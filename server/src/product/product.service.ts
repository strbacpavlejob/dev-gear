import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { throwError } from 'src/common/error/domain';
import { ProductErrors } from 'src/common/error/product.errors';
import { UserErrors } from 'src/common/error/user.errors';
import { UserService } from 'src/user/user.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './schemas/product.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
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
    if (!this.userService.isAdmin(userId))
      throwError(UserErrors.USER_HAS_NO_PERMISION);
    const product = await this.productModel.create(createProductDto);
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

  async update(id: string, userId: string, updateProductDto: UpdateProductDto) {
    //admin
    Logger.verbose(`This action updates a #${id} product`);
    if (!this.userService.isAdmin(userId))
      throwError(UserErrors.USER_HAS_NO_PERMISION);

    const updatedProduct = await this.productModel.findByIdAndUpdate(
      id,
      updateProductDto,
      {
        new: true,
      },
    );
    return this.formatProductData(updatedProduct);
  }

  async remove(id: string, userId: string) {
    Logger.verbose(`This action removes a #${id} product`);
    if (!this.userService.isAdmin(userId))
      throwError(UserErrors.USER_HAS_NO_PERMISION);
    const deltedProduct = await this.productModel.findByIdAndRemove(id);
    return this.formatProductData(deltedProduct);
  }
}
