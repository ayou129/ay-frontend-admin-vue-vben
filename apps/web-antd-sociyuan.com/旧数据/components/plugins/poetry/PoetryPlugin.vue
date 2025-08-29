<script setup>
import { onMounted, ref } from 'vue';

import PoetryContent from './PoetryContent.vue';

// 接收配置参数
const props = defineProps({
  config: {
    type: Object,
    default: () => ({}),
  },
});

// 简化的古诗词数据
const poetryDatabase = [
  {
    id: 1,
    title: '把酒对月歌',
    author: '李白',
    content: '我也不登天子船，我也不上长安眠。',
  },
  {
    id: 2,
    title: '静夜思',
    author: '李白',
    content: '床前明月光，疑是地上霜。<br>举头望明月，低头思故乡。',
  },
  {
    id: 3,
    title: '春晓',
    author: '孟浩然',
    content: '春眠不觉晓，处处闻啼鸟。<br>夜来风雨声，花落知多少。',
  },
  {
    id: 4,
    title: '登鹳雀楼',
    author: '王之涣',
    content: '白日依山尽，黄河入海流。<br>欲穷千里目，更上一层楼。',
  },
  {
    id: 5,
    title: '相思',
    author: '王维',
    content: '红豆生南国，春来发几枝。<br>愿君多采撷，此物最相思。',
  },
];

// 当前显示的诗词
const currentPoetry = ref({});

// 获取随机诗词
const getRandomPoetry = () => {
  const randomIndex = Math.floor(Math.random() * poetryDatabase.length);
  return poetryDatabase[randomIndex];
};

// 初始化诗词
const initializePoetry = () => {
  // 检查是否有保存的今日诗词
  const saved = localStorage.getItem('browser-homepage-poetry-simple');
  if (saved) {
    const data = JSON.parse(saved);
    const today = new Date().toDateString();
    if (data.date === today && data.poetry) {
      currentPoetry.value = data.poetry;
      return;
    }
  }

  // 获取新的诗词
  currentPoetry.value = getRandomPoetry();

  // 保存今日诗词
  localStorage.setItem(
    'browser-homepage-poetry-simple',
    JSON.stringify({
      poetry: currentPoetry.value,
      date: new Date().toDateString(),
    }),
  );
};

onMounted(() => {
  initializePoetry();
});
</script>

<template>
  <div class="poetry-plugin">
    <PoetryContent :current-poetry="currentPoetry" />
  </div>
</template>

<style scoped>
/* 古诗词插件容器 */
.poetry-plugin {
  padding: 0;
  text-align: center;
}
</style>
