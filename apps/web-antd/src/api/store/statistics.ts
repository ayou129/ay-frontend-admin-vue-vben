import type { PhpPageResponse } from '#/types';
import type { SpuOverviewData, SpuRankingItem } from '#/types/store/statistics';
import type { RequestGetPageQuery } from '#/utils/filter';

import { apiPrefix } from '#/api/config';
import { http } from '#/api/request';

/**
 * 获取商品概况统计
 */
export async function getSpuOverview() {
  return http.get<SpuOverviewData>(`${apiPrefix}/store/statistics/overview`);
}

/**
 * 获取商品排行榜
 */
export async function getSpuRanking(data: RequestGetPageQuery) {
  return http.post<PhpPageResponse<SpuRankingItem>>(
    `${apiPrefix}/store/statistics/ranking`,
    data,
  );
}
