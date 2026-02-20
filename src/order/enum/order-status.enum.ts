/**
 * ==========================================================================
 * ORDER-STATUS.ENUM.TS — Enum de Status do Pedido
 * ==========================================================================
 *
 * O que é um Enum?
 *   É um tipo que define um conjunto FINITO de valores possíveis.
 *   Um pedido só pode ter um destes 3 estados — nada além disso.
 *
 * Os valores à esquerda (IN_PROGRESS, COMPLETED, CANCELLED) são usados
 * no código TypeScript. Os valores à direita ('em_processamento', etc.)
 * são os valores armazenados no banco de dados.
 *
 * Este enum é usado em 3 lugares:
 *   1. OrderEntity — define os valores aceitos na coluna 'status'
 *   2. UpdateOrderDto — valida via @IsEnum() que só aceita esses valores
 *   3. OrderService — define o status inicial como IN_PROGRESS
 * ==========================================================================
 */
export enum OrderStatus {
  IN_PROGRESS = 'em_processamento',
  COMPLETED = 'concluido',
  CANCELLED = 'cancelado',
}
