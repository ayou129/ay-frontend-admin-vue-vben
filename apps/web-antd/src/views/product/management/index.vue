<script setup lang="ts">
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { Spu, SpuOrderType, SpuStatus } from '#/types/store/spu';
import type { RequestGetPageQuery } from '#/utils/filter';

import { ref } from 'vue';

import { Page } from '@vben/common-ui';
import { Plus, Search, SvgDownloadIcon } from '@vben/icons';

import { Button, message, TabPane, Tabs } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteProduct, getProductList } from '#/api/store/product';
import {
  createNumberFilter,
  createStringFilter,
  FilterOperators,
} from '#/utils/filter';

// 搜索表单配置
const [SearchForm, searchFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  layout: 'horizontal',
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入商品名称、关键字或ID进行搜索',
      },
      fieldName: 'keyword',
      label: '商品搜索',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        placeholder: '请选择商品类型',
        options: [
          { label: '全部', value: '' },
          { label: '实物商品', value: '2' },
          { label: '卡密商品', value: '1' },
          { label: '优惠券商品', value: '1' },
          { label: '酒店订单', value: '3' },
        ],
      },
      fieldName: 'type',
      label: '商品类型',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        placeholder: '请选择商品状态',
        options: [
          { label: '全部', value: '' },
          { label: '正常', value: '1' },
          { label: '已下架', value: '-1' },
        ],
      },
      fieldName: 'status',
      label: '商品状态',
    },
    {
      component: 'RangePicker',
      componentProps: {
        placeholder: ['开始时间', '结束时间'],
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
      },
      fieldName: 'dateRange',
      label: '创建时间',
    },
  ],
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
});

// Tab状态
const activeTab = ref('on_sale'); // 'on_sale' | 'off_shelf' | 'sold_out'

// 统计数据
const tabCounts = ref({
  on_sale: 0,
  off_shelf: 0,
  sold_out: 0,
});

// 构建筛选条件
const buildFilters = () => {
  const filters = [];
  const formValues = searchFormApi.getValues();

  // 关键词搜索
  if (formValues.keyword) {
    filters.push(
      createStringFilter('name', FilterOperators.LIKE, formValues.keyword),
    );
  }

  // 商品类型
  if (formValues.type) {
    filters.push(
      createNumberFilter(
        'type',
        FilterOperators.EQUAL,
        Number(formValues.type),
      ),
    );
  }

  // 商品状态
  if (formValues.status) {
    filters.push(
      createNumberFilter(
        'status',
        FilterOperators.EQUAL,
        Number(formValues.status),
      ),
    );
  }

  // Tab状态筛选
  if (activeTab.value === 'on_sale') {
    filters.push(createNumberFilter('status', FilterOperators.EQUAL, 1));
  } else if (activeTab.value === 'off_shelf') {
    filters.push(createNumberFilter('status', FilterOperators.EQUAL, -1));
  }
  // sold_out 需要根据库存判断，这里先不实现

  // 创建时间范围
  if (formValues.dateRange && formValues.dateRange.length === 2) {
    filters.push(
      createStringFilter(
        'created_at',
        FilterOperators.GTE,
        formValues.dateRange[0],
      ),
    );
    filters.push(
      createStringFilter(
        'created_at',
        FilterOperators.LTE,
        formValues.dateRange[1],
      ),
    );
  }

  return filters;
};

// 表格配置
const gridOptions: VxeGridProps<Spu> = {
  columns: [
    { type: 'checkbox', width: 50 },
    { field: 'id', title: 'ID', width: 80 },
    {
      field: 'main_images',
      title: '商品图片',
      width: 100,
      slots: { default: 'image' },
    },
    { field: 'name', title: '商品名称', minWidth: 200 },
    {
      field: 'type',
      title: '商品类型',
      width: 120,
      slots: { default: 'type' },
    },
    {
      field: 'status',
      title: '状态',
      width: 100,
      slots: { default: 'status' },
    },
    { field: 'category.name', title: '分类', width: 120 },
    { field: 'description', title: '描述', minWidth: 150 },
    { field: 'created_at', title: '创建时间', width: 180 },
    {
      title: '操作',
      width: 150,
      slots: { default: 'action' },
    },
  ],
  height: 500,
  keepSource: true,
  pagerConfig: {
    enabled: true,
    pageSize: 20,
  },
  proxyConfig: {
    ajax: {
      query: async ({ page }) => {
        const params: RequestGetPageQuery = {
          page: page.currentPage,
          page_size: page.pageSize,
          filters: buildFilters(),
          filter_sort_option: { sort_field: 'id', sort_order: 'desc' },
        };

        try {
          const response = await getProductList(params);
          // 更新Tab数量统计
          // TODO: 这里可以从API响应中获取统计数据
          return response;
        } catch (error) {
          console.error('获取商品列表失败:', error);
          return {
            result: [],
            page: {
              total: 0,
            },
          };
        }
      },
    },
  },
  toolbarConfig: {
    refresh: true,
    zoom: true,
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions,
});

// 搜索
const handleSearch = () => {
  gridApi.query();
};

// 重置
const handleReset = () => {
  searchFormApi.resetFields();
  gridApi.query();
};

// Tab切换
const handleTabChange = (key: string) => {
  activeTab.value = key;
  gridApi.query();
};

// 添加商品
const handleAddProduct = () => {
  message.info('添加商品功能开发中');
};

// 商品采集
const handleProductCollection = () => {
  message.info('商品采集功能开发中');
};

// 数据导出
const handleExport = () => {
  message.info('数据导出功能开发中');
};

// 编辑商品
const handleEdit = (row: Spu) => {
  message.info(`编辑商品: ${row.name}`);
};

// 删除商品
const handleDelete = async (row: Spu) => {
  try {
    await deleteProduct(row.id);
    message.success(`删除商品: ${row.name} 成功`);
    gridApi.query(); // 刷新列表
  } catch (error) {
    console.error('删除商品失败:', error);
    message.error(`删除商品: ${row.name} 失败`);
  }
};

// 获取商品类型文本
const getTypeText = (type: SpuOrderType) => {
  const typeMap = {
    1: '虚拟商品',
    2: '实物商品',
    3: '酒店订单',
  };
  return typeMap[type] || '未知';
};

// 获取状态文本
const getStatusText = (status: SpuStatus) => {
  return status === 1 ? '正常' : '已下架';
};
</script>

<template>
  <Page auto-content-height>
    <!-- 搜索框 Panel -->
    <div class="mb-4 rounded-lg bg-white p-6 shadow">
      <SearchForm />
      <!-- 搜索按钮 -->
      <div class="mt-4 flex space-x-2">
        <Button type="primary" @click="handleSearch">
          <Search class="size-4" />
          搜索
        </Button>
        <Button @click="handleReset"> 重置 </Button>
      </div>
    </div>

    <!-- 商品正文 Panel -->
    <div class="rounded-lg bg-white p-6 shadow">
      <!-- Switch Tab 按钮 -->
      <Tabs v-model:active-key="activeTab" @change="handleTabChange">
        <TabPane key="on_sale" :tab="`出售中的商品(${tabCounts.on_sale})`" />
        <TabPane
          key="off_shelf"
          :tab="`已下架的商品(${tabCounts.off_shelf})`"
        />
        <TabPane key="sold_out" :tab="`售罄的商品(${tabCounts.sold_out})`" />
      </Tabs>

      <!-- 按钮区域 -->
      <div class="mb-4 flex flex-wrap gap-2">
        <Button type="primary" @click="handleAddProduct">
          <Plus class="size-4" />
          添加商品
        </Button>
        <Button @click="handleProductCollection">
          <SvgDownloadIcon class="size-4" />
          商品采集
        </Button>
        <Button @click="handleExport">
          <SvgDownloadIcon class="size-4" />
          数据导出
        </Button>
      </div>

      <!-- 表格区域 -->
      <Grid>
        <template #image="{ row }">
          <img
            v-if="row.main_images && row.main_images[0]?.resource?.url"
            :src="row.main_images[0].resource.url"
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

        <template #type="{ row }">
          <span class="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
            {{ getTypeText(row.type) }}
          </span>
        </template>

        <template #status="{ row }">
          <span
            :class="{
              'bg-green-100 text-green-800': row.status === 1,
              'bg-red-100 text-red-800': row.status === -1,
            }"
            class="rounded px-2 py-1 text-xs"
          >
            {{ getStatusText(row.status) }}
          </span>
        </template>

        <template #action="{ row }">
          <div class="flex space-x-2">
            <Button size="small" type="link" @click="handleEdit(row)">
              编辑
            </Button>
            <Button size="small" type="link" danger @click="handleDelete(row)">
              删除
            </Button>
          </div>
        </template>
      </Grid>
    </div>
  </Page>
</template>

<style scoped>
.ant-tabs-tab {
  font-weight: 500;
}

.ant-tabs-tab.ant-tabs-tab-active {
  color: #1890ff;
}
</style>
