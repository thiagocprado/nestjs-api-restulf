/**
 * ==========================================================================
 * UPDATE-ORDER.DTO.TS — DTO de Atualização de Pedido
 * ==========================================================================
 *
 * Diferente dos outros DTOs de update (que usam PartialType),
 * este DTO tem apenas UM campo: status.
 *
 * @IsEnum(OrderStatus) — Valida que o valor enviado é um dos valores
 * definidos no enum OrderStatus ('em_processamento', 'concluido', 'cancelado').
 * Se enviar qualquer outro valor, retorna 400 Bad Request.
 * ==========================================================================
 */
import { IsEnum } from 'class-validator';
import { OrderStatus } from '../enum/order-status.enum';

export class UpdateOrderDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
