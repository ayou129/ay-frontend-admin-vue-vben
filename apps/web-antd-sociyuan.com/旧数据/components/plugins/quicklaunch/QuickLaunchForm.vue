<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  categories: {
    type: Array,
    required: true,
  },
  newItem: {
    type: Object,
    required: true,
  },
  canSubmit: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  'close-add-form',
  'add-custom-item',
  'update-new-item',
]);

// 创建本地副本以避免直接修改props
const localNewItem = ref({ ...props.newItem });

// 监听props.newItem变化并同步到localNewItem
watch(
  () => props.newItem,
  (newItem) => {
    localNewItem.value = { ...newItem };
  },
  { deep: true },
);

// 监听localNewItem变化并同步回父组件
watch(
  localNewItem,
  (newItem) => {
    Object.keys(newItem).forEach((key) => {
      emit('update-new-item', key, newItem[key]);
    });
  },
  { deep: true },
);
</script>

<template>
  <!-- 添加项目表单 -->
  <div class="add-form-overlay" @click="$emit('close-add-form')">
    <div class="add-form" @click.stop>
      <div class="form-header">
        <h4>添加快捷启动项</h4>
        <button class="close-btn" @click="$emit('close-add-form')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
            />
          </svg>
        </button>
      </div>

      <div class="form-body">
        <div class="form-group">
          <label>名称</label>
          <input
            v-model="localNewItem.name"
            type="text"
            placeholder="输入项目名称"
            @keyup.enter="$emit('add-custom-item')"
          />
        </div>

        <div class="form-group">
          <label>网址</label>
          <input
            v-model="localNewItem.url"
            type="url"
            placeholder="https://example.com"
            @keyup.enter="$emit('add-custom-item')"
          />
        </div>

        <div class="form-group">
          <label>图标URL（可选）</label>
          <input
            v-model="localNewItem.icon"
            type="url"
            placeholder="图标地址（留空使用默认图标）"
            @keyup.enter="$emit('add-custom-item')"
          />
        </div>

        <div class="form-group">
          <label>分类</label>
          <select v-model="localNewItem.category">
            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
        </div>

        <div class="form-group">
          <label>描述（可选）</label>
          <input
            v-model="localNewItem.description"
            type="text"
            placeholder="项目描述"
            @keyup.enter="$emit('add-custom-item')"
          />
        </div>
      </div>

      <div class="form-footer">
        <button class="cancel-btn" @click="$emit('close-add-form')">
          取消
        </button>
        <button
          class="submit-btn"
          @click="$emit('add-custom-item')"
          :disabled="!canSubmit"
        >
          添加
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.add-form-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(0 0 0 / 60%);
  animation: fadeIn 0.3s ease;
}

.add-form {
  width: 90%;
  max-width: 480px;
  padding: 0;
  overflow: hidden;
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgb(0 0 0 / 15%);
  animation: slideUp 0.3s ease;
}

.form-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.form-header h4 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
  color: #374151;
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  color: #6b7280;
  cursor: pointer;
  background: none;
  border: none;
  border-radius: 6px;
  transition: all 0.2s;
}

.close-btn:hover {
  color: #374151;
  background: rgb(0 0 0 / 5%);
}

.form-body {
  padding: 20px;
}

.form-group {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 10px 12px;
  margin-bottom: 8px;
  border-radius: 8px;
}

.form-group label {
  min-width: 80px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #374151;
  white-space: nowrap;
}

.form-group input,
.form-group select {
  box-sizing: border-box;
  flex: 1;
  padding: 6px 8px;
  font-size: 0.8rem;
  color: #374151;
  outline: none;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgb(59 130 246 / 10%);
}

.form-group input::placeholder {
  color: #9ca3af;
}

.form-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 10px 20px;
  border-top: 1px solid #e5e7eb;
}

.cancel-btn,
.submit-btn {
  min-width: 60px;
  padding: 6px 12px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.cancel-btn {
  color: #6b7280;
  background: #f3f4f6;
}

.cancel-btn:hover {
  color: #374151;
  background: #e5e7eb;
}

.submit-btn {
  color: white;
  background: #3b82f6;
  border-color: #3b82f6;
}

.submit-btn:hover:not(:disabled) {
  background: #2563eb;
  border-color: #2563eb;
}

.submit-btn:disabled {
  cursor: not-allowed;
  background: #d1d5db;
  border-color: #d1d5db;
}

/* 与设置面板一致的添加面板样式 */
</style>
