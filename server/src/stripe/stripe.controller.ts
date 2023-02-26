import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { CreateStripeProductDto } from './dto/create-stripe-product.dto';
import { UpdateStripeProductDto } from './dto/update-stripe-product.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateStripePaymentDto } from './dto/create-stripe-payment.dto';
import { CreateStripePriceDto } from './dto/create-stripe-price.dto';

@ApiTags('Stripes')
@Controller('stripes')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('products')
  createStripeProduct(@Body() createStripeProductDto: CreateStripeProductDto) {
    return this.stripeService.createStripeProduct(createStripeProductDto);
  }

  @Get('products')
  listAllProducts() {
    return this.stripeService.listAllProducts();
  }

  @Get('products/:id')
  getOneProduct(@Param('id') id: string) {
    return this.stripeService.getOneProduct(id);
  }

  @Patch('products/:id')
  updateStripeProduct(
    @Param('id') id: string,
    @Body() updateStripeDto: UpdateStripeProductDto,
  ) {
    return this.stripeService.updateStripeProduct(id, updateStripeDto);
  }

  @Delete('products/:id')
  deleteOneProduct(@Param('id') id: string) {
    return this.stripeService.deleteOneProduct(id);
  }

  @Patch('archives/:id')
  archive(@Param('id') id: string) {
    return this.stripeService.archiveStripeProduct(id);
  }

  @Post('pay')
  createPaymentIntent(@Body() createStripePaymentDto: CreateStripePaymentDto) {
    return this.stripeService.createPaymentIntent(createStripePaymentDto);
  }

  @Post('prices')
  createPrice(@Body() createStripePriceDto: CreateStripePriceDto) {
    return this.stripeService.createPriceObject(createStripePriceDto);
  }

  @Get('prices')
  findAllPrices() {
    return this.stripeService.getAllPrices();
  }

  @Get('prices/:id')
  findOnePrice(@Param('id') id: string) {
    return this.stripeService.getOnePrice(id);
  }
}
