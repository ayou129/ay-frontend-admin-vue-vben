<script setup>
// 定义事件
const emit = defineEmits(['handle-add-click']);
</script>

<template>
  <div class="empty-category">
    <div class="empty-icon">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        />
      </svg>
    </div>
    <p class="empty-text">该分类暂无快捷启动项</p>
    <p class="empty-hint">点击上方 "+" 号添加新的快捷启动项</p>
  </div>
</template>

<style scoped>
/* 响应式设计 */
@media (max-width: 768px) {
  .empty-category {
    padding: 30px 16px;
  }

  .empty-text {
    font-size: 0.9rem;
  }
}

.empty-category {
  --quicklaunch-blur: 0.3rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  /* 保持与一排快捷启动项相似的高度 */
  min-height: 120px;
  padding: 16px;
  text-align: center;

  /* 与快捷启动网格保持一致的背景和高度 */
  background: rgb(255 255 255 / 10%);
  border: 1px solid rgb(255 255 255 / 15%);
  border-radius: 20px;
  backdrop-filter: blur(var(--quicklaunch-blur));
}

.empty-icon {
  margin-bottom: 8px;
  opacity: 0.6;
}

.empty-icon svg {
  width: 32px;
  height: 32px;
  color: rgb(255 255 255 / 60%);
}

.empty-text {
  margin: 0 0 4px;
  font-size: 1rem;
  font-weight: 500;
  color: rgb(255 255 255 / 80%);
}

.empty-hint {
  margin: 0;
  font-size: 0.8rem;
  color: rgb(255 255 255 / 60%);
}

/* 空分类提示 */
</style>
