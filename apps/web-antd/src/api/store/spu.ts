import type { PhpPageResponse } from '#/types';
import type { SkuAttrListResponse } from '#/types/store/sku';
import type { Spu } from '#/types/store/spu';
import type { RequestGetPageQuery } from '#/utils/filter';

import { apiPrefix } from '#/api/config';
import { http } from '#/api/request';

/**
 * 获取商品列表
 */
export async function getSpuList(params: RequestGetPageQuery) {
  const response = await http.post<PhpPageResponse<Spu>>(
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
  return http.get<Spu>(`${apiPrefix}/store/spu/${id}`);
}

/**
 * SKU 提交数据类型（用于创建和更新）
 */
export interface SkuSubmitData {
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

/**
 * 创建商品
 */
export async function createSpu(data: {
  carousel_ids?: number[];
  category_id: number;
  detail?: string;
  name: string;
  skus?: SkuSubmitData[];
  status: number;
  type: number;
  valid_type?: number;
  valid_value?: string;
}) {
  return http.post<Spu>(`${apiPrefix}/store/spu`, data);
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
    skus?: SkuSubmitData[];
    status?: number;
    type?: number;
    valid_type?: number;
    valid_value?: string;
  },
) {
  return http.put<Spu>(`${apiPrefix}/store/spu/${id}`, data);
}

/**
 * 删除商品
 */
export async function deleteSpu(id: number) {
  return http.delete(`${apiPrefix}/store/spu/${id}`);
}

/**
 * 获取 SKU 属性列表及组合
 */
export async function getSkuAttrList(categoryId: number) {
  return http.get<SkuAttrListResponse>(
    `${apiPrefix}/store/spu/sku/attr/list/${categoryId}`,
  );
}
