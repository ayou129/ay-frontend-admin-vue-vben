import type { Resource } from '#/types/resource';

export interface Sku {
  id: number;
  spu_id: number;
  name: string;
  code: string;
  price: string; // 价格（后端返回字符串）
  stock_count: number;
  specification?: string;
  allow_member_discount: number; // 是否允许会员折扣 0=否 1=是
  main_image?: Resource; // SKU主图
  created_at: string;
  updated_at: string;
}
