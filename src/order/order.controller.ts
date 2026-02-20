/**
 * ==========================================================================
 * ORDER.CONTROLLER.TS — Camada de Controller (Pedidos)
 * ==========================================================================
 *
 * Rotas disponíveis:
 *   POST  /orders?user_id=xxx  → criar pedido (user_id via query string)
 *   GET   /orders?user_id=xxx  → listar pedidos do usuário
 *   PATCH /orders/:id          → atualizar status do pedido
 *
 * Diferenças em relação aos outros controllers:
 *   - Usa @Query() para receber o user_id da QUERY STRING (?user_id=xxx)
 *   - Usa @Patch() ao invés de @Put() para atualização PARCIAL
 *
 * Diferença entre @Put e @Patch:
 *   - @Put: convenção para atualização COMPLETA (enviar todos os campos)
 *   - @Patch: convenção para atualização PARCIAL (enviar só o que mudou)
 *   Aqui, só o status do pedido é atualizatízvel, por isso usa @Patch.
 * ==========================================================================
 */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  /**
   * POST /orders?user_id=xxx
   *
   * @Query('user_id') — Extrai o parâmetro da QUERY STRING da URL.
   *   Exemplo: POST /orders?user_id=abc-123 → userId = "abc-123"
   *
   * Diferença entre @Query, @Param e @Body:
   *   - @Query('key')  → query string: /orders?user_id=abc
   *   - @Param('key')  → parâmetro de rota: /orders/:id
   *   - @Body()        → corpo da requisição (JSON)
   */
  @Post()
  async create(
    @Query('user_id') userId: string,
    @Body() order: CreateOrderDto,
  ) {
    const createdOrder = await this.orderService.createOrder(userId, order);
    return createdOrder;
  }

  /** GET /orders?user_id=xxx — Lista todos os pedidos de um usuário */
  @Get()
  async getUserOrders(@Query('user_id') userId: string) {
    const orders = await this.orderService.getUserOrders(userId);
    return orders;
  }

  /**
   * PATCH /orders/:id — Atualização parcial (só o status).
   * @Param('id') extrai o ID do pedido da URL.
   * @Body() extrai o novo status como UpdateOrderDto.
   */
  @Patch(':id')
  async updateOrder(
    @Param('id') orderId: string,
    @Body() updateData: UpdateOrderDto,
  ) {
    return this.orderService.updateOrder(orderId, updateData);
  }
}
