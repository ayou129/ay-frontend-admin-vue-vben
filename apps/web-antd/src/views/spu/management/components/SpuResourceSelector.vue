<script setup lang="ts">
import type { Resource } from '#/types/resource';

import { computed, ref, watch } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';

import { createIconifyIcon } from '@vben/icons';

import { Image } from 'ant-design-vue';

import ResourcePickerModal from '#/components/resource/ResourcePickerModal.vue';
import { ResourceType } from '#/types/resource';

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  max: 10,
  acceptTypes: () => [ResourceType.Image],
});
const emit = defineEmits<Emits>();
// 创建图标组件
const PlusIcon = createIconifyIcon('carbon:add');
const CloseIcon = createIconifyIcon('carbon:close');

interface Props {
  modelValue?: Resource[];
  max?: number;
  acceptTypes?: ResourceType[];
}

interface Emits {
  (e: 'update:modelValue', value: Resource[]): void;
}

// 选择器弹窗
const pickerVisible = ref(false);

// 当前选中的资源（内部状态）
const selectedResources = ref<Resource[]>([...props.modelValue]);

// 已选中的资源IDs
const selectedIds = computed(() => {
  return selectedResources.value.map((r) => r.id);
});

// 打开选择器
const openPicker = () => {
  pickerVisible.value = true;
};

// 确认选择
const handleConfirm = (resources: Resource[]) => {
  selectedResources.value = resources;
  emit('update:modelValue', resources);
};

// 删除资源
const handleRemove = (index: number) => {
  selectedResources.value.splice(index, 1);
  emit('update:modelValue', [...selectedResources.value]);
};

// 拖拽排序结束
const handleDragEnd = () => {
  emit('update:modelValue', [...selectedResources.value]);
};

// 监听外部值变化
watch(
  () => props.modelValue,
  (newValue) => {
    selectedResources.value = [...(newValue || [])];
  },
);
</script>

<template>
  <div class="spu-resource-selector">
    <!-- 资源网格 -->
    <VueDraggable
      v-model="selectedResources"
      class="grid grid-cols-6 gap-4"
      @end="handleDragEnd"
    >
      <div
        v-for="(resource, index) in selectedResources"
        :key="resource.id"
        class="resource-item hover:border-primary group relative cursor-move rounded border p-2"
      >
        <!-- 删除按钮 -->
        <div
          class="absolute right-1 top-1 z-10 cursor-pointer rounded-full bg-red-500 p-1 opacity-0 transition-opacity group-hover:opacity-100"
          @click="handleRemove(index)"
        >
          <CloseIcon class="size-3.5 text-white" />
        </div>

        <!-- 图片预览 -->
        <div
          class="flex aspect-square items-center justify-center overflow-hidden rounded bg-gray-100"
        >
          <Image
            :src="resource.url"
            :alt="resource.file_original_filename"
            :preview="true"
            class="h-full w-full object-cover"
          />
        </div>

        <!-- 文件名 -->
        <div
          class="mt-1 truncate text-xs text-gray-600"
          :title="resource.file_original_filename"
        >
          {{ resource.file_original_filename }}
        </div>
      </div>

      <!-- 添加按钮 -->
      <div
        v-if="!max || selectedResources.length < max"
        class="resource-add-btn hover:border-primary flex aspect-square cursor-pointer flex-col items-center justify-center rounded border border-dashed border-gray-300"
        @click="openPicker"
      >
        <PlusIcon class="size-8 text-gray-400" />
        <div class="mt-2 text-xs text-gray-500">
          {{ selectedResources.length }}/{{ max }}
        </div>
      </div>
    </VueDraggable>

    <!-- 已达上限提示 -->
    <div
      v-if="max && selectedResources.length >= max"
      class="mt-2 text-xs text-gray-500"
    >
      已选择 {{ selectedResources.length }}/{{ max }} 项（已达上限）
    </div>

    <!-- 资源选择器弹窗 -->
    <ResourcePickerModal
      v-model:open="pickerVisible"
      :selected-ids="selectedIds"
      :accept-types="acceptTypes"
      :max-selection="max"
      mode="multiple"
      @confirm="handleConfirm"
    />
  </div>
</template>

<style scoped>
.resource-item {
  transition: all 0.2s;
}

.resource-item:hover {
  box-shadow: 0 2px 8px rgb(0 0 0 / 10%);
}

.resource-add-btn:hover {
  background-color: rgb(0 0 0 / 2%);
}
</style>
