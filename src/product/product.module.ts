import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './product.controller';
import { ProductRepository } from './product.repository';
import { ProductEntity } from './entities/product.entity';
import { ProductService } from './product.service';

@Module({
  // Registra a entidade ProductEntity para uso com TypeORM neste módulo
  imports: [TypeOrmModule.forFeature([ProductEntity])],
  // Controllers que expõem rotas HTTP
  controllers: [ProductController],
  // Providers disponíveis para DI dentro deste módulo
  providers: [ProductService, ProductRepository],
})
export class ProductModule {}
