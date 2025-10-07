<script setup lang="ts">
import { computed } from 'vue';

import { Modal } from 'ant-design-vue';

import { ResourceType } from '#/types/resource';

interface Props {
  open: boolean;
  resource?: Resource;
}

interface Emits {
  (e: 'update:open', value: boolean): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// 处理关闭
const handleClose = () => {
  emit('update:open', false);
};

// 是否是图片
const isImage = computed(() => {
  return props.resource?.type === ResourceType.Image;
});

// 是否是视频
const isVideo = computed(() => {
  return props.resource?.type === ResourceType.Video;
});

// 是否是音频
const isAudio = computed(() => {
  return props.resource?.type === ResourceType.Audio;
});

// 获取文件类型名称
const getTypeName = (type?: ResourceType) => {
  switch (type) {
    case ResourceType.Archive: {
      return '压缩包';
    }
    case ResourceType.Audio: {
      return '音频';
    }
    case ResourceType.Document: {
      return '文档';
    }
    case ResourceType.Image: {
      return '图片';
    }
    case ResourceType.Video: {
      return '视频';
    }
    default: {
      return '文件';
    }
  }
};
</script>

<template>
  <Modal
    :open="open"
    :title="resource?.file_original_filename"
    :width="800"
    :footer="null"
    @cancel="handleClose"
  >
    <div v-if="resource" class="resource-preview-content">
      <!-- 图片预览 -->
      <div v-if="isImage" class="flex justify-center">
        <img
          :src="resource.url"
          :alt="resource.file_original_filename"
          class="max-h-[600px] max-w-full"
        />
      </div>

      <!-- 视频预览 -->
      <div v-else-if="isVideo" class="flex justify-center">
        <video
          :src="resource.url"
          controls
          class="max-h-[600px] max-w-full"
        ></video>
      </div>

      <!-- 音频预览 -->
      <div v-else-if="isAudio" class="flex justify-center py-8">
        <audio :src="resource.url" controls class="w-full"></audio>
      </div>

      <!-- 其他类型 -->
      <div v-else class="py-8 text-center">
        <div class="mb-4 text-gray-500">
          {{ getTypeName(resource.type) }}文件不支持预览
        </div>
        <a
          :href="resource.url"
          target="_blank"
          class="text-primary hover:underline"
        >
          点击下载
        </a>
      </div>

      <!-- 文件信息 -->
      <div class="mt-4 border-t pt-4">
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="text-gray-500">文件名：</span>
            <span>{{ resource.file_original_filename }}</span>
          </div>
          <div>
            <span class="text-gray-500">文件大小：</span>
            <span>{{ resource.formatted_size }}</span>
          </div>
          <div>
            <span class="text-gray-500">文件类型：</span>
            <span>{{ resource.file_ext }}</span>
          </div>
          <div>
            <span class="text-gray-500">上传时间：</span>
            <span>{{ resource.created_at }}</span>
          </div>
        </div>
      </div>
    </div>
  </Modal>
</template>

<style scoped>
.resource-preview-content {
  max-height: 80vh;
  overflow-y: auto;
}
</style>
