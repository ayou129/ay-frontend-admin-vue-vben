<script setup>
import { computed, onMounted, ref, watch } from 'vue';

import {
  batchDeleteSearchHistoryItems,
  clearSearchHistory,
  deleteSearchHistoryItem,
  loadSearchHistory,
} from '../../../utils/searchHistory';

const props = defineProps({
  showHistory: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  'select-history',
  'delete-history',
  'clear-history',
  'batch-delete',
]);

const searchHistory = ref([]);
const selectedItems = ref(new Set());

// 加载搜索历史
const loadHistory = () => {
  searchHistory.value = loadSearchHistory();
};

// 选择历史记录项
const selectHistoryItem = (item) => {
  emit('select-history', item);
};

// 删除历史记录项
const deleteHistoryItem = (index) => {
  deleteSearchHistoryItem(index);
  loadHistory();
  emit('delete-history', index);

  // 更新选中项索引
  updateSelectedItemsAfterDeletion(index);
};

// 批量删除选中的历史记录
const batchDeleteSelected = () => {
  // 转换为数组并按降序排列，避免删除时索引变化
  const indicesToDelete = [...selectedItems.value].sort((a, b) => b - a);

  // 批量删除
  batchDeleteSearchHistoryItems(indicesToDelete);
  loadHistory();

  emit('batch-delete', indicesToDelete);

  // 清空选中项
  selectedItems.value.clear();
};

// 清空历史记录
const clearHistory = () => {
  clearSearchHistory();
  searchHistory.value = [];
  emit('clear-history');
  selectedItems.value.clear();
};

// 全选
const selectAll = () => {
  // 选择所有项
  for (let i = 0; i < searchHistory.value.length; i++) {
    selectedItems.value.add(i);
  }
};

// 取消选择
const cancelSelection = () => {
  selectedItems.value.clear();
};

// 切换选中状态
const toggleSelection = (index) => {
  if (selectedItems.value.has(index)) {
    selectedItems.value.delete(index);
  } else {
    selectedItems.value.add(index);
  }
};

// 处理历史项点击
const handleItemClick = (item, index) => {
  // 如果处于选择模式，切换选中状态
  if (selectedItems.value.size > 0) {
    toggleSelection(index);
  } else {
    // 否则选择该项进行搜索
    selectHistoryItem(item);
  }
};

// 更新删除后的选中项索引
const updateSelectedItemsAfterDeletion = (deletedIndex) => {
  const newSelectedItems = new Set();
  selectedItems.value.forEach((index) => {
    if (index > deletedIndex) {
      newSelectedItems.add(index - 1);
    } else if (index < deletedIndex) {
      newSelectedItems.add(index);
    }
    // 删除的项不添加到新集合中
  });
  selectedItems.value = newSelectedItems;
};

// 监听搜索历史变化
const watchSearchHistory = computed(() => searchHistory.value);

// 监听showHistory属性变化，当显示时重新加载历史记录
watch(
  () => props.showHistory,
  (newVal) => {
    if (newVal) {
      loadHistory();
    }
  },
);

onMounted(() => {
  loadHistory();
});
</script>

<template>
  <div
    class="search-history"
    v-if="showHistory && searchHistory.length > 0"
    @mousedown.stop
  >
    <div
      class="history-list"
      :class="{ 'selection-mode': selectedItems.size > 0 }"
    >
      <div
        v-for="(item, index) in searchHistory"
        :key="index"
        class="history-item"
        :class="{ selected: selectedItems.has(index) }"
        @click="handleItemClick(item, index)"
      >
        <span class="history-text">{{ item }}</span>
        <button
          v-if="selectedItems.size === 0"
          class="delete-history"
          @click.stop="deleteHistoryItem(index)"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
            />
          </svg>
        </button>
        <div v-else class="selection-checkbox" @click.stop>
          <input
            type="checkbox"
            :checked="selectedItems.has(index)"
            @change="toggleSelection(index)"
          />
        </div>
      </div>
    </div>

    <!-- 非选择模式下的按钮 -->
    <div class="history-actions" v-if="selectedItems.size === 0">
      <button class="select-all-btn" @click.stop="selectAll">全选</button>
      <button class="clear-history" @click.stop="clearHistory">
        清空历史记录
      </button>
    </div>

    <!-- 选择模式下的按钮，现在放在底部 -->
    <div class="history-actions" v-if="selectedItems.size > 0">
      <div class="selected-count">{{ selectedItems.size }} 项已选择</div>
      <div class="action-buttons">
        <button class="batch-delete-btn" @click.stop="batchDeleteSelected">
          删除
        </button>
        <button class="cancel-select-btn" @click.stop="cancelSelection">
          取消
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .search-history {
    right: 16px;
    left: 16px;
    max-width: none;
  }
}

/* 黑暗模式支持 */
@media (prefers-color-scheme: dark) {
  .search-history {
    background: rgb(31 41 55 / 98%);
    border-color: rgb(55 65 81 / 30%);
  }

  .history-header {
    background: rgb(0 0 0 / 10%);
    border-color: rgb(55 65 81 / 30%);
  }

  .history-item {
    border-color: rgb(55 65 81 / 30%);
  }

  .history-item:hover {
    background: rgb(0 0 0 / 10%);
  }

  .history-item.selected {
    background: rgb(0 0 0 / 15%);
  }

  .history-text {
    color: #f9fafb;
  }

  .delete-history:hover {
    background: rgb(0 0 0 / 20%);
  }

  .select-all-btn:hover,
  .cancel-select-btn:hover {
    background: rgb(0 0 0 / 10%);
  }

  .batch-delete-btn:hover,
  .clear-history:hover {
    background: rgb(0 0 0 / 10%);
  }
}

.search-history {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  left: 0;
  z-index: 1000;
  max-width: 500px; /* 设置最大宽度 */
  max-height: 300px; /* 设置最大高度 */
  margin: 0 auto; /* 居中显示 */
  overflow: hidden;
  background: rgb(255 255 255 / 98%);
  border: 1px solid rgb(255 255 255 / 30%);
  border-radius: 16px;
  box-shadow: 0 8px 40px rgb(0 0 0 / 15%);
  backdrop-filter: blur(20px);
  animation: slideDown 0.3s ease;
}

.selected-count {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.history-list {
  max-height: 200px; /* 设置列表最大高度 */
  overflow-y: auto;
}

.history-list.selection-mode .history-item {
  padding-right: 16px;
}

.history-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid rgb(0 0 0 / 5%);
  transition: all 0.2s;
}

.history-item:hover {
  background: rgb(0 0 0 / 5%);
}

.history-item.selected {
  background: rgb(0 0 0 / 8%);
}

.history-text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  color: #333;
  white-space: nowrap;
}

.delete-history {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  color: #999;
  cursor: pointer;
  background: none;
  border: none;
  border-radius: 4px;
  transition: all 0.2s;
}

.delete-history:hover {
  color: #666;
  background: rgb(0 0 0 / 10%);
}

.selection-checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.selection-checkbox input {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.history-actions {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-top: 1px solid rgb(0 0 0 / 5%);
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.selected-count {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.select-all-btn,
.batch-delete-btn,
.cancel-select-btn,
.clear-history {
  padding: 4px 8px;
  font-size: 12px; /* 将文字调小一点 */
  color: #666;
  cursor: pointer;
  background: none;
  border: none;
  border-radius: 4px;
  transition: all 0.2s;
}

.select-all-btn:hover,
.cancel-select-btn:hover {
  color: #333;
  background: rgb(0 0 0 / 5%);
}

.batch-delete-btn:hover,
.clear-history:hover {
  color: #333;
  background: rgb(0 0 0 / 5%);
}
</style>
