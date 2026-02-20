/**
 * ==========================================================================
 * MAIN.TS — Ponto de entrada da aplicação NestJS
 * ==========================================================================
 *
 * Este arquivo é equivalente ao "main()" de outras linguagens. É aqui que
 * a aplicação NestJS é criada, configurada e iniciada.
 *
 * Fluxo de inicialização:
 *   1. NestFactory.create() monta o container de Injeção de Dependência (DI)
 *      a partir do AppModule (módulo raiz)
 *   2. Pipes globais são configurados para validação automática dos DTOs
 *   3. O class-validator é integrado ao container de DI do Nest
 *   4. O servidor HTTP começa a escutar requisições na porta configurada
 *
 * O que é Injeção de Dependência (DI)?
 *   É um padrão onde as classes NÃO criam suas próprias dependências.
 *   Em vez disso, o framework (NestJS) cria e "injeta" automaticamente.
 *   Exemplo: o UserController não faz "new UserService()", ele recebe
 *   o UserService pronto no construtor. Isso facilita testes e manutenção.
 * ==========================================================================
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';

async function bootstrap() {
  /**
   * NestFactory.create(AppModule):
   * - Lê todos os decorators (@Module, @Injectable, @Controller...)
   * - Monta a árvore de dependências (quem depende de quem)
   * - Cria instâncias de todos os providers (services, repositories, etc.)
   * - Conecta controllers às suas rotas HTTP
   * - Retorna a instância da aplicação pronta para configuração
   */
  const app = await NestFactory.create(AppModule);

  /**
   * Pipe Global de Validação (ValidationPipe):
   *
   * O que é um Pipe no NestJS?
   *   É uma camada que intercepta os dados ANTES de chegarem ao controller.
   *   Pode transformar dados (ex: string "123" → número 123) e/ou validá-los.
   *
   * Ao registrar como "global", TODAS as rotas passam por essa validação.
   * O ValidationPipe usa a biblioteca class-validator para validar os DTOs.
   *
   * Opções:
   *   - transform: converte o JSON da requisição em instância da classe DTO
   *   - whitelist: remove campos que NÃO estão declarados no DTO (segurança)
   *   - forbidNonWhitelisted: retorna erro 400 se enviar campo não permitido
   */
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  /**
   * Integração class-validator + container de DI do NestJS:
   *
   * Por padrão, o class-validator cria suas próprias instâncias de validators.
   * Isso é um problema quando o validator precisa de uma dependência injetada
   * (por exemplo, o UniqueEmailValidator precisa do UserService para consultar o banco).
   *
   * useContainer() diz ao class-validator: "não crie instâncias sozinho,
   * peça ao container de DI do NestJS". Assim, o UniqueEmailValidator
   * recebe o UserService injetado automaticamente.
   *
   * fallbackOnErrors: true → se o container não encontrar algo, não quebra
   */
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  /**
   * Inicia o servidor HTTP na porta definida pela variável de ambiente PORT,
   * ou na porta 3000 como padrão. A partir daqui, a API está pronta para
   * receber requisições (GET, POST, PUT, DELETE, PATCH...).
   */
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
