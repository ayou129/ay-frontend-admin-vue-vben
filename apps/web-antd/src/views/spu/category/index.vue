<script lang="ts" setup>
import type { OnActionClickParams, VxeGridProps } from '#/adapter/vxe-table';
import type { CategoryModel } from '#/types/store/category';

import { nextTick, ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { Plus } from '@vben/icons';

import { Button, message } from 'ant-design-vue';

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
  actionLayout: 'inline',
  commonConfig: {
    disabledOnChangeListener: false,
    disabledOnInputListener: false,
    labelWidth: 80,
  },
  compact: true,
  handleReset: () => {
    searchParams.value = { keyword: '' };
    onRefresh();
  },
  handleSubmit: (values) => {
    searchParams.value = { keyword: values.keyword || '' };
    onRefresh();
  },
  handleValuesChange: (values) => {
    searchParams.value = { keyword: values.keyword || '' };
    onRefresh();
  },
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
    show: false,
  },
  wrapperClass: 'grid-cols-[auto_1fr]',
});

const categoryFormRef = ref();
const editData = ref();

const [FormModal, modalApi] = useVbenModal({
  destroyOnClose: true,
  onConfirm: async () => {
    await categoryFormRef.value?.submit();
  },
});

const gridOptions: VxeGridProps<CategoryModel> = {
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
    slots: {
      buttons: 'toolbar-buttons',
    },
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
  data: CategoryModel[],
  params: { keyword: string },
): CategoryModel[] {
  const result: CategoryModel[] = [];

  for (const item of data) {
    const matchKeyword = !params.keyword || item.name.includes(params.keyword);

    const filteredChildren: CategoryModel[] = item.children
      ? filterTreeData(item.children, params)
      : [];

    // 如果当前节点匹配，则保留该节点及其所有子节点
    if (matchKeyword) {
      result.push({ ...item, children: filteredChildren });
      continue;
    }

    // 如果子节点有匹配，保留该节点（即使当前节点不匹配）
    if (filteredChildren.length > 0) {
      result.push({ ...item, children: filteredChildren });
    }
  }

  return result;
}

const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });

// 展开/收起状态
const isExpandAll = ref(false);

// 展开/收起所有分类
async function toggleExpandAll() {
  await nextTick();
  const $grid = gridApi.grid;
  if ($grid) {
    isExpandAll.value = !isExpandAll.value;
    if (isExpandAll.value) {
      await $grid.setAllTreeExpand(true);
    } else {
      $grid.clearTreeExpand();
    }
  }
}

function onActionClick({ code, row }: OnActionClickParams<CategoryModel>) {
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
      modalApi.close();
    },
  };
  modalApi.open();
}

function onEdit(row: CategoryModel) {
  editData.value = {
    category: row,
    onSuccess: async (data: { name?: string; parent_id?: number }) => {
      await updateCategory(row.id, data);
      message.success('更新分类成功');
      onRefresh();
      modalApi.close();
    },
  };
  modalApi.open();
}

function onAppend(row: CategoryModel) {
  editData.value = {
    parent_id: row.id,
    onSuccess: async (data: { name: string; parent_id?: number }) => {
      await createCategory(data);
      message.success('创建子分类成功');
      onRefresh();
      modalApi.close();
    },
  };
  modalApi.open();
}

async function onDelete(row: CategoryModel) {
  try {
    await deleteCategory(row.id);
    message.success(`删除分类: ${row.name} 成功`);
    onRefresh();
  } catch {
    message.error(`删除分类: ${row.name} 失败`);
  }
}
</script>

<template>
  <Page auto-content-height>
    <FormModal @success="onRefresh">
      <CategoryForm ref="categoryFormRef" :edit-data="editData" />
    </FormModal>

    <!-- 搜索框 Panel -->
    <div class="mb-4 rounded-lg bg-white shadow">
      <div class="p-4">
        <SearchForm />
      </div>
    </div>

    <!-- 表格 Panel -->
    <div class="rounded-lg bg-white p-6 shadow">
      <Grid>
        <template #toolbar-buttons>
          <div class="flex gap-2">
            <Button type="primary" @click="onCreate">
              <Plus class="size-4" />
              添加分类
            </Button>
            <Button @click="toggleExpandAll">
              {{ isExpandAll ? '收起全部' : '展开全部' }}
            </Button>
          </div>
        </template>
      </Grid>
    </div>
  </Page>
</template>
