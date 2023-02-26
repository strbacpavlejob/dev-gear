import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

interface DBPrice {
  unit_amount: number;
}

export class CreateStripePaymentDto {
  @ApiProperty({ example: [{ unit_amount: 300 }, { unit_amount: 500 }] })
  @IsArray()
  listOfDBPrices: DBPrice;
}
