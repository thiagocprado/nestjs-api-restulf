/**
 * ==========================================================================
 * PRODUCT.CONTROLLER.TS — Camada de Controller (Produtos)
 * ==========================================================================
 *
 * Mesmo padrão do UserController:
 *   - Recebe requisições HTTP e delega para o ProductService
 *   - Não contém lógica de negócio
 *
 * Rotas disponíveis:
 *   POST   /products      → criar produto
 *   GET    /products      → listar produtos
 *   PUT    /products/:id  → atualizar produto (completo)
 *   DELETE /products/:id  → deletar produto
 * ==========================================================================
 */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { UpdateProductDto } from './dto/update-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';

/**
 * @Controller('products') — Prefixo de rota: /products.
 * Todos os endpoints desta classe começam com /products.
 */
@Controller('products')
export class ProductController {
  /** Injeção de Dependência — ProductService injetado automaticamente pelo NestJS */
  constructor(private readonly productService: ProductService) {}

  /**
   * @Post() → POST /products
   * @Body() extrai e valida o corpo da requisição como CreateProductDto.
   * O DTO de produtos é mais complexo que o de usuários: contém DTOs
   * ANINHADOS para features e images (veja create-product.dto.ts).
   */
  @Post()
  async createProduct(@Body() productData: CreateProductDto) {
    const createdProduct = await this.productService.createProduct(productData);

    return {
      message: 'Product created successfully.',
      product: createdProduct,
    };
  }

  /** @Get() → GET /products — Retorna todos os produtos com features e images */
  @Get()
  async getProducts() {
    return this.productService.getProducts();
  }

  /**
   * @Put('/:id') → PUT /products/:id
   * @Param('id') extrai o ID da URL; @Body() extrai o corpo com dados parciais.
   */
  @Put('/:id')
  async updateProduct(
    @Param('id') id: string,
    @Body() productData: UpdateProductDto,
  ) {
    const updatedProduct = await this.productService.updateProduct(
      id,
      productData,
    );

    return {
      message: 'Product updated successfully.',
      product: updatedProduct,
    };
  }

  /** @Delete('/:id') → DELETE /products/:id — Remove permanentemente */
  @Delete('/:id')
  async deleteProduct(@Param('id') id: string) {
    await this.productService.deleteProduct(id);

    return {
      message: 'Product removed successfully.',
    };
  }
}
