/**
 * ==========================================================================
 * APP.MODULE.TS — Módulo Raiz da Aplicação
 * ==========================================================================
 *
 * O que é um Module no NestJS?
 *   É a unidade organizacional principal. Cada módulo agrupa:
 *   - imports:      outros módulos dos quais este depende
 *   - controllers:  classes que recebem requisições HTTP
 *   - providers:    classes que contêm lógica (services, validators, etc.)
 *   - exports:      providers que ficam disponíveis para outros módulos
 *
 * O AppModule é o módulo RAIZ — é ele que o NestFactory.create() recebe
 * no main.ts. Todos os outros módulos são importados aqui, direta ou
 * indiretamente, formando a árvore de módulos da aplicação.
 *
 * Estrutura modular deste projeto:
 *   AppModule (raiz)
 *   ├── UserModule     → CRUD de usuários
 *   ├── ProductModule  → CRUD de produtos
 *   ├── OrderModule    → Gestão de pedidos
 *   ├── ConfigModule   → Variáveis de ambiente (.env)
 *   └── TypeOrmModule  → Conexão com o banco PostgreSQL
 * ==========================================================================
 */
import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConfigService } from './config/posgres.config.service';
import { ConfigModule } from '@nestjs/config';
import { OrderModule } from './order/order.module';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './filters/global-exception-filter';

/**
 * @Module() — Decorator de classe
 *
 * O que é um Decorator?
 *   É uma função especial (inicia com @) que adiciona METADADOS a uma classe,
 *   método ou propriedade. O NestJS lê esses metadados na inicialização
 *   para montar o container de DI e o sistema de rotas.
 *
 *   @Module() diz ao NestJS: "esta classe é um módulo, e aqui estão
 *   seus imports, controllers e providers".
 */
@Module({
  imports: [
    /**
     * Módulos de domínio (feature modules):
     * Cada módulo encapsula uma parte do negócio da aplicação.
     * Ao importá-los aqui, seus controllers e providers ficam ativos.
     */
    UserModule,
    ProductModule,
    OrderModule,

    /**
     * ConfigModule.forRoot({ isGlobal: true }):
     *
     * Padrão forRoot — usado quando um módulo precisa ser configurado UMA vez
     * na raiz da aplicação ("for the root module").
     *
     * O ConfigModule lê o arquivo .env e disponibiliza o ConfigService,
     * que permite acessar variáveis de ambiente de forma tipada.
     *
     * isGlobal: true → o ConfigService fica disponível em TODOS os módulos
     * sem precisar re-importar o ConfigModule em cada um.
     */
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    /**
     * TypeOrmModule.forRootAsync({ useClass: PostgresConfigService }):
     *
     * Padrão forRootAsync — versão assíncrona do forRoot. Usado quando
     * a configuração depende de algo que precisa ser resolvido em runtime
     * (neste caso, o ConfigService que lê variáveis de ambiente).
     *
     * useClass: PostgresConfigService → o NestJS vai:
     *   1. Criar uma instância de PostgresConfigService (injetando ConfigService)
     *   2. Chamar o método createTypeOrmOptions() para obter as configurações
     *   3. Usar essas configurações para conectar ao PostgreSQL
     *
     * Isso funciona porque PostgresConfigService implementa a interface
     * TypeOrmOptionsFactory (POO: contrato/abstração).
     */
    TypeOrmModule.forRootAsync({
      useClass: PostgresConfigService,
    }),
  ],
  /**
   * providers — registra classes que podem ser injetadas neste módulo.
   *
   * { provide: APP_FILTER, useClass: GlobalExceptionFilter }:
   *
   * Aqui estamos usando a forma EXPANDIDA de registrar um provider.
   * Ao invés da forma simples (só a classe), usamos provide/useClass:
   *
   *   - provide: APP_FILTER → é um TOKEN de injeção do NestJS.
   *     Tokens são identificadores únicos que o container de DI usa
   *     para saber ONDE injetar cada provider.
   *     APP_FILTER é um token especial que diz: "registre como filtro global".
   *
   *   - useClass: GlobalExceptionFilter → a classe que será instanciada
   *     e usada como filtro de exceções para TODA a aplicação.
   *
   * Resultado: qualquer exceção não tratada em qualquer controller
   * será capturada pelo GlobalExceptionFilter.
   */
  providers: [{ provide: APP_FILTER, useClass: GlobalExceptionFilter }],
})
export class AppModule {}
