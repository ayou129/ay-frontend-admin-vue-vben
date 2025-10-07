<script lang="ts" setup>
import type { VbenFormSchema } from '#/adapter/form';
import type { CategoryModel } from '#/types/store/category';

import { watch } from 'vue';

import { getPopupContainer } from '@vben/utils';

import { useVbenForm, z } from '#/adapter/form';
import { getCategoryTree } from '#/api/store/category';

interface Props {
  editData?: {
    category?: CategoryModel;
    onSuccess?: (data: any) => Promise<void>;
    parent_id?: number;
  };
}

const props = defineProps<Props>();

const schema: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'name',
    label: '分类名称',
    rules: z
      .string()
      .min(2, '分类名称至少需要 2 个字符')
      .max(50, '分类名称最多 50 个字符'),
  },
  {
    component: 'ApiTreeSelect',
    componentProps: {
      allowClear: true,
      api: async () => {
        const response = await getCategoryTree();
        return response.list || [];
      },
      childrenField: 'children',
      class: 'w-full',
      getPopupContainer,
      labelField: 'name',
      placeholder: '请选择父分类（可选）',
      showSearch: true,
      treeDefaultExpandAll: true,
      treeNodeFilterProp: 'name',
      valueField: 'id',
    },
    fieldName: 'parent_id',
    label: '父分类',
  },
];

const [Form, formApi] = useVbenForm({
  commonConfig: {
    colon: true,
  },
  schema,
  showDefaultActions: false,
});

// 监听 editData 变化，设置表单值
watch(
  () => props.editData,
  (data) => {
    if (data) {
      setTimeout(() => {
        if (data.category) {
          // 编辑模式
          const values: any = {
            name: data.category.name,
          };
          // 只有当 parent_id 不为 0 时才设置，否则不设置该字段
          if (data.category.parent_id && data.category.parent_id !== 0) {
            values.parent_id = data.category.parent_id;
          }
          formApi.setValues(values);
        } else if (data.parent_id) {
          // 新增子分类模式
          formApi.setValues({
            name: '',
            parent_id: data.parent_id,
          });
        } else {
          // 新增顶级分类模式 - 只设置 name，不设置 parent_id
          formApi.setValues({
            name: '',
          });
        }
      }, 50);
    }
  },
  { immediate: true, deep: true },
);

async function submit() {
  const { valid } = await formApi.validate();
  if (valid) {
    const values = await formApi.getValues<{
      name: string;
      parent_id?: null | number;
    }>();

    // 如果 parent_id 未选择（null 或 undefined），则设为 0（顶级分类）
    if (!values.parent_id || values.parent_id === null) {
      values.parent_id = 0;
    }

    await props.editData?.onSuccess?.(values);
  } else {
    throw new Error('表单验证失败');
  }
}

defineExpose({
  submit,
});
</script>

<template>
  <Form class="mx-4" />
</template>
