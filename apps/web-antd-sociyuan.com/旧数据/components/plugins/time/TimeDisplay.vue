<script setup>
defineProps({
  currentTime: {
    type: String,
    required: true,
  },
  currentDate: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="time-display">
    <div class="current-time">{{ currentTime }}</div>
    <div class="current-date">{{ currentDate }}</div>
  </div>
</template>

<style scoped>
/* 响应式设计 */
@media (max-width: 768px) {
  .current-time {
    font-size: 3rem;
  }
}

.current-time {
  margin-bottom: 12px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 4rem;
  font-weight: 200;
  color: #fff;
  letter-spacing: -2px;
}

/* 当前日期 */
.current-date {
  font-size: 1.1rem;
  font-weight: 300;
  color: #fff;
}

/* 当前时间 */
</style>
