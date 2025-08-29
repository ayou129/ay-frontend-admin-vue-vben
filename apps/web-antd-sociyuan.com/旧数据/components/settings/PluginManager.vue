<script setup>
defineProps({
  pluginList: {
    type: Array,
    required: true,
  },
});

defineEmits([
  'move-plugin',
  'toggle-plugin',
  'toggle-pin-plugin-to-top',
  'toggle-pin-plugin-to-bottom',
  'should-disable-move-up',
  'should-disable-move-down',
]);
</script>

<template>
  <!-- 插件管理 -->
  <div class="settings-section">
    <h3>插件管理</h3>
    <div class="plugin-list">
      <div
        v-for="(plugin, index) in pluginList"
        :key="plugin.id"
        class="plugin-item"
      >
        <div class="plugin-info">
          <span class="plugin-name">{{ plugin.name }}</span>
          <span class="plugin-description">{{ plugin.description }}</span>
        </div>
        <div class="plugin-actions">
          <div
            class="order-actions"
            v-if="!plugin.pinToTop && !plugin.pinToBottom"
          >
            <button
              @click="$emit('move-plugin', index, -1)"
              :disabled="
                index === 0 || (index > 0 && pluginList[index - 1].pinToTop)
              "
              class="move-btn"
              title="上移"
            >
              ↑
            </button>
            <button
              @click="$emit('move-plugin', index, 1)"
              :disabled="
                index === pluginList.length - 1 ||
                (index < pluginList.length - 1 &&
                  pluginList[index + 1].pinToBottom)
              "
              class="move-btn"
              title="下移"
            >
              ↓
            </button>
          </div>
          <div class="pin-actions">
            <button
              class="pin-btn"
              :class="{ pinned: plugin.pinToTop }"
              @click="$emit('toggle-pin-plugin-to-top', plugin)"
              :title="plugin.pinToTop ? '取消置顶' : '置顶'"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M7,2H17V4H7V2M7,22H17V20H7V22M17,10H7V12H17V10M18,6H6V8H18V6M18,14H6V16H18V14Z"
                />
              </svg>
            </button>
            <button
              class="pin-btn"
              :class="{ pinned: plugin.pinToBottom }"
              @click="$emit('toggle-pin-plugin-to-bottom', plugin)"
              :title="plugin.pinToBottom ? '取消置底' : '置底'"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M16,12V4H17V2H7V4H8V12L6,14V16H11.2V22H12.8V16H18V14L16,12Z"
                />
              </svg>
            </button>
          </div>
          <label class="plugin-toggle">
            <input
              type="checkbox"
              v-model="plugin.enabled"
              :disabled="plugin.id === 'search'"
              @change="$emit('toggle-plugin', plugin)"
            /><!-- 搜索栏插件不能禁用 -->
            <span
              class="toggle-slider"
              :class="{ disabled: plugin.id === 'search' }"
            ></span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 插件管理样式 */
.plugin-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.plugin-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.plugin-item:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
  transform: translateY(-1px);
}

.plugin-info {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.plugin-name {
  margin-bottom: 2px;
  font-size: 0.85rem;
  font-weight: 500;
  color: #374151;
}

.plugin-description {
  font-size: 0.75rem;
  line-height: 1.3;
  color: #6b7280;
}

.required-badge {
  padding: 2px 6px;
  margin-left: 6px;
  font-size: 0.7rem;
  font-weight: 500;
  color: #dc2626;
  background: rgb(220 38 38 / 10%);
  border-radius: 4px;
}

.plugin-actions {
  display: flex;
  gap: 6px;
  align-items: center;
}

.order-actions {
  display: flex;
  gap: 4px;
}

.pin-actions {
  display: flex;
  gap: 4px;
}

/* 置顶/置底按钮样式 */
.pin-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  color: #6b7280;
  cursor: pointer;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.pin-btn:hover {
  color: #374151;
  background: #e5e7eb;
}

.pin-btn.pinned {
  color: white;
  background: #3b82f6;
  border-color: #3b82f6;
}

.pin-btn.pinned:hover {
  background: #2563eb;
  border-color: #2563eb;
}

/* 切换按钮样式 */
.plugin-toggle {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 22px;
}

.plugin-toggle input {
  width: 0;
  height: 0;
  opacity: 0;
}

.toggle-slider {
  position: absolute;
  inset: 0;
  cursor: pointer;
  background: #cbd5e1;
  border-radius: 22px;
  transition: 0.3s;
}

.toggle-slider::before {
  position: absolute;
  bottom: 3px;
  left: 3px;
  width: 16px;
  height: 16px;
  content: '';
  background: white;
  border-radius: 50%;
  transition: 0.3s;
}

input:checked + .toggle-slider {
  background: #3b82f6;
}

input:checked + .toggle-slider::before {
  transform: translateX(22px);
}

.toggle-slider.disabled {
  cursor: not-allowed;
  opacity: 0.4;
}

.toggle-slider.disabled::before {
  cursor: not-allowed;
}

/* 上下移动按钮样式 */
.move-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  font-size: 0.8rem;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.move-btn:hover:not(:disabled) {
  color: #374151;
  background: #e5e7eb;
}

.move-btn:disabled {
  cursor: not-allowed;
  opacity: 0.3;
}
</style>
