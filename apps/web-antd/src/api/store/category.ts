import type { Category } from '#/types/store/category';

import { apiPrefix } from '#/api/core/config';
import { requestClient } from '#/api/request';

/**
 * 获取分类树
 */
export async function getCategoryTree() {
  return requestClient.get<{ list: Category[] }>(
    `${apiPrefix}/store/categories/tree`,
  );
}

/**
 * 获取分类详情
 */
export async function getCategoryDetail(id: number) {
  return requestClient.get<Category>(`${apiPrefix}/store/categories/${id}`);
}

/**
 * 创建分类
 */
export async function createCategory(data: {
  name: string;
  parent_id?: number;
}) {
  return requestClient.post<Category>(`${apiPrefix}/store/categories`, data);
}

/**
 * 更新分类
 */
export async function updateCategory(
  id: number,
  data: {
    name?: string;
    parent_id?: number;
  },
) {
  return requestClient.put<Category>(
    `${apiPrefix}/store/categories/${id}`,
    data,
  );
}

/**
 * 删除分类
 */
export async function deleteCategory(id: number) {
  return requestClient.delete(`${apiPrefix}/store/categories/${id}`);
}