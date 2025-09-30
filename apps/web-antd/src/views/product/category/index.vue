<script lang="ts" setup>
import type { OnActionClickParams, VxeGridProps } from '#/adapter/vxe-table';
import type { Category } from '#/types/store/category';

import { ref } from 'vue';

import { Page, useVbenDrawer } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message, Modal } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  createCategory,
  deleteCategory,
  getCategoryTree,
  updateCategory,
} from '#/api/store/category';

import CategoryForm from './modules/category-form.vue';

// 搜索表单
const searchParams = ref({
  keyword: '',
});

const [SearchForm] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    labelWidth: 80,
  },
  compact: true,
  layout: 'horizontal',
  schema: [
    {
      component: 'Input',
      componentProps: {
        allowClear: true,
        placeholder: '请输入分类名称',
      },
      fieldName: 'keyword',
      label: '分类名称',
    },
  ],
  showDefaultActions: true,
  submitButtonOptions: {
    content: '搜索',
  },
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
});

const categoryFormRef = ref();
const editData = ref();

const [FormDrawer, drawerApi] = useVbenDrawer({
  destroyOnClose: true,
  onConfirm: async () => {
    await categoryFormRef.value?.submit();
  },
});

const gridOptions: VxeGridProps<Category> = {
  columns: [
    {
      align: 'left',
      field: 'name',
      fixed: 'left',
      minWidth: 200,
      title: '分类名称',
      treeNode: true,
    },
    { field: 'id', title: 'ID', width: 80 },
    { field: 'created_at', title: '创建时间', width: 180 },
    { field: 'updated_at', title: '更新时间', width: 180 },
    {
      align: 'right',
      cellRender: {
        attrs: {
          nameField: 'name',
          onClick: onActionClick,
        },
        name: 'CellOperation',
        options: [
          {
            code: 'append',
            text: '新增子分类',
          },
          'edit',
          'delete',
        ],
      },
      field: 'operation',
      fixed: 'right',
      headerAlign: 'center',
      showOverflow: false,
      title: '操作',
      width: 200,
    },
  ],
  height: 'auto',
  keepSource: true,
  pagerConfig: {
    enabled: false,
  },
  proxyConfig: {
    ajax: {
      query: async () => {
        const response = await getCategoryTree();
        let items = response.list || [];

        // 过滤数据
        if (searchParams.value.keyword) {
          items = filterTreeData(items, searchParams.value);
        }

        return {
          items,
          total: items.length,
        };
      },
    },
  },
  rowConfig: {
    keyField: 'id',
  },
  toolbarConfig: {
    custom: true,
    export: false,
    refresh: true,
    zoom: true,
  },
  treeConfig: {
    parentField: 'parent_id',
    rowField: 'id',
    transform: false,
  },
};

// 树形数据过滤
function filterTreeData(
  data: Category[],
  params: { keyword: string },
): Category[] {
  return data
    .map((item) => {
      const matchKeyword =
        !params.keyword || item.name.includes(params.keyword);

      const filteredChildren = item.children
        ? filterTreeData(item.children, params)
        : [];

      // 如果当前节点匹配，则保留该节点及其所有子节点
      if (matchKeyword) {
        return { ...item, children: filteredChildren };
      }

      // 如果子节点有匹配，保留该节点（即使当前节点不匹配）
      if (filteredChildren.length > 0) {
        return { ...item, children: filteredChildren };
      }

      return null;
    })
    .filter((item): item is Category => item !== null);
}

const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });

function onActionClick({ code, row }: OnActionClickParams<Category>) {
  switch (code) {
    case 'append': {
      onAppend(row);
      break;
    }
    case 'delete': {
      onDelete(row);
      break;
    }
    case 'edit': {
      onEdit(row);
      break;
    }
  }
}

function onRefresh() {
  gridApi.query();
}

function onCreate() {
  editData.value = {
    onSuccess: async (data: { name: string; parent_id?: number }) => {
      await createCategory(data);
      message.success('创建分类成功');
      onRefresh();
      drawerApi.close();
    },
  };
  drawerApi.open();
}

function onEdit(row: Category) {
  editData.value = {
    category: row,
    onSuccess: async (data: { name?: string; parent_id?: number }) => {
      await updateCategory(row.id, data);
      message.success('更新分类成功');
      onRefresh();
      drawerApi.close();
    },
  };
  drawerApi.open();
}

function onAppend(row: Category) {
  editData.value = {
    parent_id: row.id,
    onSuccess: async (data: { name: string; parent_id?: number }) => {
      await createCategory(data);
      message.success('创建子分类成功');
      onRefresh();
      drawerApi.close();
    },
  };
  drawerApi.open();
}

async function onDelete(row: Category) {
  Modal.confirm({
    cancelText: '取消',
    content: `确定要删除分类「${row.name}」吗？`,
    okText: '确定',
    okType: 'danger',
    title: '删除确认',
    async onOk() {
      try {
        await deleteCategory(row.id);
        message.success(`删除分类: ${row.name} 成功`);
        onRefresh();
      } catch {
        message.error(`删除分类: ${row.name} 失败`);
      }
    },
  });
}

// 搜索处理
function handleSearch(values: any) {
  searchParams.value = {
    keyword: values.keyword || '',
  };
  onRefresh();
}

// 重置搜索
function handleReset() {
  searchParams.value = {
    keyword: '',
  };
  onRefresh();
}
</script>

<template>
  <Page auto-content-height>
    <FormDrawer @success="onRefresh">
      <CategoryForm ref="categoryFormRef" :edit-data="editData" />
    </FormDrawer>

    <!-- 搜索框 Panel -->
    <div class="mb-4 rounded-lg bg-white shadow">
      <div class="p-4">
        <SearchForm @reset="handleReset" @submit="handleSearch" />
      </div>
    </div>

    <!-- 表格 Panel -->
    <Grid>
      <template #toolbar-tools>
        <Button type="primary" @click="onCreate">
          <Plus class="size-5" />
          添加分类
        </Button>
      </template>
    </Grid>
  </Page>
</template>
