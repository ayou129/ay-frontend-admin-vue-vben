<script setup>
import { ref } from 'vue';

// 接收配置参数
const props = defineProps({
  config: {
    type: Object,
    default: () => ({}),
  },
});

// 定义事件
const emit = defineEmits(['update:config']);

// 间距配置状态
const topSpacing = ref(0); // 顶部间距 (vh)
const bottomSpacing = ref(0); // 底部间距 (vh)
const pluginGap = ref(16); // 插件间隔 (px)

// 更新顶部间距
const updateTopSpacing = (event) => {
  const newValue = Number.parseFloat(event.target.value);
  topSpacing.value = newValue;

  // 保存到本地存储
  localStorage.setItem('browser-homepage-top-spacing', newValue.toString());

  // 触发事件通知其他组件
  window.dispatchEvent(
    new CustomEvent('top-spacing-changed', {
      detail: { spacing: newValue },
    }),
  );
};

// 更新底部间距
const updateBottomSpacing = (event) => {
  const newValue = Number.parseFloat(event.target.value);
  bottomSpacing.value = newValue;

  // 保存到本地存储
  localStorage.setItem('browser-homepage-bottom-spacing', newValue.toString());

  // 触发事件通知其他组件
  window.dispatchEvent(
    new CustomEvent('bottom-spacing-changed', {
      detail: { spacing: newValue },
    }),
  );
};

// 更新插件间隔
const updatePluginGap = (event) => {
  const newValue = Number.parseInt(event.target.value);
  pluginGap.value = newValue;

  // 保存到本地存储
  localStorage.setItem('browser-homepage-plugin-gap', newValue.toString());

  // 触发事件通知其他组件
  window.dispatchEvent(
    new CustomEvent('plugin-gap-changed', {
      detail: { gap: newValue },
    }),
  );
};
</script>

<template>
  <div class="layout-settings">
    <!-- 顶部间距设置 -->
    <div class="spacing-setting">
      <label>顶部间距</label>
      <input
        type="range"
        min="0"
        max="20"
        step="0.5"
        :value="topSpacing"
        @input="updateTopSpacing"
        class="spacing-slider"
      />
      <span class="value-display"> {{ topSpacing }}vh </span>
    </div>

    <!-- 底部间距设置 -->
    <div class="spacing-setting">
      <label>底部间距</label>
      <input
        type="range"
        min="0"
        max="20"
        step="0.5"
        :value="bottomSpacing"
        @input="updateBottomSpacing"
        class="spacing-slider"
      />
      <span class="value-display"> {{ bottomSpacing }}vh </span>
    </div>

    <!-- 插件间隔设置 -->
    <div class="spacing-setting">
      <label>插件间隔</label>
      <input
        type="range"
        min="0"
        max="150"
        step="1"
        :value="pluginGap"
        @input="updatePluginGap"
        class="spacing-slider"
      />
      <span class="value-display"> {{ pluginGap }}px </span>
    </div>
  </div>
</template>

<style scoped>
/* 页面布局设置样式 */
.layout-settings {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.spacing-setting {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 10px 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.spacing-setting label {
  min-width: 80px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #374151;
  white-space: nowrap;
}

/* 数值显示样式 */
.value-display {
  min-width: 30px;
  font-size: 0.75rem; /* 调小字体大小 */
  color: #6b7280;
  text-align: right;
}

/* 特定值的字体大小调整 */
.value-zero,
.value-max {
  font-size: 0.75rem;
  color: #6b7280;
}

.spacing-slider {
  flex: 1;
  height: 4px;
  cursor: pointer;
  outline: none;
  background: #e2e8f0;
  border-radius: 2px;
}

.spacing-slider::-webkit-slider-thumb {
  width: 16px;
  height: 16px;
  appearance: none;
  cursor: pointer;
  background: #3b82f6;
  border: 2px solid #fff;
  border-radius: 50%;
  box-shadow: 0 1px 4px rgb(0 0 0 / 20%);
}

.spacing-slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}

.spacing-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  cursor: pointer;
  background: #3b82f6;
  border: 2px solid #fff;
  border-radius: 50%;
  box-shadow: 0 1px 4px rgb(0 0 0 / 20%);
}
</style>
