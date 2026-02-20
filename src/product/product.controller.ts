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

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async createProduct(@Body() productData: CreateProductDto) {
    const createdProduct = await this.productService.createProduct(productData);

    return {
      message: 'Product created successfully.',
      product: createdProduct,
    };
  }

  @Get()
  async getProducts() {
    return this.productService.getProducts();
  }

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

  @Delete('/:id')
  async deleteProduct(@Param('id') id: string) {
    await this.productService.deleteProduct(id);

    return {
      message: 'Product removed successfully.',
    };
  }
}
