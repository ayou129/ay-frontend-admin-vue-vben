<script setup lang="ts">
import { ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import SearchForm from './components/search-form.vue';
import SpuForm from './components/spu-form.vue';
import SpuTable from './components/spu-table.vue';

// 搜索参数
const searchParams = ref({});

// 当前编辑的商品数据
const editData = ref<null | Spu>(null);

// 抽屉标题
const drawerTitle = ref('商品信息');

// 弹窗表单配置
const [SpuFormModal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
  onConfirm: async () => {
    try {
      await spuFormRef.value?.submitForm();
      // 如果没有异常，说明提交成功，关闭弹窗并刷新列表
      modalApi.close();
      spuTableRef.value?.refresh();
    } catch {
      // 验证失败或API调用失败时，不关闭弹窗
      // 用户可以看到验证错误信息
    }
  },
});

// 表格引用
const spuTableRef = ref();

// 表单引用
const spuFormRef = ref();

// 搜索
const handleSearch = (values: Record<string, any>) => {
  searchParams.value = values;
  spuTableRef.value?.refresh();
};

// 重置搜索
const handleReset = () => {
  searchParams.value = {};
  spuTableRef.value?.refresh();
};

// 添加商品
const handleAddSpu = () => {
  editData.value = null;
  drawerTitle.value = '添加商品';
  modalApi.open();
};

// 编辑商品
const handleEditSpu = (row: SpuModel) => {
  editData.value = row;
  drawerTitle.value = '编辑商品';
  modalApi.open();
};

// 表单提交成功（现在由 onConfirm 统一处理，这个方法保留但不再使用）
const handleFormSuccess = () => {
  // 现在由 onConfirm 统一处理关闭抽屉和刷新列表
};
</script>

<template>
  <Page auto-content-height>
    <!-- 搜索表单 -->
    <SearchForm @search="handleSearch" @reset="handleReset" />

    <!-- 商品表格 -->
    <SpuTable
      ref="spuTableRef"
      :search-params="searchParams"
      @add="handleAddSpu"
      @edit="handleEditSpu"
    />

    <!-- 商品表单弹窗 -->
    <SpuFormModal
      class="!h-[80vh] !max-h-[80vh] !w-[65vw] !max-w-[65vw]"
      content-class="!overflow-hidden !p-4 !flex-1 !flex !flex-col !min-h-0"
      :title="drawerTitle"
    >
      <SpuForm
        ref="spuFormRef"
        :edit-data="editData"
        @success="handleFormSuccess"
      />
    </SpuFormModal>
  </Page>
</template>

<style scoped>
.ant-tabs-tab {
  font-weight: 500;
}

.ant-tabs-tab.ant-tabs-tab-active {
  color: #1890ff;
}
</style>
