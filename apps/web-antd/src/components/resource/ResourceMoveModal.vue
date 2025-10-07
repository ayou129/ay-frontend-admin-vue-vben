<script setup lang="ts">
import type { Key } from 'ant-design-vue/es/_util/type';

import type { ResourceModel, ResourceFolderModel } from '#/types/resource';

import { ref, watch } from 'vue';

import { message, Modal, Tree } from 'ant-design-vue';

import {
  getResourceFolderModelTree,
  moveResourceFile,
} from '#/api/resource/resource';

interface Props {
  open: boolean;
  resource?: Resource;
}

interface Emits {
  (e: 'update:open', value: boolean): void;
  (e: 'success'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// 目录树数据
const folderTree = ref<ResourceFolderModel[]>([]);
const loading = ref(false);
const selectedFolderId = ref<Key[]>([]);

// 转换为 Tree 组件所需的格式
const treeData = ref<any[]>([]);

// 加载目录树
const loadFolderTree = async () => {
  try {
    loading.value = true;
    const response = await getResourceFolderModelTree();
    folderTree.value = response.list;

    // 转换为树形数据
    const transform = (folders: ResourceFolderModel[]): any[] => {
      return folders.map((folder) => ({
        key: folder.id,
        title: folder.name,
        children: folder.children ? transform(folder.children) : undefined,
      }));
    };
    treeData.value = transform(folderTree.value);
  } catch (error) {
    console.error('加载目录树失败:', error);
  } finally {
    loading.value = false;
  }
};

// 选择目录
const onSelect = (keys: Key[]) => {
  selectedFolderId.value = keys;
};

// 确认移动
const handleConfirm = async () => {
  if (!props.resource || selectedFolderId.value.length === 0) {
    message.error('请选择目标目录');
    return;
  }

  try {
    await moveResourceFile(
      props.resource.id,
      Number(selectedFolderId.value[0]),
    );
    message.success('移动文件成功');
    emit('success');
    handleCancel();
  } catch (error) {
    console.error('移动文件失败:', error);
    message.error('移动文件失败');
  }
};

// 取消
const handleCancel = () => {
  emit('update:open', false);
  selectedFolderId.value = [];
};

// 监听弹窗打开
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      loadFolderTree();
      selectedFolderId.value = [];
    }
  },
);
</script>

<template>
  <Modal
    :open="open"
    title="移动到目录"
    @cancel="handleCancel"
    @ok="handleConfirm"
  >
    <div class="py-4">
      <div v-if="loading" class="p-4 text-center text-gray-500">加载中...</div>
      <Tree
        v-else
        v-model:selected-keys="selectedFolderId"
        :tree-data="treeData"
        :show-line="true"
        default-expand-all
        @select="onSelect"
      />
    </div>
  </Modal>
</template>
