/**
 * ==========================================================================
 * GLOBAL-EXCEPTION-FILTER.TS — Filtro Global de Exceções
 * ==========================================================================
 *
 * O que é um Exception Filter no NestJS?
 *   É uma camada que INTERCEPTA exceções não tratadas em qualquer parte
 *   da aplicação e decide como responder ao cliente.
 *
 * Fluxo de uma requisição com erro:
 *   Cliente → Controller → Service → [EXCEÇÃO!] → Exception Filter → Resposta
 *
 * Sem este filtro, o NestJS usa seu filtro padrão (que só trata HttpException).
 * Com este filtro, capturamos TODAS as exceções (inclusive erros inesperados)
 * e retornamos uma resposta padronizada.
 *
 * POO — Interface/Contrato:
 *   Implementa ExceptionFilter, que exige o método catch().
 *   O NestJS sabe que pode chamar catch() em qualquer classe que
 *   implemente essa interface — isso é polimorfismo.
 *
 * Este filtro foi registrado no AppModule como provider global
 * usando o token APP_FILTER.
 * ==========================================================================
 */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

/**
 * @Catch() — Decorator que define QUAIS exceções este filtro captura.
 *
 * @Catch() sem argumentos = captura TODAS as exceções (HttpException,
 * TypeError, erros de banco, etc.). Se fosse @Catch(HttpException),
 * capturaria apenas exceções HTTP.
 *
 * "implements ExceptionFilter" → contrato que obriga a ter o método catch().
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  /**
   * Injeção de Dependência — HttpAdapterHost:
   *
   * O HttpAdapterHost é um provider do CORE do NestJS que dá acesso
   * ao adaptador HTTP subjacente (Express ou Fastify).
   *
   * Por que usar o httpAdapter ao invés de response.json() diretamente?
   * Para manter o código DESACOPLADO do framework HTTP específico.
   * Se um dia trocar Express por Fastify, este filtro continua funcionando.
   */
  constructor(private adapterHost: HttpAdapterHost) {}

  /**
   * Método catch() — chamado automaticamente pelo NestJS quando uma
   * exceção não tratada é lançada.
   *
   * Parâmetros (injetados pelo NestJS):
   *   - exception: a exceção lançada (tipo unknown, pode ser qualquer coisa)
   *   - host: ArgumentsHost, que dá acesso ao request e response
   *
   * Lógica:
   *   1. Se a exceção é uma HttpException (ex: NotFoundException, BadRequestException),
   *      usa o status e a mensagem que ela já carrega.
   *   2. Se NÃO é HttpException (erro inesperado), retorna 500 Internal Server Error
   *      com timestamp e o caminho da requisição.
   *
   * "exception instanceof HttpException" → Polimorfismo:
   *   Todas as exceções HTTP do NestJS (NotFoundException, BadRequestException, etc.)
   *   HERDAM de HttpException. O instanceof verifica se a exceção é desse tipo
   *   ou de qualquer subclasse — isso é possível graças à herança.
   */
  catch(exception: unknown, host: ArgumentsHost) {
    console.log(exception);

    const { httpAdapter } = this.adapterHost;

    /** host.switchToHttp() converte o contexto para HTTP (request + response) */
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const { status, body } =
      exception instanceof HttpException
        ? {
            status: exception.getStatus(),
            body: exception.getResponse(),
          }
        : {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            body: {
              statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
              timestamp: new Date().toISOString(),
              path: httpAdapter.getRequestUrl(request),
            },
          };

    /** Envia a resposta ao cliente usando o adaptador HTTP (desacoplado) */
    httpAdapter.reply(response, body, status);
  }
}
