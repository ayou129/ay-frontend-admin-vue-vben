<script setup lang="ts">
import type { Sku, SkuAttr } from '#/types/store/sku';

import { computed, ref, watch } from 'vue';

import { createIconifyIcon } from '@vben/icons';

import {
  Alert,
  Button,
  Dropdown,
  Image,
  InputNumber,
  Menu,
  Table,
} from 'ant-design-vue';

import { getSkuAttrList } from '#/api/store/spu';
import { openResourcePicker } from '#/components/resource';
import { ResourceType } from '#/types/resource';

// Props
interface Props {
  categoryId?: number;
}

const props = defineProps<Props>();

// 创建图标
const PlusIcon = createIconifyIcon('carbon:add');
const DeleteIcon = createIconifyIcon('carbon:trash-can');

// SKU 列表
const skuList = ref<Sku[]>([]);

// 当前分类的属性列表
const attrList = ref<SkuAttr[]>([]);
const combinations = ref<string[]>([]);

// 加载状态
const loading = ref(false);

// 表格列定义
const columns = [
  {
    title: 'SKU名称',
    dataIndex: 'name',
    key: 'name',
    width: 150,
  },
  {
    title: 'SKU编码',
    dataIndex: 'code',
    key: 'code',
    width: 120,
  },
  {
    title: '价格',
    dataIndex: 'price',
    key: 'price',
    width: 120,
  },
  {
    title: '库存',
    dataIndex: 'stock_count',
    key: 'stock_count',
    width: 100,
  },
  {
    title: '会员折扣',
    dataIndex: 'allow_member_discount',
    key: 'allow_member_discount',
    width: 100,
  },
  {
    title: 'SKU主图',
    key: 'main_image',
    width: 100,
  },
  {
    title: '操作',
    key: 'action',
    width: 120,
    fixed: 'right' as const,
  },
];

// 计算可用的规格组合（未添加的）
const availableCombinations = computed(() => {
  const existingSpecs = new Set(
    skuList.value
      .map((sku) =>
        sku.attr_value ? Object.values(sku.attr_value).join('-') : '',
      )
      .filter(Boolean),
  );
  return combinations.value.filter((c) => !existingSpecs.has(c));
});

// 是否显示添加按钮
const showAddButton = computed(() => availableCombinations.value.length > 0);

// 获取 SKU 属性列表
const fetchSkuAttrList = async (categoryId: number) => {
  if (!categoryId) {
    attrList.value = [];
    combinations.value = [];
    return;
  }

  try {
    loading.value = true;
    const response = await getSkuAttrList(categoryId);
    attrList.value = response.attrs || [];
    combinations.value = response.combinations || [];
  } catch (error) {
    console.error('获取 SKU 属性列表失败:', error);
    attrList.value = [];
    combinations.value = [];
  } finally {
    loading.value = false;
  }
};

// 解析组合字符串为 attr_value 对象
const parseCombination = (combination: string): Record<string, string> => {
  const values = combination.split('-');
  const attrValue: Record<string, string> = {};
  attrList.value.forEach((attr, index) => {
    if (values[index]) {
      attrValue[attr.name] = values[index];
    }
  });
  return attrValue;
};

// 添加 SKU（通过选择组合）
const handleAddSkuByCombination = (combination: string) => {
  const attrValue = parseCombination(combination);
  const newSku: any = {
    id: Date.now(), // 临时ID
    name: combination, // name 就是组合字符串，如 "红色-XL"
    code: '',
    price: '0',
    stock_count: 0,
    attr_value: attrValue, // JSON 版本，如 {"颜色": "红色", "尺码": "XL"}
    allow_member_discount: 1,
    main_image: undefined,
  };
  skuList.value.push(newSku);
};

// 删除 SKU
const handleDeleteSku = (index: number) => {
  skuList.value.splice(index, 1);
};

// 选择 SKU 主图
const handleSelectImage = async (index: number) => {
  try {
    const resources = await openResourcePicker({
      mode: 'single',
      acceptTypes: [ResourceType.Image],
    });

    if (resources.length > 0 && skuList.value[index]) {
      skuList.value[index].main_image = resources[0];
    }
  } catch (error) {
    console.error('选择图片失败:', error);
  }
};

// 移除 SKU 主图
const handleRemoveImage = (index: number) => {
  if (skuList.value[index]) {
    skuList.value[index].main_image = undefined;
  }
};

// 监听 categoryId 变化
watch(
  () => props.categoryId,
  (newCategoryId) => {
    if (newCategoryId) {
      fetchSkuAttrList(newCategoryId);
    } else {
      attrList.value = [];
      combinations.value = [];
    }
  },
  { immediate: true },
);

// 暴露方法供父组件调用
defineExpose({
  getSkuList: () => skuList.value,
  setSkuList: (list: Sku[]) => {
    skuList.value = list;
  },
});
</script>

<template>
  <div class="sku-management">
    <!-- 顶部提示和按钮 -->
    <div class="mb-3 flex items-center justify-between gap-4">
      <!-- 左侧提示 -->
      <Alert
        message="修改商品分类后，SKU 属性列表会自动更新，但不会删除已存在的其他分类的 SKU 数据。"
        type="info"
        show-icon
        class="flex-1"
        :style="{ fontSize: '12px' }"
      />

      <!-- 右侧按钮 -->
      <div class="flex-shrink-0">
        <Dropdown v-if="showAddButton" :trigger="['click']">
          <Button type="primary">
            <template #icon>
              <PlusIcon class="size-4" />
            </template>
            添加 SKU
          </Button>
          <template #overlay>
            <Menu>
              <Menu.Item
                v-for="combination in availableCombinations"
                :key="combination"
                @click="handleAddSkuByCombination(combination)"
              >
                {{ combination }}
              </Menu.Item>
            </Menu>
          </template>
        </Dropdown>
        <span v-else class="text-sm text-gray-400">
          {{
            attrList.length === 0
              ? '请先在基础信息中选择商品分类'
              : '所有规格组合已添加完毕'
          }}
        </span>
      </div>
    </div>

    <!-- 当前分类的属性展示 -->
    <div
      v-if="attrList.length > 0"
      class="mb-4 rounded border border-gray-200 bg-gray-50 p-3"
    >
      <div class="mb-2 font-medium text-gray-700">当前分类规格属性：</div>
      <div class="space-y-2">
        <div
          v-for="attr in attrList"
          :key="attr.id"
          class="flex items-start gap-2"
        >
          <span class="min-w-20 font-medium text-gray-600">
            {{ attr.name }}:
          </span>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="value in attr.values"
              :key="value.id"
              class="rounded bg-blue-100 px-2 py-1 text-sm text-blue-700"
            >
              {{ value.value }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- SKU 表格 -->
    <Table
      :columns="columns"
      :data-source="skuList"
      :loading="loading"
      :pagination="false"
      :scroll="{ x: 1000 }"
      row-key="id"
    >
      <!-- SKU 名称 -->
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'name'">
          <a-input
            v-model:value="record.name"
            placeholder="请输入SKU名称"
            size="small"
          />
        </template>

        <!-- SKU 编码 -->
        <template v-else-if="column.key === 'code'">
          <a-input
            v-model:value="record.code"
            placeholder="请输入SKU编码"
            size="small"
          />
        </template>

        <!-- 价格 -->
        <template v-else-if="column.key === 'price'">
          <InputNumber
            v-model:value="record.price"
            :min="0"
            :precision="2"
            :step="0.01"
            placeholder="0.00"
            size="small"
            class="w-full"
          />
        </template>

        <!-- 库存 -->
        <template v-else-if="column.key === 'stock_count'">
          <InputNumber
            v-model:value="record.stock_count"
            :min="0"
            placeholder="0"
            size="small"
            class="w-full"
          />
        </template>

        <!-- 会员折扣 -->
        <template v-else-if="column.key === 'allow_member_discount'">
          <a-switch
            v-model:checked="record.allow_member_discount"
            :checked-value="1"
            :un-checked-value="0"
          />
        </template>

        <!-- SKU 主图 -->
        <template v-else-if="column.key === 'main_image'">
          <div class="flex items-center gap-2">
            <div
              v-if="record.main_image"
              class="relative size-12 overflow-hidden rounded border"
            >
              <Image
                :src="record.main_image.url"
                :alt="record.main_image.file_original_filename"
                :preview="true"
                class="h-full w-full object-cover"
              />
              <div
                class="absolute right-0 top-0 cursor-pointer bg-red-500 p-0.5"
                @click="handleRemoveImage(index)"
              >
                <DeleteIcon class="size-3 text-white" />
              </div>
            </div>
            <Button
              v-else
              size="small"
              type="dashed"
              @click="handleSelectImage(index)"
            >
              选择图片
            </Button>
          </div>
        </template>

        <!-- 操作 -->
        <template v-else-if="column.key === 'action'">
          <Button
            danger
            size="small"
            type="link"
            @click="handleDeleteSku(index)"
          >
            <template #icon>
              <DeleteIcon class="size-4" />
            </template>
            删除
          </Button>
        </template>
      </template>
    </Table>

    <!-- 提示信息 -->
    <div v-if="skuList.length === 0" class="mt-4 text-center text-gray-400">
      暂无 SKU，请点击"添加 SKU"按钮添加
    </div>
  </div>
</template>

<style scoped>
.sku-management {
  padding: 16px 0;
}
</style>
