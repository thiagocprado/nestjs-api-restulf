/**
 * ==========================================================================
 * UPDATE-PRODUCT.DTO.TS — DTO de Atualização de Produto
 * ==========================================================================
 *
 * POO — HERANÇA com PartialType:
 *   Herda TODOS os campos e validações do CreateProductDto,
 *   mas torna tudo OPCIONAL (?). Ao enviar { name: "Novo nome" },
 *   apenas o name é validado; os demais campos são ignorados.
 * ==========================================================================
 */
import { CreateProductDto } from './create-product.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
