<script setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue';

import {
  loadPluginOrder,
  loadPluginSettings,
  loadSearchEngineSettings,
  loadSpacingSettings,
  loadThemeSettings,
  saveBackground,
  saveBackgroundColor,
  saveBackgroundMode,
  saveBottomSpacing,
  saveDefaultSearchEngine,
  saveMaskOpacity,
  savePluginGap,
  savePluginOrderToStorage,
  savePluginSettings,
  saveQuickLaunchBlur,
  saveSearchEngineOrder,
  saveTopSpacing,
} from '../../utils/storage.js';
import LayoutSettings from './LayoutSettings.vue';
// 导入独立的子组件
import PluginManager from './PluginManager.vue';
import QuickLaunchSettings from './QuickLaunchSettings.vue';
import SearchEngineSettings from './SearchEngineSettings.vue';
import ThemeSettings from './ThemeSettings.vue';

// 定义事件
const emit = defineEmits(['close', 'toggle-plugin']);

// 插件列表
const pluginList = reactive([
  {
    id: 'search',
    name: '搜索栏',
    description: '搜索功能是起始页的核心功能',
    enabled: true,
    pinToTop: true,
    pinToBottom: false,
  },
  {
    id: 'time',
    name: '时间插件',
    description: '显示当前时间和日期',
    enabled: true,
    pinToTop: false,
    pinToBottom: false,
  },
  {
    id: 'poetry',
    name: '古诗词插件',
    description: '随机显示古诗词作品',
    enabled: true,
    pinToTop: false,
    pinToBottom: false,
  },
  {
    id: 'quicklaunch',
    name: '快捷启动栏',
    description: '快速访问常用网站和功能',
    enabled: true,
    pinToTop: false,
    pinToBottom: true,
  },
]);

// 搜索引擎列表
const searchEngines = reactive([
  {
    id: 'baidu',
    name: '百度',
    icon: '/assets/icons/baidu.svg',
    url: 'https://www.baidu.com/s?wd=',
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

// 背景图片列表
const backgrounds = [
  '/assets/backgrounds/bg1.jpg',
  '/assets/backgrounds/bg2.jpg',
  '/assets/backgrounds/bg3.jpg',
  '/assets/backgrounds/bg4.jpg',
  '/assets/backgrounds/bg5.jpg',
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
];

// 当前背景
const currentBackground = ref('/assets/backgrounds/bg1.jpg');

// 设置状态
const defaultSearchEngine = ref('baidu');

// 主题设置
const themeSettings = reactive({
  backgroundMode: 'image',
  backgroundColor: '#1e40af',
  maskOpacity: 0.3,
});

// 默认主题设置
const defaultThemeSettings = {
  backgroundMode: 'image',
  backgroundColor: '#1e40af',
  maskOpacity: 0.3,
};

// 间距配置状态
const topSpacing = ref(1); // 顶部间距 (vh)
const bottomSpacing = ref(0); // 底部间距 (vh)，默认值改为0
const pluginGap = ref(50); // 插件间隔 (px)
const quickLaunchBlur = ref(20); // 快捷启动虚化程度 (0-80)

// 传递给子组件的配置对象
const searchEngineConfig = reactive({
  defaultEngine: defaultSearchEngine,
  engines: searchEngines,
});

const layoutConfig = reactive({
  topSpacing,
  bottomSpacing,
  pluginGap,
});

const quickLaunchConfig = reactive({
  quickLaunchBlur,
});

const themeConfig = reactive({
  settings: themeSettings,
  backgrounds,
  currentBackground,
});

// 更新搜索引擎配置
const updateSearchEngineConfig = (newConfig) => {
  // 这里可以处理来自子组件的配置更新
  Object.assign(searchEngineConfig, newConfig);
};

// 更新布局配置
const updateLayoutConfig = (newConfig) => {
  // 这里可以处理来自子组件的配置更新
  Object.assign(layoutConfig, newConfig);
};

// 更新快捷启动配置
const updateQuickLaunchConfig = (newConfig) => {
  // 这里可以处理来自子组件的配置更新
  Object.assign(quickLaunchConfig, newConfig);
};

// 更新主题配置
const updateThemeConfig = (newConfig) => {
  // 这里可以处理来自子组件的配置更新
  Object.assign(themeConfig, newConfig);
};

// 切换插件状态
const togglePlugin = (plugin) => {
  // 发出事件让父组件处理
  emit('toggle-plugin', plugin);
};

// 移动插件顺序
const movePlugin = (index, direction) => {
  const newIndex = index + direction;
  if (newIndex < 0 || newIndex >= pluginList.length) return;

  // 交换位置
  const temp = pluginList[index];
  pluginList[index] = pluginList[newIndex];
  pluginList[newIndex] = temp;

  // 更新order属性
  pluginList[index].order = index;
  pluginList[newIndex].order = newIndex;

  // 保存新顺序到本地存储
  savePluginOrderToStorage(pluginList);

  // 保存插件设置
  savePluginSettings(pluginList);

  // 触发插件顺序更新事件
  window.dispatchEvent(
    new CustomEvent('plugin-order-changed', {
      detail: { plugins: pluginList },
    }),
  );
};

// 保存插件顺序
const savePluginOrder = () => {
  // 保存插件顺序到本地存储
  savePluginOrderToStorage(pluginList);

  // 触发插件顺序更新事件
  window.dispatchEvent(
    new CustomEvent('plugin-order-changed', {
      detail: { plugins: pluginList },
    }),
  );
};

// 置顶插件
const togglePinPluginToTop = (plugin) => {
  // 如果已经是置底状态，先取消置底
  if (plugin.pinToBottom) {
    plugin.pinToBottom = false;
  }

  const oldState = plugin.pinToTop;

  // 如果要将插件置顶
  if (oldState) {
    // 取消置顶
    plugin.pinToTop = false;
  } else {
    // 先取消其他已置顶的插件
    pluginList.forEach((p) => {
      if (p.id !== plugin.id && p.pinToTop) {
        p.pinToTop = false;
      }
    });

    plugin.pinToTop = true;

    // 移动到顶部（在所有非置顶插件的最前面，但要在置顶插件之后）
    const index = pluginList.findIndex((p) => p.id === plugin.id);
    if (index > 0) {
      // 找到第一个非置顶插件的位置
      let insertIndex = 0;
      // 跳过所有置顶插件
      while (
        insertIndex < pluginList.length &&
        pluginList[insertIndex].pinToTop
      ) {
        insertIndex++;
      }

      // 如果当前插件不在正确位置，则移动它
      if (index !== insertIndex) {
        const [removed] = pluginList.splice(index, 1);
        pluginList.splice(insertIndex, 0, removed);
      }
    }
  }

  // 保存插件设置到本地存储
  savePluginSettings(pluginList);

  // 触发插件顺序更新事件
  window.dispatchEvent(
    new CustomEvent('plugin-order-changed', {
      detail: { plugins: pluginList },
    }),
  );
};

// 置底插件
const togglePinPluginToBottom = (plugin) => {
  // 如果已经置顶，则先取消置顶
  if (plugin.pinToTop) {
    plugin.pinToTop = false;
  }

  // 切换置底状态
  plugin.pinToBottom = !plugin.pinToBottom;

  // 保存插件设置到本地存储
  savePluginSettings(pluginList);

  // 触发插件置底状态更新事件
  window.dispatchEvent(
    new CustomEvent('plugin-pin-changed', {
      detail: { plugins: pluginList },
    }),
  );
};

// 调整插件顺序，确保置顶的在最上面，置底的在最下面
const adjustPluginOrder = () => {
  // 找出置顶和置底的插件
  const topPlugins = pluginList.filter((p) => p.pinToTop);
  const bottomPlugins = pluginList.filter((p) => p.pinToBottom);
  const normalPlugins = pluginList.filter((p) => !p.pinToTop && !p.pinToBottom);

  // 重新排列
  const newOrder = [...topPlugins, ...normalPlugins, ...bottomPlugins];

  if (newOrder.length === pluginList.length) {
    pluginList.splice(0, pluginList.length, ...newOrder);
  }
};

// 检查是否应该禁用上移按钮
const shouldDisableMoveUp = (index) => {
  // 如果是第一个插件，或者上一个插件是置顶的，或者当前插件是置顶的，则禁用
  if (index === 0) return true;
  if (pluginList[index].pinToTop) return true;
  if (pluginList[index - 1].pinToTop) return true;
  return false;
};

// 检查是否应该禁用下移按钮
const shouldDisableMoveDown = (index) => {
  // 如果是最后一个插件，或者下一个插件是置底的，或者当前插件是置底的，则禁用
  if (index === pluginList.length - 1) return true;
  if (pluginList[index].pinToBottom) return true;
  if (pluginList[index + 1].pinToBottom) return true;
  return false;
};

// 更新默认搜索引擎
const updateDefaultEngine = () => {
  saveDefaultSearchEngine(defaultSearchEngine.value);

  // 触发搜索引擎更新事件
  window.dispatchEvent(
    new CustomEvent('search-engine-changed', {
      detail: { defaultEngine: defaultSearchEngine.value },
    }),
  );
};

// 移动搜索引擎顺序
const moveEngine = (index, direction) => {
  const newIndex = index + direction;
  if (newIndex < 0 || newIndex >= searchEngines.length) return;

  // 交换位置
  const temp = searchEngines[index];
  searchEngines[index] = searchEngines[newIndex];
  searchEngines[newIndex] = temp;

  // 保存新顺序
  saveSearchEngineOrder(searchEngines);

  // 触发搜索引擎顺序更新事件
  window.dispatchEvent(
    new CustomEvent('search-engine-order-changed', {
      detail: { engines: searchEngines },
    }),
  );
};

// 更新顶部间距
const updateTopSpacing = () => {
  saveTopSpacing(topSpacing.value);

  // 触发顶部间距更新事件
  window.dispatchEvent(
    new CustomEvent('top-spacing-changed', {
      detail: { spacing: topSpacing.value },
    }),
  );
};

// 更新底部间距
const updateBottomSpacing = () => {
  saveBottomSpacing(bottomSpacing.value);

  // 触发底部间距更新事件
  window.dispatchEvent(
    new CustomEvent('bottom-spacing-changed', {
      detail: { spacing: bottomSpacing.value },
    }),
  );
};

// 更新插件间隔
const updatePluginGap = () => {
  savePluginGap(pluginGap.value);

  // 触发插件间隔更新事件
  window.dispatchEvent(
    new CustomEvent('plugin-gap-changed', {
      detail: { gap: pluginGap.value },
    }),
  );
};

// 监听快捷启动背景配置变更
const handleQuickLaunchBackgroundChange = (event) => {
  const { blur } = event.detail;
  quickLaunchBlur.value = blur;

  // 保存到本地存储
  saveQuickLaunchBlur(blur);
};

// 更新背景模式
const updateBackgroundMode = () => {
  saveBackgroundMode(themeSettings.backgroundMode);

  switch (themeSettings.backgroundMode) {
    case 'color': {
      // 通知主布局更新背景
      window.dispatchEvent(
        new CustomEvent('background-mode-changed', {
          detail: { mode: 'color', color: themeSettings.backgroundColor },
        }),
      );

      break;
    }
    case 'gradient': {
      // 通知主布局更新背景
      window.dispatchEvent(
        new CustomEvent('background-mode-changed', {
          detail: { mode: 'gradient' },
        }),
      );

      break;
    }
    case 'image': {
      // 通知主布局更新背景
      window.dispatchEvent(
        new CustomEvent('background-mode-changed', {
          detail: { mode: 'image' },
        }),
      );

      break;
    }
    // No default
  }
};

// 更新背景颜色
const updateBackgroundColor = () => {
  saveBackgroundColor(themeSettings.backgroundColor);
  if (themeSettings.backgroundMode === 'color') {
    // 通知主布局更新背景
    window.dispatchEvent(
      new CustomEvent('background-color-changed', {
        detail: { color: themeSettings.backgroundColor },
      }),
    );
  }
};

// 更新遮罩透明度
const updateMaskOpacity = () => {
  saveMaskOpacity(themeSettings.maskOpacity);

  // 通知主布局更新遮罩透明度
  window.dispatchEvent(
    new CustomEvent('mask-opacity-changed', {
      detail: { opacity: themeSettings.maskOpacity },
    }),
  );
};

// 选择背景图片
const selectBackgroundImage = (imageUrl) => {
  currentBackground.value = imageUrl;

  // 保存选择到本地存储
  saveBackground(imageUrl);

  // 触发背景更新事件
  window.dispatchEvent(
    new CustomEvent('background-image-selected', {
      detail: { imageUrl },
    }),
  );
};

// 恢复主题设置默认值
const restoreThemeDefaults = () => {
  // 恢复主题设置为默认值
  themeSettings.backgroundMode = defaultThemeSettings.backgroundMode;
  themeSettings.backgroundColor = defaultThemeSettings.backgroundColor;
  themeSettings.maskOpacity = defaultThemeSettings.maskOpacity;

  // 保存默认设置到本地存储
  saveBackgroundMode(defaultThemeSettings.backgroundMode);
  saveBackgroundColor(defaultThemeSettings.backgroundColor);
  saveMaskOpacity(defaultThemeSettings.maskOpacity);

  // 通知主布局更新背景和遮罩透明度
  if (defaultThemeSettings.backgroundMode === 'color') {
    window.dispatchEvent(
      new CustomEvent('background-mode-changed', {
        detail: { mode: 'color', color: defaultThemeSettings.backgroundColor },
      }),
    );
  } else if (defaultThemeSettings.backgroundMode === 'image') {
    window.dispatchEvent(
      new CustomEvent('background-mode-changed', {
        detail: { mode: 'image' },
      }),
    );
  }

  // 通知主布局更新遮罩透明度
  window.dispatchEvent(
    new CustomEvent('mask-opacity-changed', {
      detail: { opacity: defaultThemeSettings.maskOpacity },
    }),
  );
};

// 初始化设置
const initializeSettings = () => {
  // 加载主题设置
  const themeSettings = loadThemeSettings();
  if (themeSettings.background) {
    currentBackground.value = themeSettings.background;
  }

  // 加载插件设置
  loadPluginSettings(pluginList);

  // 加载插件顺序
  loadPluginOrder(pluginList);

  // 确保置顶的插件在最上面，置底的插件在最下面
  adjustPluginOrder();

  // 加载搜索引擎设置
  const searchSettings = loadSearchEngineSettings();
  if (searchSettings.defaultEngine) {
    defaultSearchEngine.value = searchSettings.defaultEngine;
  }

  // 加载搜索引擎顺序
  if (searchSettings.engineOrder) {
    const reorderedEngines = [];
    searchSettings.engineOrder.forEach((id) => {
      const engine = searchEngines.find((e) => e.id === id);
      if (engine) reorderedEngines.push(engine);
    });
    if (reorderedEngines.length === searchEngines.length) {
      searchEngines.splice(0, searchEngines.length, ...reorderedEngines);
    }
  }

  // 加载间距设置
  const spacingSettings = loadSpacingSettings();
  if (spacingSettings.topSpacing !== undefined) {
    topSpacing.value = spacingSettings.topSpacing;
  }
  if (spacingSettings.bottomSpacing !== undefined) {
    bottomSpacing.value = spacingSettings.bottomSpacing;
  }
  if (spacingSettings.pluginGap !== undefined) {
    pluginGap.value = spacingSettings.pluginGap;
  }

  if (spacingSettings.quickLaunchBlur !== undefined) {
    quickLaunchBlur.value = spacingSettings.quickLaunchBlur;
  }

  // 初始化主题设置
  const themeSettingsData = loadThemeSettings();
  if (themeSettingsData.backgroundMode) {
    themeSettings.backgroundMode = themeSettingsData.backgroundMode;
  }
  if (themeSettingsData.backgroundColor) {
    themeSettings.backgroundColor = themeSettingsData.backgroundColor;
  }
  if (themeSettingsData.maskOpacity !== undefined) {
    themeSettings.maskOpacity = themeSettingsData.maskOpacity;
  }
};

// 处理打开搜索设置事件
const handleOpenSearchSettings = () => {
  // 这个事件处理程序负责显示设置面板并切换到搜索引擎设置部分
  // 由于设置面板已经打开，所以不需要额外操作
  console.log('搜索引擎设置已打开');
};

// 处理键盘事件
const handleKeyDown = (event) => {
  // 按ESC键关闭设置面板
  if (event.key === 'Escape') {
    emit('close');
  }
};

// 监听自定义事件
onMounted(() => {
  // 加载设置
  loadPluginSettings(pluginList);
  loadPluginOrder(pluginList);
  adjustPluginOrder();

  // 监听事件...
  window.addEventListener('open-search-settings', handleOpenSearchSettings);
  window.addEventListener(
    'quicklaunch-background-changed',
    handleQuickLaunchBackgroundChange,
  );

  // 处理ESC键...
  document.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  // 移除事件监听
  window.removeEventListener('open-search-settings', handleOpenSearchSettings);
  window.removeEventListener(
    'quicklaunch-background-changed',
    handleQuickLaunchBackgroundChange,
  );
  document.removeEventListener('keydown', handleKeyDown);
});
</script>

<template>
  <div class="system-panel">
    <div class="theme-content">
      <div class="theme-header">
        <h2>设置</h2>
        <button class="close-btn" @click="$emit('close')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
            />
          </svg>
        </button>
      </div>

      <div class="theme-body">
        <!-- 插件管理 -->
        <div class="settings-section">
          <PluginManager
            :plugin-list="pluginList"
            @move-plugin="movePlugin"
            @toggle-plugin="$emit('toggle-plugin', $event)"
            @toggle-pin-plugin-to-top="togglePinPluginToTop"
            @toggle-pin-plugin-to-bottom="togglePinPluginToBottom"
            @should-disable-move-up="shouldDisableMoveUp"
            @should-disable-move-down="shouldDisableMoveDown"
          />
        </div>

        <!-- 搜索引擎偏好 -->
        <div class="settings-section">
          <h3>搜索引擎偏好</h3>
          <SearchEngineSettings
            :config="searchEngineConfig"
            @update:config="updateSearchEngineConfig"
          />
        </div>

        <!-- 页面布局设置 -->
        <div class="settings-section">
          <h3>页面布局</h3>
          <LayoutSettings
            :config="layoutConfig"
            @update:config="updateLayoutConfig"
          />
        </div>

        <!-- 快捷启动设置 -->
        <div class="settings-section">
          <h3>快捷启动设置</h3>
          <QuickLaunchSettings
            :config="quickLaunchConfig"
            @update:config="updateQuickLaunchConfig"
          />
        </div>

        <!-- 主题设置 -->
        <div class="settings-section">
          <div class="section-header">
            <h3>主题设置</h3>
            <button class="restore-btn" @click="restoreThemeDefaults">
              恢复默认
            </button>
          </div>
          <ThemeSettings
            :config="themeConfig"
            @update:config="updateThemeConfig"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 480px) {
  .system-panel {
    width: 100%; /* 在小屏幕上占据全宽 */
  }
}

.system-panel {
  position: fixed;
  top: 0;
  right: 0; /* 仅固定在右侧，不覆盖整个页面 */
  z-index: 2000;
  display: flex;
  justify-content: flex-end;
  width: 360px; /* 固定宽度 */
  height: 100%;
}

/* 主题面板内容 */
.theme-content {
  display: flex;
  flex-direction: column;
  width: 100%; /* 宽度设置为100%，填充父容器 */
  height: 100%;
  background: white;
  box-shadow: -2px 0 20px rgb(0 0 0 / 15%); /* 添加阴影效果 */
}

/* 主题面板头部 */
.theme-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.theme-header h2 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
  color: #374151;
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  color: #6b7280;
  cursor: pointer;
  background: none;
  border: none;
  border-radius: 6px;
  transition: background 0.2s;
}

.close-btn:hover {
  color: #374151;
  background: rgb(0 0 0 / 5%);
}

/* 主题面板主体 */
.theme-body {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 6px;
  margin: 0 0 12px;
  font-size: 0.9rem;
  font-weight: 500;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
}

.section-header h3 {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 500;
  color: #374151;
}

.restore-btn {
  padding: 4px 8px;
  font-size: 0.75rem;
  color: #6b7280;
  cursor: pointer;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.restore-btn:hover {
  color: #374151;
  background: #e5e7eb;
}

/* 设置面板 */
</style>
