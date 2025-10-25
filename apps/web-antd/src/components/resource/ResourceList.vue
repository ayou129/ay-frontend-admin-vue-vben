<script setup lang="ts">
import type { ResourceModel } from '#/types/resource';

import { createIconifyIcon } from '@vben/icons';

import {
  Checkbox,
  Dropdown,
  Empty,
  Image,
  Menu,
  MenuItem,
  Spin,
} from 'ant-design-vue';

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
const MoreIcon = createIconifyIcon('carbon:overflow-menu-horizontal');
const EyeIcon = createIconifyIcon('carbon:view');

interface Props {
  loading?: boolean;
  resources?: ResourceModel[];
  selectedIds?: number[];
  mode?: 'multiple' | 'single';
  maxSelection: number;
}

interface Emits {
  (e: 'select', resource: ResourceModel): void;
  (e: 'preview', resource: ResourceModel): void;
  (e: 'delete', resource: ResourceModel): void;
  (e: 'move', resource: ResourceModel): void;
}

// 是否选中
const isSelected = (resource: ResourceModel) => {
  return props.selectedIds?.includes(resource.id);
};

// 是否可以选中（达到上限时）
const canSelect = (resource: ResourceModel) => {
  if (!props.maxSelection) return true;
  if (isSelected(resource)) return true;
  return (props.selectedIds?.length || 0) < props.maxSelection;
};

// 处理选择
const handleSelect = (resource: ResourceModel) => {
  if (!canSelect(resource)) {
    return;
  }
  emit('select', resource);
};

// 处理预览
const handlePreview = (resource: ResourceModel) => {
  emit('preview', resource);
};

// 获取文件图标
const getFileIcon = (resource: ResourceModel) => {
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
const isImage = (resource: ResourceModel) => {
  return resource.type === ResourceType.Image;
};

// 删除资源
const handleDelete = (resource: ResourceModel) => {
  emit('delete', resource);
};

// 移动资源
const handleMove = (resource: ResourceModel) => {
  emit('move', resource);
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
          class="resource-item hover:border-primary group relative cursor-pointer rounded-lg border p-2 transition-all hover:shadow-md"
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

          <!-- 操作按钮 -->
          <div class="absolute right-2 top-2 z-10">
            <Dropdown :trigger="['click']">
              <MoreIcon
                class="size-4 cursor-pointer text-gray-400 opacity-0 transition-opacity hover:text-gray-600 group-hover:opacity-100"
                @click.stop
              />
              <template #overlay>
                <Menu>
                  <MenuItem key="move" @click.stop="handleMove(resource)">
                    移动到
                  </MenuItem>
                  <MenuItem
                    key="delete"
                    danger
                    @click.stop="handleDelete(resource)"
                  >
                    删除
                  </MenuItem>
                </Menu>
              </template>
            </Dropdown>
          </div>

          <!-- 文件预览 -->
          <div
            class="resource-preview group/preview relative mb-2 flex h-32 items-center justify-center overflow-hidden rounded bg-gray-100"
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

            <!-- 预览按钮（图片/视频/音频） -->
            <div
              v-if="isImage(resource) || resource.type === ResourceType.Video || resource.type === ResourceType.Audio"
              class="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover/preview:bg-black/20 group-hover/preview:opacity-100"
            >
              <div
                class="pointer-events-auto flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform hover:scale-110"
                @click.stop="handlePreview(resource)"
              >
                <EyeIcon class="size-5 text-gray-700" />
              </div>
            </div>
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
