
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  itemType: string;
  @Prop({ required: true })
  brand: string;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  description: string;
  @Prop({ required: true })
  categories: string[];
  @Prop({ required: true })
  plug: string[];
  @Prop({ required: true })
  colors: string[];
  @Prop({ required: true })
  imgUrls: string[];
  @Prop({ required: true, default: 0 })
  price: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);