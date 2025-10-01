<script setup lang="ts">
import type { Resource } from '#/types/resource';

import { createIconifyIcon } from '@vben/icons';

import { Checkbox, Empty, Image, Spin } from 'ant-design-vue';

import { ResourceType } from '#/types/resource';

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  resources: () => [],
  selectedIds: () => [],
  mode: 'multiple',
});
const emit = defineEmits<Emits>();
// 创建图标组件
const FileIcon = createIconifyIcon('carbon:document');
const MusicIcon = createIconifyIcon('carbon:music');
const VideoIcon = createIconifyIcon('carbon:video');
const ArchiveIcon = createIconifyIcon('carbon:folder-off');
const CircleIcon = createIconifyIcon('carbon:circle-dash');

interface Props {
  loading?: boolean;
  resources?: Resource[];
  selectedIds?: number[];
  mode?: 'multiple' | 'single';
  maxSelection: number;
}

interface Emits {
  (e: 'select', resource: Resource): void;
  (e: 'preview', resource: Resource): void;
}

// 是否选中
const isSelected = (resource: Resource) => {
  return props.selectedIds?.includes(resource.id);
};

// 是否可以选中（达到上限时）
const canSelect = (resource: Resource) => {
  if (!props.maxSelection) return true;
  if (isSelected(resource)) return true;
  return (props.selectedIds?.length || 0) < props.maxSelection;
};

// 处理选择
const handleSelect = (resource: Resource) => {
  if (!canSelect(resource)) {
    return;
  }
  emit('select', resource);
};

// 处理预览
const handlePreview = (resource: Resource) => {
  emit('preview', resource);
};

// 获取文件图标
const getFileIcon = (resource: Resource) => {
  switch (resource.type) {
    case ResourceType.Archive: {
      return ArchiveIcon;
    }
    case ResourceType.Audio: {
      return MusicIcon;
    }
    case ResourceType.Document: {
      return FileIcon;
    }
    case ResourceType.Image: {
      return null;
    } // 图片直接显示缩略图
    case ResourceType.Video: {
      return VideoIcon;
    }
    default: {
      return CircleIcon;
    }
  }
};

// 是否是图片类型
const isImage = (resource: Resource) => {
  return resource.type === ResourceType.Image;
};
</script>

<template>
  <div class="resource-list">
    <Spin :spinning="loading">
      <div v-if="resources.length === 0" class="py-8">
        <Empty description="暂无资源" />
      </div>
      <div v-else class="grid grid-cols-4 gap-4">
        <div
          v-for="resource in resources"
          :key="resource.id"
          class="resource-item hover:border-primary relative cursor-pointer rounded-lg border p-2 transition-all hover:shadow-md"
          :class="{
            'border-primary bg-primary/5': isSelected(resource),
            'cursor-not-allowed opacity-50': !canSelect(resource),
          }"
          @click="handleSelect(resource)"
        >
          <!-- 选择框 -->
          <div class="absolute left-2 top-2 z-10">
            <Checkbox
              :checked="isSelected(resource)"
              :disabled="!canSelect(resource)"
              @click.stop="handleSelect(resource)"
            />
          </div>

          <!-- 文件预览 -->
          <div
            class="resource-preview mb-2 flex h-32 items-center justify-center overflow-hidden rounded bg-gray-100"
            @click.stop="handlePreview(resource)"
          >
            <!-- 图片预览 -->
            <Image
              v-if="isImage(resource)"
              :src="resource.url"
              :alt="resource.file_original_filename"
              :preview="false"
              class="h-full w-full object-cover"
            />
            <!-- 其他类型显示图标 -->
            <component
              :is="getFileIcon(resource)"
              v-else
              class="text-4xl text-gray-400"
            />
          </div>

          <!-- 文件信息 -->
          <div class="resource-info">
            <div
              class="truncate text-sm font-medium"
              :title="resource.file_original_filename"
            >
              {{ resource.file_original_filename }}
            </div>
            <div class="mt-1 text-xs text-gray-500">
              {{ resource.formatted_size }}
            </div>
          </div>
        </div>
      </div>
    </Spin>
  </div>
</template>

<style scoped>
.resource-list {
  min-height: 200px;
}

.resource-item:hover .resource-preview {
  transform: scale(1.02);
  transition: transform 0.2s;
}
</style>
