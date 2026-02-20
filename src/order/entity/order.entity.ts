/**
 * ==========================================================================
 * ORDER.ENTITY.TS — Entidade de Pedido (tabela "orders")
 * ==========================================================================
 *
 * Representa um pedido feito por um usuário.
 *
 * Relacionamentos:
 *   @ManyToOne user  → N:1 com UserEntity (muitos pedidos para um usuário)
 *   @OneToMany items → 1:N com OrderItemEntity (um pedido tem muitos itens)
 *
 * O cascade: true em items faz com que ao salvar o pedido,
 * os itens sejam salvos junto automaticamente.
 * ==========================================================================
 */
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { OrderStatus } from '../enum/order-status.enum';
import { UserEntity } from '../../user/entity/user.entity';
import { OrderItemEntity } from './order-item.entity';

@Entity({ name: 'orders' })
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'total_value', nullable: false })
  totalValue: number;

  /**
   * Coluna com enum — os valores aceitos são definidos pelo OrderStatus.
   * O TypeORM armazena como varchar no banco, mas no código TypeScript
   * você trabalha com o enum tipado.
   */
  @Column({ name: 'status', enum: OrderStatus, nullable: false })
  status: OrderStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;

  /**
   * @ManyToOne — Relacionamento N:1 com UserEntity.
   * Muitos pedidos pertencem a UM usuário.
   * Este lado (order) TEM a foreign key (userId) no banco.
   * (user) => user.orders → propriedade inversa na UserEntity.
   */
  @ManyToOne(() => UserEntity, (user) => user.orders)
  user: UserEntity;

  /**
   * @OneToMany com cascade: true:
   * Um pedido tem MUITOS itens.
   * cascade: true → ao salvar o pedido, os itens são salvos junto.
   * Isso é usado no OrderService.createOrder() para salvar tudo de uma vez.
   */
  @OneToMany(() => OrderItemEntity, (item) => item.order, { cascade: true })
  items: OrderItemEntity[];
}
