/**
 * ==========================================================================
 * PRODUCT.MODULE.TS — Módulo de Produtos
 * ==========================================================================
 *
 * Encapsula tudo relacionado ao domínio de PRODUTOS:
 * controller, service e entidades (Product, ProductFeature, ProductImage).
 *
 * Segue exatamente a mesma estrutura do UserModule:
 *   imports: repositórios de entidades via TypeOrmModule.forFeature
 *   controllers: ProductController (rotas HTTP)
 *   providers: ProductService (lógica de negócio)
 * ==========================================================================
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductEntity } from './entity/product.entity';
import { ProductFeatureEntity } from './entity/product-feature.entity';
import { ProductImageEntity } from './entity/product-image.entity';
import { OrderItemEntity } from '../order/entity/order-item.entity';

@Module({
  /**
   * TypeOrmModule.forFeature([...]) com 4 entidades:
   * Cada entidade listada aqui gera um Repository<Entidade> injetável.
   *
   * Perceba que OrderItemEntity (de outro módulo) também está registrada.
   * No TypeORM, qualquer módulo pode registrar qualquer entidade
   * se precisar do repositório — não é restrito ao módulo "dono".
   */
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
