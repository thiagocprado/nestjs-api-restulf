import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConfigService } from './config/posgres.config.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // Módulos de domínio
    UserModule,
    ProductModule,

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
})
export class AppModule {}
