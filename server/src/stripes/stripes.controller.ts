import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StripesService } from './stripes.service';
import { CreateStripeProductDto } from './dto/create-stripe-product.dto';
import { UpdateStripeProductDto } from './dto/update-stripe-product.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateStripePaymentDto } from './dto/create-stripe-payment.dto';
import { CreateStripePriceDto } from './dto/create-stripe-price.dto';

@ApiTags('Stripes')
@Controller('stripes')
export class StripesController {
  constructor(private readonly stripesService: StripesService) {}

  @Post('products')
  createStripeProduct(@Body() createStripeProductDto: CreateStripeProductDto) {
    return this.stripesService.createStripeProduct(createStripeProductDto);
  }

  @Get('products')
  listAllProducts() {
    return this.stripesService.listAllProducts();
  }

  @Get('products/:id')
  getOneProduct(@Param('id') id: string) {
    return this.stripesService.getOneProduct(id);
  }

  @Patch('products/:id')
  updateStripeProduct(
    @Param('id') id: string,
    @Body() updateStripeDto: UpdateStripeProductDto,
  ) {
    return this.stripesService.updateStripeProduct(id, updateStripeDto);
  }

  @Delete('products/:id')
  deleteOneProduct(@Param('id') id: string) {
    return this.stripesService.deleteOneProduct(id);
  }

  @Patch('archives/:id')
  archive(@Param('id') id: string) {
    return this.stripesService.archiveStripeProduct(id);
  }

  @Post('pay')
  createPaymentIntent(@Body() createStripePaymentDto: CreateStripePaymentDto) {
    return this.stripesService.createPaymentIntent(createStripePaymentDto);
  }

  @Post('prices')
  createPrice(@Body() createStripePriceDto: CreateStripePriceDto) {
    return this.stripesService.createPriceObject(createStripePriceDto);
  }

  @Get('prices')
  findAllPrices() {
    return this.stripesService.getAllPrices();
  }

  @Get('prices/:id')
  findOnePrice(@Param('id') id: string) {
    return this.stripesService.getOnePrice(id);
  }
}
