import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConfigService } from './config/posgres.config.service';
import { ConfigModule } from '@nestjs/config';
import { OrderModule } from './order/order.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/http-exception-filter';

@Module({
  imports: [
    // Módulos de domínio
    UserModule,
    ProductModule,
    OrderModule,

    // Torna ConfigService global (não precisa re-importar em cada módulo)
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Registra a conexão do TypeORM de forma assíncrona usando uma classe
    // PostgresConfigService implementa TypeOrmOptionsFactory e lê variáveis via ConfigService
    TypeOrmModule.forRootAsync({
      useClass: PostgresConfigService,
    }),
  ],
  providers: [{ provide: APP_FILTER, useClass: HttpExceptionFilter }],
})
export class AppModule {}
