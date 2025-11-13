import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { ProductImageDto, ProductFeatureDto } from './create-product.dto';

export class UpdateProductDto {
  @IsUUID(undefined, { message: 'Product ID is invalid' })
  id: string;

  @IsUUID(undefined, { message: 'User ID is invalid' })
  userId: string;

  @IsString()
  @IsNotEmpty({ message: 'Product name must not be empty' })
  @IsOptional()
  name: string;

  @IsNumber({ maxDecimalPlaces: 2, allowNaN: false, allowInfinity: false })
  @Min(1, { message: 'Price must be greater than zero' })
  @IsOptional()
  price: number;

  @IsNumber()
  @Min(0, { message: 'Invalid minimum quantity' })
  @IsOptional()
  quantity: number;

  @IsString()
  @IsOptional()
  description: string;

  @ValidateNested()
  @IsArray()
  @ArrayMinSize(3)
  @Type(() => ProductFeatureDto)
  @IsOptional()
  features: ProductFeatureDto[];

  @ValidateNested()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => ProductImageDto)
  @IsOptional()
  images: ProductImageDto[];

  @IsString()
  @IsNotEmpty({ message: 'Product category must not be empty' })
  @IsOptional()
  category: string;
}
