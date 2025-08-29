<script setup>
defineProps({
  categories: {
    type: Array,
    required: true,
  },
  activeCategory: {
    type: String,
    required: true,
  },
});

defineEmits(['switch-category', 'handle-add-click']);

// 处理分类滚动
const handleTabsScroll = (event) => {
  event.preventDefault();
  const container = event.target.closest('.quicklaunch-tabs');
  if (container) {
    container.scrollLeft += event.deltaY;
  }
};
</script>

<template>
  <!-- Tab 切换 + 添加按钮（居中布局，支持滚动） -->
  <div class="quicklaunch-tabs-container" v-if="categories.length > 1">
    <div class="quicklaunch-tabs" @wheel="handleTabsScroll">
      <button
        v-for="category in categories"
        :key="category.id"
        class="tab-btn"
        :class="{ active: activeCategory === category.id }"
        @click.stop="$emit('switch-category', category.id)"
      >
        {{ category.name }}
      </button>
      <!-- 添加按钮放在分类最右侧 -->
      <button
        class="tab-add-btn"
        @click="$emit('handle-add-click')"
        title="添加新项目"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Tab 切换容器（支持滚动） */
.quicklaunch-tabs-container {
  position: relative;
  margin-bottom: 20px;
}

.quicklaunch-tabs {
  display: flex;
  gap: 8px;
  justify-content: center;
  padding: 4px 0;
  overflow: auto hidden;
  scrollbar-color: rgb(255 255 255 / 30%) transparent;
  scrollbar-width: thin;
  scroll-behavior: smooth;
}

.quicklaunch-tabs::-webkit-scrollbar {
  height: 6px;
}

.quicklaunch-tabs::-webkit-scrollbar-track {
  background: rgb(255 255 255 / 10%);
  border-radius: 3px;
}

.quicklaunch-tabs::-webkit-scrollbar-thumb {
  background: rgb(255 255 255 / 30%);
  border-radius: 3px;
}

.quicklaunch-tabs::-webkit-scrollbar-thumb:hover {
  background: rgb(255 255 255 / 50%);
}

.tab-btn {
  padding: 6px 16px;
  font-size: 0.9rem;
  color: rgb(255 255 255 / 80%);
  cursor: pointer;
  background: rgb(255 255 255 / 10%);
  border: 1px solid rgb(255 255 255 / 20%);
  border-radius: 16px;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  background: rgb(255 255 255 / 15%);
  transform: translateY(-1px);
}

.tab-btn.active {
  font-weight: 500;
  color: #333;
  background: rgb(255 255 255 / 90%);
  border-color: rgb(255 255 255 / 90%);
}

/* 分类添加按钮 */
.tab-add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-left: 8px;
  color: rgb(255 255 255 / 80%);
  cursor: pointer;
  background: rgb(255 255 255 / 10%);
  border: 1px solid rgb(255 255 255 / 20%);
  border-radius: 50%;
  transition: all 0.2s ease;
}

.tab-add-btn:hover {
  color: #fff;
  background: rgb(255 255 255 / 20%);
  transform: scale(1.1);
}
</style>
