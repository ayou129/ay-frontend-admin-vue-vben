import type { PhpPageResponse } from '#/types';
import type { RequestGetPageQuery } from '#/utils/filter';

import { requestClient } from '#/api/request';

import { apiPrefix } from '../core/config';

export namespace ProductStatisticsApi {
  /** 商品概况统计数据 */
  export interface OverviewData {
    /** 商品浏览量 */
    page_views: number;
    /** 浏览量环比增长 */
    page_views_growth: string;
    /** 商品访客数 */
    visitors: number;
    /** 访客数环比增长 */
    visitors_growth: string;
    /** 支付件数 */
    payment_count: number;
    /** 支付件数环比增长 */
    payment_count_growth: string;
    /** 支付金额 */
    payment_amount: string;
    /** 支付金额环比增长 */
    payment_amount_growth: string;
    /** 退款件数 */
    refund_count: number;
    /** 退款件数环比增长 */
    refund_count_growth: string;
    /** 退款金额 */
    refund_amount: string;
    /** 退款金额环比增长 */
    refund_amount_growth: string;
    /** 图表数据 */
    chart_data: string[];
  }

  /** 商品排行榜数据项 */
  export interface RankingItem {
    /** ID */
    id: number;
    /** 商品名称 */
    name: string;
    /** 商品图片URL */
    image_url: string;
    /** 商品浏览量 */
    page_views: number;
    /** 商品访客数 */
    visitors: number;
    /** 加购件数 */
    add_cart_count: number;
    /** 支付金额 */
    payment_amount: string;
    /** 收藏数量 */
    favorite_count: number;
    /** 访客-支付转化率 */
    conversion_rate: string;
    /** 商品状态 */
    status: number;
    /** 创建时间 */
    created_at: string;
    /** 更新时间 */
    updated_at: string;
  }
}

/**
 * 获取商品概况统计
 */
export async function getProductOverview() {
  return requestClient.get<ProductStatisticsApi.OverviewData>(
    `${apiPrefix}/store/statistics/overview`,
  );
}

/**
 * 获取商品排行榜
 */
export async function getProductRanking(data: RequestGetPageQuery) {
  return requestClient.post<PhpPageResponse<ProductStatisticsApi.RankingItem>>(
    `${apiPrefix}/store/statistics/ranking`,
    data,
  );
}
