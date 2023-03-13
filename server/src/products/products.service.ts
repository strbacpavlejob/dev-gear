import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { throwError } from 'src/common/error/domain';
import { ProductErrors } from 'src/common/error/product.errors';
import { UserErrors } from 'src/common/error/user.errors';
import { CreateStripePriceDto } from 'src/stripes/dto/create-stripe-price.dto';
import { CreateStripeProductDto } from 'src/stripes/dto/create-stripe-product.dto';
import { StripesService } from 'src/stripes/stripes.service';
import { UsersService } from 'src/users/users.service';
import { CreateProductDto } from './dto/create-product.dto';
import { FilterProductsDto } from './dto/filter-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => StripesService))
    private readonly stripesService: StripesService,
  ) {}

  async formatProductData(product: Product & { _id: Types.ObjectId }) {
    return {
      _id: product._id,
      ...product,
    };
  }
  async formatProductListData(
    products: Array<Product & { _id: Types.ObjectId }>,
  ) {
    const productsExtended = [];
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const formatedProduct = await this.formatProductData(product);
      productsExtended.push(formatedProduct);
    }
    return productsExtended;
  }

  async create(createProductDto: CreateProductDto, userId: string) {
    //admin
    Logger.verbose(`Creates one product: ${createProductDto.name}`);
    // if (!(await this.usersService.isAdmin(userId)))
    //   throwError(UserErrors.USER_HAS_NO_PERMISION);

    //create product
    const product = await this.productModel.create(createProductDto);
    const createStripeProductDto: CreateStripeProductDto = {
      name: `${product.brand} ${product.name}`,
      description: product.description,
      images: product.imgUrls.filter((item) => item !== ''),
    };
    const stripeProduct = await this.stripesService.createStripeProduct(
      createStripeProductDto,
    );
    ///create price it was multiplied before with 100
    //  default_price: product.price,

    const createStripePriceDto: CreateStripePriceDto = {
      stripeProductId: stripeProduct.id,
      stripePrice: product.price * 100,
    };

    const stripePrice = await this.stripesService.createPriceObject(
      createStripePriceDto,
    );

    await this.stripesService.setDefaultPrice(stripeProduct.id, stripePrice.id);

    return this.formatProductData(product);
  }

  async findAll() {
    Logger.verbose(`This action returns all products`);
    const products = await this.productModel.find().lean();
    return this.formatProductListData(products);
  }

  async findOneByName(name: string) {
    Logger.verbose(`This action returns a product with ${name}`);
    const product = await this.productModel.findOne({ name }).lean();
    return product;
  }

  async findOne(id: string) {
    Logger.verbose(`This action returns a #${id} product`);
    const product = await this.productModel.findById(id).lean();
    if (!product) throwError(ProductErrors.PRODUCT_NOT_FOUND);
    return this.formatProductData(product);
  }

  updateStripeProductNameHelper(
    newBrand: string,
    newName: string,
    oldBrand: string,
    oldName: string,
  ) {
    const brandString = newBrand ? newBrand : oldBrand;
    const nameString = newName ? newName : oldName;
    return `${brandString} ${nameString}`;
  }

  async update(id: string, userId: string, updateProductDto: UpdateProductDto) {
    //admin
    Logger.verbose(`This action updates a #${id} product`);
    // if (!(await this.usersService.isAdmin(userId)))
    //   throwError(UserErrors.USER_HAS_NO_PERMISION);

    //find product in MongoDB
    const foundProduct = await this.productModel.findById(id);
    const { brand, name } = foundProduct;

    // Update product in MongoDB
    const updatedProduct = await this.productModel.findByIdAndUpdate(
      id,
      updateProductDto,
      {
        new: true,
      },
    );

    //find stripe product
    const stripeProduct = await this.stripesService.getOneProductByName(
      `${brand} ${name}`,
    );
    const foundStripeProduct = stripeProduct.data[0];

    //update basic data
    await this.stripesService.updateStripeProduct(foundStripeProduct.id, {
      name: this.updateStripeProductNameHelper(
        updateProductDto.brand,
        updateProductDto.name,
        foundProduct.brand,
        foundProduct.name,
      ),
      description: updateProductDto.description
        ? updateProductDto.description
        : foundProduct.description,
      images: updateProductDto.imgUrls
        ? updateProductDto.imgUrls.filter((item) => item !== '')
        : foundProduct.imgUrls,
    });

    //update price
    if (updateProductDto.price) {
      //set default_price: null
      await this.stripesService.disableDefaultPrice(foundStripeProduct.id);

      const createStripePriceDto: CreateStripePriceDto = {
        stripeProductId: foundStripeProduct.id,
        stripePrice: updateProductDto.price * 100,
      };

      const stripePrice = await this.stripesService.createPriceObject(
        createStripePriceDto,
      );

      await this.stripesService.setDefaultPrice(
        foundStripeProduct.id,
        stripePrice.id,
      );
    }
    return this.formatProductData(updatedProduct);
  }

  async remove(id: string, userId: string) {
    Logger.verbose(`This action removes a #${id} product`);
    // if (!(await this.usersService.isAdmin(userId)))
    //   throwError(UserErrors.USER_HAS_NO_PERMISION);
    //    const deltedProduct = await this.productModel.findByIdAndRemove(id);

    //remove from MongoDB
    const deltedProduct = await this.productModel.findByIdAndRemove(id);
    const { name, brand } = deltedProduct;

    //remove from stripe
    //find product on stripe
    const stripeProduct = await this.stripesService.getOneProductByName(
      `${brand} ${name}`,
    );
    const foundStripeProduct = stripeProduct.data[0];
    //set default_price: null
    await this.stripesService.disableDefaultPrice(foundStripeProduct.id);
    //set active: false
    await this.stripesService.deletePrice(
      foundStripeProduct.default_price as string,
    );
    // set product active:false
    await this.stripesService.archiveStripeProduct(foundStripeProduct.id);

    return this.formatProductData(deltedProduct);
  }

  async filterProducts(filterProductsDto: FilterProductsDto) {
    Logger.verbose(`This action returns all filtred products`);
    const {
      searchedWords,
      itemTypes,
      brands,
      plugs,
      colors,
      maxPrice,
      minPrice,
      order,
      sort,
      limit,
    } = filterProductsDto;

    interface SortQueryObject {
      [key: string]: any;
    }

    let matchQuery = {};
    let sortQuery: SortQueryObject = {
      price: -1,
    };

    if (searchedWords) {
      matchQuery = {
        ...matchQuery,
        $or: [
          { brand: { $regex: `^${searchedWords}`, $options: 'i' } },
          { name: { $regex: `^${searchedWords}`, $options: 'i' } },
        ],
      };
    }

    if (itemTypes) {
      matchQuery = {
        ...matchQuery,
        itemType: { $in: itemTypes },
      };
    }

    if (brands) {
      matchQuery = {
        ...matchQuery,
        brand: { $in: brands },
      };
    }

    if (plugs) {
      matchQuery = {
        ...matchQuery,
        plug: { $in: plugs },
      };
    }

    if (colors) {
      matchQuery = {
        ...matchQuery,
        color: { $in: colors },
      };
    }

    if (minPrice) {
      matchQuery = {
        ...matchQuery,
        price: { $gte: minPrice },
      };
    }

    if (maxPrice) {
      matchQuery = {
        ...matchQuery,
        price: { $lte: maxPrice },
      };
    }

    if (sort && order) {
      sortQuery = {
        [sort]: order === 'dsc' ? -1 : 1,
      };
    }

    const products = await this.productModel.aggregate([
      {
        $match: {
          ...matchQuery,
        },
      },
      {
        $sort: {
          ...sortQuery,
        },
      },
      {
        $limit: limit ? limit : 100,
      },
    ]);

    return this.formatProductListData(products);
  }
}
