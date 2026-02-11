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

  @OneToMany(
    () => ProductFeatureEntity,
    (productFeatureEntity) => productFeatureEntity.product,
    { cascade: true, eager: true },
  )
  features: ProductFeatureEntity[];

  @OneToMany(() => ProductImageEntity, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images: ProductImageEntity[];

  @OneToMany(() => OrderItemEntity, (orderItem) => orderItem.product)
  orderItems: OrderItemEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
