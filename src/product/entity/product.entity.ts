/**
 * ==========================================================================
 * PRODUCT.ENTITY.TS — Entidade de Produto (tabela "products")
 * ==========================================================================
 *
 * Entidade central do domínio de produtos. Mapeada para a tabela "products".
 *
 * Contém 3 relacionamentos @OneToMany:
 *   - features (1:N) → características do produto
 *   - images (1:N) → imagens do produto
 *   - orderItems (1:N) → itens de pedido que referenciam este produto
 *
 * Conceitos importantes nesta entidade:
 *   - cascade: true → ao salvar o produto, features/images são salvas juntas
 *   - eager: true → ao buscar o produto, features/images vêm automaticamente
 * ==========================================================================
 */
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { ProductFeatureEntity } from './product-feature.entity';
import { ProductImageEntity } from './product-image.entity';
import { OrderItemEntity } from '../../order/entity/order-item.entity';

@Entity({ name: 'products' })
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** user_id: identifica qual usuário criou este produto */
  @Column({ name: 'user_id', length: 100, nullable: false })
  userId: string;

  @Column({ name: 'name', length: 200, nullable: false })
  name: string;

  @Column({ name: 'price', nullable: false })
  price: number;

  @Column({ name: 'available_quantity', nullable: false })
  availableQuantity: number;

  @Column({ name: 'description', length: 255, nullable: false })
  description: string;

  @Column({ name: 'category', length: 100, nullable: false })
  category: string;

  /**
   * @OneToMany com cascade: true e eager: true:
   *
   * cascade: true → Operações em CASCATA:
   *   Quando você salva um ProductEntity (repository.save(product)),
   *   as features dentro de product.features também são salvas
   *   automaticamente. Não precisa salvar cada feature separadamente.
   *
   * eager: true → Carregamento ANSIOSO:
   *   Quando você busca um produto (repository.find()), as features
   *   são carregadas automaticamente junto, sem precisar de relations.
   *   O oposto seria lazy: true (carrega só quando acessar a propriedade).
   */
  @OneToMany(
    () => ProductFeatureEntity,
    (productFeatureEntity) => productFeatureEntity.product,
    { cascade: true, eager: true },
  )
  features: ProductFeatureEntity[];

  /** Mesmo padrão: cascade + eager para imagens */
  @OneToMany(() => ProductImageEntity, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images: ProductImageEntity[];

  /**
   * Relacionamento com OrderItem — SEM cascade e SEM eager.
   * Não queremos que ao salvar um produto, os itens de pedido sejam afetados.
   * E não queremos carregar todos os itens de pedido ao buscar um produto.
   */
  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.product)
  orderItems: OrderItemEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
