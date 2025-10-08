<script setup lang="ts">
import type { Sku, SkuAttr } from '#/types/store/sku';

import { computed, ref, watch } from 'vue';

import { createIconifyIcon } from '@vben/icons';

import {
  Alert,
  Button,
  Divider,
  Dropdown,
  Image,
  Input,
  InputNumber,
  Menu,
  message,
  Modal,
  Switch,
  Table,
} from 'ant-design-vue';

import {
  deleteBatchSkuByIds,
  getSkuAttrList,
  getSpuDetail,
} from '#/api/store/spu';
import { openResourcePicker } from '#/components/resource';
import { ResourceType } from '#/types/resource';
import { SkuStatus } from '#/types/store/sku';

// Props
interface Props {
  categoryId?: number;
  spuId?: number;
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
    title: '状态',
    key: 'status',
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
  const existingNames = new Set(skuList.value.map((sku) => sku.name));
  return combinations.value.filter((c) => !existingNames.has(c));
});

// 是否显示添加按钮
const showAddButton = computed(() => availableCombinations.value.length > 0);

// 是否显示"一键添加"选项（可用组合数 > 0 时显示）
const showAddAllOption = computed(() => availableCombinations.value.length > 0);

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

// 从后端获取 SKU 数据的缓存
const backendSkusMap = ref<Map<string, Sku>>(new Map());

// 获取后端 SKU 数据（用于恢复误删的 SKU）
const fetchBackendSkus = async () => {
  if (!props.spuId) {
    backendSkusMap.value.clear();
    return;
  }

  try {
    const response = await getSpuDetail(props.spuId);
    const skus = response.skus || [];
    backendSkusMap.value = new Map(skus.map((sku) => [sku.name, sku]));
  } catch (error) {
    console.error('获取 SPU 详情失败:', error);
    backendSkusMap.value.clear();
  }
};

// 创建 SKU 实例（工厂模式 + 数据恢复策略）
const createSku = (combination: string): any => {
  const backendSku = backendSkusMap.value.get(combination);

  // 如果后端存在该 SKU，使用后端数据恢复
  if (backendSku) {
    return {
      ...backendSku,
      id: backendSku.id || Date.now() + Math.random(), // 保留原 ID 或生成临时 ID
    };
  }

  // 否则使用默认值
  return {
    id: Date.now() + Math.random(),
    name: combination,
    code: '',
    price: '0',
    stock_count: 0,
    attr_value: parseCombination(combination),
    allow_member_discount: 1,
    status: SkuStatus.Enabled, // 默认启用
    main_image: undefined,
  };
};

// 排序 SKU 列表（按 name 升序）
const sortSkuList = () => {
  skuList.value.sort((a, b) => a.name.localeCompare(b.name));
};

// 添加单个 SKU
const handleAddSkuByCombination = async (combination: string) => {
  await fetchBackendSkus();
  skuList.value.push(createSku(combination));
  sortSkuList();
};

// 一键添加所有可用 SKU
const handleAddAllSkus = async () => {
  await fetchBackendSkus();
  const newSkus = availableCombinations.value.map((combination) =>
    createSku(combination),
  );
  skuList.value.push(...newSkus);
  sortSkuList();
};

// 删除 SKU
const handleDeleteSku = async (index: number) => {
  const sku = skuList.value[index];
  if (!sku) return;

  // 编辑模式下，所有删除都需要确认并调用 API
  if (props.spuId) {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除 SKU "${sku.name}" 吗？如果该 SKU 已关联订单则无法删除。`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          // 获取后端 SKU 数据，找到对应的真实 ID
          await fetchBackendSkus();
          const backendSku = backendSkusMap.value.get(sku.name);

          if (backendSku && backendSku.id) {
            // 如果后端存在，调用删除 API
            await deleteBatchSkuByIds(props.spuId!, [backendSku.id]);
            message.success('删除成功');
          }

          // 无论后端是否存在，都从列表中移除
          skuList.value.splice(index, 1);
          sortSkuList();
        } catch (error: any) {
          message.error(error.message || '删除失败');
        }
      },
    });
  } else {
    // 新建模式，直接删除（无需确认）
    skuList.value.splice(index, 1);
    sortSkuList();
  }
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
              <!-- 一键添加全部选项 -->
              <Menu.Item
                v-if="showAddAllOption"
                key="add-all"
                class="text-primary font-medium"
                @click="handleAddAllSkus"
              >
                一键添加全部规格 ({{ availableCombinations.length }})
              </Menu.Item>
              <Divider v-if="showAddAllOption" class="!my-1" />

              <!-- 单个规格选项 -->
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
        <Button v-else type="primary" disabled>
          <template #icon>
            <PlusIcon class="size-4" />
          </template>
          添加 SKU
        </Button>
      </div>
    </div>

    <!-- 当前分类的属性展示 -->
    <div
      v-if="attrList.length > 0"
      class="mb-3 rounded border border-gray-200 bg-gray-50 p-2"
    >
      <div class="mb-1.5 text-xs font-medium text-gray-600">
        当前分类规格属性：
      </div>
      <div class="space-y-1.5">
        <div
          v-for="attr in attrList"
          :key="attr.id"
          class="flex items-start gap-2"
        >
          <span class="min-w-16 text-xs font-medium text-gray-500">
            {{ attr.name }}:
          </span>
          <div class="flex flex-wrap gap-1.5">
            <span
              v-for="value in attr.values"
              :key="value.id"
              class="rounded bg-blue-50 px-1.5 py-0.5 text-xs text-blue-600"
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
          <span class="text-gray-700">{{ record.name }}</span>
        </template>

        <!-- SKU 编码 -->
        <template v-else-if="column.key === 'code'">
          <Input
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
          <Switch
            v-model:checked="record.allow_member_discount"
            :checked-value="1"
            :un-checked-value="0"
          />
        </template>

        <!-- 状态 -->
        <template v-else-if="column.key === 'status'">
          <Switch
            v-model:checked="record.status"
            :checked-value="1"
            :un-checked-value="0"
            checked-children="启用"
            un-checked-children="禁用"
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
