/**
 * ==========================================================================
 * PRODUCT.SERVICE.TS — Camada de Service (Lógica de Negócio de Produtos)
 * ==========================================================================
 *
 * Mesmo padrão do UserService, mas com algumas diferenças:
 *   - Busca com RELAÇÕES (features e images)
 *   - Usa ListProductDto para filtrar dados na saída
 *   - Usa hard delete (delete real, não soft delete)
 *
 * A classe é @Injectable() (provider) e recebe o Repository<ProductEntity>
 * via @InjectRepository — mesmo padrão de DI do UserService.
 * ==========================================================================
 */
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

  /**
   * Cria um novo produto.
   *
   * Object.assign copia os dados do DTO para a entidade, incluindo
   * os arrays de features e images. Como ProductEntity tem
   * cascade: true nesses relacionamentos, o TypeORM salva
   * o produto E suas features/images em uma única operação.
   */
  async createProduct(productData: CreateProductDto) {
    const productEntity = new ProductEntity();

    Object.assign(productEntity, productData as ProductEntity);

    return this.productRepository.save(productEntity);
  }

  /**
   * Busca todos os produtos com seus RELACIONAMENTOS.
   *
   * relations: { images: true, features: true }:
   *   O TypeORM faz JOINs automáticos para carregar as tabelas
   *   product_images e product_features junto com products.
   *
   * Nota: como ProductEntity já tem eager: true nesses relacionamentos,
   * eles seriam carregados mesmo sem o relations explícito.
   * Aqui está explícito para clareza.
   *
   * O resultado é mapeado para ListProductDto, que expõe apenas
   * id, name, features e images (sem preço, estoque, etc.).
   */
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

  /**
   * Atualiza um produto existente.
   * Busca pelo ID, verifica se existe, copia os novos dados e salva.
   */
  async updateProduct(id: string, newData: UpdateProductDto) {
    const entity = await this.productRepository.findOneBy({ id });

    if (entity === null) {
      throw new NotFoundException('Product not found.');
    }

    Object.assign(entity, newData as ProductEntity);

    return this.productRepository.save(entity);
  }

  /**
   * Remove um produto permanentemente (HARD DELETE).
   *
   * Diferença entre hard delete e soft delete:
   *   - Hard delete (repository.delete): remove a linha do banco para sempre
   *   - Soft delete (repository.softDelete): preenche deleted_at, mas mantém a linha
   *
   * Aqui usa hard delete. Se quisesse soft delete, usaria
   * this.productRepository.softDelete(id) — aproveitando o @DeleteDateColumn
   * que já existe na ProductEntity.
   */
  async deleteProduct(id: string) {
    const result = await this.productRepository.delete(id);

    if (!result.affected) {
      throw new NotFoundException('Product not found.');
    }
  }
}
