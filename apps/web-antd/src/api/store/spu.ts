import type { GoPageModel } from '@ay-shared-core/types/api';
import type { PageQueryDTO } from '@ay-shared-core/utils/page_query';

import type { SkuAttrListResponse } from '#/types/store/sku';
import type { CreateSpuDTO, SpuModel, UpdateSpuDTO } from '#/types/store/spu';

import { apiPrefix } from '#/api/config';
import { http } from '#/api/request';

/**
 * 获取商品列表
 */
export async function getSpuList(params: PageQueryDTO) {
  const response = await http.post<GoPageModel<SpuModel>>(
    `${apiPrefix}/admin/store/spu/list/page`,
    params,
  );

  // 转换为 VxeGrid 期望的格式 {items: [], total: 0}
  return {
    items: response.list,
    total: response.total,
  };
}

/**
 * 获取商品详情
 */
export async function getSpuDetail(id: number) {
  return http.get<SpuModel>(`${apiPrefix}/admin/store/spu/${id}`);
}

/**
 * 创建商品
 */
export async function createSpu(data: CreateSpuDTO) {
  return http.post<SpuModel>(`${apiPrefix}/admin/store/spu`, data);
}

/**
 * 更新商品
 */
export async function updateSpu(id: number, data: UpdateSpuDTO) {
  return http.put<SpuModel>(`${apiPrefix}/admin/store/spu/${id}`, data);
}

/**
 * 删除商品
 */
export async function deleteSpu(id: number) {
  return http.delete(`${apiPrefix}/admin/store/spu/${id}`);
}

/**
 * 获取 SKU 属性列表及组合
 */
export async function getSkuAttrList(categoryId: number) {
  return http.get<SkuAttrListResponse>(
    `${apiPrefix}/admin/store/spu/sku/attr/list/${categoryId}`,
  );
}

/**
 * 批量删除 SKU
 */
export async function deleteBatchSkuByIds(spuId: number, skuIds: number[]) {
  return http.delete(`${apiPrefix}/store/spu/${spuId}/sku/batch`, {
    data: { sku_ids: skuIds },
  });
}
