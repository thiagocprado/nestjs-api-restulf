import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entity/order.entity';
import { In, Repository } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';
import { OrderStatus } from './enum/order-status.enum';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderItemEntity } from './entity/order-item.entity';
import { ProductEntity } from 'src/product/entity/product.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async createOrder(userId: string, order: CreateOrderDto) {
    const user = await this.getUser(userId);

    const productsIds = order.items.map((item) => item.productId);
    const relatedProducts = await this.productRepository.findBy({
      id: In(productsIds),
    });

    this.validateProductsData(order, relatedProducts);

    const orderEntity = new OrderEntity();
    orderEntity.status = OrderStatus.IN_PROGRESS;
    orderEntity.user = user;

    const orderItemsEntity = order.items.map((item) => {
      const relatedProduct = relatedProducts.find(
        (product) => product.id === item.productId,
      );

      const orderItemEntity = new OrderItemEntity();
      orderItemEntity.product = relatedProduct!;
      orderItemEntity.sellPrice = relatedProduct!.price;

      orderItemEntity.quantity = item.quantity;
      orderItemEntity.product.availableQuantity -= item.quantity;

      return orderItemEntity;
    });

    const totalValue = orderItemsEntity.reduce((total, item) => {
      return total + item.quantity * item.sellPrice;
    }, 0);

    orderEntity.items = orderItemsEntity;
    orderEntity.totalValue = totalValue;

    return this.orderRepository.save(orderEntity);
  }

  private async getUser(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`Usuário com ID ${userId} não encontrado`);
    }

    return user;
  }

  private validateProductsData(
    order: CreateOrderDto,
    relatedProducts: ProductEntity[],
  ) {
    order.items.forEach((item) => {
      const relatedProduct = relatedProducts.find(
        (product) => product.id === item.productId,
      );

      if (!relatedProduct) {
        throw new NotFoundException(
          `Produto com ID ${item.productId} não encontrado`,
        );
      }

      if (item.quantity > relatedProduct.availableQuantity) {
        throw new BadRequestException(
          `Quantidade solicitada (${item.quantity}) é maior do que a disponível (${relatedProduct.availableQuantity}) para o produto ${relatedProduct.name}`,
        );
      }
    });
  }
}
