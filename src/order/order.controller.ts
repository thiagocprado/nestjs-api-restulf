import { Controller, Post, Body, Query } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Query('user_id') userId: string, @Body() order: CreateOrderDto) {
    return this.orderService.createOrder(userId, order);
  }
}
