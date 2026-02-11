import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsUUID,
  ValidateNested,
} from 'class-validator';

class OrderItemDTO {
  @IsUUID()
  productId: string;

  @IsInt()
  quantity: number;
}

export class CreateOrderDto {
  @ValidateNested()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => OrderItemDTO)
  items: OrderItemDTO[];
}
