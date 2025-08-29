<script setup>
import { onMounted, ref } from 'vue';

// 接收配置参数
const props = defineProps({
  config: {
    type: Object,
    default: () => ({}),
  },
});

// 定义事件
const emit = defineEmits(['update:config']);

// 主题配置状态
const themeMode = ref('light'); // 主题模式: light, dark
const backgroundColor = ref('#6366f1'); // 背景颜色
const selectedBackgroundImage = ref(-1); // 选中的背景图片索引，-1表示无背景图片

// 背景图片选项
const backgroundImages = [
  '/assets/bgimg/pexels-christian-heitz-285904-842711.jpg',
  '/assets/bgimg/pexels-eberhardgross-1624496.jpg',
];

// 初始化设置
onMounted(() => {
  // 加载主题模式
  const savedThemeMode = localStorage.getItem('browser-homepage-theme-mode');
  if (savedThemeMode) {
    themeMode.value = savedThemeMode;
  }

  // 加载背景颜色
  const savedBackgroundColor = localStorage.getItem(
    'browser-homepage-background-color',
  );
  if (savedBackgroundColor) {
    backgroundColor.value = savedBackgroundColor;
  }

  // 加载背景图片
  const savedBackgroundImage = localStorage.getItem(
    'browser-homepage-background-image',
  );
  if (savedBackgroundImage) {
    selectedBackgroundImage.value = Number.parseInt(savedBackgroundImage);
  }
});

// 更新主题模式
const updateThemeMode = (event) => {
  const newMode = event.target.value;
  themeMode.value = newMode;

  // 保存到本地存储
  localStorage.setItem('browser-homepage-theme-mode', newMode);

  // 应用主题
  applyTheme(newMode);
};

// 应用主题
const applyTheme = (mode) => {
  document.documentElement.dataset.theme = mode;
};

// 更新背景颜色
const updateBackgroundColor = (event) => {
  const newColor = event.target.value;
  backgroundColor.value = newColor;

  // 保存到本地存储
  localStorage.setItem('browser-homepage-background-color', newColor);

  // 应用背景颜色
  applyBackground();
};

// 应用背景设置
const applyBackground = () => {
  const root = document.documentElement;
  root.style.setProperty('--background-color', backgroundColor.value);
};

// 选择背景图片
const selectBackgroundImage = (index) => {
  selectedBackgroundImage.value =
    index === selectedBackgroundImage.value ? -1 : index;

  // 保存到本地存储
  if (selectedBackgroundImage.value === -1) {
    localStorage.removeItem('browser-homepage-background-image');
    // 触发背景更新事件，清除背景
    window.dispatchEvent(
      new CustomEvent('background-image-selected', {
        detail: { imageUrl: null },
      }),
    );
  } else {
    const imageUrl = backgroundImages[selectedBackgroundImage.value];
    localStorage.setItem('browser-homepage-background-image', index.toString());
    // 触发背景更新事件
    window.dispatchEvent(
      new CustomEvent('background-image-selected', {
        detail: { imageUrl },
      }),
    );
  }
};
</script>

<template>
  <div class="theme-settings">
    <!-- 主题选择 -->
    <div class="theme-option">
      <label>主题模式</label>
      <select :value="themeMode" @change="updateThemeMode">
        <option value="light">浅色主题</option>
        <option value="dark">深色主题</option>
      </select>
    </div>

    <!-- 背景颜色 -->
    <div class="color-picker">
      <label>背景颜色</label>
      <input
        type="color"
        :value="backgroundColor"
        @change="updateBackgroundColor"
      />
    </div>

    <!-- 背景图片选择 -->
    <div class="background-image-options">
      <h4>背景图片</h4>
      <div class="bg-image-grid">
        <div
          v-for="(image, index) in backgroundImages"
          :key="index"
          class="bg-image-option"
          :class="{ active: selectedBackgroundImage === index }"
          @click="selectBackgroundImage(index)"
        >
          <div
            class="bg-image-preview"
            :style="{ backgroundImage: `url(${image})` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 主题设置样式 */
.theme-settings {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.theme-option,
.color-picker {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 10px 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.theme-option label,
.color-picker label {
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

.theme-option select {
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

.theme-option select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 10%);
}

.color-picker input[type='color'] {
  width: 40px;
  height: 28px;
  cursor: pointer;
  outline: none;
  background: none;
  border: 1px solid #d1d5db;
  border-radius: 6px;
}

.color-picker input[type='color']:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 10%);
}

/* 背景图片选择 */
.background-image-options {
  padding: 12px;
  margin-top: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.background-image-options h4 {
  margin: 0 0 12px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #374151;
}

.bg-image-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.bg-image-option {
  position: relative;
  width: 100px;
  height: 70px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.bg-image-option:hover {
  box-shadow: 0 4px 12px rgb(0 0 0 / 10%);
  transform: translateY(-2px);
}

.bg-image-option.active {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 30%);
}

.bg-image-preview {
  width: 100%;
  height: 100%;
  background-position: center;
  background-size: cover;
}
</style>
