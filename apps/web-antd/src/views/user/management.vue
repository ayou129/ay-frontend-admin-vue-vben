<script setup lang="ts">
import type { UserVO } from '#/types';

import { Page, useVbenModal } from '@vben/common-ui';

import { Button, Popconfirm, Tag } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { useUserStore } from '#/store/user';
import { FilterOperators, ValueTypes } from '#/types';

// Store
const userStore = useUserStore();

// 字段筛选配置
const getFieldFilterConfig = (field: string, value: any) => {
  switch (field) {
    case 'email': {
      // 邮箱：模糊搜索
      return {
        operator: FilterOperators.LIKE,
        value,
        valueType: ValueTypes.STRING,
      };
    }
    case 'nick_name':
    case 'real_name': {
      // 姓名、昵称：模糊搜索
      return {
        operator: FilterOperators.LIKE,
        value,
        valueType: ValueTypes.STRING,
      };
    }
    case 'phone': {
      // 手机号：支持模糊搜索（部分匹配）
      return {
        operator: FilterOperators.LIKE,
        value,
        valueType: ValueTypes.STRING,
      };
    }
    case 'status': {
      // 状态：精确匹配
      return {
        operator: FilterOperators.EQUAL,
        value,
        valueType: ValueTypes.NUMBER,
      };
    }
    default: {
      // 默认：模糊搜索
      return {
        operator: FilterOperators.LIKE,
        value,
        valueType: ValueTypes.STRING,
      };
    }
  }
};

// 表格配置和gridApi声明需要先定义
const [VxeGrid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: [
      { type: 'checkbox', width: 50 },
      { field: 'id', title: 'ID', width: 80 },
      { field: 'phone', title: '手机号', width: 130 },
      { field: 'real_name', title: '真实姓名', width: 120 },
      { field: 'nick_name', title: '昵称', width: 120 },
      { field: 'email', title: '邮箱', width: 200 },
      {
        field: 'status',
        title: '状态',
        width: 100,
        slots: { default: 'status' },
      },
      { field: 'created_at', title: '创建时间', width: 180 },
      {
        field: 'action',
        title: '操作',
        width: 150,
        slots: { default: 'action' },
      },
    ],
    proxyConfig: {
      ajax: {
        query: async (
          { page }: { page: { currentPage: number; pageSize: number } },
          formValues: Record<string, any> = {},
        ) => {
          // 从表单值构建筛选条件
          const filters = Object.entries(formValues)
            .filter(
              ([_, value]) =>
                value !== undefined && value !== null && value !== '',
            )
            .map(([field, value]) => {
              // 根据字段类型确定筛选方式
              const filterConfig = getFieldFilterConfig(field, value);
              return {
                field,
                operator: filterConfig.operator,
                value: filterConfig.value,
                value_type: filterConfig.valueType,
              };
            });

          const response = await userStore.fetchPage(
            page.currentPage,
            page.pageSize,
            filters,
          );
          return {
            items: response.items || [],
            total: response.total || 0,
          };
        },
      },
    },
  },
  formOptions: {
    collapsed: false,
    schema: [
      {
        component: 'Input',
        fieldName: 'phone',
        label: '手机号',
      },
      {
        component: 'Input',
        fieldName: 'real_name',
        label: '真实姓名',
      },
      {
        component: 'Input',
        fieldName: 'nick_name',
        label: '昵称',
      },
      {
        component: 'Input',
        fieldName: 'email',
        label: '邮箱',
      },
      {
        component: 'Select',
        componentProps: {
          allowClear: true,
          options: [
            { label: '未激活', value: 0 },
            { label: '正常', value: 1 },
            { label: '冻结', value: 2 },
            { label: '已删除', value: 3 },
          ],
          placeholder: '请选择状态',
        },
        fieldName: 'status',
        label: '状态',
      },
    ],
    showCollapseButton: true,
    submitOnChange: true,
    showDefaultActions: true, // 显示默认操作按钮
    submitButtonOptions: { show: false }, // 隐藏搜索按钮（因为是自动搜索）
    resetButtonOptions: { content: '重置筛选' }, // 保留重置按钮
  },
});

// 用户表单配置
const userFormSchema = [
  {
    component: 'Input',
    fieldName: 'phone',
    label: '手机号',
    rules: 'required',
  },
  {
    component: 'Input',
    fieldName: 'real_name',
    label: '真实姓名',
  },
  {
    component: 'Input',
    fieldName: 'nick_name',
    label: '昵称',
  },
  {
    component: 'Input',
    fieldName: 'email',
    label: '邮箱',
  },
  {
    component: 'Select',
    componentProps: {
      options: [
        { label: '未激活', value: 0 },
        { label: '正常', value: 1 },
        { label: '冻结', value: 2 },
        { label: '已删除', value: 3 },
      ],
    },
    fieldName: 'status',
    label: '状态',
    rules: 'required',
  },
  {
    component: 'Select',
    componentProps: {
      options: [
        { label: '未知', value: 0 },
        { label: '男性', value: 1 },
        { label: '女性', value: 2 },
      ],
    },
    fieldName: 'gender',
    label: '性别',
  },
];

// 创建用户弹窗
const [CreateModal, createModalApi] = useVbenModal({
  onConfirm: async () => {
    const valid = await createFormApi.validate();
    if (valid) {
      const formData =
        (await createFormApi.getValues()) as unknown as Partial<UserVO>;
      const success = await userStore.create(formData);
      if (success) {
        createModalApi.close();
        createFormApi.resetForm();
        // 刷新表格数据
        gridApi.query();
      }
    }
  },
  title: '新增用户',
});

const [CreateForm, createFormApi] = useVbenForm({
  schema: userFormSchema,
  showDefaultActions: false,
});

// 编辑用户弹窗
const [EditModal, editModalApi] = useVbenModal({
  onConfirm: async () => {
    const valid = await editFormApi.validate();
    if (valid) {
      const formData =
        (await editFormApi.getValues()) as unknown as Partial<UserVO>;
      const { id } = editModalApi.getData<{ id: number }>();
      const success = await userStore.update(id, formData);
      if (success) {
        editModalApi.close();
        // 刷新表格数据
        gridApi.query();
      }
    }
  },
  title: '编辑用户',
});

const [EditForm, editFormApi] = useVbenForm({
  schema: userFormSchema,
  showDefaultActions: false,
});

// 不需要手动初始化，VxeGrid会自动加载数据

// 事件处理
const handleCreate = () => {
  createFormApi.resetForm();
  createModalApi.open();
};

const handleEdit = (user: UserVO) => {
  editFormApi.setValues(user);
  editModalApi.setData({ id: user.id });
  editModalApi.open();
};

const handleDelete = async (id: number) => {
  const success = await userStore.delete(id);
  if (success) {
    // 刷新表格数据
    gridApi.query();
  }
};
</script>

<template>
  <Page description="用户信息管理和维护" title="用户管理">
    <div class="mb-4">
      <Button type="primary" @click="handleCreate"> 新增用户 </Button>
    </div>

    <VxeGrid>
      <template #status="{ row }">
        <Tag :color="userStore.format_status(row.status).color">
          {{ userStore.format_status(row.status).text }}
        </Tag>
      </template>

      <template #action="{ row }">
        <div class="flex gap-2">
          <Button type="link" size="small" @click="handleEdit(row)">
            编辑
          </Button>
          <Popconfirm
            title="确定删除此用户吗？"
            @confirm="handleDelete(row.id)"
          >
            <Button type="link" size="small" danger> 删除 </Button>
          </Popconfirm>
        </div>
      </template>
    </VxeGrid>

    <!-- 创建用户弹窗 -->
    <CreateModal>
      <CreateForm />
    </CreateModal>

    <!-- 编辑用户弹窗 -->
    <EditModal>
      <EditForm />
    </EditModal>
  </Page>
</template>
