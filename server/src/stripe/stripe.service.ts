import { Injectable } from '@nestjs/common';
import { CreateStripeProductDto } from './dto/create-stripe-product.dto';
import { UpdateStripeProductDto } from './dto/update-stripe-product.dto';
import { Stripe } from 'stripe';
import { ConfigService } from '@nestjs/config';
import { CreateStripePriceDto } from './dto/create-stripe-price.dto';
import { CreateStripePaymentDto } from './dto/create-stripe-payment.dto';

@Injectable()
export class StripeService {
  readonly stripe: Stripe;
  constructor(readonly configService: ConfigService) {
    this.stripe = new Stripe(configService.get<string>('STRIPE_SECRET_KEY'), {
      apiVersion: '2022-11-15',
    });
  }

  async createStripeProduct(createStripeProductDto: CreateStripeProductDto) {
    const product = await this.stripe.products.create(createStripeProductDto);
    return product;
  }

  async listAllProducts() {
    console.log(process.env.STRIPE_SECRET_KEY);
    const product = await this.stripe.products.list({
      limit: 100,
    });
    return product;
  }

  async getOneProduct(id: string) {
    const product = await this.stripe.products.retrieve(id);
    return product;
  }

  async updateStripeProduct(
    id: string,
    updateStripeDto: UpdateStripeProductDto,
  ) {
    const product = await this.stripe.products.update(id, updateStripeDto);
    return product;
  }

  async deleteOneProduct(id: string) {
    const deletedProduct = await this.stripe.products.del(id);
    return deletedProduct;
  }

  async archiveStripeProduct(id: string) {
    const product = await this.stripe.products.update(id, {
      active: false,
    });
    return product;
  }

  calculateOrderAmount(items) {
    let subtotal = 0;
    const tax = 1.05;
    const shipping = 500;
    for (const i in items) {
      console.log(items[i].unit_amount);
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
