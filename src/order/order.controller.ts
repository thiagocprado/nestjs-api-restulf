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

  @Post()
  async create(
    @Query('user_id') userId: string,
    @Body() order: CreateOrderDto,
  ) {
    const createdOrder = await this.orderService.createOrder(userId, order);
    return createdOrder;
  }

  @Get()
  async getUserOrders(@Query('user_id') userId: string) {
    const orders = await this.orderService.getUserOrders(userId);
    return orders;
  }

  @Patch(':id')
  async updateOrder(
    @Param('id') orderId: string,
    @Body() updateData: UpdateOrderDto,
  ) {
    return this.orderService.updateOrder(orderId, updateData);
  }
}
