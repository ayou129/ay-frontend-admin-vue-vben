import type { PhpPageResponse } from '#/types';
import type { Spu } from '#/types/store/spu';
import type { RequestGetPageQuery } from '#/utils/filter';

import { apiPrefix } from '#/api/core/config';
import { requestClient } from '#/api/request';

/**
 * 获取商品列表
 */
export async function getSpuList(params: RequestGetPageQuery) {
  const response = await requestClient.post<PhpPageResponse<Spu>>(
    `${apiPrefix}/store/spu/list/page`,
    params,
  );

  // 转换为 VxeGrid 期望的格式 {items: [], total: 0}
  return {
    items: response.data,
    total: response.total,
  };
}

/**
 * 获取商品详情
 */
export async function getSpuDetail(id: number) {
  return requestClient.get<Spu>(`${apiPrefix}/store/spu/${id}`);
}

/**
 * 创建商品
 */
export async function createSpu(data: {
  carousel_ids?: number[];
  category_id: number;
  detail?: string;
  name: string;
  status: number;
  type: number;
  valid_type?: number;
  valid_value?: string;
}) {
  return requestClient.post<Spu>(`${apiPrefix}/store/spu`, data);
}

/**
 * 更新商品
 */
export async function updateSpu(
  id: number,
  data: {
    carousel_ids?: number[];
    category_id?: number;
    detail?: string;
    name?: string;
    status?: number;
    type?: number;
    valid_type?: number;
    valid_value?: string;
  },
) {
  return requestClient.put<Spu>(`${apiPrefix}/store/spu/${id}`, data);
}

/**
 * 删除商品
 */
export async function deleteSpu(id: number) {
  return requestClient.delete(`${apiPrefix}/store/spu/${id}`);
}
