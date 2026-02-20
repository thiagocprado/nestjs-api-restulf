/**
 * ==========================================================================
 * ORDER.SERVICE.TS — Camada de Service (Lógica de Negócio de Pedidos)
 * ==========================================================================
 *
 * Este é o service MAIS COMPLEXO do projeto. Ele orquestra múltiplos
 * repositórios e contém lógica de negócio elaborada.
 *
 * Fluxo de criação de pedido (createOrder):
 *   1. Buscar o usuário (verificar se existe)
 *   2. Buscar os produtos dos itens do pedido
 *   3. Validar: todos os produtos existem? Tem estoque suficiente?
 *   4. Criar a entidade de pedido com status "em_processamento"
 *   5. Criar as entidades de itens do pedido (OrderItemEntity)
 *   6. Atualizar o estoque de cada produto (decrementar)
 *   7. Calcular o valor total do pedido
 *   8. Salvar tudo no banco (com cascade)
 *
 * POO — Encapsulamento:
 *   Os métodos getUser() e validateProductsData() são PRIVATE.
 *   São lógica INTERNA que não deve ser acessível de fora da classe.
 * ==========================================================================
 */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entity/order.entity';
import { In, Repository } from 'typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { OrderStatus } from './enum/order-status.enum';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderItemEntity } from './entity/order-item.entity';
import { ProductEntity } from '../product/entity/product.entity';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  /**
   * Injeção de 3 repositórios via construtor:
   *
   * Este service precisa acessar 3 tabelas diferentes:
   *   - orders (para criar/buscar/atualizar pedidos)
   *   - users (para verificar se o usuário existe)
   *   - products (para buscar produtos e validar estoque)
   *
   * Cada @InjectRepository() injeta o repositório da entidade especificada.
   * Isso só funciona porque as 3 entidades foram registradas no
   * TypeOrmModule.forFeature() do OrderModule.
   */
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  /**
   * Cria um novo pedido — método mais complexo do projeto.
   *
   * Veja o fluxo detalhado nos comentários inline abaixo.
   */
  async createOrder(userId: string, order: CreateOrderDto) {
    /** Passo 1: Buscar e validar o usuário */
    const user = await this.getUser(userId);

    /**
     * Passo 2: Buscar todos os produtos dos itens do pedido.
     *
     * In(productsIds) → operador TypeORM que gera:
     *   WHERE id IN ('uuid-1', 'uuid-2', 'uuid-3')
     * Busca todos os produtos de uma vez (eficiente, evita N queries).
     */
    const productsIds = order.items.map((item) => item.productId);
    const relatedProducts = await this.productRepository.findBy({
      id: In(productsIds),
    });

    /** Passo 3: Validar se todos os produtos existem e têm estoque */
    this.validateProductsData(order, relatedProducts);

    /** Passo 4: Criar a entidade do pedido */
    const orderEntity = new OrderEntity();
    orderEntity.status = OrderStatus.IN_PROGRESS;
    orderEntity.user = user;

    /**
     * Passo 5: Criar os itens do pedido (OrderItemEntity).
     *
     * Para cada item do DTO, cria uma entidade de item:
     *   - Associa o produto encontrado
     *   - Registra o preço de venda (foto do preço no momento da compra)
     *   - Registra a quantidade
     *   - DECREMENTA o estoque do produto
     */
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

    /** Passo 6: Calcular o valor total (soma de quantidade * preço de cada item) */
    const totalValue = orderItemsEntity.reduce((total, item) => {
      return total + item.quantity * item.sellPrice;
    }, 0);

    orderEntity.items = orderItemsEntity;
    orderEntity.totalValue = totalValue;

    /**
     * Passo 7: Salvar no banco.
     *
     * Graças ao cascade: true na OrderEntity, o repository.save() salva:
     *   - O pedido (orders)
     *   - Os itens do pedido (orders_items)
     *   - E atualiza o estoque dos produtos (products)
     * Tudo em uma única operação.
     */
    return this.orderRepository.save(orderEntity);
  }

  /** Busca todos os pedidos de um usuário, incluindo os dados do usuário */
  async getUserOrders(userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (user === null) {
      throw new NotFoundException('User not found.');
    }

    /**
     * relations: { user: true } → carrega os dados do usuário junto.
     * where: { user: { id: userId } } → filtra pedidos pelo ID do usuário
     * (o TypeORM resolve o JOIN automaticamente).
     */
    return this.orderRepository.find({
      where: {
        user: { id: userId },
      },
      relations: {
        user: true,
      },
    });
  }

  /** Atualiza o status de um pedido (ex: "em_processamento" → "concluido") */
  async updateOrder(id: string, dto: UpdateOrderDto) {
    const order = await this.orderRepository.findOneBy({ id });

    if (order === null) {
      throw new NotFoundException('Order not found.');
    }

    Object.assign(order, dto as OrderEntity);

    return this.orderRepository.save(order);
  }

  /**
   * Método PRIVADO — busca e valida a existência do usuário.
   * Encapsulamento (POO): lógica interna que não deve ser exposta.
   * Se o usuário não existir, lança NotFoundException (404).
   */
  private async getUser(userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (user === null) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }

  /**
   * Método PRIVADO — valida os dados dos produtos do pedido.
   * Encapsulamento (POO): regras de negócio internas.
   *
   * Validações:
   *   1. Cada produto do pedido deve existir no banco
   *   2. A quantidade solicitada não pode exceder o estoque disponível
   *
   * BadRequestException → retorna status 400 (erro do cliente).
   * NotFoundException → retorna status 404 (recurso não encontrado).
   */
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
          `Product with ID ${item.productId} not found.`,
        );
      }

      if (item.quantity > relatedProduct.availableQuantity) {
        throw new BadRequestException(
          `Requested quantity (${item.quantity}) exceeds available stock (${relatedProduct.availableQuantity}) for product ${relatedProduct.name}.`,
        );
      }
    });
  }
}
