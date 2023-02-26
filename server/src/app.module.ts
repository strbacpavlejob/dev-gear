import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import mongodbConfig from './shared/config/mongodb.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { StripesModule } from './stripes/stripes.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb://localhost/devgear'),
    // ConfigModule.forRoot({
    //   load: [mongodbConfig],
    // }),
    // MongooseModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: (configService: ConfigService): MongooseModuleOptions => ({
    //     uri: configService.get<string>('mongodb.uri'),
    //     dbName: configService.get<string>('mongodb.dbName'),
    //     // user: process.env.MONGO_USERNAME,
    //     // pass: process.env.MONGO_PASSWORD,
    //   }),
    //   inject: [ConfigService],
    // }),
    AuthModule,
    UsersModule,
    ProductsModule,
    StripesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
