<script setup>
import { onMounted, ref, watch } from 'vue';

// 接收配置参数
const props = defineProps({
  config: {
    type: Object,
    default: () => ({}),
  },
});

// 定义事件
const emit = defineEmits(['update:config']);

// 快捷启动虚化程度（0-80）
const quickLaunchBlur = ref(20);

// 初始化设置
onMounted(() => {
  const savedBlur = localStorage.getItem('browser-homepage-quicklaunch-blur');
  if (savedBlur) {
    quickLaunchBlur.value = Number.parseInt(savedBlur);
  }
});

// 监听配置变化
watch(
  () => props.config,
  (newConfig) => {
    if (newConfig.quickLaunchBlur !== undefined) {
      quickLaunchBlur.value = newConfig.quickLaunchBlur;
    }
  },
  { immediate: true, deep: true },
);

// 更新快捷启动虚化程度
const updateQuickLaunchBlur = (event) => {
  const newValue = Number.parseInt(event.target.value);
  quickLaunchBlur.value = newValue;

  // 通知父组件配置已更新
  emit('update:config', { quickLaunchBlur: newValue });

  // 保存到本地存储
  localStorage.setItem(
    'browser-homepage-quicklaunch-blur',
    newValue.toString(),
  );

  // 触发事件通知其他组件
  window.dispatchEvent(
    new CustomEvent('quicklaunch-background-changed', {
      detail: { blur: newValue },
    }),
  );
};

// 初始化设置
const initializeSettings = () => {
  const savedBlur = localStorage.getItem('browser-homepage-quicklaunch-blur');
  if (savedBlur) {
    quickLaunchBlur.value = Number.parseInt(savedBlur);
  }
};

// 初始化
initializeSettings();
</script>

<template>
  <div class="quicklaunch-settings">
    <!-- 快捷启动虚化程度设置 -->
    <div class="setting-item">
      <label>虚化程度</label>
      <input
        type="range"
        min="0"
        max="80"
        step="1"
        :value="quickLaunchBlur"
        @input="updateQuickLaunchBlur"
        class="blur-slider"
      />
      <span class="value-display"> {{ quickLaunchBlur }}% </span>
    </div>
  </div>
</template>

<style scoped>
.quicklaunch-settings {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.setting-item {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 10px 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.setting-item label {
  min-width: 80px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #374151;
  white-space: nowrap;
}

.value-display {
  min-width: 30px;
  font-size: 0.75rem;
  color: #6b7280;
  text-align: right;
}

.blur-slider {
  flex: 1;
  height: 4px;
  cursor: pointer;
  outline: none;
  background: #e2e8f0;
  border-radius: 2px;
}

.blur-slider::-webkit-slider-thumb {
  width: 16px;
  height: 16px;
  appearance: none;
  cursor: pointer;
  background: #3b82f6;
  border: 2px solid #fff;
  border-radius: 50%;
  box-shadow: 0 1px 4px rgb(0 0 0 / 20%);
}

.blur-slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}

.blur-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  cursor: pointer;
  background: #3b82f6;
  border: 2px solid #fff;
  border-radius: 50%;
  box-shadow: 0 1px 4px rgb(0 0 0 / 20%);
}
</style>
