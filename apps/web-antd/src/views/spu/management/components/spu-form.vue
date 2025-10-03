<script setup lang="ts">
import type { Category } from '#/types/store/category';
import type { Spu } from '#/types/store/spu';

import { computed, markRaw, onMounted, ref, watch } from 'vue';

import { message, Tabs } from 'ant-design-vue';

import { useVbenForm, z } from '#/adapter/form';
import { getCategoryTree } from '#/api/store/category';
import { createSpu, updateSpu } from '#/api/store/spu';
import { RichEditor } from '#/components/editor';
import { ResourceType } from '#/types/resource';
import { SpuOrderType } from '#/types/store/spu';

import SkuManagement from './SkuManagement.vue';
import SpuResourceSelector from './SpuResourceSelector.vue';

// Props定义
interface Props {
  editData?: null | Spu;
}

const props = defineProps<Props>();

// 是否编辑模式
const isEdit = computed(() => !!props.editData);

// 当前激活的 Tab
const activeTab = ref('basic');

// 商品类型选项
const typeOptions = [
  { label: '虚拟商品', value: SpuOrderType.Virtual },
  { label: '实物商品', value: SpuOrderType.Physical },
  { label: '酒店订单', value: SpuOrderType.Hotel },
];

// 商品状态选项
const statusOptions = [
  { label: '正常', value: 1 },
  { label: '已下架', value: -1 },
];

// 有效期类型选项
const validTypeOptions = [
  { label: '固定有效期', value: 1 },
  { label: '动态有效期(天数)', value: 2 },
];

// ===================
// Tab 1: 基础信息表单
// ===================
const [BasicInfoForm, basicInfoFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
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
      component: markRaw(SpuResourceSelector),
      componentProps: {
        acceptTypes: [ResourceType.Image],
        max: 10,
      },
      defaultValue: [],
      fieldName: 'carousels',
      help: '最多上传10张图片，支持拖拽排序',
      label: '商品轮播图',
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
      help: '固定有效期格式：2025-5-14 22:49:53 或 2025-5-14，动态有效期输入天数：如 7',
      label: '有效期值',
    },
  ],
  wrapperClass: 'grid-cols-1',
});

// ===================
// Tab 2: 库存管理
// ===================
const skuManagementRef = ref();

// ===================
// Tab 3: 商品详情
// ===================
const detailContent = ref('');

// ===================
// 数据处理
// ===================

// 设置表单值（编辑时）
const setFormValues = (data: Spu) => {
  // Tab 1: 基础信息
  const basicFormValues: any = {};

  if (data.name) basicFormValues.name = data.name;

  // 商品类型
  if (data.type !== undefined && data.type !== null) {
    const typeNum = Number(data.type);
    if (typeNum > 0) basicFormValues.type = typeNum;
  }

  // 商品状态
  if (data.status !== undefined && data.status !== null) {
    const statusNum = Number(data.status);
    if (statusNum === 1 || statusNum === -1) basicFormValues.status = statusNum;
  }

  // 分类ID
  if (data.category_id !== undefined && data.category_id !== null) {
    const categoryNum = Number(data.category_id);
    if (categoryNum > 0) basicFormValues.category_id = categoryNum;
  }

  // 商品轮播图
  if (data.carousels && Array.isArray(data.carousels)) {
    basicFormValues.carousels = data.carousels;
  }

  // 有效期类型
  if (data.valid_type !== undefined && data.valid_type !== null) {
    const validTypeNum = Number(data.valid_type);
    if (validTypeNum > 0) basicFormValues.valid_type = validTypeNum;
  }

  if (data.valid_value) basicFormValues.valid_value = data.valid_value;

  basicInfoFormApi.setValues(basicFormValues);

  // Tab 2: 库存管理 - 设置 SKU 列表
  if (data.skus && skuManagementRef.value) {
    skuManagementRef.value.setSkuList(data.skus);
  }

  // Tab 3: 商品详情
  detailContent.value = data.detail || '';
};

// 重置表单
const resetForm = () => {
  basicInfoFormApi.resetForm();
  basicInfoFormApi.setValues({
    carousels: [],
    category_id: undefined,
    status: undefined,
    type: undefined,
  });
  // 重置 SKU 列表
  if (skuManagementRef.value) {
    skuManagementRef.value.setSkuList([]);
  }
  detailContent.value = '';
  activeTab.value = 'basic';
};

// 收集所有 Tab 的数据
const collectFormData = async () => {
  // 验证基础信息表单
  const basicValidateResult = await basicInfoFormApi.validate();
  if (!basicValidateResult.valid) {
    activeTab.value = 'basic';
    throw new Error('基础信息表单验证失败');
  }

  // 获取基础信息数据
  const basicValues = await basicInfoFormApi.getValues();

  // 获取 SKU 列表数据
  const skuList = skuManagementRef.value
    ? skuManagementRef.value.getSkuList()
    : [];

  // 组合所有数据
  const formData: any = {
    ...basicValues,
    detail: detailContent.value,
    skus: skuList,
  };

  return formData;
};

// 提交表单
const submitForm = async () => {
  try {
    const formData = await collectFormData();

    if (isEdit.value && props.editData) {
      await updateSpu(props.editData.id, formData);
      message.success('更新商品成功');
    } else {
      await createSpu(formData as any);
      message.success('添加商品成功');
    }
  } catch (error: any) {
    if (error.message !== '基础信息表单验证失败') {
      message.error(error.message || '提交失败');
    }
    throw error;
  }
};

// 组件加载时获取分类数据（如果需要的话可以预加载）
onMounted(() => {
  // 可以在这里预加载一些数据
});

// 监听编辑数据变化
watch(
  () => props.editData,
  async (newData) => {
    if (newData) {
      // 稍微延迟确保组件已更新
      await new Promise((resolve) => setTimeout(resolve, 100));
      setFormValues(newData);
    } else {
      resetForm();
    }
  },
  { immediate: true },
);

// 暴露方法给父组件
defineExpose({
  resetForm,
  setFormValues,
  submitForm,
});
</script>

<template>
  <div class="spu-form-tabs">
    <Tabs v-model:active-key="activeTab">
      <!-- Tab 1: 基础信息 -->
      <Tabs.TabPane key="basic" tab="基础信息">
        <div class="tab-content-wrapper">
          <BasicInfoForm />
        </div>
      </Tabs.TabPane>

      <!-- Tab 2: 库存管理 -->
      <Tabs.TabPane key="stock" tab="库存管理">
        <div class="tab-content-wrapper">
          <SkuManagement ref="skuManagementRef" />
        </div>
      </Tabs.TabPane>

      <!-- Tab 3: 商品详情 -->
      <Tabs.TabPane key="detail" tab="商品详情">
        <div class="tab-content-wrapper">
          <RichEditor
            v-model="detailContent"
            :height="400"
            placeholder="请输入商品详情，支持富文本格式和插入图片"
          />
        </div>
      </Tabs.TabPane>

      <!-- Tab 4: 物流设置 (暂时注释，等待确认字段) -->
      <!-- <Tabs.TabPane
        v-if="basicInfoFormApi.getValues().type === SpuOrderType.Physical"
        key="logistics"
        tab="物流设置"
      >
        <div class="tab-content-wrapper">
          <div class="logistics-settings">
            物流设置内容待实现
          </div>
        </div>
      </Tabs.TabPane> -->
    </Tabs>
  </div>
</template>

<style scoped>
.spu-form-tabs {
  display: flex;
  flex-direction: column;
  height: 600px;
}

.spu-form-tabs :deep(.ant-tabs) {
  display: flex;
  flex: 1;
  flex-direction: column;
  margin-top: -8px;
  overflow: hidden;
}

.spu-form-tabs :deep(.ant-tabs-nav) {
  position: sticky;
  top: 0;
  z-index: 10;
  margin-bottom: 0;
  background-color: white;
}

.spu-form-tabs :deep(.ant-tabs-content-holder) {
  flex: 1;
  overflow-y: auto;
}

.spu-form-tabs :deep(.ant-tabs-content) {
  height: 100%;
}

.tab-content-wrapper {
  padding: 16px;
}
</style>
