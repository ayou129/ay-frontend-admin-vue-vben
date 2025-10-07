import type { Resource } from '#/types/resource';

// SKU 属性值
export interface SkuAttrValue {
  id: number;
  attr_id: number;
  value: string;
  sort: number;
  status?: number;
  created_at?: string;
  updated_at?: string;
}

// SKU 属性
export interface SkuAttr {
  id: number;
  category_id: number;
  name: string;
  sort: number;
  status: number;
  created_at: string;
  updated_at: string;
  values: SkuAttrValue[];
}

// SKU 属性列表响应
export interface SkuAttrListResponse {
  attrs: SkuAttr[];
  combinations: string[]; // 如 ["红色-L", "红色-M", ...]
}

// SKU
export interface Sku {
  id: number;
  spu_id: number;
  name: string;
  code: string;
  price: string; // 价格（后端返回字符串）
  stock_count: number;
  attr_value?: Record<string, string>; // 如 {"颜色": "红色", "尺码": "XL"}
  allow_member_discount: number; // 是否允许会员折扣 0=否 1=是
  main_image?: Resource; // SKU主图
  created_at: string;
  updated_at: string;
}
