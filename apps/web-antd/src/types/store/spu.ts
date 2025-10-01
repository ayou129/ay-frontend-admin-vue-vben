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

export interface Spu {
  id: number;
  category_id?: number;
  category?: Category;
  type: SpuOrderType; // 1=虚拟商品 2=实物商品 3=酒店订单
  name: string;
  status: SpuStatus; // 1=正常 -1=已下架
  detail?: string; // 商品详情（后端返回字段）
  valid_type: SpuValidType; // 1=固定有效期 2=动态有效期
  valid_value: string; //  2025-5-14 22:49:53或 2025-5-14格式 或 7
  created_at: string;
  updated_at: string;
  skus?: Sku[];
  carousels?: Resource[]; // 商品轮播图列表
}
