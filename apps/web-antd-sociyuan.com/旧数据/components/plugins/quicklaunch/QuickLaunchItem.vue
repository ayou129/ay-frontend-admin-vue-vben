<script setup>
defineProps({
  item: {
    type: Object,
    required: true,
  },
  showLabels: {
    type: Boolean,
    default: true,
  },
});

defineEmits(['delete-custom-item']);
</script>

<template>
  <div
    class="quick-item"
    :class="{ 'custom-item': item.custom }"
    :title="item.description || item.name"
  >
    <div class="item-icon">
      <img v-if="item.icon" :src="item.icon" :alt="item.name" />
      <div v-else class="default-icon">
        {{ item.name.charAt(0).toUpperCase() }}
      </div>
    </div>
    <span class="item-name" v-if="showLabels">{{ item.name }}</span>

    <!-- 自定义项目的删除按钮 -->
    <button
      v-if="item.custom"
      class="delete-btn"
      @click.stop="$emit('delete-custom-item')"
      title="删除"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
        <path
          d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
        />
      </svg>
    </button>
  </div>
</template>

<style scoped>
/* macOS Dock 风格的启动项 */
.quick-item {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
  min-width: 60px;
  padding: 8px;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.quick-item:hover {
  transform: scale(1.2) translateY(-8px);
}

.item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: rgb(255 255 255 / 90%);
  border-radius: 12px;
  box-shadow: 0 4px 15px rgb(0 0 0 / 10%);
  transition: all 0.3s ease;
}

.quick-item:hover .item-icon {
  box-shadow: 0 8px 25px rgb(0 0 0 / 20%);
}

.item-icon img {
  width: 32px;
  height: 32px;
  object-fit: contain;
  border-radius: 6px;
}

.default-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  font-size: 14px;
  font-weight: 500;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 6px;
}

.item-name {
  font-size: 0.8rem;
  font-weight: 400;
  color: rgb(255 255 255 / 90%);
  text-align: center;
  text-shadow: 0 1px 2px rgb(0 0 0 / 30%);
}

/* 删除按钮 */
.delete-btn {
  position: absolute;
  top: -4px;
  right: -4px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: white;
  cursor: pointer;
  background: rgb(255 59 48 / 90%);
  border: 2px solid white;
  border-radius: 50%;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.2s ease;
}

.quick-item:hover .delete-btn {
  opacity: 1;
  transform: scale(1);
}
</style>
