import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entity/product.entity';
import { Repository } from 'typeorm';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { ListProductDto } from './dto/list-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async createProduct(productData: CreateProductDto) {
    const productEntity = new ProductEntity();

    Object.assign(productEntity, productData as ProductEntity);

    return this.productRepository.save(productEntity);
  }

  async getProducts() {
    const savedProducts = await this.productRepository.find({
      relations: {
        images: true,
        features: true,
      },
    });
    const productsList = savedProducts.map(
      (product) =>
        new ListProductDto(
          product.id,
          product.name,
          product.features,
          product.images,
        ),
    );
    return productsList;
  }

  async updateProduct(id: string, newData: UpdateProductDto) {
    const entity = await this.productRepository.findOneBy({ id });

    if (entity === null) {
      throw new NotFoundException('Product not found.');
    }

    Object.assign(entity, newData as ProductEntity);

    return this.productRepository.save(entity);
  }

  async deleteProduct(id: string) {
    const result = await this.productRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException('Product not found.');
    }
  }
}
