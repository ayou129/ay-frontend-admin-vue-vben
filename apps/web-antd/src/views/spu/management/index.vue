<script setup lang="ts">
import type { Spu } from '#/types/store/spu';

import { ref } from 'vue';

import { Page, useVbenDrawer } from '@vben/common-ui';

import SearchForm from './components/search-form.vue';
import SpuForm from './components/spu-form.vue';
import SpuTable from './components/spu-table.vue';

// 搜索参数
const searchParams = ref({});

// 当前编辑的商品数据
const editData = ref<null | Spu>(null);

// 抽屉标题
const drawerTitle = ref('商品信息');

// 抽屉表单配置
const [SpuFormDrawer, drawerApi] = useVbenDrawer({
  onCancel() {
    drawerApi.close();
  },
  onConfirm: async () => {
    try {
      await productFormRef.value?.submitForm();
      // 如果没有异常，说明提交成功，关闭抽屉并刷新列表
      drawerApi.close();
      productTableRef.value?.refresh();
    } catch {
      // 验证失败或API调用失败时，不关闭抽屉
      // 用户可以看到验证错误信息
    }
  },
});

// 表格引用
const productTableRef = ref();

// 表单引用
const productFormRef = ref();

// 搜索
const handleSearch = (values: Record<string, any>) => {
  searchParams.value = values;
  productTableRef.value?.refresh();
};

// 重置搜索
const handleReset = () => {
  searchParams.value = {};
  productTableRef.value?.refresh();
};

// 添加商品
const handleAddSpu = () => {
  editData.value = null;
  drawerTitle.value = '添加商品';
  drawerApi.open();
};

// 编辑商品
const handleEditSpu = (row: Spu) => {
  editData.value = row;
  drawerTitle.value = '编辑商品';
  drawerApi.open();
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
      ref="productTableRef"
      :search-params="searchParams"
      @add="handleAddSpu"
      @edit="handleEditSpu"
    />

    <!-- 商品表单抽屉 -->
    <SpuFormDrawer :title="drawerTitle" width="60%">
      <SpuForm
        ref="productFormRef"
        :edit-data="editData"
        @success="handleFormSuccess"
      />
    </SpuFormDrawer>
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
