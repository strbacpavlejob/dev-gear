import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateStripeProductDto {
  @ApiProperty({ example: 'Iphone' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'some product descirption' })
  @IsString()
  description: string;

  @ApiProperty({ example: ['url1', 'url2'] })
  @IsArray()
  images: string[];
}
