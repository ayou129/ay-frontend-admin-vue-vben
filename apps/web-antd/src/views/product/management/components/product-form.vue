<script setup lang="ts">
import type { Spu } from '#/types/store/spu';
import type { StoreCategory } from '#/api/store/category';

import { computed, onMounted, ref, watch } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { message } from 'ant-design-vue';

import { useVbenForm, z } from '#/adapter/form';
import { getCategoryTree } from '#/api/store/category';
import { createProduct, updateProduct } from '#/api/store/product';

// Props和Emits定义
interface Props {
  editData?: Spu | null;
}

interface Emits {
  success: [];
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// 是否编辑模式
const isEdit = computed(() => !!props.editData);

// 分类选项
const categoryOptions = ref<Array<{ label: string; value: number }>>([]);

// 商品类型选项 (写死)
const typeOptions = [
  { label: '虚拟商品', value: 1 },
  { label: '实物商品', value: 2 },
  { label: '酒店订单', value: 3 },
];

// 商品状态选项 (写死)
const statusOptions = [
  { label: '正常', value: 1 },
  { label: '已下架', value: -1 },
];

// 有效期类型选项 (写死)
const validTypeOptions = [
  { label: '固定有效期', value: 1 },
  { label: '动态有效期(天数)', value: 2 },
];

// 获取分类数据
const loadCategoryOptions = async () => {
  try {
    const response = await getCategoryTree();
    const flattenCategories = (categories: StoreCategory[]): Array<{ label: string; value: number }> => {
      let result: Array<{ label: string; value: number }> = [];

      for (const category of categories) {
        result.push({ label: category.name, value: category.id });
        if (category.children && category.children.length > 0) {
          const childOptions = flattenCategories(category.children);
          // 为子分类添加缩进标识
          const indentedChildren = childOptions.map(child => ({
            ...child,
            label: `　${child.label}`, // 使用全角空格缩进
          }));
          result = result.concat(indentedChildren);
        }
      }

      return result;
    };

    categoryOptions.value = flattenCategories(response.list);
  } catch (error) {
    console.error('获取分类数据失败:', error);
    message.error('获取分类数据失败');
  }
};

// 表单配置
const [ProductForm, productFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  handleSubmit: onSubmit,
  layout: 'vertical',
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入商品名称',
      },
      fieldName: 'name',
      label: '商品名称',
      rules: z.string().min(1, '商品名称不能为空'),
    },
    {
      component: 'Select',
      componentProps: computed(() => ({
        placeholder: '请选择商品类型',
        options: typeOptions,
      })),
      fieldName: 'type',
      label: '商品类型',
      rules: z.number().min(1, '请选择商品类型'),
    },
    {
      component: 'Select',
      componentProps: computed(() => ({
        placeholder: '请选择商品状态',
        options: statusOptions,
      })),
      fieldName: 'status',
      label: '商品状态',
      rules: z.number().min(-1, '请选择商品状态'),
    },
    {
      component: 'Select',
      componentProps: computed(() => ({
        placeholder: '请选择商品分类',
        options: categoryOptions.value,
        showSearch: true,
        filterOption: (input: string, option: any) => {
          return option?.label?.includes(input);
        },
      })),
      fieldName: 'category_id',
      label: '商品分类',
      rules: z.number().min(1, '请选择商品分类'),
    },
    {
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入商品描述',
        rows: 4,
      },
      fieldName: 'description',
      label: '商品描述',
    },
    {
      component: 'Select',
      componentProps: computed(() => ({
        placeholder: '请选择有效期类型',
        options: validTypeOptions,
      })),
      fieldName: 'valid_type',
      label: '有效期类型',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入有效期值（如：2025-5-14 22:49:53 或 7）',
      },
      fieldName: 'valid_value',
      label: '有效期值',
      help: '固定有效期格式：2025-5-14 22:49:53 或 2025-5-14，动态有效期输入天数：如 7',
    },
  ],
  wrapperClass: 'grid-cols-1',
});

// 提交表单
async function onSubmit(values: Record<string, any>) {
  try {
    if (isEdit.value && props.editData) {
      await updateProduct(props.editData.id, values);
      message.success('更新商品成功');
    } else {
      await createProduct(values);
      message.success('添加商品成功');
    }
    emit('success');
    return true;
  } catch (error) {
    console.error('提交商品表单失败:', error);
    message.error(isEdit.value ? '更新商品失败' : '添加商品失败');
    return false;
  }
}

// 设置表单值（编辑时）
const setFormValues = (data: Spu) => {
  productFormApi.setValues({
    name: data.name,
    type: data.type,
    status: data.status,
    category_id: data.category_id,
    description: data.description,
    valid_type: data.valid_type,
    valid_value: data.valid_value,
  });
};

// 重置表单
const resetForm = () => {
  productFormApi.resetForm();
};

// 组件加载时获取分类数据
onMounted(() => {
  loadCategoryOptions();
});

// 监听编辑数据变化
watch(
  () => props.editData,
  (newData) => {
    if (newData) {
      setFormValues(newData);
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

// 暴露方法给父组件
defineExpose({
  setFormValues,
  resetForm,
});
</script>

<template>
  <div class="p-6">
    <ProductForm />
  </div>
</template>