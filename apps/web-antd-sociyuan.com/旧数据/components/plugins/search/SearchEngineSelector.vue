<script setup>
defineProps({
  currentEngine: {
    type: Object,
    required: true,
  },
});

defineEmits(['toggle-engine-list']);
</script>

<template>
  <div class="search-engine-selector" @click="$emit('toggle-engine-list')">
    <img
      :src="currentEngine.icon"
      :alt="currentEngine.name"
      class="engine-icon"
    />
  </div>
</template>

<style scoped>
/* 搜索引擎选择器 */
.search-engine-selector {
  display: flex;
  align-items: center;
  padding: 8px;
  cursor: pointer;
  border-radius: 50%;
  transition: background 0.2s ease;
}

.search-engine-selector:hover {
  background: rgb(0 0 0 / 5%);
}

.engine-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
}
</style>
