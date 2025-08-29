<script setup>
defineProps({
  currentPoetry: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <div class="poetry-content">
    <div class="poetry-text" v-html="currentPoetry.content"></div>
    <div class="poetry-footer">
      <span class="poetry-author">{{ currentPoetry.author }}</span>
      <span class="poetry-title">{{ currentPoetry.title }}</span>
    </div>
  </div>
</template>

<style scoped>
/* 响应式设计 */
@media (max-width: 768px) {
  .poetry-text {
    font-size: 1.1rem;
  }
}

.poetry-content {
  max-width: 500px;
  margin: 0 auto;
}

.poetry-text {
  margin-bottom: 32px;
  font-family: STKaiti, KaiTi, '楷体', serif;
  font-size: 1.3rem;
  font-weight: 400;
  line-height: 2;
  color: #fff;
}

.poetry-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 16px;
  font-size: 0.9rem;
  color: rgb(255 255 255 / 80%);
  border-top: 1px solid rgb(255 255 255 / 20%);
}

.poetry-author,
.poetry-title {
  font-weight: 400;
}

/* 诗词内容 */
</style>
