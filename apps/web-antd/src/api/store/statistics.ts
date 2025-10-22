import type { GoPageModel } from '@ay-shared-core/types/api';
import type { PageQueryDTO } from '@ay-shared-core/utils/page_query';

import type { SpuOverviewData, SpuRankingItem } from '#/types/store/statistics';

import { apiPrefix } from '#/api/config';
import { http } from '#/api/request';

/**
 * 获取商品概况统计
 */
export async function getSpuOverview() {
  return http.get<SpuOverviewData>(
    `${apiPrefix}/admin/store/statistics/overview`,
  );
}

/**
 * 获取商品排行榜
 */
export async function getSpuRanking(data: PageQueryDTO) {
  return http.post<GoPageModel<SpuRankingItem>>(
    `${apiPrefix}/admin/store/statistics/ranking`,
    data,
  );
}
