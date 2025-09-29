import type { Spu } from '#/types/store/spu';
import type { RequestGetPageQuery } from '#/utils/filter';

import { apiPrefix } from '#/api/core/config';
import { requestClient } from '#/api/request';

/**
 * 获取商品列表
 */
export async function getProductList(params: RequestGetPageQuery) {
  return requestClient.get<{
    page: {
      total: number;
    };
    result: Spu[];
  }>(`${apiPrefix}/store/products`, {
    params: {
      page: params.page,
      page_size: params.page_size,
      filters: params.filters,
      filter_sort_option: params.filter_sort_option,
    },
  });
}

/**
 * 获取商品详情
 */
export async function getProductDetail(id: number) {
  return requestClient.get<Spu>(`${apiPrefix}/store/products/${id}`);
}

/**
 * 创建商品
 */
export async function createProduct(data: {
  category_id: number;
  description?: string;
  name: string;
  status: number;
  type: number;
  valid_type?: number;
  valid_value?: string;
}) {
  return requestClient.post<Spu>(`${apiPrefix}/store/products`, data);
}

/**
 * 更新商品
 */
export async function updateProduct(
  id: number,
  data: {
    category_id?: number;
    description?: string;
    name?: string;
    status?: number;
    type?: number;
    valid_type?: number;
    valid_value?: string;
  },
) {
  return requestClient.put<Spu>(`${apiPrefix}/store/products/${id}`, data);
}

/**
 * 删除商品
 */
export async function deleteProduct(id: number) {
  return requestClient.delete(`${apiPrefix}/store/products/${id}`);
}
