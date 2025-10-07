<script setup lang="ts">
import type { AnalysisOverviewItem } from '@vben/common-ui';

import type { VxeGridProps } from '#/adapter/vxe-table';
import type { SpuOverviewData, SpuRankingItem } from '#/types/store/statistics';
import type { RequestGetPageQuery } from '#/utils/filter';

import { onMounted, ref } from 'vue';

import { Page, VbenCountToAnimator } from '@vben/common-ui';
import {
  SvgBellIcon,
  SvgCakeIcon,
  SvgCardIcon,
  SvgDownloadIcon,
} from '@vben/icons';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getSpuOverview, getSpuRanking } from '#/api/store/statistics';

import SpuChart from './components/spu-chart.vue';

// 商品概况数据
const overviewData = ref<SpuOverviewData>();
const overviewItems = ref<AnalysisOverviewItem[]>([]);

// 加载商品概况数据
async function loadOverviewData() {
  try {
    const response = await getSpuOverview();
    overviewData.value = response;

    // 转换为 AnalysisOverview 组件需要的格式
    overviewItems.value = [
      {
        icon: SvgCardIcon,
        title: '商品浏览量',
        totalTitle: '总浏览量',
        totalValue: response.page_views,
        value: response.page_views,
      },
      {
        icon: SvgCakeIcon,
        title: '商品访客数',
        totalTitle: '总访客数',
        totalValue: response.visitors,
        value: response.visitors,
      },
      {
        icon: SvgDownloadIcon,
        title: '支付件数',
        totalTitle: '总支付件数',
        totalValue: response.payment_count,
        value: response.payment_count,
      },
      {
        icon: SvgBellIcon,
        title: '支付金额',
        totalTitle: '总支付金额',
        totalValue: Number.parseFloat(response.payment_amount) || 0,
        value: Number.parseFloat(response.payment_amount) || 0,
      },
      {
        icon: SvgCardIcon,
        title: '退款件数',
        totalTitle: '总退款件数',
        totalValue: response.refund_count,
        value: response.refund_count,
      },
      {
        icon: SvgCakeIcon,
        title: '退款金额',
        totalTitle: '总退款金额',
        totalValue: Number.parseFloat(response.refund_amount) || 0,
        value: Number.parseFloat(response.refund_amount) || 0,
      },
    ];
  } catch (error) {
    console.error('加载商品概况数据失败:', error);
  }
}

// 商品排行表格配置
const formSchema = [
  {
    component: 'Select',
    componentProps: {
      allowClear: true,
      placeholder: '请选择排行类型',
      options: [
        { label: '商品浏览量', value: 'page_views' },
        { label: '商品访客数', value: 'visitors' },
        { label: '加购件数', value: 'add_cart_count' },
        { label: '支付金额', value: 'payment_amount' },
        { label: '收藏数量', value: 'favorite_count' },
        { label: '访客-支付转化率', value: 'conversion_rate' },
      ],
    },
    fieldName: 'ranking_type',
    label: '排行类型',
  },
  {
    component: 'RangePicker',
    componentProps: {
      placeholder: ['开始时间', '结束时间'],
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD',
    },
    fieldName: 'date_range',
    label: '时间范围',
  },
];

const gridOptions: VxeGridProps<SpuRankingItem> = {
  columns: [
    { title: '序号', type: 'seq', width: 60 },
    { field: 'id', title: 'ID', width: 80 },
    {
      field: 'image_url',
      title: '商品图片',
      width: 100,
      slots: { default: 'image' },
    },
    { field: 'name', title: '商品名称', minWidth: 200 },
    { field: 'page_views', title: '浏览量', width: 100 },
    { field: 'visitors', title: '访客数', width: 100 },
    { field: 'add_cart_count', title: '加购件数', width: 100 },
    { field: 'payment_amount', title: '支付金额', width: 120 },
    { field: 'favorite_count', title: '收藏数', width: 100 },
    { field: 'conversion_rate', title: '转化率', width: 100 },
  ],
  height: 500,
  keepSource: true,
  pagerConfig: {
    enabled: true,
    pageSize: 10,
  },
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        const params: RequestGetPageQuery = {
          page: page.currentPage,
          page_size: page.pageSize,
          filters: [],
          filter_sort_option: { sort_field: 'id', sort_order: 'desc' },
        };

        // 处理筛选条件
        if (formValues.ranking_type) {
          params.filter_sort_option = {
            sort_field: formValues.ranking_type,
            sort_order: 'desc',
          };
        }

        if (formValues.date_range && formValues.date_range.length === 2) {
          params.filters = [
            {
              field: 'created_at',
              operator: 'between',
              value: formValues.date_range,
              value_type: 'string',
            },
          ];
        }

        return await getSpuRanking(params);
      },
    },
  },
  toolbarConfig: {
    refresh: true,
    zoom: true,
  },
};

const [Grid] = useVbenVxeGrid({
  formOptions: {
    schema: formSchema,
    submitOnChange: true,
  },
  gridOptions,
});

onMounted(() => {
  loadOverviewData();
});
</script>

<template>
  <Page auto-content-height>
    <!-- 商品概况 Panel -->
    <div class="mb-6 rounded-lg bg-white p-6 shadow">
      <h1 class="mb-6 text-xl font-bold">商品概况</h1>

      <!-- 数据区域 -->
      <div class="mb-8">
        <div
          class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
        >
          <div
            v-for="item in overviewItems"
            :key="item.title"
            class="rounded-lg border bg-white p-4 shadow-sm"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <p class="text-sm text-gray-600">{{ item.title }}</p>
                <VbenCountToAnimator
                  :end-val="item.value"
                  :start-val="0"
                  class="mt-1 text-2xl font-semibold"
                  prefix=""
                />
                <p class="mt-1 text-xs text-gray-500">
                  {{ item.totalTitle }}:
                  <VbenCountToAnimator
                    :end-val="item.totalValue"
                    :start-val="0"
                    class="inline"
                    prefix=""
                  />
                </p>
              </div>
              <div class="ml-4 flex-shrink-0">
                <component :is="item.icon" class="h-8 w-8 text-blue-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 图表区域 -->
      <div>
        <h3 class="mb-4 text-base font-medium">商品数据趋势</h3>
        <div class="rounded-lg border bg-white p-4">
          <SpuChart :chart-data="overviewData?.chart_data || []" />
        </div>
      </div>
    </div>

    <!-- 商品排行 Panel -->
    <div class="rounded-lg bg-white p-6 shadow">
      <h1 class="mb-6 text-xl font-bold">商品排行</h1>

      <!-- 商品排行表格 -->
      <Grid>
        <template #image="{ row }">
          <img
            v-if="row.image_url"
            :src="row.image_url"
            :alt="row.name"
            class="h-12 w-12 rounded object-cover"
          />
          <div
            v-else
            class="flex h-12 w-12 items-center justify-center rounded bg-gray-100 text-gray-400"
          >
            无图
          </div>
        </template>
      </Grid>
    </div>
  </Page>
</template>
