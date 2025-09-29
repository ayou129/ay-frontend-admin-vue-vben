import type { RequestClient } from '#/api/request';

import { requestClient } from '#/api/request';

const apiPrefix = '/api/v1/admin';

export interface StoreCategory {
  id: number;
  name: string;
  parent_id?: number;
  children?: StoreCategory[];
}

export interface CategoryTreeResponse {
  list: StoreCategory[];
}

// 获取分类树
export async function getCategoryTree(): Promise<CategoryTreeResponse> {
  return requestClient.get(`${apiPrefix}/store/categories/tree`);
}

// 获取分类详情
export async function getCategoryDetail(id: number): Promise<StoreCategory> {
  return requestClient.get(`${apiPrefix}/store/categories/${id}`);
}

// 创建分类
export async function createCategory(data: {
  name: string;
  parent_id?: number;
}): Promise<StoreCategory> {
  return requestClient.post(`${apiPrefix}/store/categories`, data);
}

// 更新分类
export async function updateCategory(
  id: number,
  data: {
    name?: string;
    parent_id?: number;
  },
): Promise<StoreCategory> {
  return requestClient.put(`${apiPrefix}/store/categories/${id}`, data);
}

// 删除分类
export async function deleteCategory(id: number): Promise<void> {
  return requestClient.delete(`${apiPrefix}/store/categories/${id}`);
}