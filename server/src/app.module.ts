import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import mongodbConfig from './shared/config/mongodb.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
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
    UserModule,
    ProductModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
