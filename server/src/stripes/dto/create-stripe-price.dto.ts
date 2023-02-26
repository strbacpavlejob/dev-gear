import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateStripePriceDto {
  @ApiProperty({ example: 'prod_NPtlZRSAr0bDZF' })
  @IsString()
  stripeProductId: string;

  @ApiProperty({ example: 300 })
  @IsNumber()
  stripePrice: number;
}
