/**
 * ==========================================================================
 * ORDER-ITEM.ENTITY.TS — Entidade de Item do Pedido (tabela "orders_items")
 * ==========================================================================
 *
 * Esta é a entidade de TABELA ASSOCIATIVA entre Order e Product.
 *
 * No mundo relacional, quando um pedido pode ter muitos produtos
 * e um produto pode estar em muitos pedidos, precisamos de uma
 * tabela intermediária (N:N). Aqui, essa tabela é "orders_items".
 *
 * Além das foreign keys (orderId, productId), ela armazena dados
 * ESPECÍFICOS daquela relação:
 *   - quantity: quantas unidades foram compradas
 *   - sale_price: preço no momento da compra ("foto" do preço)
 *
 * Relacionamentos:
 *   @ManyToOne order   → N:1 com OrderEntity
 *   @ManyToOne product → N:1 com ProductEntity
 * ==========================================================================
 */
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { OrderEntity } from './order.entity';
import { ProductEntity } from '../../product/entity/product.entity';

@Entity({ name: 'orders_items' })
export class OrderItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'quantity', nullable: false })
  quantity: number;

  /** Preço de venda no momento da compra (pode diferir do preço atual do produto) */
  @Column({ name: 'sale_price', nullable: false })
  sellPrice: number;

  /**
   * @ManyToOne — N:1 com OrderEntity.
   * Muitos itens pertencem a UM pedido.
   * onDelete/onUpdate: CASCADE → se o pedido for deletado,
   * os itens são deletados junto.
   */
  @ManyToOne(() => OrderEntity, (order) => order.items, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  order: OrderEntity;

  /**
   * @ManyToOne — N:1 com ProductEntity.
   * Muitos itens podem referenciar UM produto.
   * cascade: ['update'] → ao salvar o OrderItem, se o produto associado
   * tiver mudanças (ex: estoque decrementado), o TypeORM atualiza o produto.
   * Isso é usado no OrderService.createOrder() para decrementar o estoque.
   */
  @ManyToOne(() => ProductEntity, (product) => product.orderItems, {
    cascade: ['update'],
  })
  product: ProductEntity;
}
