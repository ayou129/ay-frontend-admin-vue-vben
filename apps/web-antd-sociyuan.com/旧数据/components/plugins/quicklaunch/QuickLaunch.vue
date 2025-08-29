<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';

import QuickLaunchEmpty from './QuickLaunchEmpty.vue';
import QuickLaunchForm from './QuickLaunchForm.vue';
import QuickLaunchGrid from './QuickLaunchGrid.vue';
import QuickLaunchTabs from './QuickLaunchTabs.vue';

// 接收配置参数
const props = defineProps({
  config: {
    type: Object,
    default: () => ({
      columns: 2,
      showLabels: true,
      defaultCategory: 'common',
    }),
  },
});

// 快捷启动项数据
const quickLaunchItems = reactive([
  // 常用工具
  {
    id: 'baidu',
    name: '百度',
    icon: '/assets/icons/baidu.svg',
    url: 'https://www.baidu.com',
    type: 'link',
    category: 'search',
    description: '百度搜索',
    custom: false,
  },
  {
    id: 'google',
    name: 'Google',
    icon: '/assets/icons/google.svg',
    url: 'https://www.google.com',
    type: 'link',
    category: 'search',
    description: 'Google搜索',
    custom: false,
  },
  {
    id: 'bing',
    name: '必应',
    icon: '/assets/icons/bing.svg',
    url: 'https://www.bing.com',
    type: 'link',
    category: 'search',
    description: '必应搜索',
    custom: false,
  },
  {
    id: '360',
    name: '360搜索',
    icon: '/assets/icons/360sousuo.svg',
    url: 'https://www.so.com',
    type: 'link',
    category: 'search',
    description: '360搜索',
    custom: false,
  },
  {
    id: 'sogou',
    name: '搜狗搜索',
    icon: '/assets/icons/sougousousuo.svg',
    url: 'https://www.sogou.com',
    type: 'link',
    category: 'search',
    description: '搜狗搜索',
    custom: false,
  },
  // 常用网站
  {
    id: 'github',
    name: 'GitHub',
    icon: 'https://github.com/favicon.ico',
    url: 'https://github.com',
    type: 'link',
    category: 'dev',
    description: '代码托管平台',
    custom: false,
  },
  {
    id: 'stackoverflow',
    name: 'Stack Overflow',
    icon: 'https://stackoverflow.com/favicon.ico',
    url: 'https://stackoverflow.com',
    type: 'link',
    category: 'dev',
    description: '开发者问答社区',
    custom: false,
  },
  {
    id: 'bilibili',
    name: '哔哩哔哩',
    icon: 'https://www.bilibili.com/favicon.ico',
    url: 'https://www.bilibili.com',
    type: 'link',
    category: 'entertainment',
    description: 'B站视频平台',
    custom: false,
  },
  {
    id: 'zhihu',
    name: '知乎',
    icon: 'https://www.zhihu.com/favicon.ico',
    url: 'https://www.zhihu.com',
    type: 'link',
    category: 'social',
    description: '知识问答社区',
    custom: false,
  },
  // 功能项
  {
    id: 'wallpaper',
    name: '背景切换',
    icon: '/assets/icons/wallpaper.svg',
    type: 'function',
    category: 'common',
    description: '切换背景壁纸',
    custom: false,
  },
]);

// 分类数据
const categories = reactive([
  { id: 'common', name: '常用' },
  { id: 'search', name: '搜索' },
  { id: 'dev', name: '开发' },
  { id: 'social', name: '社交' },
  { id: 'entertainment', name: '娱乐' },
  { id: 'tools', name: '工具' },
]);

// 当前活跃分类
const activeCategory = ref(props.config.defaultCategory || 'common');

// 快捷启动虚化程度配置（0-80）
const quickLaunchBlur = ref(30);

// 添加表单显示状态
const showAddForm = ref(false);

// 新项目数据
const newItem = reactive({
  name: '',
  url: '',
  icon: '',
  category: 'common',
  description: '',
});

// 网格列数和标签显示
const gridColumns = computed(() => props.config.columns || 2);
const showLabels = computed(() => props.config.showLabels !== false);

// 当前分类的启动项
const activeItems = ref([]);

// 用户鉴权状态（伪代码）
const isUserLoggedIn = ref(false);

// 鉴权检查（伪代码）
const checkUserAuth = async () => {
  // 这里应该是真实的鉴权逻辑
  // 例如：检查 JWT token、调用鉴权 API 等
  try {
    // const token = localStorage.getItem('authToken')
    // const response = await fetch('/api/auth/verify', {
    //   headers: { Authorization: `Bearer ${token}` }
    // })
    // return response.ok

    // 模拟鉴权结果（当前设为已登录状态，默认通过）
    return true;
  } catch (error) {
    console.error('鉴权失败:', error);
    return false;
  }
};

// 处理添加按钮点击
const handleAddClick = async () => {
  // 鉴权检查
  const isLoggedIn = await checkUserAuth();

  if (!isLoggedIn) {
    // 未登录，显示登录提示或跳转到登录页面
    alert('请先登录后再添加快捷启动项');
    // window.location.href = '/login' // 或者跳转到登录页面
    return;
  }

  // 已登录，显示添加表单
  showAddForm.value = true;
};

// 更新当前分类的启动项
const updateActiveItems = () => {
  activeItems.value = quickLaunchItems.filter(
    (item) => item.category === activeCategory.value,
  );
};

// 是否可以提交新项目
const canSubmit = computed(() => {
  return newItem.name.trim() && newItem.url.trim();
});

// 更新新项目数据
const updateNewItem = (field, value) => {
  newItem[field] = value;
};

// 切换分类
const switchCategory = (categoryId) => {
  activeCategory.value = categoryId;
  updateActiveItems();
  // 保存当前分类选择
  localStorage.setItem('quicklaunch-active-category', categoryId);
};

// 处理启动项点击
const handleItemClick = (item) => {
  switch (item.type) {
    case 'function': {
      // 功能处理
      handleFunctionItem(item);
      break;
    }

    case 'link': {
      // 立即跳转
      window.open(item.url, '_blank');
      break;
    }

    default: {
      console.log('点击了启动项:', item.name);
    }
  }
};

// 处理功能类型启动项
const handleFunctionItem = (item) => {
  switch (item.id) {
    case 'wallpaper': {
      // 背景切换功能
      handleWallpaperChange();
      break;
    }
    default: {
      console.log('处理功能:', item.name);
    }
  }
};

// 处理背景切换
const handleWallpaperChange = () => {
  // 触发背景切换事件
  window.dispatchEvent(new CustomEvent('toggle-background'));
};

// 关闭添加表单
const closeAddForm = () => {
  showAddForm.value = false;
  // 重置表单
  Object.assign(newItem, {
    name: '',
    url: '',
    icon: '',
    category: 'common',
    description: '',
  });
};

// 添加自定义项目
const addCustomItem = () => {
  if (!canSubmit.value) return;

  const customItem = {
    id: `custom_${Date.now()}`,
    name: newItem.name.trim(),
    url: newItem.url.trim(),
    icon: newItem.icon.trim() || null,
    type: 'link',
    category: newItem.category,
    description: newItem.description.trim() || newItem.name.trim(),
    custom: true,
  };

  quickLaunchItems.push(customItem);
  saveCustomItems();
  updateActiveItems();
  closeAddForm();
};

// 删除自定义项目
const deleteCustomItem = (itemId) => {
  const index = quickLaunchItems.findIndex((item) => item.id === itemId);
  if (index !== -1) {
    quickLaunchItems.splice(index, 1);
    saveCustomItems();
    updateActiveItems();
  }
};

// 保存自定义项目到本地存储
const saveCustomItems = () => {
  const customItems = quickLaunchItems.filter((item) => item.custom);
  localStorage.setItem('quicklaunch-custom-items', JSON.stringify(customItems));
};

// 加载自定义项目
const loadCustomItems = () => {
  const saved = localStorage.getItem('quicklaunch-custom-items');
  if (saved) {
    const customItems = JSON.parse(saved);
    customItems.forEach((item) => {
      // 检查是否已存在（避免重复）
      if (!quickLaunchItems.find((existing) => existing.id === item.id)) {
        quickLaunchItems.push(item);
      }
    });
  }
};

// 加载快捷启动背景设置
const loadQuickLaunchSettings = () => {
  const savedBlur = localStorage.getItem('browser-homepage-quicklaunch-blur');
  if (savedBlur) {
    quickLaunchBlur.value = Number.parseInt(savedBlur);
  }

  // 应用样式
  applyQuickLaunchStyles();
};

// 应用快捷启动背景样式
const applyQuickLaunchStyles = () => {
  const grids = document.querySelectorAll('.quicklaunch-grid, .empty-category');
  grids.forEach((grid) => {
    if (grid) {
      // 应用虚化效果（0-80范围转换为0-0.8的blur值）
      grid.style.setProperty(
        '--quicklaunch-blur',
        `${quickLaunchBlur.value / 100}rem`,
      );
    }
  });
};

// 监听快捷启动背景配置变更
const handleQuickLaunchBackgroundChange = (event) => {
  const { blur } = event.detail;
  quickLaunchBlur.value = blur;
  applyQuickLaunchStyles();
};

// 初始化设置
const initializeSettings = () => {
  // 恢复分类选择
  const savedCategory = localStorage.getItem('quicklaunch-active-category');
  if (savedCategory && categories.find((c) => c.id === savedCategory)) {
    activeCategory.value = savedCategory;
  }

  // 加载自定义项目
  loadCustomItems();

  // 更新当前分类的启动项
  updateActiveItems();
};

// 拖拽结束处理
const onDragEnd = () => {
  // 将拖拽后的顺序同步回 quickLaunchItems
  activeItems.value.forEach((item, index) => {
    const originalIndex = quickLaunchItems.findIndex(
      (original) => original.id === item.id,
    );
    if (originalIndex !== -1) {
      quickLaunchItems[originalIndex] = item;
    }
  });

  // 更新项目顺序并保存
  saveItemOrder();
};

// 保存项目顺序
const saveItemOrder = () => {
  const orderData = {};

  categories.forEach((category) => {
    const categoryItems = quickLaunchItems.filter(
      (item) => item.category === category.id,
    );
    orderData[category.id] = categoryItems.map((item) => item.id);
  });

  localStorage.setItem('quicklaunch-item-order', JSON.stringify(orderData));
};

// 加载项目顺序
const loadItemOrder = () => {
  const saved = localStorage.getItem('quicklaunch-item-order');
  if (saved) {
    const orderData = JSON.parse(saved);

    // 根据保存的顺序重新排列项目
    Object.keys(orderData).forEach((categoryId) => {
      const itemIds = orderData[categoryId];
      const categoryItems = quickLaunchItems.filter(
        (item) => item.category === categoryId,
      );

      // 按保存的顺序重新排列
      const orderedItems = [];
      itemIds.forEach((id) => {
        const item = categoryItems.find((item) => item.id === id);
        if (item) orderedItems.push(item);
      });

      // 添加新增的项目（不在保存顺序中的）
      categoryItems.forEach((item) => {
        if (!itemIds.includes(item.id)) {
          orderedItems.push(item);
        }
      });

      // 更新数组
      const startIndex = quickLaunchItems.findIndex(
        (item) => item.category === categoryId,
      );
      if (startIndex !== -1) {
        const oldCategoryItems = quickLaunchItems.filter(
          (item) => item.category === categoryId,
        );
        oldCategoryItems.forEach((item) => {
          const index = quickLaunchItems.indexOf(item);
          quickLaunchItems.splice(index, 1);
        });

        orderedItems.forEach((item, index) => {
          quickLaunchItems.splice(startIndex + index, 0, item);
        });
      }
    });
  }
};

onMounted(() => {
  initializeSettings();
  loadItemOrder();
  loadQuickLaunchSettings();

  // 监听快捷启动背景配置变更事件
  window.addEventListener(
    'quicklaunch-background-changed',
    handleQuickLaunchBackgroundChange,
  );
});

// 组件销毁时清理事件监听
onUnmounted(() => {
  window.removeEventListener(
    'quicklaunch-background-changed',
    handleQuickLaunchBackgroundChange,
  );
});
</script>

<template>
  <div class="quicklaunch-plugin">
    <QuickLaunchTabs
      :categories="categories"
      :active-category="activeCategory"
      @switch-category="switchCategory"
      @handle-add-click="handleAddClick"
    />

    <!-- 快捷启动内容区域（支持空分类提示） -->
    <div class="quicklaunch-content">
      <QuickLaunchGrid
        v-if="activeItems.length > 0"
        :active-items="activeItems"
        :show-labels="showLabels"
        @handle-item-click="handleItemClick"
        @delete-custom-item="deleteCustomItem"
        @on-drag-end="onDragEnd"
      />
      <QuickLaunchEmpty v-else @handle-add-click="handleAddClick" />
    </div>

    <!-- 添加项目表单 -->
    <QuickLaunchForm
      v-if="showAddForm"
      :categories="categories"
      :new-item="newItem"
      :can-submit="canSubmit"
      @close-add-form="closeAddForm"
      @update-new-item="updateNewItem"
      @add-custom-item="addCustomItem"
    />
  </div>
</template>

<style scoped>
/* 响应式设计 */
@media (max-width: 768px) {
  .quicklaunch-plugin {
    padding: 24px;
  }
}

.quicklaunch-plugin {
  padding: 0;
}

/* 快捷启动内容区域 */
.quicklaunch-content {
  min-height: 150px;
}

/* 快捷启动插件容器 */
</style>
