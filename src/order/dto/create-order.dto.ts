/**
 * ==========================================================================
 * CREATE-ORDER.DTO.TS — DTO de Criação de Pedido (com DTO Aninhado)
 * ==========================================================================
 *
 * Define o contrato de entrada para criar um pedido.
 * O pedido é composto por uma lista de ITENS, cada um com:
 *   - productId: qual produto está sendo comprado
 *   - quantity: quantas unidades
 *
 * A classe OrderItemDTO é uma classe PRIVADA ao módulo (não é exportada).
 * Só existe para validar os itens dentro de CreateOrderDto.
 * ==========================================================================
 */
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsUUID,
  ValidateNested,
} from 'class-validator';

/**
 * DTO aninhado para cada item do pedido.
 * NÃO é exportado — só é usado internamente por CreateOrderDto.
 */
class OrderItemDTO {
  /** @IsUUID() — O productId deve ser um UUID válido */
  @IsUUID()
  productId: string;

  /** @IsInt() — Quantidade deve ser um número inteiro (sem decimais) */
  @IsInt()
  quantity: number;
}

export class CreateOrderDto {
  /**
   * @ValidateNested() + @Type(() => OrderItemDTO):
   *   Mesmo padrão do create-product.dto.ts:
   *   - ValidateNested: valida cada objeto dentro do array
   *   - Type: converte plain objects em instâncias de OrderItemDTO
   *   - IsArray: garante que é um array
   *   - ArrayMinSize(1): exige pelo menos 1 item no pedido
   */
  @ValidateNested()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => OrderItemDTO)
  items: OrderItemDTO[];
}
