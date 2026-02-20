/**
 * ==========================================================================
 * LIST-PRODUCT.DTO.TS — DTO de Saída (Resposta) de Produto
 * ==========================================================================
 *
 * Controla quais dados do produto são expostos na listagem.
 * Expõe: id, name, features e images.
 * Esconde: userId, price, availableQuantity, createdAt, deletedAt...
 *
 * As classes auxiliares (ProductFeatureListDto, ProductImageListDto)
 * filtram os dados dos relacionamentos, expondo apenas name/description/url.
 *
 * "readonly" no construtor → propriedades imutáveis (encapsulamento).
 * ==========================================================================
 */

/** DTO auxiliar — filtra dados de features na resposta */
class ProductFeatureListDto {
  name: string;
  description: string;
}

/** DTO auxiliar — filtra dados de images na resposta */
class ProductImageListDto {
  url: string;
  description: string;
}

export class ListProductDto {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly features: ProductFeatureListDto[],
    readonly images: ProductImageListDto[],
  ) {}
}
