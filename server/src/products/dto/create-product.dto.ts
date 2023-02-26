import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Smarthpne' })
  @IsString()
  itemType: string;

  @ApiProperty({ example: 'Apple' })
  @IsString()
  brand: string;

  @ApiProperty({ example: 'Iphone' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'some description' })
  @IsString()
  description: string;

  @ApiProperty({ example: ['work', 'gaming', 'everyday'] })
  @IsString({ each: true })
  @IsArray()
  categories: string[];

  @ApiProperty({ example: ['EU', 'US', 'UK'] })
  @IsString({ each: true })
  @IsArray()
  plug: string[];

  @ApiProperty({ example: ['white', 'blue'] })
  @IsString({ each: true })
  @IsArray()
  colors: string[];

  @ApiProperty({ example: ['url1', 'url2'] })
  @IsString({ each: true })
  @IsArray()
  imgUrls: string[];

  @ApiProperty({ example: 300 })
  @IsNumber()
  price: number;
}
