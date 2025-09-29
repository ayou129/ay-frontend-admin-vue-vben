<script setup lang="ts">
import { Search } from '@vben/icons';
import { Button } from 'ant-design-vue';
import { useVbenForm } from '#/adapter/form';

// Props和Emits定义
interface Props {}
interface Emits {
  search: [values: Record<string, any>];
  reset: [];
}

defineProps<Props>();
const emit = defineEmits<Emits>();

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
          { label: '虚拟商品', value: '1' },
          { label: '实物商品', value: '2' },
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

// 搜索
const handleSearch = () => {
  const values = searchFormApi.getValues();
  emit('search', values);
};

// 重置
const handleReset = () => {
  searchFormApi.resetFields();
  emit('reset');
};

// 暴露API给父组件
defineExpose({
  getValues: () => searchFormApi.getValues(),
  resetFields: () => searchFormApi.resetFields(),
});
</script>

<template>
  <div class="mb-4 rounded-lg bg-white p-6 shadow">
    <SearchForm />
    <!-- 搜索按钮 -->
    <div class="mt-4 flex space-x-2">
      <Button type="primary" @click="handleSearch">
        <Search class="size-4" />
        搜索
      </Button>
      <Button @click="handleReset">
        重置
      </Button>
    </div>
  </div>
</template>