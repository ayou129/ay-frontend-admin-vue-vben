<script setup lang="ts">
import type { Sku } from '#/types/store/sku';

import { ref } from 'vue';

import { createIconifyIcon } from '@vben/icons';

import { Button, Image, InputNumber, Table } from 'ant-design-vue';

import { openResourcePicker } from '#/components/resource';
import { ResourceType } from '#/types/resource';

// 创建图标
const PlusIcon = createIconifyIcon('carbon:add');
const DeleteIcon = createIconifyIcon('carbon:trash-can');

// SKU 列表
const skuList = ref<Sku[]>([]);

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
    title: '规格',
    dataIndex: 'specification',
    key: 'specification',
    width: 150,
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

// 添加 SKU
const handleAddSku = () => {
  const newSku: any = {
    id: Date.now(), // 临时ID
    name: '',
    code: '',
    price: '0',
    stock_count: 0,
    specification: '',
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
    <div class="mb-4 flex items-center justify-between">
      <div class="text-base font-medium">SKU 库存管理</div>
      <Button type="primary" @click="handleAddSku">
        <template #icon>
          <PlusIcon class="size-4" />
        </template>
        添加 SKU
      </Button>
    </div>

    <Table
      :columns="columns"
      :data-source="skuList"
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

        <!-- 规格 -->
        <template v-else-if="column.key === 'specification'">
          <a-input
            v-model:value="record.specification"
            placeholder="如: 红色/L"
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
