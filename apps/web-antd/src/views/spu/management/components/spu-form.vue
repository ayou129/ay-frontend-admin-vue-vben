<script setup lang="ts">
import type { Category } from '#/types/store/category';
import type { Spu } from '#/types/store/spu';

import { computed, onMounted, ref, watch } from 'vue';

import { message } from 'ant-design-vue';

import { useVbenForm, z } from '#/adapter/form';
import { getCategoryTree } from '#/api/store/category';
import { createSpu, updateSpu } from '#/api/store/spu';

// Props定义
interface Props {
  editData?: null | Spu;
}

const props = defineProps<Props>();

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
    const flattenCategories = (
      categories: Category[],
    ): Array<{ label: string; value: number }> => {
      let result: Array<{ label: string; value: number }> = [];

      for (const category of categories) {
        result.push({ label: category.name, value: category.id });
        if (category.children && category.children.length > 0) {
          const childOptions = flattenCategories(category.children);
          // 为子分类添加缩进标识
          const indentedChildren = childOptions.map((child) => ({
            ...child,
            label: `  ${child.label}`, // 使用空格缩进
          }));
          result = [...result, ...indentedChildren];
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
const [SpuForm, spuFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  handleSubmit: onSubmit,
  layout: 'vertical',
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
      componentProps: {
        allowClear: true,
        options: typeOptions,
        placeholder: '请选择商品类型',
      },
      defaultValue: undefined,
      fieldName: 'type',
      label: '商品类型',
      rules: 'selectRequired',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: statusOptions,
        placeholder: '请选择商品状态',
      },
      defaultValue: undefined,
      fieldName: 'status',
      label: '商品状态',
      rules: 'selectRequired',
    },
    {
      component: 'ApiSelect',
      componentProps: {
        allowClear: true,
        api: async () => {
          const response = await getCategoryTree();
          const flattenCategories = (
            categories: Category[],
          ): Array<{ label: string; value: number }> => {
            let result: Array<{ label: string; value: number }> = [];
            for (const category of categories) {
              result.push({ label: category.name, value: category.id });
              if (category.children && category.children.length > 0) {
                const childOptions = flattenCategories(category.children);
                const indentedChildren = childOptions.map((child) => ({
                  ...child,
                  label: `  ${child.label}`,
                }));
                result = [...result, ...indentedChildren];
              }
            }
            return result;
          };
          return flattenCategories(response.list);
        },
        filterOption: (input: string, option: any) => {
          return option?.label?.includes(input);
        },
        placeholder: '请选择商品分类',
        showSearch: true,
      },
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
      fieldName: 'detail',
      label: '商品描述',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: validTypeOptions,
        placeholder: '请选择有效期类型',
      },
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
  if (isEdit.value && props.editData) {
    await updateSpu(props.editData.id, values);
    message.success('更新商品成功');
  } else {
    await createSpu(values as any);
    message.success('添加商品成功');
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

  if (data.detail) formValues.detail = data.detail;

  // 有效期类型
  if (data.valid_type !== undefined && data.valid_type !== null) {
    const validTypeNum = Number(data.valid_type);
    if (validTypeNum > 0) formValues.valid_type = validTypeNum;
  }

  if (data.valid_value) formValues.valid_value = data.valid_value;

  spuFormApi.setValues(formValues);
};

// 重置表单
const resetForm = () => {
  spuFormApi.resetForm();
  // 确保重置后选择器没有默认值
  spuFormApi.setValues({
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
      await new Promise((resolve) => setTimeout(resolve, 100));
      setFormValues(newData);
    } else {
      resetForm();
    }
  },
  { immediate: true },
);

// 手动提交表单的方法
const submitForm = async () => {
  // 先手动验证表单
  const validateResult = await spuFormApi.validate();

  if (!validateResult.valid) {
    throw new Error('表单验证失败');
  }

  // 验证通过，获取值并调用 onSubmit
  const values = await spuFormApi.getValues();
  await onSubmit(values);
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
    <SpuForm />
  </div>
</template>
