import { PartialType } from '@nestjs/swagger';
import { CreateStripeProductDto } from './create-stripe-product.dto';

export class UpdateStripeProductDto extends PartialType(
  CreateStripeProductDto
) {}
