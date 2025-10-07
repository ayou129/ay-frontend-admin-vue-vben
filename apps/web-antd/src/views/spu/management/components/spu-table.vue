<script setup lang="ts">
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { SpuOrderType, SpuStatus } from '#/types/store/spu';
import type { RequestGetPageQuery } from '#/utils/filter';

import { ref } from 'vue';

import { Plus, SvgDownloadIcon } from '@vben/icons';

import { Button, Image, message, TabPane, Tabs } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteSpu, getSpuList } from '#/api/store/spu';
import {
  createNumberFilter,
  createStringFilter,
  FilterOperators,
} from '#/utils/filter';

// Props和Emits定义
interface Props {
  searchParams: Record<string, any>;
}

interface Emits {
  add: [];
  edit: [row: SpuModel];
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Tab状态
const activeTab = ref('on_sale');

// 统计数据
const tabCounts = ref({
  on_sale: 0,
  off_shelf: 0,
  sold_out: 0,
});

// 构建筛选条件
const buildFilters = () => {
  const filters = [];
  const formValues = props.searchParams;

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

  // 商品状态筛选：优先使用搜索表单的状态，否则使用Tab状态
  if (formValues.status) {
    filters.push(
      createNumberFilter(
        'status',
        FilterOperators.EQUAL,
        Number(formValues.status),
      ),
    );
  } else {
    // 仅当搜索表单没有状态筛选时，才使用Tab状态筛选
    if (activeTab.value === 'on_sale') {
      filters.push(createNumberFilter('status', FilterOperators.EQUAL, 1));
    } else if (activeTab.value === 'off_shelf') {
      filters.push(createNumberFilter('status', FilterOperators.EQUAL, -1));
    }
  }

  // 创建时间范围
  if (formValues.dateRange && formValues.dateRange.length === 2) {
    filters.push(
      createStringFilter(
        'created_at',
        FilterOperators.GTE,
        formValues.dateRange[0],
      ),
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
const gridOptions: VxeGridProps<SpuModel> = {
  columns: [
    { type: 'checkbox', width: 50 },
    { field: 'id', title: 'ID', width: 80 },
    {
      field: 'carousels',
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
    { field: 'detail', title: '描述', minWidth: 150 },
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
          const response = await getSpuList(params);
          return response;
        } catch (error) {
          console.error('获取商品列表失败:', error);
          return {
            items: [],
            total: 0,
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

// Tab切换
const handleTabChange = (key: number | string) => {
  activeTab.value = String(key);
  gridApi.query();
};

// 添加商品
const handleAddSpu = () => {
  emit('add');
};

// 商品采集
const handleSpuCollection = () => {
  message.info('商品采集功能开发中');
};

// 数据导出
const handleExport = () => {
  message.info('数据导出功能开发中');
};

// 编辑商品
const handleEdit = (row: SpuModel) => {
  emit('edit', row);
};

// 删除商品
const handleDelete = async (row: SpuModel) => {
  try {
    await deleteSpu(row.id);
    message.success(`删除商品: ${row.name} 成功`);
    gridApi.query();
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

// 刷新表格
const refresh = () => {
  gridApi.query();
};

// 暴露方法给父组件
defineExpose({
  refresh,
});
</script>

<template>
  <div class="rounded-lg bg-white p-6 shadow">
    <!-- Switch Tab 按钮 -->
    <Tabs v-model:active-key="activeTab" @change="handleTabChange">
      <TabPane key="on_sale" :tab="`出售中的商品(${tabCounts.on_sale})`" />
      <TabPane key="off_shelf" :tab="`已下架的商品(${tabCounts.off_shelf})`" />
      <TabPane key="sold_out" :tab="`售罄的商品(${tabCounts.sold_out})`" />
    </Tabs>

    <!-- 按钮区域 -->
    <div class="mb-2 flex flex-wrap gap-2">
      <Button type="primary" @click="handleAddSpu">
        <Plus class="size-4" />
        添加商品
      </Button>
      <Button @click="handleSpuCollection">
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
        <Image
          v-if="row.carousels && row.carousels[0]?.url"
          :src="row.carousels[0].url"
          :alt="row.name"
          :preview="true"
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
</template>
