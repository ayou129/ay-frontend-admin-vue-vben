import type { Resource } from '#/types/resource';
import type { Category } from '#/types/store/category';
import type { Sku } from '#/types/store/sku';

export enum SpuOrderType {
  Hotel = 3, // 酒店订单
  Physical = 2, // 实物商品
  Virtual = 1, // 虚拟商品
}

export enum SpuStatus {
  Normal = 1, // 正常
  OffShelf = -1, // 已下架
}

export enum SpuValidType {
  DynamicDays = 2, // 动态有效期(天数)
  FixedDate = 1, // 固定有效期
}

export interface SpuMainImage {
  id?: number; // 资源关联记录ID
  relation_id: number; // SPU ID
  resource_id: number; // 资源ID
  sort: number; // 排序字段
  resource?: Resource; // 对应的资源对象
  created_at?: string;
  updated_at?: string;
}

export interface Spu {
  id: number;
  category_id?: number;
  category?: Category;
  type: SpuOrderType; // 1=虚拟商品 2=实物商品 3=酒店订单
  name: string;
  status: SpuStatus; // 1=正常 -1=已下架
  description?: string;
  valid_type: SpuValidType; // 1=固定有效期 2=动态有效期
  valid_value: string; //  2025-5-14 22:49:53或 2025-5-14格式 或 7
  created_at: string;
  updated_at: string;
  skus?: Sku[];
  main_images?: SpuMainImage[]; // 商品主图关联列表（包含关联信息和资源信息）
}
