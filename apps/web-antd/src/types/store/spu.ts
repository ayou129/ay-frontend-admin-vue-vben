import type { ResourceModel } from '#/types/resource';
import type { CategoryModel } from '#/types/store/category';
import type { Sku } from '#/types/store/sku';

export enum SpuOrderType {
  Hotel = 3, // 酒店订单
  Physical = 2, // 实物商品
  Virtual = 1, // 虚拟商品
}

export const spuOrderTypeTextMap: Record<SpuOrderType, string> = {
  [SpuOrderType.Virtual]: '虚拟商品',
  [SpuOrderType.Physical]: '实物商品',
  [SpuOrderType.Hotel]: '酒店订单',
};

export const spuOrderTypeColorMap: Record<SpuOrderType, string> = {
  [SpuOrderType.Virtual]: 'blue',
  [SpuOrderType.Physical]: 'green',
  [SpuOrderType.Hotel]: 'purple',
};

export enum SpuStatus {
  Normal = 1, // 正常
  OffShelf = -1, // 已下架
}

export const spuStatusTextMap: Record<SpuStatus, string> = {
  [SpuStatus.Normal]: '出售中',
  [SpuStatus.OffShelf]: '已下架',
};

export const spuStatusColorMap: Record<SpuStatus, string> = {
  [SpuStatus.Normal]: 'green',
  [SpuStatus.OffShelf]: 'red',
};

export enum SpuValidType {
  DynamicDays = 2, // 动态有效期(天数)
  FixedDate = 1, // 固定有效期
}

export const spuValidTypeTextMap: Record<SpuValidType, string> = {
  [SpuValidType.FixedDate]: '固定有效期',
  [SpuValidType.DynamicDays]: '动态有效期',
};

export const spuValidTypeColorMap: Record<SpuValidType, string> = {
  [SpuValidType.FixedDate]: 'blue',
  [SpuValidType.DynamicDays]: 'orange',
};

export interface SpuModel {
  id: number;
  category_id?: number;
  category?: CategoryModel;
  type: SpuOrderType; // 1=虚拟商品 2=实物商品 3=酒店订单
  name: string;
  status: SpuStatus; // 1=正常 -1=已下架
  detail?: string; // 商品详情（后端返回字段）
  valid_type: SpuValidType; // 1=固定有效期 2=动态有效期
  valid_value: string; //  2025-5-14 22:49:53或 2025-5-14格式 或 7
  created_at: string;
  updated_at: string;
  skus?: Sku[];
  carousels?: ResourceModel[]; // 商品轮播图列表
}
