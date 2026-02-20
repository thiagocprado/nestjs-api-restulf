/**
 * ==========================================================================
 * PRODUCT-FEATURE.ENTITY.TS — Entidade de Característica do Produto
 * ==========================================================================
 *
 * Tabela "product_features" — armazena características de cada produto.
 * Relacionamento N:1 com ProductEntity (muitas features para um produto).
 *
 * Opções importantes do @ManyToOne:
 *   - orphanedRowAction: 'delete' → se ao atualizar um produto você
 *     remover uma feature da lista, o TypeORM DELETA a feature órfã do banco.
 *   - onDelete: 'CASCADE' → se o produto for deletado, suas features
 *     são deletadas automaticamente pelo banco (FK com CASCADE).
 *   - onUpdate: 'CASCADE' → se o ID do produto mudar, a FK atualiza junto.
 * ==========================================================================
 */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductEntity } from './product.entity';

@Entity('product_features')
export class ProductFeatureEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', length: 100, nullable: false })
  name: string;

  @Column({ name: 'description', length: 255, nullable: false })
  description: string;

  /**
   * @ManyToOne — Relacionamento N:1 (Muitos para Um).
   *
   * Muitas features pertencem a UM produto.
   * () => ProductEntity → a entidade do lado "um"
   * (product) => product.features → a propriedade inversa na ProductEntity
   *
   * Este lado (feature) TEM a foreign key (productId) no banco.
   */
  @ManyToOne(() => ProductEntity, (product) => product.features, {
    orphanedRowAction: 'delete',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  product: ProductEntity;
}
