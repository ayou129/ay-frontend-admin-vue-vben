<script setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue';

import { addSearchHistoryItem } from '../../../utils/searchHistory';
import SearchEngineSelector from './SearchEngineSelector.vue';
import SearchHistory from './SearchHistory.vue';
import SearchInput from './SearchInput.vue';

// 接收配置参数
const props = defineProps({
  config: {
    type: Object,
    default: () => ({}),
  },
});

// 搜索相关状态
const searchQuery = ref('');
const showEngineList = ref(false);
const showHistory = ref(false);
const searchInput = ref(null);

// 搜索引擎数据
const searchEngines = reactive([
  {
    id: 'baidu',
    name: '百度',
    icon: '/assets/icons/baidu.svg',
    url: 'https://www.baidu.com/s?wd=',
    isDefault: true,
  },
  {
    id: 'google',
    name: 'Google',
    icon: '/assets/icons/google.svg',
    url: 'https://www.google.com/search?q=',
  },
  {
    id: 'bing',
    name: '必应',
    icon: '/assets/icons/bing.svg',
    url: 'https://www.bing.com/search?q=',
  },
  {
    id: '360',
    name: '360搜索',
    icon: '/assets/icons/360sousuo.svg',
    url: 'https://www.so.com/s?q=',
  },
  {
    id: 'sogou',
    name: '搜狗搜索',
    icon: '/assets/icons/sougousousuo.svg',
    url: 'https://www.sogou.com/web?query=',
  },
]);

// 当前搜索引擎
const currentEngine = ref(
  searchEngines.find((engine) => engine.isDefault) || searchEngines[0],
);

// 切换搜索引擎
const switchEngine = (engine) => {
  currentEngine.value = engine;
  showEngineList.value = false;
};

// 选择搜索引擎
const selectEngine = (engine) => {
  switchEngine(engine);
};

// 切换引擎列表显示
const toggleEngineList = () => {
  // 切换时关闭历史面板，实现互斥显示
  showHistory.value = false;
  showEngineList.value = !showEngineList.value;
};

// 处理输入框获得焦点
const handleInputFocus = () => {
  // 关闭搜索引擎列表，打开历史面板
  showEngineList.value = false;
  showHistory.value = true;
};

// 处理输入框失去焦点
const handleInputBlur = () => {
  // 不要自动关闭搜索历史面板
  // 用户可能是要点击历史项或全选按钮
};

// 选择历史记录项
const selectHistoryItem = (item) => {
  searchQuery.value = item;
  showHistory.value = false;
  // 聚焦到输入框
  setTimeout(() => {
    if (searchInput.value && searchInput.value.$el) {
      searchInput.value.focus();
    }
  }, 10);
};

// 删除历史记录项
const deleteHistoryItem = (index) => {
  // 这个方法在SearchHistory组件中已经实现，这里可以留空或者添加其他逻辑
  console.log('Delete history item at index:', index);
  // 不要在删除后关闭面板
};

// 批量删除历史记录
const batchDeleteHistory = (indices) => {
  // 这个方法在SearchHistory组件中已经实现，这里可以留空或者添加其他逻辑
  console.log('Batch delete history items at indices:', indices);
  // 不要在批量删除后关闭面板
};

// 清空历史记录
const clearHistory = () => {
  // 这个方法在SearchHistory组件中已经实现，这里可以留空或者添加其他逻辑
  console.log('Clear all history');
  // 不要在清空后关闭面板
};

// 执行搜索
const performSearch = () => {
  if (!searchQuery.value.trim()) return;

  // 保存搜索历史
  addSearchHistoryItem(searchQuery.value);

  const searchUrl =
    currentEngine.value.url + encodeURIComponent(searchQuery.value);
  window.open(searchUrl, '_blank');
};

// 处理键盘快捷键
const handleKeydown = (event) => {
  // Alt + 数字键切换搜索引擎
  if (event.altKey && event.key >= '1' && event.key <= '9') {
    event.preventDefault();
    const index = Number.parseInt(event.key) - 1;
    if (index < searchEngines.length) {
      switchEngine(searchEngines[index]);
    }
  }

  // 向下箭头键显示历史记录
  if (event.key === 'ArrowDown' && !showHistory.value) {
    showHistory.value = true;
  }
};

// 打开搜索引擎设置
const openSearchSettings = () => {
  showEngineList.value = false;
  // 触发设置面板打开搜索引擎偏好
  window.dispatchEvent(new CustomEvent('open-search-settings'));
};

// 监听设置更新事件
const handleSettingsUpdate = () => {
  // 重新加载默认搜索引擎
  const savedDefault = localStorage.getItem(
    'browser-homepage-default-search-engine',
  );
  if (savedDefault) {
    const defaultEngine = searchEngines.find(
      (engine) => engine.id === savedDefault,
    );
    if (defaultEngine) {
      currentEngine.value = defaultEngine;
    }
  }

  // 重新加载搜索引擎顺序
  const savedOrder = localStorage.getItem(
    'browser-homepage-search-engine-order',
  );
  if (savedOrder) {
    const orderIds = JSON.parse(savedOrder);
    const reorderedEngines = [];
    orderIds.forEach((id) => {
      const engine = searchEngines.find((e) => e.id === id);
      if (engine) reorderedEngines.push(engine);
    });
    if (reorderedEngines.length === searchEngines.length) {
      searchEngines.splice(0, searchEngines.length, ...reorderedEngines);
    }
  }
};

// 点击外部关闭下拉列表
const handleClickOutside = (event) => {
  // 如果点击在历史面板内部，不关闭面板
  if (event.target.closest('.search-history')) {
    return;
  }

  // 如果点击不在搜索插件内部，关闭所有下拉
  if (!event.target.closest('.search-plugin')) {
    showEngineList.value = false;
    showHistory.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);

  // 监听设置更新事件
  window.addEventListener('search-engine-changed', handleSettingsUpdate);
  window.addEventListener('search-engine-order-changed', handleSettingsUpdate);

  // 初始化时加载设置
  handleSettingsUpdate();
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);

  // 移除设置更新事件监听
  window.removeEventListener('search-engine-changed', handleSettingsUpdate);
  window.removeEventListener(
    'search-engine-order-changed',
    handleSettingsUpdate,
  );
});
</script>

<template>
  <div class="search-plugin" @click.stop>
    <!-- 搜索栏容器 -->
    <div class="search-bar">
      <!-- 主搜索框 -->
      <div class="search-container">
        <div class="search-engine-wrapper">
          <SearchEngineSelector
            :current-engine="currentEngine"
            :search-engines="searchEngines"
            @toggle-engine-list="toggleEngineList"
            @select-engine="selectEngine"
          />

          <!-- 搜索引擎列表弹出层 -->
          <div v-if="showEngineList" class="engine-dropdown" @click.stop>
            <div class="engine-list">
              <div
                v-for="engine in searchEngines"
                :key="engine.id"
                class="engine-option"
                :class="{ active: engine.id === currentEngine.id }"
                @click="selectEngine(engine)"
              >
                <img
                  :src="engine.icon"
                  :alt="engine.name"
                  class="engine-icon"
                />
                <span>{{ engine.name }}</span>
              </div>
            </div>
            <div class="engine-settings" @click="openSearchSettings">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"
                />
              </svg>
              <span>搜索引擎偏好</span>
            </div>
          </div>
        </div>

        <SearchInput
          ref="searchInput"
          v-model="searchQuery"
          :current-engine="currentEngine"
          @keydown="handleKeydown"
          @perform-search="performSearch"
          @focus="handleInputFocus"
          @blur="handleInputBlur"
        />
        <button class="search-button" @click="performSearch">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"
            />
          </svg>
        </button>
      </div>

      <!-- 搜索历史 -->
      <SearchHistory
        v-if="showHistory"
        :show-history="showHistory"
        @select-history="selectHistoryItem"
        @delete-history="deleteHistoryItem"
        @clear-history="clearHistory"
        @batch-delete="batchDeleteHistory"
      />
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
  .search-container {
    max-width: none;
    margin: 0 16px;
  }

  .search-input {
    font-size: 16px; /* 防止iOS缩放 */
  }

  .engine-dropdown {
    right: 16px;
    left: 16px;
    margin-right: 0;
    margin-left: 0;
    transform: none;
  }
}

@media (max-width: 480px) {
  .search-container {
    padding: 6px;
    margin: 0 12px;
  }

  .search-input {
    padding: 10px 12px;
    font-size: 16px;
  }

  .search-button {
    padding: 10px 16px;
    font-size: 13px;
  }

  .engine-icon {
    width: 20px;
    height: 20px;
  }
}

/* 黑暗模式支持 */
@media (prefers-color-scheme: dark) {
  .search-container {
    color: #f9fafb;
    background: rgb(31 41 55 / 95%);
  }

  .search-input {
    color: #f9fafb;
  }

  .search-input::placeholder {
    color: #9ca3af;
  }

  .engine-dropdown {
    background: rgb(31 41 55 / 98%);
    border-color: rgb(55 65 81 / 30%);
  }

  .engine-settings {
    color: #d1d5db;
    border-color: rgb(55 65 81 / 30%);
  }

  .engine-option:hover {
    background: rgb(79 70 229 / 20%);
  }

  .engine-settings:hover {
    background: rgb(79 70 229 / 20%);
  }
}

.search-plugin {
  width: 100%;
  padding: 0;
}

/* 搜索栏容器 */
.search-bar {
  position: relative;
  width: 100%;
}

/* 主搜索框容器 */
.search-container {
  display: flex;
  align-items: center;
  max-width: 500px;
  padding: 8px 16px;
  margin: 0 auto;
  background: rgb(255 255 255 / 95%);
  border-radius: 40px;
  box-shadow: 0 2px 20px rgb(0 0 0 / 8%);
  backdrop-filter: blur(20px);
  transition: all 0.3s ease;
}

.search-container:hover {
  box-shadow: 0 4px 24px rgb(0 0 0 / 12%);
}

/* 搜索按钮 */
.search-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 8px;
  color: white;
  cursor: pointer;
  background: #4285f4;
  border: none;
  border-radius: 50%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-button:hover {
  background: #3367d6;
  box-shadow: 0 4px 12px rgb(66 133 244 / 30%);
  transform: translateY(-1px);
}

/* 搜索引擎下拉列表 */
.engine-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 1100;
  min-width: 200px;
  max-width: 250px;
  overflow: hidden;
  background: rgb(255 255 255 / 98%);
  border: 1px solid rgb(255 255 255 / 30%);
  border-radius: 16px;
  box-shadow: 0 8px 40px rgb(0 0 0 / 15%);
  backdrop-filter: blur(20px);
  transform-origin: top left;
  animation: slideDown 0.3s ease;
}

/* 引擎列表 */
.engine-list {
  max-height: 300px;
  padding: 8px 0;
  overflow-y: auto;
}

.engine-option {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 10px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.engine-option:hover {
  background: rgb(0 0 0 / 5%);
}

.engine-option.active {
  font-weight: 500;
  background: rgb(0 0 0 / 8%);
}

.engine-option img {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

/* 设置选项 */
.engine-settings {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 12px 16px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  border-top: 1px solid rgb(0 0 0 / 10%);
  transition: all 0.2s;
}

.engine-settings:hover {
  background: rgb(0 0 0 / 5%);
}

.engine-settings svg {
  opacity: 0.7;
}

/* 焦点状态 */
.search-input:focus {
  outline: none;
}

.search-container:focus-within {
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgb(79 70 229 / 10%);
}

/* 搜索插件容器 */
</style>
