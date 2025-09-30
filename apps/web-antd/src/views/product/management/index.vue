<script setup lang="ts">
import type { Spu } from '#/types/store/spu';

import { computed, ref } from 'vue';

import { Page, useVbenDrawer } from '@vben/common-ui';

import ProductForm from './components/product-form.vue';
import ProductTable from './components/product-table.vue';
import SearchForm from './components/search-form.vue';

// 搜索参数
const searchParams = ref({});

// 抽屉表单配置
const [ProductFormDrawer, drawerApi] = useVbenDrawer({
  title: computed(() => (editData.value ? '编辑商品' : '添加商品')),
  width: '60%',
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

// 当前编辑的商品数据
const editData = ref<null | Spu>(null);

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
const handleAddProduct = () => {
  editData.value = null;
  drawerApi.open();
};

// 编辑商品
const handleEditProduct = (row: Spu) => {
  editData.value = row;
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
    <ProductTable
      ref="productTableRef"
      :search-params="searchParams"
      @add="handleAddProduct"
      @edit="handleEditProduct"
    />

    <!-- 商品表单抽屉 -->
    <ProductFormDrawer>
      <ProductForm
        ref="productFormRef"
        :edit-data="editData"
        @success="handleFormSuccess"
      />
    </ProductFormDrawer>
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
