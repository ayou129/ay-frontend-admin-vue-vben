import type { ResourceModel } from '#/types/resource';

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

// SKU 状态枚举
export enum SkuStatus {
  Disabled = 0, // 禁用
  Enabled = 1, // 启用
}

export const skuStatusTextMap: Record<SkuStatus, string> = {
  [SkuStatus.Disabled]: '禁用',
  [SkuStatus.Enabled]: '启用',
};

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
  status: SkuStatus; // SKU 状态 0=禁用 1=启用
  main_image?: ResourceModel; // SKU主图
  created_at: string;
  updated_at: string;
}

// SKU 提交数据类型（用于创建和更新）
export interface SkuDTO {
  id?: number; // 编辑时需要传递
  spu_id?: number; // 编辑时需要传递
  name: string;
  code: string;
  price: number | string;
  stock_count: number;
  attr_value?: Record<string, string>;
  allow_member_discount: number;
  main_image_id?: number;
}
