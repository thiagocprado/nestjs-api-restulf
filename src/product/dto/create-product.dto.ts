import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { ProductEntity } from '../entities/product.entity';

export class ProductFeatureDto {
  id: string;

  @IsString()
  @IsNotEmpty({ message: 'Feature name must not be empty' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Feature description must not be empty' })
  description: string;

  product: ProductEntity;
}

export class ProductImageDto {
  id: string;

  @IsUrl(undefined, { message: 'Image URL is invalid' })
  url: string;

  @IsString()
  @IsNotEmpty({ message: 'Image description must not be empty' })
  description: string;

  product: ProductEntity;
}

export class CreateProductDto {
  @IsUUID(undefined, { message: 'User ID is invalid' })
  userId: string;

  @IsString()
  @IsNotEmpty({ message: 'Product name must not be empty' })
  name: string;

  @IsNumber({ maxDecimalPlaces: 2, allowNaN: false, allowInfinity: false })
  @Min(1, { message: 'Price must be greater than zero' })
  price: number;

  @IsNumber()
  @Min(0, { message: 'Invalid minimum quantity' })
  quantity: number;

  @IsString()
  @IsNotEmpty({ message: 'Product description must not be empty' })
  @MaxLength(1000, {
    message: 'Description cannot exceed 1000 characters',
  })
  description: string;

  @ValidateNested()
  @IsArray()
  @ArrayMinSize(3)
  @Type(() => ProductFeatureDto)
  features: ProductFeatureDto[];

  @ValidateNested()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => ProductImageDto)
  images: ProductImageDto[];

  @IsString()
  @IsNotEmpty({ message: 'Product category must not be empty' })
  category: string;
}
