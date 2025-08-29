<script setup lang="ts">
import type { MemberLevelDTO, MemberLevelVO } from '#/types';

import { reactive } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import { Button, Popconfirm, Switch } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { useMemberLevelStore } from '#/store/member-level';
import { FilterOperators, MemberLevelStatus, ValueTypes } from '#/types';

defineOptions({
  name: 'MemberLevelManagement',
});

// Store
const memberLevelStore = useMemberLevelStore();

// 字段筛选配置
const getFieldFilterConfig = (field: string, value: any) => {
  switch (field) {
    case 'level_no':
    case 'point_max':
    case 'point_min': {
      return {
        operator: FilterOperators.EQUAL,
        value,
        valueType: ValueTypes.NUMBER,
      };
    }
    case 'name': {
      return {
        operator: FilterOperators.LIKE,
        value,
        valueType: ValueTypes.STRING,
      };
    }
    case 'status': {
      return {
        operator: FilterOperators.EQUAL,
        value,
        valueType: ValueTypes.NUMBER,
      };
    }
    default: {
      return {
        operator: FilterOperators.LIKE,
        value,
        valueType: ValueTypes.STRING,
      };
    }
  }
};

// 状态变更loading状态管理
const statusLoadingState = reactive<Record<number, boolean>>({});

// 表格配置
const [VxeGrid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: [
      { type: 'checkbox', width: 50 },
      { field: 'id', title: 'ID', width: 80 },
      { field: 'name', title: '等级名称', width: 120 },
      { field: 'level_no', title: '等级序号', width: 100 },
      {
        field: 'point_range',
        title: '积分范围',
        width: 120,
        slots: { default: 'point_range' },
      },
      {
        field: 'discount_rate',
        title: '折扣率',
        width: 120,
        slots: { default: 'discount_rate' },
      },
      {
        field: 'status',
        title: '状态',
        width: 110,
        slots: { default: 'status' },
      },
      { field: 'icon', title: '图标', width: 80 },
      { field: 'remark', title: '备注', width: 150 },
      { field: 'created_at', title: '创建时间', width: 180 },
      {
        field: 'action',
        title: '操作',
        width: 180,
        slots: { default: 'action' },
      },
    ],
    proxyConfig: {
      ajax: {
        query: async ({
          page,
        }: {
          page: { currentPage: number; pageSize: number };
        }) => {
          const formValues = await gridApi.formApi.getLatestSubmissionValues();
          const filters = Object.entries(formValues)
            .filter(
              ([_, value]) =>
                value !== undefined && value !== null && value !== '',
            )
            .map(([field, value]) => {
              const filterConfig = getFieldFilterConfig(field, value);
              return {
                field,
                operator: filterConfig.operator,
                value: filterConfig.value,
                value_type: filterConfig.valueType,
              };
            });

          const filter_sort_option = {
            sort_field: 'id',
            sort_order: 'desc' as const,
          };

          const response = await memberLevelStore.fetchPage(
            page.currentPage,
            page.pageSize,
            filters,
            filter_sort_option,
          );
          return {
            items: response?.items || [],
            total: response?.total || 0,
          };
        },
      },
    },
  },
  formOptions: {
    collapsed: false,
    schema: [
      { component: 'Input', fieldName: 'name', label: '等级名称' },
      {
        component: 'InputNumber',
        componentProps: { min: 1, precision: 0, placeholder: '请输入等级序号' },
        fieldName: 'level_no',
        label: '等级序号',
      },
      {
        component: 'Select',
        componentProps: {
          allowClear: true,
          options: [
            { label: '禁用', value: MemberLevelStatus.Disabled },
            { label: '启用', value: MemberLevelStatus.Enabled },
          ],
          placeholder: '请选择状态',
        },
        fieldName: 'status',
        label: '状态',
      },
    ],
    showCollapseButton: true,
    submitOnChange: true,
    showDefaultActions: true,
    submitButtonOptions: { show: false },
    resetButtonOptions: { content: '重置筛选' },
    handleSubmit: (values: Record<string, any>) => {
      gridApi.reload(values);
    },
  },
});

// 会员等级表单配置
const memberLevelFormSchema = [
  {
    component: 'Input',
    fieldName: 'name',
    label: '等级名称',
    rules: 'required',
  },
  {
    component: 'InputNumber',
    componentProps: {
      min: 1,
      precision: 0,
      placeholder: '请输入等级序号',
    },
    fieldName: 'level_no',
    label: '等级序号',
    rules: 'required',
  },
  {
    component: 'InputNumber',
    componentProps: {
      min: 0,
      precision: 0,
      placeholder: '请输入最小积分',
    },
    fieldName: 'point_min',
    label: '最小积分',
    rules: 'required',
  },
  {
    component: 'InputNumber',
    componentProps: {
      min: 0,
      precision: 0,
      placeholder: '请输入最大积分，0表示无上限',
    },
    fieldName: 'point_max',
    label: '最大积分',
    rules: 'required',
  },
  {
    component: 'InputNumber',
    componentProps: {
      min: 0.01,
      max: 1,
      step: 0.01,
      precision: 2,
      placeholder: '请输入折扣率',
    },
    fieldName: 'discount_rate',
    label: '折扣率',
    rules: 'required',
    help: '输入0.85表示85%折扣率，1表示不打折，范围0.01-1.00',
  },
  {
    component: 'Select',
    componentProps: {
      options: [
        { label: '禁用', value: MemberLevelStatus.Disabled },
        { label: '启用', value: MemberLevelStatus.Enabled },
      ],
    },
    fieldName: 'status',
    label: '状态',
    rules: 'required',
  },
  {
    component: 'Input',
    fieldName: 'icon',
    label: '图标',
  },
  {
    component: 'Textarea',
    componentProps: {
      rows: 3,
      placeholder: '请输入备注',
    },
    fieldName: 'remark',
    label: '备注',
  },
];

// 新增会员等级Modal
const [CreateModal, createModalApi] = useVbenModal({
  onConfirm: async () => {
    const valid = await createFormApi.validate();
    if (valid) {
      createModalApi.setState({ confirmLoading: true });
      try {
        const formData =
          (await createFormApi.getValues()) as unknown as MemberLevelDTO;
        const success = await memberLevelStore.create(formData);
        if (success) {
          createModalApi.close();
          createFormApi.resetForm();
          gridApi.query();
        }
      } finally {
        createModalApi.setState({ confirmLoading: false });
      }
    }
  },
  title: '新增会员等级',
});
const [CreateForm, createFormApi] = useVbenForm({
  schema: memberLevelFormSchema,
  showDefaultActions: false,
});

// 编辑会员等级Modal
const [EditModal, editModalApi] = useVbenModal({
  onConfirm: async () => {
    const valid = await editFormApi.validate();
    if (valid) {
      editModalApi.setState({ confirmLoading: true });
      try {
        const formData =
          (await editFormApi.getValues()) as unknown as MemberLevelDTO;
        const { id } = editModalApi.getData<{ id: number }>();
        const success = await memberLevelStore.update(id, formData);
        if (success) {
          editModalApi.close();
          gridApi.query();
        }
      } finally {
        editModalApi.setState({ confirmLoading: false });
      }
    }
  },
  title: '编辑会员等级',
});
const [EditForm, editFormApi] = useVbenForm({
  schema: memberLevelFormSchema,
  showDefaultActions: false,
});

// 删除loading状态管理
const deleteLoadingState = reactive<Record<number, boolean>>({});

// 事件处理
const handleCreate = () => {
  createFormApi.resetForm();
  createModalApi.open();
};

const handleEdit = (memberLevel: MemberLevelVO) => {
  editFormApi.setValues(memberLevel);
  editModalApi.setData({ id: memberLevel.id });
  editModalApi.open();
};

const handleStatusChange = async (id: number, status: MemberLevelStatus) => {
  statusLoadingState[id] = true;
  try {
    const success = await memberLevelStore.changeStatus(id, status);
    if (success) {
      gridApi.query();
    }
  } finally {
    statusLoadingState[id] = false;
  }
};

const handleDelete = async (id: number) => {
  deleteLoadingState[id] = true;
  try {
    const success = await memberLevelStore.delete(id);
    if (success) {
      gridApi.query();
    }
  } finally {
    deleteLoadingState[id] = false;
  }
};
</script>

<template>
  <Page description="会员等级配置和管理" title="会员等级">
    <div class="mb-4">
      <Button type="primary" @click="handleCreate"> 新增等级 </Button>
    </div>

    <VxeGrid>
      <template #point_range="{ row }">
        {{ memberLevelStore.format_point_range(row.point_min, row.point_max) }}
      </template>

      <template #discount_rate="{ row }">
        {{ memberLevelStore.format_discount_rate(row.discount_rate) }}
      </template>

      <template #status="{ row }">
        <div class="flex items-center gap-2">
          <Switch
            :checked="row.status === MemberLevelStatus.Enabled"
            :loading="statusLoadingState[row.id]"
            @change="
              (checked) =>
                handleStatusChange(
                  row.id,
                  checked
                    ? MemberLevelStatus.Enabled
                    : MemberLevelStatus.Disabled,
                )
            "
          />
          <span
            :style="{ color: memberLevelStore.format_status(row.status).color }"
          >
            {{ memberLevelStore.format_status(row.status).text }}
          </span>
        </div>
      </template>

      <template #action="{ row }">
        <div class="flex gap-2">
          <Button type="link" size="small" @click="handleEdit(row)">
            编辑
          </Button>
          <Popconfirm
            title="确定删除此会员等级吗？"
            @confirm="handleDelete(row.id)"
          >
            <Button
              type="link"
              size="small"
              danger
              :loading="deleteLoadingState[row.id]"
            >
              删除
            </Button>
          </Popconfirm>
        </div>
      </template>
    </VxeGrid>

    <!-- 新增会员等级Modal -->
    <CreateModal>
      <CreateForm />
    </CreateModal>

    <!-- 编辑会员等级Modal -->
    <EditModal>
      <EditForm />
    </EditModal>
  </Page>
</template>
