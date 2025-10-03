<script setup lang="ts">
import type { Resource } from '#/types/resource';

import { computed, ref, watch } from 'vue';

import { createIconifyIcon } from '@vben/icons';

import { Button, Input, message, Modal, Select, Upload } from 'ant-design-vue';

import {
  deleteResourceFiles,
  getResourceFiles,
  uploadResourceFiles,
} from '#/api/resource/resource';
import { ResourceType } from '#/types/resource';

import ResourceFolderTree from './ResourceFolderTree.vue';
import ResourceList from './ResourceList.vue';
import ResourceMoveModal from './ResourceMoveModal.vue';
import ResourcePreview from './ResourcePreview.vue';

const props = withDefaults(defineProps<Props>(), {
  open: false,
  mode: 'multiple',
  acceptTypes: () => [],
  selectedIds: () => [],
  maxSelection: 30,
});

const emit = defineEmits<Emits>();

// 创建上传图标
const UploadIcon = createIconifyIcon('carbon:upload');

interface Props {
  open?: boolean;
  mode?: 'multiple' | 'single';
  acceptTypes?: ResourceType[];
  selectedIds?: number[];
  maxSelection?: number;
}

interface Emits {
  (e: 'update:open', value: boolean): void;
  (e: 'confirm', resources: Resource[]): void;
}

// 当前选中的目录ID
const currentFolderId = ref<number>();

// 资源列表
const resources = ref<Resource[]>([]);
const loading = ref(false);

// 当前选中的资源IDs
const selectedResourceIds = ref<number[]>([]);

// 搜索关键词
const searchKeyword = ref('');

// 类型筛选
const typeFilter = ref<ResourceType>();

// 预览相关
const previewVisible = ref(false);
const previewResource = ref<Resource>();

// 移动相关
const moveModalVisible = ref(false);
const moveResource = ref<Resource>();

// 类型选项
const typeOptions = [
  { label: '图片', value: ResourceType.Image },
  { label: '视频', value: ResourceType.Video },
  { label: '音频', value: ResourceType.Audio },
  { label: '文档', value: ResourceType.Document },
  { label: '压缩包', value: ResourceType.Archive },
];

// 过滤后的资源列表
const filteredResources = computed(() => {
  let result = resources.value;

  // 类型筛选
  if (typeFilter.value !== undefined) {
    result = result.filter((r) => r.type === typeFilter.value);
  }

  // 接受类型筛选
  if (props.acceptTypes.length > 0) {
    result = result.filter((r) => props.acceptTypes.includes(r.type));
  }

  // 搜索筛选
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    result = result.filter((r) =>
      r.file_original_filename.toLowerCase().includes(keyword),
    );
  }

  return result;
});

// 已选中的资源
const selectedResources = computed(() => {
  return resources.value.filter((r) =>
    selectedResourceIds.value.includes(r.id),
  );
});

// 加载资源列表
const loadResources = async (folderId?: number) => {
  try {
    loading.value = true;
    // 如果没有指定 folderId，使用资源列表分页 API 加载所有资源
    if (folderId === undefined) {
      const { getResourceList } = await import('#/api/resource/resource');
      const response = await getResourceList({
        page: 1,
        page_size: 1000,
        filters: [],
        filter_sort_option: { sort_field: 'id', sort_order: 'desc' },
      });
      resources.value = response.items;
    } else {
      const response = await getResourceFiles(folderId);
      resources.value = response.list;
    }
  } catch (error) {
    console.error('加载资源列表失败:', error);
    message.error('加载资源列表失败');
  } finally {
    loading.value = false;
  }
};

// 选择目录
const handleFolderSelect = (folderId?: number) => {
  currentFolderId.value = folderId;
  loadResources(folderId);
};

// 选择资源
const handleResourceSelect = (resource: Resource) => {
  const index = selectedResourceIds.value.indexOf(resource.id);

  if (props.mode === 'single') {
    // 单选模式：直接替换
    selectedResourceIds.value = [resource.id];
  } else {
    // 多选模式：切换选中状态
    if (index === -1) {
      if (
        props.maxSelection &&
        selectedResourceIds.value.length >= props.maxSelection
      ) {
        message.warning(`最多只能选择${props.maxSelection}个资源`);
        return;
      }
      selectedResourceIds.value.push(resource.id);
    } else {
      selectedResourceIds.value.splice(index, 1);
    }
  }
};

// 预览资源
const handleResourcePreview = (resource: Resource) => {
  previewResource.value = resource;
  previewVisible.value = true;
};

// 上传文件前的校验
const beforeUpload = (_file: File, fileList: File[]) => {
  const maxCount = 30;
  if (fileList.length > maxCount) {
    message.error(`最多只能上传 ${maxCount} 个文件`);
    return false;
  }
  return true;
};

// 上传文件
const handleUpload = async (options: any) => {
  const formData = new FormData();
  formData.append('files[]', options.file);

  // 如果有选中目录，则上传到指定目录；否则上传到根目录（传 folder_id = 0 或不传）
  if (currentFolderId.value !== undefined) {
    formData.append('folder_id', currentFolderId.value.toString());
  }

  try {
    const response = await uploadResourceFiles(formData);
    message.success('上传成功');

    // 重新加载资源列表
    await loadResources(currentFolderId.value);

    // 自动选中上传的资源
    if (response.list && response.list.length > 0) {
      for (const resource of response.list) {
        if (!selectedResourceIds.value.includes(resource.id)) {
          selectedResourceIds.value.push(resource.id);
        }
      }
    }

    options.onSuccess();
  } catch (error) {
    console.error('上传失败:', error);
    message.error('上传失败');
    options.onError(error);
  }
};

// 确认选择
const handleConfirm = () => {
  emit('confirm', selectedResources.value);
  emit('update:open', false);
};

// 取消
const handleCancel = () => {
  emit('update:open', false);
};

// 删除资源
const handleDeleteResource = (resource: Resource) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除文件"${resource.file_original_filename}"吗？`,
    onOk: async () => {
      try {
        await deleteResourceFiles([resource.id]);
        message.success('删除文件成功');
        // 重新加载资源列表
        await loadResources(currentFolderId.value);
        // 从选中列表中移除
        const index = selectedResourceIds.value.indexOf(resource.id);
        if (index !== -1) {
          selectedResourceIds.value.splice(index, 1);
        }
      } catch (error) {
        console.error('删除文件失败:', error);
        message.error('删除文件失败');
      }
    },
  });
};

// 移动资源
const handleMoveResource = (resource: Resource) => {
  moveResource.value = resource;
  moveModalVisible.value = true;
};

// 移动成功后刷新列表
const handleMoveSuccess = () => {
  moveModalVisible.value = false;
  loadResources(currentFolderId.value);
};

// 重置筛选条件（不重置目录树选择）
const handleResetFilter = () => {
  searchKeyword.value = '';
  typeFilter.value = undefined;
};

// 监听弹窗打开，初始化选中状态并加载资源
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      selectedResourceIds.value = [...props.selectedIds];
      // 每次打开都重新加载当前目录的资源（如果没有选中目录，则加载所有资源）
      loadResources(currentFolderId.value);
    } else {
      // 关闭时重置状态
      handleResetFilter();
    }
  },
  { immediate: true }, // 立即执行，支持动态创建的组件
);
</script>

<template>
  <Modal
    :open="open"
    title="选择资源"
    :width="1200"
    :footer="null"
    @cancel="handleCancel"
  >
    <div class="resource-picker-modal">
      <div class="flex h-[600px] gap-4">
        <!-- 左侧：目录树 -->
        <div class="w-64 overflow-y-auto border-r pr-4">
          <div class="mb-2 font-medium">资源目录</div>
          <ResourceFolderTree @select="handleFolderSelect" />
        </div>

        <!-- 右侧：文件列表 -->
        <div class="flex flex-1 flex-col">
          <!-- 工具栏 -->
          <div class="mb-4 flex gap-2">
            <Input
              v-model:value="searchKeyword"
              placeholder="搜索文件名"
              class="w-64"
              allow-clear
            />
            <Select
              v-model:value="typeFilter"
              :options="typeOptions"
              placeholder="筛选类型"
              class="w-32"
              allow-clear
            />
            <Button @click="handleResetFilter">重置筛选</Button>
            <Upload
              :before-upload="beforeUpload"
              :custom-request="handleUpload"
              :show-upload-list="false"
              :multiple="true"
            >
              <Button>
                <template #icon>
                  <UploadIcon class="size-4" />
                </template>
                上传文件
              </Button>
            </Upload>
          </div>

          <!-- 资源列表 -->
          <div class="flex-1 overflow-y-auto">
            <ResourceList
              :loading="loading"
              :resources="filteredResources"
              :selected-ids="selectedResourceIds"
              :mode="mode"
              :max-selection="maxSelection"
              @select="handleResourceSelect"
              @preview="handleResourcePreview"
              @delete="handleDeleteResource"
              @move="handleMoveResource"
            />
          </div>

          <!-- 底部：已选数量和按钮 -->
          <div class="mt-4 flex items-center justify-between border-t pt-4">
            <div class="text-sm text-gray-500">
              已选择 {{ selectedResourceIds.length }} 项
              <span v-if="maxSelection">(最多 {{ maxSelection }} 项)</span>
            </div>
            <div class="flex gap-2">
              <Button @click="handleCancel">取消</Button>
              <Button
                type="primary"
                :disabled="selectedResourceIds.length === 0"
                @click="handleConfirm"
              >
                确认
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 预览弹窗 -->
    <ResourcePreview
      v-model:open="previewVisible"
      :resource="previewResource"
    />

    <!-- 移动弹窗 -->
    <ResourceMoveModal
      v-model:open="moveModalVisible"
      :resource="moveResource"
      @success="handleMoveSuccess"
    />
  </Modal>
</template>

<style scoped>
.resource-picker-modal {
  max-height: 80vh;
}
</style>
