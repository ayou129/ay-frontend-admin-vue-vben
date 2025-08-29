<script setup>
import { reactive, ref } from 'vue';

// 接收配置参数
const props = defineProps({
  config: {
    type: Object,
    default: () => ({}),
  },
});

// 定义事件
const emit = defineEmits(['update:config']);

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

// 默认搜索引擎
const defaultEngine = ref('baidu');

// 更新默认搜索引擎
const updateDefaultEngine = (event) => {
  const newDefault = event.target.value;
  defaultEngine.value = newDefault;

  // 保存到本地存储
  localStorage.setItem('browser-homepage-default-search-engine', newDefault);

  // 触发事件通知其他组件
  window.dispatchEvent(new CustomEvent('search-engine-changed'));
};

// 上移搜索引擎
const moveEngineUp = (index) => {
  if (index > 0) {
    const temp = searchEngines[index];
    searchEngines[index] = searchEngines[index - 1];
    searchEngines[index - 1] = temp;

    // 保存顺序到本地存储
    saveEngineOrder();
  }
};

// 下移搜索引擎
const moveEngineDown = (index) => {
  if (index < searchEngines.length - 1) {
    const temp = searchEngines[index];
    searchEngines[index] = searchEngines[index + 1];
    searchEngines[index + 1] = temp;

    // 保存顺序到本地存储
    saveEngineOrder();
  }
};

// 保存搜索引擎顺序
const saveEngineOrder = () => {
  const orderIds = searchEngines.map((engine) => engine.id);
  localStorage.setItem(
    'browser-homepage-search-engine-order',
    JSON.stringify(orderIds),
  );

  // 触发事件通知其他组件
  window.dispatchEvent(new CustomEvent('search-engine-order-changed'));
};
</script>

<template>
  <div class="search-engine-settings">
    <!-- 默认搜索引擎设置 -->
    <div class="default-engine">
      <label>默认搜索引擎</label>
      <select :value="defaultEngine" @change="updateDefaultEngine">
        <option
          v-for="engine in searchEngines"
          :key="engine.id"
          :value="engine.id"
        >
          {{ engine.name }}
        </option>
      </select>
    </div>

    <!-- 搜索引擎排序 -->
    <div class="engine-list">
      <h4>搜索引擎排序</h4>
      <div
        v-for="(engine, index) in searchEngines"
        :key="engine.id"
        class="engine-item"
      >
        <img :src="engine.icon" :alt="engine.name" class="engine-icon" />
        <span class="engine-name">{{ engine.name }}</span>
        <div class="engine-actions">
          <button
            class="move-btn"
            :disabled="index === 0"
            @click="moveEngineUp(index)"
          >
            ↑
          </button>
          <button
            class="move-btn"
            :disabled="index === searchEngines.length - 1"
            @click="moveEngineDown(index)"
          >
            ↓
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 搜索引擎设置样式 */
.search-engine-settings {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.default-engine {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 10px 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.default-engine label {
  font-size: 0.85rem;
  font-weight: 500;
  color: #374151;
  white-space: nowrap;
}

.default-engine select {
  flex: 1;
  padding: 6px 8px;
  font-size: 0.8rem;
  color: #374151;
  cursor: pointer;
  outline: none;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
}

.default-engine select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 10%);
}

.engine-list h4 {
  margin: 0 0 10px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #374151;
}

.engine-item {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 8px 12px;
  margin-bottom: 6px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.engine-item:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
  transform: translateY(-1px);
}

.engine-icon {
  width: 18px;
  height: 18px;
  object-fit: contain;
}

.engine-name {
  flex: 1;
  font-size: 0.8rem;
  font-weight: 500;
  color: #374151;
}

.engine-actions {
  display: flex;
  gap: 4px;
}

.move-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  font-size: 0.8rem;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.move-btn:hover:not(:disabled) {
  color: #374151;
  background: #e5e7eb;
}

.move-btn:disabled {
  cursor: not-allowed;
  opacity: 0.3;
}
</style>
