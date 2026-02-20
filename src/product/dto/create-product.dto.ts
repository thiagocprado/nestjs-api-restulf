/**
 * ==========================================================================
 * CREATE-PRODUCT.DTO.TS — DTO de Criação de Produto (com DTOs Aninhados)
 * ==========================================================================
 *
 * Este é o DTO mais complexo do projeto. Além dos campos simples,
 * contém ARRAYS DE DTOs ANINHADOS (features e images).
 *
 * Para validar objetos aninhados, é necessário combinar:
 *   1. @ValidateNested() — diz ao class-validator para validar dentro do objeto
 *   2. @Type(() => ClasseDto) — diz ao class-transformer para converter
 *      os plain objects do JSON em instâncias da classe correta
 *
 * Sem @Type(), o class-validator receberia objetos puros (plain objects)
 * e NÃO conseguiria acessar os decorators de validação das classes filhas.
 * ==========================================================================
 */
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { ProductEntity } from '../entity/product.entity';

/**
 * DTO aninhado para características do produto.
 * Cada produto deve ter pelo menos 3 features (ver @ArrayMinSize abaixo).
 *
 * @IsOptional() em id e product: esses campos são preenchidos
 * automaticamente pelo TypeORM, não precisam vir na requisição.
 */
export class ProductFeatureDto {
  @IsOptional()
  id: string;

  @IsString()
  @IsNotEmpty({ message: 'Feature name must not be empty' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Feature description must not be empty' })
  description: string;

  @IsOptional()
  product: ProductEntity;
}

/** DTO aninhado para imagens do produto. Pelo menos 1 imagem é obrigatória. */
export class ProductImageDto {
  @IsOptional()
  id: string;

  /** @IsUrl() — Valida que o valor é uma URL válida (http://... ou https://...) */
  @IsUrl(undefined, { message: 'Image URL is invalid' })
  url: string;

  @IsString()
  @IsNotEmpty({ message: 'Image description must not be empty' })
  description: string;

  @IsOptional()
  product: ProductEntity;
}

export class CreateProductDto {
  /** @IsUUID() — Valida que o valor é um UUID válido */
  @IsUUID(undefined, { message: 'User ID is invalid' })
  userId: string;

  @IsString()
  @IsNotEmpty({ message: 'Product name must not be empty' })
  name: string;

  /**
   * @IsNumber({ maxDecimalPlaces: 2 }) — Aceita números com no máximo
   * 2 casas decimais. allowNaN/allowInfinity: false impede valores inválidos.
   * @Min(1) — Preço mínimo de 1 (não aceita zero ou negativo).
   */
  @IsNumber({ maxDecimalPlaces: 2, allowNaN: false, allowInfinity: false })
  @Min(1, { message: 'Price must be greater than zero' })
  price: number;

  @IsNumber()
  @Min(1, { message: 'Invalid minimum quantity' })
  availableQuantity: number;

  /** @MaxLength(1000) — Limita o tamanho da descrição a 1000 caracteres */
  @IsString()
  @IsNotEmpty({ message: 'Product description must not be empty' })
  @MaxLength(1000, {
    message: 'Description cannot exceed 1000 characters',
  })
  description: string;

  /**
   * @ValidateNested() + @Type(() => ProductFeatureDto):
   *   - ValidateNested: "valide cada item do array usando os decorators da classe"
   *   - Type: "converta cada plain object em instância de ProductFeatureDto"
   *   - IsArray: garante que é um array
   *   - ArrayMinSize(3): exige pelo menos 3 características
   */
  @ValidateNested()
  @IsArray()
  @ArrayMinSize(3)
  @Type(() => ProductFeatureDto)
  features: ProductFeatureDto[];

  /** Mesmo padrão de validação aninhada, mas exige pelo menos 1 imagem */
  @ValidateNested()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => ProductImageDto)
  images: ProductImageDto[];

  @IsString()
  @IsNotEmpty({ message: 'Product category must not be empty' })
  category: string;
}
