<script setup lang="ts">
import type { TreeProps } from 'ant-design-vue';

import type { ResourceFolder } from '#/types/resource';

import { computed, onMounted, ref } from 'vue';

import { Tree } from 'ant-design-vue';

import { getResourceFolderTree } from '#/api/resource/resource';

interface Props {
  selectedFolderId?: number;
}

interface Emits {
  (e: 'select', folderId: number): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// 目录树数据
const folderTree = ref<ResourceFolder[]>([]);
const loading = ref(false);

// 转换为 Tree 组件所需的格式
const treeData = computed<TreeProps['treeData']>(() => {
  const transform = (folders: ResourceFolder[]): TreeProps['treeData'] => {
    return folders.map((folder) => ({
      key: folder.id,
      title: folder.name,
      children: folder.children ? transform(folder.children) : undefined,
    }));
  };
  return transform(folderTree.value);
});

// 选中的节点
const selectedKeys = ref<number[]>([]);

// 加载目录树
const loadFolderTree = async () => {
  try {
    loading.value = true;
    const response = await getResourceFolderTree();
    folderTree.value = response.list;
  } catch (error) {
    console.error('加载目录树失败:', error);
  } finally {
    loading.value = false;
  }
};

// 选择节点
const onSelect: TreeProps['onSelect'] = (keys) => {
  if (keys.length > 0) {
    const folderId = keys[0] as number;
    selectedKeys.value = [folderId];
    emit('select', folderId);
  }
};

// 监听外部选中的目录
const updateSelectedKeys = (folderId?: number) => {
  selectedKeys.value = folderId === undefined ? [] : [folderId];
};

// 组件挂载时加载数据
onMounted(() => {
  loadFolderTree();
  updateSelectedKeys(props.selectedFolderId);
});

// 暴露方法给父组件
defineExpose({
  loadFolderTree,
  updateSelectedKeys,
});
</script>

<template>
  <div class="resource-folder-tree">
    <div v-if="loading" class="p-4 text-center text-gray-500">加载中...</div>
    <Tree
      v-else
      v-model:selected-keys="selectedKeys"
      :tree-data="treeData"
      :show-line="true"
      default-expand-all
      @select="onSelect"
    />
  </div>
</template>

<style scoped>
.resource-folder-tree {
  height: 100%;
  overflow-y: auto;
}
</style>
