<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

import PluginContainer from '../plugins/PluginContainer.vue';
import SettingsPanel from '../settings/SettingsPanel.vue';

// 设置面板显示状态
const showSettings = ref(false);
const pluginContainer = ref(null);

// 背景图片配置
const backgrounds = [
  '/assets/bgimg/pexels-christian-heitz-285904-842711.jpg',
  '/assets/bgimg/pexels-eberhardgross-1624496.jpg',
  // 默认渐变背景
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
];

// 当前背景
const currentBackground = ref('');

// 初始化背景
const initBackground = () => {
  // 只在客户端执行的操作
  if (process.client) {
    // 检查本地存储
    const saved = localStorage.getItem('browser-homepage-background');

    if (saved) {
      currentBackground.value = saved;

      // 根据背景类型设置样式
      applyBackground(saved);
    } else {
      // 使用默认背景
      const defaultBg = backgrounds[0]; // 默认使用第一张图片背景
      currentBackground.value = defaultBg;
      localStorage.setItem('browser-homepage-background', defaultBg);

      // 应用默认背景
      applyBackground(defaultBg);
    }
  }
};

// 应用背景样式
const applyBackground = (bg) => {
  if (!process.client) return;

  // 获取根元素
  const root = document.documentElement;
  const mainLayout = document.querySelector('.main-layout');
  if (!root || !mainLayout) return;

  // 清除所有背景相关的样式
  mainLayout.style.background = '';
  mainLayout.style.backgroundColor = '';
  mainLayout.style.backgroundImage = '';

  // 根据背景类型应用样式
  if (bg.includes('linear-gradient')) {
    // 渐变背景
    mainLayout.style.background = bg;
  } else if (bg.startsWith('#')) {
    // 颜色值
    mainLayout.style.backgroundColor = bg;
  } else {
    // 图片URL
    mainLayout.style.backgroundImage = `url(${bg})`;
  }
};

// 切换背景
const changeBackground = (bgUrl) => {
  if (!process.client) return;

  currentBackground.value = bgUrl;
  localStorage.setItem('browser-homepage-background', bgUrl);
  applyBackground(bgUrl);
};

// 打开设置面板
const openSettings = () => {
  showSettings.value = true;
};

// 关闭设置面板
const closeSettings = () => {
  showSettings.value = false;
};

// 处理插件开关事件
const handleTogglePlugin = (plugin) => {
  // 保存插件设置到本地存储
  if (pluginContainer.value) {
    // 通过PluginContainer暴露的方法更新插件状态
    pluginContainer.value.togglePlugin(plugin.id, plugin.enabled);
  }

  // 触发插件设置更新事件
  window.dispatchEvent(
    new CustomEvent('plugin-settings-changed', {
      detail: { pluginId: plugin.id, enabled: plugin.enabled },
    }),
  );
};

// 监听打开搜索引擎设置事件
const handleOpenSearchSettings = () => {
  openSettings();
};

// 监听背景相关设置更新
const handleBackgroundUpdate = (event) => {
  if (!process.client) return;

  const { mode, color } = event.detail || {};

  if (mode === 'color' && color) {
    currentBackground.value = color;
    localStorage.setItem('browser-homepage-background', color);
    applyBackground(color);
  } else if (mode === 'image') {
    // 使用第一张图片作为默认背景
    const defaultImg = backgrounds[0];
    currentBackground.value = defaultImg;
    localStorage.setItem('browser-homepage-background', defaultImg);
    applyBackground(defaultImg);
  } else if (mode === 'gradient') {
    // 使用渐变背景
    const gradientBg = backgrounds[2];
    currentBackground.value = gradientBg;
    localStorage.setItem('browser-homepage-background', gradientBg);
    applyBackground(gradientBg);
  }
};

// 更新遮罩透明度
const updateMaskOpacity = (event) => {
  if (!process.client) return;

  const { opacity } = event.detail || {};
  if (opacity !== undefined) {
    const layout = document.querySelector('.main-layout');
    if (layout) {
      layout.style.setProperty('--mask-opacity', opacity);
    }
  }
};

// 监听背景图片选择
const handleBackgroundImageSelected = (event) => {
  if (!process.client) return;

  const { imageUrl } = event.detail || {};

  if (imageUrl) {
    currentBackground.value = imageUrl;
    localStorage.setItem('browser-homepage-background', imageUrl);
    applyBackground(imageUrl);
  }
};

// 暴露方法供子组件使用
defineExpose({
  changeBackground,
  backgrounds,
  currentBackground,
});

// 处理ESC键关闭设置面板
const handleKeyDown = (event) => {
  if (event.key === 'Escape' && showSettings.value) {
    closeSettings();
  }
};

onMounted(() => {
  // 只在客户端执行所有浏览器相关操作
  if (process.client) {
    initBackground();

    // 监听设置相关事件
    window.addEventListener('open-search-settings', handleOpenSearchSettings);
    window.addEventListener('background-mode-changed', handleBackgroundUpdate);
    window.addEventListener('background-color-changed', handleBackgroundUpdate);
    window.addEventListener('mask-opacity-changed', updateMaskOpacity);
    window.addEventListener(
      'background-image-selected',
      handleBackgroundImageSelected,
    );

    // 添加ESC键监听
    document.addEventListener('keydown', handleKeyDown);

    // 初始化遮罩透明度
    const savedOpacity = localStorage.getItem('browser-homepage-mask-opacity');
    if (savedOpacity) {
      const layout = document.querySelector('.main-layout');
      if (layout) {
        layout.style.setProperty('--mask-opacity', savedOpacity);
      }
    }
  }
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('open-search-settings', handleOpenSearchSettings);
  window.removeEventListener('background-mode-changed', handleBackgroundUpdate);
  window.removeEventListener(
    'background-color-changed',
    handleBackgroundUpdate,
  );
  window.removeEventListener('mask-opacity-changed', updateMaskOpacity);
  window.removeEventListener(
    'background-image-selected',
    handleBackgroundImageSelected,
  );
});
</script>

<template>
  <div class="main-layout">
    <!-- 插件容器区域 -->
    <section class="plugins-section">
      <!-- <ClientOnly> -->
      <PluginContainer ref="pluginContainer" />
      <!-- </ClientOnly> -->
    </section>

    <!-- 设置按钮 -->
    <button class="settings-btn" @click="openSettings" title="设置">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"
        />
      </svg>
    </button>

    <!-- 设置面板 -->
    <ClientOnly>
      <div v-if="showSettings" class="settings-panel">
        <SettingsPanel
          @close="closeSettings"
          @toggle-plugin="handleTogglePlugin"
        />
      </div>
    </ClientOnly>
  </div>
</template>

<style scoped>
@media (max-width: 480px) {
  .settings-panel {
    width: 100%; /* 在小屏幕上占据全宽 */
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-layout {
    padding: 0;
  }
}

.main-layout {
  --mask-opacity: 0.2;

  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start; /* 改为flex-start以确保内容从顶部开始 */
  width: 100%;
  height: 100vh; /* 使用确切的高度而非最小高度 */
  padding: 0;
  margin: 0;
  overflow-x: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center;
  background-size: cover;
}

.main-layout::before {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  content: '';
  background: rgb(0 0 0 / var(--mask-opacity));
  transition: background 0.3s ease;
}

/* 确保内容在遮罩层之上 */
.plugins-section,
.settings-btn {
  position: relative;
  z-index: 1;
}

/* 插件区域 */
.plugins-section {
  z-index: 1;
  display: flex;
  flex: 1; /* 允许插件区域占据剩余空间 */
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  height: calc(100vh - 40px); /* 减去设置按钮的空间 */
  padding: 0;
  margin: 0 auto;
}

/* 设置按钮 */
.settings-btn {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  color: #4f46e5;
  cursor: pointer;
  background: rgb(255 255 255 / 90%);
  border: none;
  border-radius: 50%;
  box-shadow: 0 4px 20px rgb(0 0 0 / 10%);
  backdrop-filter: blur(10px);
  transition: all 0.3s;
}

.settings-btn:hover {
  background: rgb(255 255 255 / 100%);
  box-shadow: 0 6px 25px rgb(0 0 0 / 15%);
  transform: rotate(90deg);
}

/* 设置面板 */
.settings-panel {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 2000;
  width: 360px; /* 固定宽度 */
  height: 100%;
  pointer-events: none; /* 默认不拦截鼠标事件 */
}

/* 设置面板内的内容可以正常响应交互 */
.settings-panel > * {
  pointer-events: auto;
}

/* 主布局容器 */
</style>
