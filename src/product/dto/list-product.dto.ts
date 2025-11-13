class ProductFeatureListDto {
  name: string;
  description: string;
}

class ProductImageListDto {
  url: string;
  description: string;
}

export class ListProductDto {
  id: string;
  userId: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
  category: string;
  features: ProductFeatureListDto[];
  images: ProductImageListDto[];
}
