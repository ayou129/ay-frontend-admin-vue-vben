<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  currentEngine: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits([
  'update:modelValue',
  'keydown',
  'perform-search',
  'focus',
  'blur',
]);

const searchInput = ref(null);
const inputValue = ref(props.modelValue);

// 监听输入值变化并同步到父组件
watch(inputValue, (newValue) => {
  emit('update:modelValue', newValue);
});

// 监听父组件传入的值变化并同步到本地
watch(
  () => props.modelValue,
  (newValue) => {
    inputValue.value = newValue;
  },
);

// 暴露focus方法给父组件
defineExpose({
  focus: () => {
    if (searchInput.value) {
      searchInput.value.focus();
    }
  },
});
</script>

<template>
  <input
    ref="searchInput"
    v-model="inputValue"
    type="text"
    class="search-input"
    id="search-input-field"
    :placeholder="`在${currentEngine.name}中搜索`"
    @keydown="$emit('keydown', $event)"
    @keyup.enter="$emit('perform-search')"
    @focus="$emit('focus')"
    @blur="$emit('blur')"
  />
</template>

<style scoped>
/* 响应式设计 */
@media (max-width: 480px) {
  .search-input {
    width: 100%; /* 简化宽度 */
    height: 100%; /* 简化高度 */
    padding-top: 1px; /* 在小屏幕上也只设置padding-top */
    margin-right: 5px;
    margin-left: 5px;
    font-size: 16px;
  }
}

/* 黑暗模式支持 */
@media (prefers-color-scheme: dark) {
  .search-input {
    color: #f9fafb;
  }

  .search-input::placeholder {
    color: #9ca3af;
  }
}

.search-input {
  flex: 1;
  width: 100%; /* 简化宽度 */
  height: 100%; /* 简化高度 */
  padding-top: 1px; /* 只设置padding-top */
  margin-right: 5px;
  margin-left: 5px;
  font-size: 16px;
  color: #333;
  outline: none;
  background: transparent;
  border: none;
}

.search-input::placeholder {
  color: #999;
}

/* 焦点状态 */
.search-input:focus {
  outline: none;
}

/* 搜索输入框 */
</style>
