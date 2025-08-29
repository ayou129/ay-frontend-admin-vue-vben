<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';

import {
  loadPluginOrder,
  loadPluginSettings,
  loadSpacingSettings,
  saveBottomSpacing,
  savePluginGap,
  savePluginSettings,
  saveTopSpacing,
} from '../../utils/storage.js';
import PoetryPlugin from './poetry/PoetryPlugin.vue';
import QuickLaunch from './quicklaunch/QuickLaunch.vue';
import SearchPlugin from './search/SearchPlugin.vue';
import TimePlugin from './time/TimePlugin.vue';

// 间距配置状态
const topSpacing = ref(0); // 顶部间距 (vh) - 默认值
const bottomSpacing = ref(0); // 底部间距 (vh) - 默认值
const pluginGap = ref(16); // 插件间隔 (px)

// 插件配置数据
const plugins = reactive([
  {
    id: 'time',
    name: '时间插件',
    type: 'time',
    enabled: true,
    order: 0,
    pinToBottom: false, // 是否置底
    pinToTop: false, // 是否置顶
    config: {
      showSeconds: true,
      format24h: true,
    },
  },
  {
    id: 'search',
    name: '搜索栏',
    type: 'search',
    enabled: true,
    order: 1,
    pinToBottom: false, // 是否置底
    pinToTop: false, // 是否置顶
    config: {},
  },
  {
    id: 'poetry',
    name: '古诗词插件',
    type: 'poetry',
    enabled: true,
    order: 2,
    pinToBottom: false, // 是否置底
    pinToTop: false, // 是否置顶
    config: {
      autoRefresh: true,
      refreshInterval: 24 * 60 * 60 * 1000, // 24小时
    },
  },
  {
    id: 'quicklaunch',
    name: '快捷启动栏',
    type: 'quicklaunch',
    enabled: true,
    order: 3,
    pinToBottom: false, // 默认不置底，通过本地存储加载实际设置
    pinToTop: false, // 是否置顶
    config: {
      columns: 2,
      showLabels: true,
    },
  },
]);

// 获取已启用的插件，按置顶和置底优先级以及顺序排列
const enabledPlugins = computed(() => {
  const enabled = plugins.filter((plugin) => plugin.enabled);

  // 分组：置顶插件、普通插件和置底插件
  const topPlugins = enabled.filter((plugin) => plugin.pinToTop);
  const normalPlugins = enabled.filter(
    (plugin) => !plugin.pinToTop && !plugin.pinToBottom,
  );
  const bottomPlugins = enabled.filter((plugin) => plugin.pinToBottom);

  // 各自按order排序
  topPlugins.sort((a, b) => a.order - b.order);
  normalPlugins.sort((a, b) => a.order - b.order);
  bottomPlugins.sort((a, b) => a.order - b.order);

  // 合并：置顶插件在最前，普通插件在中间，置底插件在最后
  return [...topPlugins, ...normalPlugins, ...bottomPlugins];
});

// 获取插件组件
const getPluginComponent = (type) => {
  const componentMap = {
    search: SearchPlugin,
    time: TimePlugin,
    poetry: PoetryPlugin,
    quicklaunch: QuickLaunch,
  };
  return componentMap[type] || 'div';
};

// 加载插件设置
const loadPluginSettingsFromStorage = () => {
  loadPluginSettings(plugins);
  loadPluginOrder(plugins);
};

// 加载间距设置
const loadSpacingSettingsFromStorage = () => {
  const settings = loadSpacingSettings();
  if (settings.topSpacing !== undefined) {
    topSpacing.value = settings.topSpacing;
  }
  if (settings.bottomSpacing !== undefined) {
    bottomSpacing.value = settings.bottomSpacing;
  }
  if (settings.pluginGap !== undefined) {
    pluginGap.value = settings.pluginGap;
  }

  // 应用样式
  applySpacingStyles();
};

// 应用间距样式
const applySpacingStyles = () => {
  const container = document.querySelector('.plugins-grid');
  if (container) {
    // 处理顶部间距
    if (topSpacing.value === 0) {
      container.style.setProperty('--top-spacing', '0vh');
      container.style.setProperty('padding-top', '0');
    } else {
      container.style.setProperty('--top-spacing', `${topSpacing.value}vh`);
      container.style.removeProperty('padding-top');
    }

    // 处理底部间距
    if (bottomSpacing.value === 0) {
      container.style.setProperty('--bottom-spacing', '0vh');
      const quickLaunch = document.querySelector('.plugin-quicklaunch');
      if (quickLaunch) {
        quickLaunch.style.setProperty('margin-bottom', '0');
      }
    } else {
      container.style.setProperty(
        '--bottom-spacing',
        `${bottomSpacing.value}vh`,
      );
      const quickLaunch = document.querySelector('.plugin-quicklaunch');
      if (quickLaunch) {
        quickLaunch.style.removeProperty('margin-bottom');
      }
    }

    container.style.setProperty('--plugin-gap', `${pluginGap.value}px`);
  }
};

// 监听间距配置变更
const handleSpacingChange = (event) => {
  const { type, detail } = event;

  switch (type) {
    case 'bottom-spacing-changed': {
      bottomSpacing.value = detail.spacing;
      saveBottomSpacing(detail.spacing);
      break;
    }
    case 'plugin-gap-changed': {
      pluginGap.value = detail.gap;
      savePluginGap(detail.gap);
      break;
    }
    case 'top-spacing-changed': {
      topSpacing.value = detail.spacing;
      saveTopSpacing(detail.spacing);
      break;
    }
  }

  // 延迟应用样式以确保DOM更新
  setTimeout(() => {
    applySpacingStyles();
  }, 0);
};

// 保存插件设置
const savePluginSettingsToLocal = () => {
  savePluginSettings(plugins);
};

// 监听插件设置变更
const handlePluginSettingsChange = (event) => {
  const { pluginId, enabled } = event.detail || {};
  const plugin = plugins.find((p) => p.id === pluginId);
  // 搜索栏插件不能禁用
  if (plugin && plugin.id !== 'search') {
    plugin.enabled = enabled;
    savePluginSettingsToLocal();
  }
};

// 监听插件置顶/置底状态变更
const handlePluginPinChange = (event) => {
  const { plugins: updatedPlugins } = event.detail || {};

  if (updatedPlugins) {
    // 更新所有插件的置顶/置底状态
    updatedPlugins.forEach((updatedPlugin) => {
      const plugin = plugins.find((p) => p.id === updatedPlugin.id);
      if (plugin) {
        plugin.pinToTop = updatedPlugin.pinToTop || false;
        plugin.pinToBottom = updatedPlugin.pinToBottom || false;
      }
    });
  } else {
    // 向后兼容旧版事件格式
    const { pluginId, pinToBottom } = event.detail || {};
    const plugin = plugins.find((p) => p.id === pluginId);
    if (plugin) {
      plugin.pinToBottom = pinToBottom;
    }
  }
};

// 监听插件顺序变更
const handlePluginOrderChange = (event) => {
  const { plugins: updatedPlugins } = event.detail || {};
  if (updatedPlugins && updatedPlugins.length > 0) {
    // 更新插件顺序
    updatedPlugins.forEach((updatedPlugin, index) => {
      const plugin = plugins.find((p) => p.id === updatedPlugin.id);
      if (plugin) {
        plugin.order = index;
      }
    });
    savePluginSettingsToLocal();
  }
};

// 切换插件状态
const togglePlugin = (pluginId, enabled) => {
  const plugin = plugins.find((p) => p.id === pluginId);
  // 搜索栏插件不能禁用
  if (plugin && plugin.id !== 'search') {
    plugin.enabled = enabled;
    savePluginSettingsToLocal();
  }
};

// 更新插件配置
const updatePluginConfig = (pluginId, config) => {
  const plugin = plugins.find((p) => p.id === pluginId);
  if (plugin) {
    plugin.config = { ...plugin.config, ...config };
    savePluginSettingsToLocal();
  }
};

// 更新插件置底状态
const updatePluginPinToBottom = (pluginId, pinToBottom) => {
  const plugin = plugins.find((p) => p.id === pluginId);
  if (plugin) {
    plugin.pinToBottom = pinToBottom;
    savePluginSettingsToLocal();
  }
};

// 更新插件顺序
const updatePluginOrder = (pluginId, order) => {
  const plugin = plugins.find((p) => p.id === pluginId);
  if (plugin) {
    plugin.order = order;
    savePluginSettingsToLocal();
  }
};

// 暴露插件数据和方法供父组件使用
defineExpose({
  plugins,
  togglePlugin,
  updatePluginConfig,
  updatePluginPinToBottom,
  updatePluginOrder,
});

onMounted(() => {
  loadPluginSettingsFromStorage();
  loadSpacingSettingsFromStorage();

  // 监听插件设置变更事件
  window.addEventListener(
    'plugin-settings-changed',
    handlePluginSettingsChange,
  );

  // 监听插件置顶/置底状态变更事件
  window.addEventListener('plugin-pin-changed', handlePluginPinChange);

  // 监听插件顺序变更事件
  window.addEventListener('plugin-order-changed', handlePluginOrderChange);

  // 监听间距配置变更事件
  window.addEventListener('top-spacing-changed', handleSpacingChange);
  window.addEventListener('bottom-spacing-changed', handleSpacingChange);
  window.addEventListener('plugin-gap-changed', handleSpacingChange);
});

onUnmounted(() => {
  // 移除事件监听
  window.removeEventListener(
    'plugin-settings-changed',
    handlePluginSettingsChange,
  );
  window.removeEventListener('plugin-pin-changed', handlePluginPinChange);
  window.removeEventListener('plugin-order-changed', handlePluginOrderChange);
  window.removeEventListener('top-spacing-changed', handleSpacingChange);
  window.removeEventListener('bottom-spacing-changed', handleSpacingChange);
  window.removeEventListener('plugin-gap-changed', handleSpacingChange);
});
</script>

<template>
  <div class="plugin-container">
    <!-- 插件网格 -->
    <div class="plugins-grid">
      <div
        v-for="plugin in enabledPlugins"
        :key="plugin.id"
        class="plugin-wrapper"
        :class="[
          `plugin-${plugin.type}`,
          { 'plugin-pinned-to-bottom': plugin.pinToBottom },
        ]"
      >
        <!-- 插件内容 -->
        <component
          :is="getPluginComponent(plugin.type)"
          :config="plugin.config"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 响应式设计 */
@media (max-width: 768px) {
  .plugins-grid {
    padding-top: calc(var(--top-spacing) * 0.5); /* 移动端减少顶部间距 */
    padding-right: 16px;
    padding-left: 16px;
  }

  .plugin-wrapper:not(.plugin-pinned-to-bottom) {
    margin-bottom: calc(var(--plugin-gap) * 0.875); /* 移动端稍微减少插件间距 */
  }

  .plugin-wrapper.plugin-pinned-to-bottom {
    margin-bottom: calc(var(--bottom-spacing) * 0.5); /* 使用底部间距变量 */
  }
}

@media (max-width: 480px) {
  .plugins-grid {
    padding-top: calc(var(--top-spacing) * 0.3); /* 小屏幕最小化顶部间距 */
    padding-right: 12px;
    padding-left: 12px;
  }

  .plugin-wrapper:not(.plugin-pinned-to-bottom) {
    margin-bottom: calc(var(--plugin-gap) * 0.75); /* 小屏幕最小化插件间隔 */
  }

  .plugin-wrapper.plugin-pinned-to-bottom {
    margin-bottom: calc(var(--bottom-spacing) * 0.3); /* 使用底部间距变量 */
  }
}

.plugin-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%; /* 确保容器有明确的高度 */
}

/* 插件网格布局 */
.plugins-grid {
  --top-spacing: 0vh;
  --bottom-spacing: 0vh;
  --plugin-gap: 16px;

  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding-top: var(--top-spacing); /* 使用顶部间距变量 */
}

/* 插件包装器基础样式 */
.plugin-wrapper {
  width: 100%;
  max-width: 1000px;
  margin-right: auto;
  margin-left: auto;
}

/* 普通插件间距 */
.plugin-wrapper:not(.plugin-pinned-to-bottom) {
  margin-bottom: var(--plugin-gap); /* 使用可配置的插件间隔 */
}

/* 置底插件样式 */
.plugin-wrapper.plugin-pinned-to-bottom {
  margin-top: auto; /* 自动推到底部 */
  margin-bottom: var(--bottom-spacing); /* 使用底部间距变量 */
}

/* 插件容器 */
</style>
