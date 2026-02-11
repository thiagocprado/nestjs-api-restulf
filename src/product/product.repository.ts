import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductEntity } from './entity/product.entity';

@Injectable()
export class ProductRepository {
  private products: ProductEntity[] = [];

  findAll() {
    return this.products;
  }

  save(productData: ProductEntity) {
    this.products.push(productData);
    return productData;
  }

  private findById(id: string) {
    const possibleProduct = this.products.find((product) => product.id === id);

    if (!possibleProduct) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }

    return possibleProduct;
  }

  update(id: string, productData: Partial<ProductEntity>) {
    const notUpdatableFields = ['id', 'userId'] as const;
    const product = this.findById(id);
    const record: Record<string, unknown> = product as unknown as Record<
      string,
      unknown
    >;
    Object.entries(productData).forEach(([key, value]) => {
      if (notUpdatableFields.includes(key as any)) {
        return;
      }
      record[key] = value as unknown;
    });

    return product;
  }

  remove(id: string) {
    const removedProduct = this.findById(id);
    this.products = this.products.filter((product) => product.id !== id);
    return removedProduct;
  }
}
