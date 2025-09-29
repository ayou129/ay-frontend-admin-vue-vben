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
  resetOnMounted: false,
  showDefaultActions: false,
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
        allowClear: true,
      })),
      defaultValue: undefined,
      fieldName: 'type',
      label: '商品类型',
      rules: 'selectRequired',
    },
    {
      component: 'Select',
      componentProps: computed(() => ({
        placeholder: '请选择商品状态',
        options: statusOptions,
        allowClear: true,
      })),
      defaultValue: undefined,
      fieldName: 'status',
      label: '商品状态',
      rules: 'selectRequired',
    },
    {
      component: 'Select',
      componentProps: computed(() => ({
        placeholder: '请选择商品分类',
        options: categoryOptions.value,
        showSearch: true,
        allowClear: true,
        filterOption: (input: string, option: any) => {
          return option?.label?.includes(input);
        },
      })),
      defaultValue: undefined,
      fieldName: 'category_id',
      label: '商品分类',
      rules: 'selectRequired',
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
        allowClear: true,
      })),
      defaultValue: undefined,
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
  console.log('onSubmit 被调用了，values:', values);

  try {
    if (isEdit.value && props.editData) {
      console.log('准备调用 updateProduct API');
      await updateProduct(props.editData.id, values);
      message.success('更新商品成功');
    } else {
      console.log('准备调用 createProduct API');
      await createProduct(values);
      message.success('添加商品成功');
    }
    // emit('success'); // 现在由父组件的 onConfirm 统一处理
    return true;
  } catch (error) {
    console.error('提交商品表单失败:', error);
    message.error(isEdit.value ? '更新商品失败' : '添加商品失败');
    return false;
  }
}

// 设置表单值（编辑时）
const setFormValues = (data: Spu) => {
  const formValues: any = {};

  // 只设置有值的字段
  if (data.name) formValues.name = data.name;

  // 商品类型：1=虚拟商品, 2=实物商品, 3=酒店订单
  if (data.type !== undefined && data.type !== null) {
    const typeNum = Number(data.type);
    if (typeNum > 0) formValues.type = typeNum;
  }

  // 商品状态：1=正常, -1=已下架 (-1是有效值)
  if (data.status !== undefined && data.status !== null) {
    const statusNum = Number(data.status);
    if (statusNum === 1 || statusNum === -1) formValues.status = statusNum;
  }

  // 分类ID
  if (data.category_id !== undefined && data.category_id !== null) {
    const categoryNum = Number(data.category_id);
    if (categoryNum > 0) formValues.category_id = categoryNum;
  }

  if (data.description) formValues.description = data.description;

  // 有效期类型
  if (data.valid_type !== undefined && data.valid_type !== null) {
    const validTypeNum = Number(data.valid_type);
    if (validTypeNum > 0) formValues.valid_type = validTypeNum;
  }

  if (data.valid_value) formValues.valid_value = data.valid_value;

  productFormApi.setValues(formValues);
};

// 重置表单
const resetForm = () => {
  productFormApi.resetForm();
  // 确保重置后选择器没有默认值
  productFormApi.setValues({
    type: undefined,
    status: undefined,
    category_id: undefined,
  });
};

// 组件加载时获取分类数据
onMounted(() => {
  loadCategoryOptions();
});

// 监听编辑数据变化
watch(
  () => props.editData,
  async (newData) => {
    if (newData) {
      // 确保分类数据已加载
      if (categoryOptions.value.length === 0) {
        await loadCategoryOptions();
      }
      // 稍微延迟确保组件已更新
      await new Promise(resolve => setTimeout(resolve, 100));
      setFormValues(newData);
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

// 手动提交表单的方法
const submitForm = async () => {
  console.log('submitForm 被调用');

  // 先手动验证表单
  const validateResult = await productFormApi.validate();
  console.log('验证结果:', validateResult);

  if (!validateResult.valid) {
    console.log('验证失败，抛出异常');
    throw new Error('表单验证失败');
  }

  // 验证通过，获取值并调用 onSubmit
  const values = await productFormApi.getValues();
  console.log('获取的表单值:', values);

  const result = await onSubmit(values);
  if (!result) {
    throw new Error('提交失败');
  }

  return result;
};

// 暴露方法给父组件
defineExpose({
  setFormValues,
  resetForm,
  submitForm,
});
</script>

<template>
  <div class="p-6">
    <ProductForm />
  </div>
</template>