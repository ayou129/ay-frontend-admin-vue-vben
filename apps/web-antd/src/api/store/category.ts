import type { CategoryModel } from '#/types/store/category';

import { apiPrefix } from '#/api/config';
import { http } from '#/api/request';

/**
 * 获取分类树
 */
export async function getCategoryTree() {
  return http.get<{ list: Category[] }>(`${apiPrefix}/store/categories/tree`);
}

/**
 * 获取分类详情
 */
export async function getCategoryDetail(id: number) {
  return http.get<Category>(`${apiPrefix}/store/categories/${id}`);
}

/**
 * 创建分类
 */
export async function createCategory(data: {
  name: string;
  parent_id?: number;
}) {
  return http.post<Category>(`${apiPrefix}/store/categories`, data);
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
  return http.put<Category>(`${apiPrefix}/store/categories/${id}`, data);
}

/**
 * 删除分类
 */
export async function deleteCategory(id: number) {
  return http.delete(`${apiPrefix}/store/categories/${id}`);
}
