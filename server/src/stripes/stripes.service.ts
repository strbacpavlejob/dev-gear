import { Injectable, Logger } from '@nestjs/common';
import { CreateStripeProductDto } from './dto/create-stripe-product.dto';
import { UpdateStripeProductDto } from './dto/update-stripe-product.dto';
import { Stripe } from 'stripe';
import { ConfigService } from '@nestjs/config';
import { CreateStripePriceDto } from './dto/create-stripe-price.dto';
import { CreateStripePaymentDto } from './dto/create-stripe-payment.dto';

@Injectable()
export class StripesService {
  readonly stripe: Stripe;
  constructor(readonly configService: ConfigService) {
    this.stripe = new Stripe(configService.get<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2022-11-15',
    });
  }

  async createStripeProduct(createStripeProductDto: CreateStripeProductDto) {
    Logger.verbose(
      `This action creates one stripe product: ${createStripeProductDto.name}`,
    );
    const product = await this.stripe.products.create(createStripeProductDto);
    return product;
  }

  async listAllProducts() {
    Logger.verbose(`This action returns 100 stripe products`);
    const product = await this.stripe.products.list({
      limit: 100,
    });
    return product;
  }

  async getOneProduct(id: string) {
    Logger.verbose(`This action returns one stripe product id:${id}`);
    const product = await this.stripe.products.retrieve(id);
    return product;
  }

  async getOneProductByName(name: string) {
    Logger.verbose(`This action returns one stripe product with name:${name}`);
    const product = await this.stripe.products.search({
      query: `active:"true" AND name~"${name}"`,
    });
    return product;
  }

  async updateStripeProduct(
    id: string,
    updateStripeDto: UpdateStripeProductDto,
  ) {
    Logger.verbose(`This action updates one stripe product #${id}`);
    const product = await this.stripe.products.update(id, updateStripeDto);
    return product;
  }

  async setDefaultPrice(id: string, priceId: string) {
    Logger.verbose(`This action sets default price for stripe product #${id}`);
    const product = await this.stripe.products.update(id, {
      default_price: priceId,
    });
    return product;
  }

  async disableDefaultPrice(id: string) {
    try {
      Logger.verbose(
        `This action disables a default price for a #${id} stripe product`,
      );
      await this.stripe.products.update(id, { default_price: null });
    } catch (error) {
      Logger.error(`Error in disableDefaultPrice ${error}`);
    }
  }

  async deletePrice(id: string) {
    try {
      Logger.verbose(`This action removes a #${id} stripe price`);
      await this.stripe.prices.update(id, { active: false });
    } catch (error) {
      Logger.error(`Error in deletePrice ${error}`);
    }
  }

  async deleteOneProduct(id: string) {
    try {
      Logger.verbose(`This action removes a #${id} stripe product`);
      const deletedProduct = await this.stripe.products.del(id);
      return deletedProduct;
    } catch (error) {
      Logger.error(`Error in deleteOneProduct ${error}`);
      return;
    }
  }

  async archiveStripeProduct(id: string) {
    Logger.verbose(`This action archives a #${id} stripe product`);
    const product = await this.stripe.products.update(id, {
      active: false,
    });
    return product;
  }

  calculateOrderAmount(items) {
    let subtotal = 0;
    const tax = 1.3;
    const shipping = 15;
    for (const i in items) {
      subtotal += items[i].unit_amount;
    }
    const total = subtotal * tax + shipping;
    return total;
  }

  async createPaymentIntent(createStripePaymentDto: CreateStripePaymentDto) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: this.calculateOrderAmount(createStripePaymentDto.listOfDBPrices),
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });
    return {
      clientSecret: paymentIntent.client_secret,
    };
  }

  async createPriceObject(createStripePriceDto: CreateStripePriceDto) {
    const price = await this.stripe.prices.create({
      unit_amount: createStripePriceDto.stripePrice,
      currency: 'usd',
      product: createStripePriceDto.stripeProductId,
    });
    return price;
  }

  async getAllPrices() {
    const prices = await this.stripe.prices.list({
      limit: 20,
    });
    return prices;
  }

  async getOnePrice(id: string) {
    const price = await this.stripe.prices.retrieve(id);
    return price;
  }
}
