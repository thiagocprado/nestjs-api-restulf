import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './product.controller';
import { ProductRepository } from './product.repository';
import { ProductService } from './product.service';
import { ProductEntity } from './entity/product.entity';
import { ProductFeatureEntity } from './entity/product-feature.entity';
import { ProductImageEntity } from './entity/product-image.entity';
import { OrderItemEntity } from '../order/entity/order-item.entity';

@Module({
  // Registra a entidade ProductEntity para uso com TypeORM neste módulo
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      ProductFeatureEntity,
      ProductImageEntity,
      OrderItemEntity,
    ]),
  ],
  // Controllers que expõem rotas HTTP
  controllers: [ProductController],
  // Providers disponíveis para DI dentro deste módulo
  providers: [ProductService, ProductRepository],
})
export class ProductModule {}
