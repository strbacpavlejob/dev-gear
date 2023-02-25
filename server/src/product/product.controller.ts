import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/utils/guards/jwt-guard.guard';
import { GetCurrentUserById } from 'src/utils';
import { FilterProductsDto } from './dto/filter-products.dto';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('filter')
  filter(@Body() filterProductsDto: FilterProductsDto) {
    return this.productService.filterProducts(filterProductsDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createProductDto: CreateProductDto,
    @GetCurrentUserById() userId: string,
  ) {
    return this.productService.create(createProductDto, userId);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @GetCurrentUserById() userId: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, userId, updateProductDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @GetCurrentUserById() userId: string) {
    return this.productService.remove(id, userId);
  }
}
