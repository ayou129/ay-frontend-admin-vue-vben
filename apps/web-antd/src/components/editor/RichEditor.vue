<script setup lang="ts">
import type {
  IDomEditor,
  IEditorConfig,
  IToolbarConfig,
} from '@wangeditor/editor';

import { onBeforeUnmount, ref, shallowRef, watch } from 'vue';

import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { message } from 'ant-design-vue';

import { useResourcePicker } from '#/components/resource';
import { ResourceType } from '#/types/resource';

import '@wangeditor/editor/dist/css/style.css';

interface Props {
  modelValue?: string;
  placeholder?: string;
  height?: number;
  disabled?: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '请输入内容...',
  height: 400,
  disabled: false,
});

const emit = defineEmits<Emits>();

// 编辑器实例
const editorRef = shallowRef<IDomEditor>();

// 内容 HTML
const valueHtml = ref(props.modelValue);

// 资源选择器
const { openResourcePicker } = useResourcePicker();

// 工具栏配置
const toolbarConfig: Partial<IToolbarConfig> = {
  excludeKeys: [
    'uploadVideo', // 排除视频上传（使用自定义图片上传）
  ],
};

// 编辑器配置
const editorConfig: Partial<IEditorConfig> = {
  placeholder: props.placeholder,
  MENU_CONF: {
    // 自定义图片上传 - 强制使用资源库选择
    uploadImage: {
      // 禁用本地文件选择
      allowedFileTypes: [],
      // 自定义上传逻辑
      async customUpload(
        _file: File,
        insertFn: (url: string, alt: string, href: string) => void,
      ) {
        try {
          // 打开资源选择器
          const resources = await openResourcePicker({
            mode: 'single',
            acceptTypes: [ResourceType.Image],
          });

          if (resources && resources.length > 0) {
            const resource = resources[0];
            if (resource) {
              // 插入图片到编辑器
              insertFn(
                resource.url,
                resource.file_original_filename,
                resource.url,
              );
            }
          }
        } catch (error) {
          console.error('插入图片失败:', error);
        }
      },
      // 自定义选择图片逻辑（点击插入图片按钮）
      async customBrowseAndUpload(
        insertFn: (url: string, alt: string, href: string) => void,
      ) {
        try {
          // 打开资源选择器
          const resources = await openResourcePicker({
            mode: 'single',
            acceptTypes: [ResourceType.Image],
          });

          if (resources && resources.length > 0) {
            const resource = resources[0];
            if (resource) {
              // 插入图片到编辑器
              insertFn(
                resource.url,
                resource.file_original_filename,
                resource.url,
              );
            }
          }
        } catch (error) {
          console.error('插入图片失败:', error);
        }
      },
    },
    // 禁用通过 URL 插入图片（可选，如果需要可以注释掉）
    insertImage: {
      onInsertedImage(_imageNode: any) {
        // 图片已插入，无需处理
      },
      // 验证图片 URL
      checkImage(_src: string, _alt: string, _url: string) {
        // 可以在这里添加 URL 验证逻辑
        // 例如：只允许来自资源库的图片
        return true;
      },
      // 解析图片 URL
      parseImageSrc(src: string) {
        return src;
      },
    },
  },
};

// 编辑器创建时
const handleCreated = (editor: IDomEditor) => {
  editorRef.value = editor;

  // 禁用粘贴图片
  editor.on('paste', (e: any) => {
    // 检查是否包含图片文件
    const items = e.clipboardData?.items;
    if (items) {
      for (const item of items) {
        if (item.type.includes('image')) {
          e.preventDefault();
          message.warning(
            '禁止粘贴图片，请点击工具栏"插入图片"按钮从资源库选择',
          );
          return false;
        }
      }
    }
  });

  // 禁用拖拽图片
  editor.on('drop', (e: any) => {
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      for (const file of files) {
        if (file.type.includes('image')) {
          e.preventDefault();
          message.warning(
            '禁止拖拽上传图片，请点击工具栏"插入图片"按钮从资源库选择',
          );
          return false;
        }
      }
    }
  });
};

// 内容变化时
const handleChange = (editor: IDomEditor) => {
  const html = editor.getHtml();
  emit('update:modelValue', html);
};

// 监听外部值变化
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== valueHtml.value) {
      valueHtml.value = newValue;
    }
  },
);

// 组件销毁时
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor) {
    editor.destroy();
  }
});

// 暴露编辑器实例
defineExpose({
  getEditor: () => editorRef.value,
});
</script>

<template>
  <div class="rich-editor-container">
    <Toolbar
      :editor="editorRef"
      :default-config="toolbarConfig"
      mode="default"
      class="rich-editor-toolbar"
    />
    <Editor
      v-model="valueHtml"
      :default-config="editorConfig"
      mode="default"
      :style="{ height: `${height}px`, overflowY: 'hidden' }"
      class="rich-editor-content"
      @on-created="handleCreated"
      @on-change="handleChange"
    />
  </div>
</template>

<style scoped>
.rich-editor-container {
  overflow: hidden;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
}

.rich-editor-toolbar {
  border-bottom: 1px solid #d9d9d9;
}

.rich-editor-content {
  background-color: #fff;
}

/* 编辑器内容区域样式 */
.rich-editor-content :deep(.w-e-text-container) {
  background-color: #fff;
}

.rich-editor-content :deep(.w-e-text-placeholder) {
  color: #bfbfbf;
}

/* 聚焦时的边框颜色 */
.rich-editor-container:focus-within {
  border-color: #40a9ff;
  box-shadow: 0 0 0 2px rgb(24 144 255 / 20%);
}
</style>
