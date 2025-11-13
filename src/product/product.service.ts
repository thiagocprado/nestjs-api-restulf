import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable() // Torna a classe um provider injetável
export class ProductService {
  constructor(
    // Injeta o repositório do TypeORM para ProductEntity
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  // Cria um novo produto no banco de dados
  async createProduct(product: ProductEntity) {
    return await this.productRepository.save(product);
  }

  // Retorna todos os produtos cadastrados
  async getProducts() {
    return await this.productRepository.find();
  }

  // Atualiza um produto existente pelo ID
  async updateProduct(id: string, product: Partial<UpdateProductDto>) {
    await this.productRepository.update(id, product);
    return await this.productRepository.findOneBy({ id });
  }

  // Remove um produto pelo ID (soft delete se configurado)
  async deleteProduct(id: string) {
    const product = await this.productRepository.findOneBy({ id });
    if (product) {
      await this.productRepository.delete(id);
    }
    return product;
  }
}
