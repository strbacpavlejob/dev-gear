import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class FilterProductsDto {
  @ApiProperty({ example: 'apple iphone' })
  @IsOptional()
  @IsString()
  searchedWords: string;

  @ApiProperty({ example: ['Laptop'] })
  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  itemTypes: string[];

  @ApiProperty({ example: ['Apple'] })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  brands: string[];

  @ApiProperty({ example: ['work', 'gaming', 'everyday'] })
  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  categories: string[];

  @ApiProperty({ example: ['EU', 'US', 'UK'] })
  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  plugs: string[];

  @ApiProperty({ example: ['white', 'blue'] })
  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  colors: string[];

  @ApiProperty({ example: 3000 })
  @IsOptional()
  @IsNumber()
  maxPrice: number;

  @ApiProperty({ example: 1000 })
  @IsOptional()
  @IsNumber()
  minPrice: number;

  @ApiProperty({ example: 'dsc' })
  @IsOptional()
  @IsString()
  order: string;

  @ApiProperty({ example: 'price' })
  @IsOptional()
  @IsString()
  sort: string;

  @ApiProperty({ example: 10 })
  @IsOptional()
  @IsNumber()
  limit: number;
}
