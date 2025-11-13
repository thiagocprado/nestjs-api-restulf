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
import { ProductEntity } from './entity/product.entity';
import { ProductService } from './product.service';

@Controller('products') // Define o prefixo de rota /products
export class ProductController {
  // Injeção de dependência: ProductService é resolvido pelo container do Nest
  constructor(private readonly productService: ProductService) {}

  @Post() // Rota POST /products
  async createProduct(@Body() productData: CreateProductDto) {
    // DTO CreateProductDto é validado pelo ValidationPipe global
    const product = new ProductEntity();

    product.name = productData.name;
    product.userId = productData.userId;
    product.price = productData.price;
    product.quantity = productData.quantity;
    product.description = productData.description;
    product.category = productData.category;
    product.features = productData.features;
    product.images = productData.images;

    const createdProduct = await this.productService.createProduct(product);
    return {
      product: createdProduct,
      message: 'Product created successfully',
    };
  }

  @Get() // Rota GET /products
  async getProducts() {
    return await this.productService.getProducts();
  }

  @Put('/:id') // Rota PUT /products/:id
  async updateProduct(
    @Param('id') id: string,
    @Body() productData: UpdateProductDto,
  ) {
    const updatedProduct = await this.productService.updateProduct(
      id,
      productData,
    );

    return {
      message: 'Product updated successfully',
      product: updatedProduct,
    };
  }

  @Delete('/:id') // Rota DELETE /products/:id
  async deleteProduct(@Param('id') id: string) {
    const deletedProduct = await this.productService.deleteProduct(id);

    return {
      message: 'Product removed successfully',
      product: deletedProduct,
    };
  }
}
