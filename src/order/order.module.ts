/**
 * ==========================================================================
 * ORDER.MODULE.TS — Módulo de Pedidos
 * ==========================================================================
 *
 * Encapsula tudo relacionado ao domínio de PEDIDOS:
 * controller, service e entidades.
 *
 * Detalhe importante: este módulo importa entidades de OUTROS domínios
 * (UserEntity, ProductEntity) via TypeOrmModule.forFeature.
 *
 * No TypeORM + NestJS, qualquer módulo pode registrar repositórios
 * de qualquer entidade. Isso é diferente de importar outro Module —
 * aqui estamos registrando apenas os REPOSITÓRIOS das entidades,
 * não os services ou controllers de User/Product.
 *
 * O OrderService precisa dos repositórios de User e Product para:
 *   - Verificar se o usuário existe antes de criar um pedido
 *   - Buscar os produtos para validar estoque e preços
 * ==========================================================================
 */
import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entity/order.entity';
import { UserEntity } from '../user/entity/user.entity';
import { OrderItemEntity } from './entity/order-item.entity';
import { ProductEntity } from '../product/entity/product.entity';

@Module({
  imports: [
    /**
     * Registra 4 repositórios para injeção neste módulo:
     *   - Repository<OrderEntity>     → persistir pedidos
     *   - Repository<UserEntity>      → buscar usuários
     *   - Repository<OrderItemEntity> → gerenciado via cascade
     *   - Repository<ProductEntity>   → buscar e validar produtos
     */
    TypeOrmModule.forFeature([
      OrderEntity,
      UserEntity,
      OrderItemEntity,
      ProductEntity,
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
