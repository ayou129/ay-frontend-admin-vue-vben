<script setup lang="ts">
import type { FormInstance, Rule } from 'ant-design-vue/es/form';

import type { ResourceModel } from '#/types/resource';
import type { CategoryModel } from '#/types/store/category';
import type { SpuModel } from '#/types/store/spu';

import { computed, ref, watch } from 'vue';

import { Form, Input, message, Select, Tabs } from 'ant-design-vue';

import { getCategoryTree } from '#/api/store/category';
import { createSpu, updateSpu } from '#/api/store/spu';
import { RichEditor } from '#/components/editor';
import { ResourceType } from '#/types/resource';
import { SpuOrderType } from '#/types/store/spu';

import SkuManagement from './SkuManagement.vue';
import SpuResourceSelector from './SpuResourceSelector.vue';

// Props定义
interface Props {
  editData?: null | SpuModel;
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
const basicFormRef = ref<FormInstance>();
const basicFormState = ref({
  name: '',
  type: undefined as number | undefined,
  status: undefined as number | undefined,
  category_id: undefined as number | undefined,
  carousels: [] as ResourceModel[],
  valid_type: undefined as number | undefined,
  valid_value: '',
});

const basicFormRules: Record<string, Rule[]> = {
  name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择商品类型', trigger: 'change' }],
  status: [{ required: true, message: '请选择商品状态', trigger: 'change' }],
  category_id: [
    { required: true, message: '请选择商品分类', trigger: 'change' },
  ],
};

// 分类选项
const categoryOptions = ref<Array<{ label: string; value: number }>>([]);

// 加载分类树
const loadCategoryTree = async () => {
  const response = await getCategoryTree();
  const flattenCategories = (
    categories: CategoryModel[],
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
  categoryOptions.value = flattenCategories(response.list);
};

// 加载分类
loadCategoryTree();

// ===================
// Tab 2: 库存管理
// ===================
const skuManagementRef = ref();

// 临时保存待设置的 SKU 数据（用于编辑时）
const pendingSkuData = ref<any>(null);

// 当前选中的分类 ID
const currentCategoryId = computed(() => basicFormState.value.category_id);

// ===================
// Tab 3: 商品详情
// ===================
const detailContent = ref('');

// ===================
// 数据处理
// ===================

// 设置表单值（编辑时）
const setFormValues = async (data: SpuModel) => {
  basicFormState.value = {
    name: data.name || '',
    type: data.type === undefined ? undefined : Number(data.type),
    status: data.status === undefined ? undefined : Number(data.status),
    category_id:
      data.category_id === undefined ? undefined : Number(data.category_id),
    carousels: data.carousels || [],
    valid_type:
      data.valid_type === undefined ? undefined : Number(data.valid_type),
    valid_value: data.valid_value || '',
  };

  // Tab 3: 商品详情
  detailContent.value = data.detail || '';

  // Tab 2: 库存管理 - 设置 SKU 列表
  // 由于 SkuManagement 组件在另一个 Tab 中，可能还未挂载
  // 先保存数据，等组件挂载后再设置
  if (data.skus) {
    pendingSkuData.value = data.skus;
  }
};

// 重置表单
const resetForm = () => {
  basicFormRef.value?.resetFields();
  basicFormState.value = {
    name: '',
    type: undefined,
    status: undefined,
    category_id: undefined,
    carousels: [],
    valid_type: undefined,
    valid_value: '',
  };
  // 重置 SKU 列表
  if (skuManagementRef.value) {
    skuManagementRef.value.setSkuList([]);
  }
  // 清除待处理的 SKU 数据
  pendingSkuData.value = null;
  detailContent.value = '';
  activeTab.value = 'basic';
};

// 收集所有 Tab 的数据
const collectFormData = async () => {
  // 验证基础信息表单
  try {
    await basicFormRef.value?.validate();
  } catch {
    activeTab.value = 'basic';
    throw new Error('基础信息表单验证失败');
  }

  // 获取 SKU 列表数据
  const skuList = skuManagementRef.value
    ? skuManagementRef.value.getSkuList()
    : [];

  // 将轮播图 Resource[] 转换为 carousel_ids (number[])
  const carousel_ids = basicFormState.value.carousels.map(
    (resource) => resource.id,
  );

  // 转换 SKU 数据：将 main_image Resource 对象转换为 main_image_id
  const skusData = skuList.map((sku: any) => ({
    id: sku.id,
    spu_id: sku.spu_id,
    name: sku.name,
    code: sku.code,
    price: sku.price,
    stock_count: sku.stock_count,
    attr_value: sku.attr_value,
    allow_member_discount: sku.allow_member_discount,
    main_image_id: sku.main_image?.id,
  }));

  // 组合所有数据
  const formData: any = {
    name: basicFormState.value.name,
    type: basicFormState.value.type,
    status: basicFormState.value.status,
    category_id: basicFormState.value.category_id,
    carousel_ids,
    valid_type: basicFormState.value.valid_type,
    valid_value: basicFormState.value.valid_value,
    detail: detailContent.value,
    skus: skusData,
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
    // 前端校验错误需要提示，其他错误已由 HTTP 拦截器处理
    if (error.message === '基础信息表单验证失败') {
      // 表单验证错误，不需要再次提示
    }
    // HTTP 错误已由拦截器处理，不需要再次提示
    throw error;
  }
};

// 监听编辑数据变化
watch(
  () => props.editData,
  async (newData) => {
    if (newData) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      setFormValues(newData);
    } else {
      resetForm();
    }
  },
  { immediate: true },
);

// 监听 skuManagementRef 挂载，自动设置待处理的 SKU 数据
watch(
  skuManagementRef,
  (ref) => {
    if (ref && pendingSkuData.value) {
      ref.setSkuList(pendingSkuData.value);
      pendingSkuData.value = null; // 清除待处理数据
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
        <Form
          ref="basicFormRef"
          :model="basicFormState"
          :rules="basicFormRules"
          layout="vertical"
        >
          <Form.Item label="商品名称" name="name">
            <Input
              v-model:value="basicFormState.name"
              placeholder="请输入商品名称"
            />
          </Form.Item>

          <Form.Item label="商品类型" name="type">
            <Select
              v-model:value="basicFormState.type"
              :options="typeOptions"
              allow-clear
              placeholder="请选择商品类型"
            />
          </Form.Item>

          <Form.Item label="商品状态" name="status">
            <Select
              v-model:value="basicFormState.status"
              :options="statusOptions"
              allow-clear
              placeholder="请选择商品状态"
            />
          </Form.Item>

          <Form.Item label="商品分类" name="category_id">
            <Select
              v-model:value="basicFormState.category_id"
              :options="categoryOptions"
              allow-clear
              show-search
              :filter-option="
                (input: string, option: any) => option?.label?.includes(input)
              "
              placeholder="请选择商品分类"
            />
          </Form.Item>

          <Form.Item label="商品轮播图">
            <SpuResourceSelector
              v-model="basicFormState.carousels"
              :accept-types="[ResourceType.Image]"
              :max="10"
            />
            <div class="form-item-tip">最多上传10张图片，支持拖拽排序</div>
          </Form.Item>

          <Form.Item label="有效期类型">
            <Select
              v-model:value="basicFormState.valid_type"
              :options="validTypeOptions"
              allow-clear
              placeholder="请选择有效期类型"
            />
          </Form.Item>

          <Form.Item label="有效期值">
            <Input
              v-model:value="basicFormState.valid_value"
              placeholder="请输入有效期值（如：2025-5-14 22:49:53 或 7）"
            />
            <div class="form-item-tip">
              固定有效期格式：2025-5-14 22:49:53 或
              2025-5-14，动态有效期输入天数：如 7
            </div>
          </Form.Item>
        </Form>
      </Tabs.TabPane>

      <!-- Tab 2: 库存管理 -->
      <Tabs.TabPane key="stock" tab="库存管理">
        <SkuManagement
          ref="skuManagementRef"
          :category-id="currentCategoryId"
          :spu-id="editData?.id"
        />
      </Tabs.TabPane>

      <!-- Tab 3: 商品详情 -->
      <Tabs.TabPane key="detail" tab="商品详情">
        <RichEditor
          v-model="detailContent"
          :height="400"
          placeholder="请输入商品详情，支持富文本格式和插入图片"
        />
      </Tabs.TabPane>
    </Tabs>
  </div>
</template>

<style scoped>
.spu-form-tabs {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
}

.spu-form-tabs :deep(.ant-tabs) {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
}

.spu-form-tabs :deep(.ant-tabs-nav) {
  z-index: 10;
  flex-shrink: 0;
  padding-left: 16px;
  margin-bottom: 0;
  background-color: white;
}

/* 表单提示文本样式 */
.form-item-tip {
  margin-top: 6px;
  margin-left: 4px;
  font-size: 12px;
  color: #6b7280;
}

.spu-form-tabs :deep(.ant-tabs-content-holder) {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
}

.spu-form-tabs :deep(.ant-tabs-content) {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
}

.spu-form-tabs :deep(.ant-tabs-tabpane) {
  flex: 1;
  min-height: 0;
  padding: 16px;
  overflow: hidden auto;
}

.spu-form-tabs :deep(.ant-tabs-tabpane-hidden) {
  display: none;
}
</style>
