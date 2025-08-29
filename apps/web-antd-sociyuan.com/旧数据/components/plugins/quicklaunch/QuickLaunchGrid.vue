<script setup>
import { ref, watch } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';

import QuickLaunchItem from './QuickLaunchItem.vue';

const props = defineProps({
  activeItems: {
    type: Array,
    required: true,
  },
  showLabels: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits([
  'handle-item-click',
  'delete-custom-item',
  'on-drag-end',
]);

// 创建可拖拽的项目副本
const draggableItems = ref([...props.activeItems]);

// 监听activeItems变化并同步到draggableItems
watch(
  () => props.activeItems,
  (newItems) => {
    draggableItems.value = [...newItems];
  },
);

// 监听draggableItems变化并同步回activeItems
watch(
  draggableItems,
  (newItems) => {
    // 注意：这里我们不直接修改props.activeItems，而是通过事件通知父组件
  },
  { deep: true },
);
</script>

<template>
  <!-- 快捷启动项列表 -->
  <VueDraggable
    v-model="draggableItems"
    :animation="200"
    ghost-class="ghost-item"
    chosen-class="chosen-item"
    class="quicklaunch-grid"
    @end="$emit('on-drag-end')"
  >
    <QuickLaunchItem
      v-for="item in draggableItems"
      :key="item.id"
      :item="item"
      :show-labels="showLabels"
      @click="$emit('handle-item-click', item)"
      @delete-custom-item="$emit('delete-custom-item', item.id)"
    />
  </VueDraggable>
</template>

<style scoped>
@media (max-width: 768px) {
  .quick-item {
    padding: 12px;
  }
}

.quicklaunch-grid {
  --quicklaunch-blur: 0.3rem;

  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  padding: 16px;
  background: rgb(255 255 255 / 10%);
  border: 1px solid rgb(255 255 255 / 15%);
  border-radius: 20px;
  backdrop-filter: blur(var(--quicklaunch-blur));
}

/* 拖拽样式 */
.ghost-item {
  opacity: 0.3;
  transform: scale(0.95);
}

.chosen-item {
  box-shadow: 0 8px 25px rgb(0 0 0 / 15%);
  transform: scale(1.05);
}

/* macOS Dock 风格的快捷启动网格 */
</style>
