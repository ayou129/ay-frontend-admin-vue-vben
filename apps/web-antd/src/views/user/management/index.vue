<script setup lang="ts">
import type { VbenFormProps } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { UserVO } from '#/types';

import { onMounted, reactive } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import { Button, Popconfirm, Tag } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { useUserStore } from '#/store/user';

// Store
const userStore = useUserStore();

// 搜索表单配置
const searchFormOptions: VbenFormProps = {
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
  handleSubmit: (values: Record<string, any>) => {
    // 过滤空值并直接作为查询参数
    const searchParams = Object.fromEntries(
      Object.entries(values).filter(
        ([_, value]) => value !== undefined && value !== null && value !== '',
      ),
    );
    userStore.setSearchParams(searchParams);
    userStore.fetchPage();
  },
};

// 表格配置
const gridOptions: VxeTableGridOptions<UserVO> = reactive({
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
  data: userStore.items,
  loading: userStore.loading,
  pagerConfig: {
    currentPage: userStore.page,
    pageSize: userStore.page_size,
    total: userStore.total,
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
      }
    }
  },
  title: '编辑用户',
});

const [EditForm, editFormApi] = useVbenForm({
  schema: userFormSchema,
  showDefaultActions: false,
});

// 初始化
onMounted(async () => {
  await userStore.fetchPage();
  console.warn('数据获取完成，当前items数量:', userStore.items.length);
});

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
  await userStore.delete(id);
};

const [VxeGrid] = useVbenVxeGrid({
  gridOptions,
  formOptions: searchFormOptions,
});
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
