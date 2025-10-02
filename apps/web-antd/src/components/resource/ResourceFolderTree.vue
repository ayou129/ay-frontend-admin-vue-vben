<script setup lang="ts">
import type { TreeProps } from 'ant-design-vue';

import type { ResourceFolder } from '#/types/resource';

import { computed, onMounted, ref } from 'vue';

import { createIconifyIcon } from '@vben/icons';

import {
  Button,
  Dropdown,
  Menu,
  MenuItem,
  message,
  Modal,
  Tree,
} from 'ant-design-vue';

import {
  deleteResourceFolder,
  getResourceFolderTree,
} from '#/api/resource/resource';

import ResourceFolderFormModal from './ResourceFolderFormModal.vue';

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
// 创建图标
const FolderIcon = createIconifyIcon('carbon:folder');
const MoreIcon = createIconifyIcon('carbon:overflow-menu-horizontal');

interface Props {
  selectedFolderId?: number;
}

interface Emits {
  (e: 'select', folderId: number): void;
}

// 目录树数据
const folderTree = ref<ResourceFolder[]>([]);
const loading = ref(false);

// 转换为 Tree 组件所需的格式
const treeData = computed<TreeProps['treeData']>(() => {
  const transform = (folders: ResourceFolder[]): any[] => {
    return folders.map((folder) => ({
      key: folder.id,
      title: folder.name,
      children: folder.children ? transform(folder.children) : undefined,
    }));
  };

  // 添加"全部资源"顶级节点
  const allNode = {
    key: 'all',
    title: '全部资源',
  };

  const transformedData = transform(folderTree.value);
  return [allNode, ...transformedData];
});

// 选中的节点（支持 string 类型以兼容 'all' 节点）
const selectedKeys = ref<Array<number | string>>([]);

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
    const key = keys[0];
    selectedKeys.value = [key as number | string];

    // 如果选择的是"全部资源"，emit undefined；否则 emit folderId
    if (key === 'all') {
      emit('select', undefined as any);
    } else {
      emit('select', key as number);
    }
  }
};

// 监听外部选中的目录
const updateSelectedKeys = (folderId?: number) => {
  // undefined 时选中"全部资源"
  selectedKeys.value = folderId === undefined ? ['all'] : [folderId];
};

// 组件挂载时加载数据
onMounted(() => {
  loadFolderTree();
  updateSelectedKeys(props.selectedFolderId);
});

// 目录表单弹窗
const folderFormVisible = ref(false);
const editingFolder = ref<ResourceFolder>();
const parentFolderId = ref<number>();

// 在树形结构中查找目录
const findFolder = (
  folders: ResourceFolder[],
  id: number | string,
): ResourceFolder | undefined => {
  for (const folder of folders) {
    if (folder.id === id) return folder;
    if (folder.children) {
      const found = findFolder(folder.children, id);
      if (found) return found;
    }
  }
  return undefined;
};

// 创建目录
const handleCreate = (parentId?: number) => {
  editingFolder.value = undefined;
  parentFolderId.value = parentId;
  folderFormVisible.value = true;
};

// 编辑目录
const handleEdit = (folderId: number) => {
  const folder = findFolder(folderTree.value, folderId);
  if (folder) {
    editingFolder.value = folder;
    parentFolderId.value = undefined;
    folderFormVisible.value = true;
  }
};

// 删除目录
const handleDelete = (folderId: number) => {
  const folder = findFolder(folderTree.value, folderId);
  if (!folder) return;

  Modal.confirm({
    title: '确认删除',
    content: `确定要删除目录"${folder.name}"吗？`,
    onOk: async () => {
      try {
        await deleteResourceFolder(folder.id);
        message.success('删除目录成功');
        await loadFolderTree();
      } catch (error) {
        console.error('删除目录失败:', error);
        message.error('删除目录失败');
      }
    },
  });
};

// 表单提交成功
const handleFormSuccess = () => {
  folderFormVisible.value = false;
  loadFolderTree();
};

// 暴露方法给父组件
defineExpose({
  loadFolderTree,
  updateSelectedKeys,
});
</script>

<template>
  <div class="resource-folder-tree">
    <!-- 创建根目录按钮 -->
    <div class="mb-2">
      <Button type="link" size="small" @click="handleCreate()">
        + 创建根目录
      </Button>
    </div>

    <div v-if="loading" class="p-4 text-center text-gray-500">加载中...</div>
    <Tree
      v-else
      v-model:selected-keys="selectedKeys"
      :tree-data="treeData"
      :show-line="{ showLeafIcon: false }"
      default-expand-all
      @select="onSelect"
    >
      <template #title="{ title, key }">
        <div class="folder-node group flex items-center justify-between">
          <div class="flex items-center gap-1">
            <FolderIcon v-if="key !== 'all'" class="size-4 text-gray-500" />
            <span>{{ title }}</span>
          </div>
          <Dropdown v-if="key !== 'all'" :trigger="['click']" class="ml-4">
            <MoreIcon
              class="size-4 cursor-pointer text-gray-400 opacity-0 transition-opacity hover:text-gray-600 group-hover:opacity-100"
              @click.stop
            />
            <template #overlay>
              <Menu>
                <MenuItem key="create" @click="handleCreate(key as number)">
                  新建子目录
                </MenuItem>
                <MenuItem key="edit" @click="handleEdit(key as number)">
                  编辑
                </MenuItem>
                <MenuItem
                  key="delete"
                  danger
                  @click="handleDelete(key as number)"
                >
                  删除
                </MenuItem>
              </Menu>
            </template>
          </Dropdown>
        </div>
      </template>
    </Tree>

    <!-- 目录表单弹窗 -->
    <ResourceFolderFormModal
      v-model:open="folderFormVisible"
      :edit-data="editingFolder"
      :parent-id="parentFolderId"
      @success="handleFormSuccess"
    />
  </div>
</template>

<style scoped>
.resource-folder-tree {
  height: 100%;
  overflow-y: auto;
}
</style>
