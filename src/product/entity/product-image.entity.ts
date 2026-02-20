/**
 * ==========================================================================
 * PRODUCT-IMAGE.ENTITY.TS — Entidade de Imagem do Produto
 * ==========================================================================
 *
 * Tabela "product_images" — armazena imagens de cada produto.
 * Relacionamento N:1 com ProductEntity (muitas imagens para um produto).
 *
 * Mesma estrutura e configurações do ProductFeatureEntity:
 *   - orphanedRowAction: 'delete' (remove imagens órfãs)
 *   - onDelete/onUpdate: 'CASCADE' (remove/atualiza junto com o produto)
 * ==========================================================================
 */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity({ name: 'product_images' })
export class ProductImageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'url', length: 255, nullable: false })
  url: string;

  @Column({ name: 'description', length: 255, nullable: false })
  description: string;

  /** @ManyToOne — N:1 com ProductEntity. Este lado tem a FK (productId) */
  @ManyToOne(() => ProductEntity, (product) => product.images, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  product: ProductEntity;
}
