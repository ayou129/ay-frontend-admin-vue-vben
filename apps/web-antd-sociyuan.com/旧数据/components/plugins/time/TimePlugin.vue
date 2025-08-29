<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

import TimeDisplay from './TimeDisplay.vue';

// 接收配置参数
const props = defineProps({
  config: {
    type: Object,
    default: () => ({
      showSeconds: true,
      format24h: true,
      showLunar: false,
    }),
  },
});

// 时间相关状态
const currentTime = ref('');
const currentDate = ref('');

// 定时器
let timeInterval = null;

// 更新时间
const updateTime = () => {
  const now = new Date();

  // 更新时间 - 格式：15:47:45
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  currentTime.value = `${hours}:${minutes}:${seconds}`;

  // 更新日期 - 格式：2025年8月27日 星期X
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const weekdays = [
    '星期日',
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六',
  ];
  const weekday = weekdays[now.getDay()];
  currentDate.value = `${year}年${month}月${day}日 ${weekday}`;
};

// 获取问候语
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 6) return '深夜好';
  if (hour < 9) return '早上好';
  if (hour < 12) return '上午好';
  if (hour < 14) return '中午好';
  if (hour < 18) return '下午好';
  if (hour < 22) return '晚上好';
  return '夜深了';
};

onMounted(() => {
  updateTime();
  timeInterval = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval);
  }
});
</script>

<template>
  <div class="time-plugin">
    <TimeDisplay :current-time="currentTime" :current-date="currentDate" />
  </div>
</template>

<style scoped>
/* 响应式设计 */
@media (max-width: 768px) {
  .current-time {
    font-size: 3rem;
  }
}

.time-plugin {
  padding: 0;
  text-align: center;
}

/* 时间插件容器 */
</style>
