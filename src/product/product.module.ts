import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductEntity } from './entity/product.entity';
import { ProductFeatureEntity } from './entity/product-feature.entity';
import { ProductImageEntity } from './entity/product-image.entity';
import { OrderItemEntity } from '../order/entity/order-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      ProductFeatureEntity,
      ProductImageEntity,
      OrderItemEntity,
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
