class ProductFeatureListDto {
  name: string;
  description: string;
}

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
