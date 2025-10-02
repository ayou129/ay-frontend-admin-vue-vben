# 资源组件使用文档

## 组件列表

### 基础组件

- `ResourcePickerModal` - 资源选择弹窗（通用）
- `ResourceList` - 资源列表（通用）
- `ResourceFolderTree` - 资源目录树（通用）
- `ResourcePreview` - 资源预览（通用）

### 业务组件

- `SpuResourceSelector` - 商品资源选择器（业务专用）

## 使用方式

### 1. 在表单中使用（SpuResourceSelector）

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { SpuResourceSelector } from '#/components/resource';
import { ResourceType } from '#/types/resource';

const carousels = ref([]);
</script>

<template>
  <SpuResourceSelector
    v-model="carousels"
    :max="10"
    :accept-types="[ResourceType.Image]"
  />
</template>
```

### 2. 富文本编辑器中插入图片

```vue
<script setup lang="ts">
import { openResourcePicker } from '#/components/resource';
import { ResourceType } from '#/types/resource';

// 在富文本编辑器中插入图片的处理函数
async function handleInsertImage() {
  const resources = await openResourcePicker({
    mode: 'single',
    acceptTypes: [ResourceType.Image],
  });

  if (resources.length > 0) {
    return resources[0].url; // 返回图片 URL
  }
  return null;
}
</script>

<template>
  <RichEditor v-model="description" :image-handler="handleInsertImage" />
</template>
```

### 3. 直接使用 composable

```vue
<script setup lang="ts">
import { useResourcePicker } from '#/components/resource';
import { ResourceType } from '#/types/resource';

const { openResourcePicker } = useResourcePicker();

async function selectImages() {
  const resources = await openResourcePicker({
    mode: 'multiple',
    acceptTypes: [ResourceType.Image, ResourceType.Video],
    maxSelection: 5,
  });

  console.log('选中的资源:', resources);
}
</script>
```

## API 文档

### openResourcePicker(options)

#### Options

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| mode | `'single' \| 'multiple'` | `'multiple'` | 选择模式 |
| acceptTypes | `ResourceType[]` | `[]` | 接受的资源类型 |
| selectedIds | `number[]` | `[]` | 已选中的资源 IDs（用于回显） |
| maxSelection | `number` | `30` | 最大选择数量 |

#### 返回值

`Promise<Resource[]>` - 返回选中的资源列表

### SpuResourceSelector Props

| 参数        | 类型             | 默认值                 | 说明             |
| ----------- | ---------------- | ---------------------- | ---------------- |
| modelValue  | `Resource[]`     | `[]`                   | 已选择的资源列表 |
| max         | `number`         | `10`                   | 最大选择数量     |
| acceptTypes | `ResourceType[]` | `[ResourceType.Image]` | 接受的资源类型   |

### SpuResourceSelector Events

| 事件              | 参数         | 说明               |
| ----------------- | ------------ | ------------------ |
| update:modelValue | `Resource[]` | 选择的资源发生变化 |

## 功能特性

### 资源选择器 (ResourcePickerModal)

- ✅ 左侧目录树 + 右侧文件列表布局
- ✅ 支持搜索文件名
- ✅ 支持按类型筛选
- ✅ 支持直接上传（最多30个文件）
- ✅ 支持单选/多选模式
- ✅ 支持已选资源回显
- ✅ 支持文件删除
- ✅ 支持文件移动到其他目录
- ✅ 上传后自动选中

### 目录管理 (ResourceFolderTree)

- ✅ 创建根目录
- ✅ 创建子目录
- ✅ 编辑目录
- ✅ 删除目录
- ✅ 目录树操作菜单（hover 显示）

### 资源预览 (ResourcePreview)

- ✅ 图片预览（高清大图）
- ✅ 视频播放
- ✅ 音频播放
- ✅ 文件信息展示
- ✅ 不支持预览的文件提供下载链接

### 商品资源选择器 (SpuResourceSelector)

- ✅ 网格展示已选资源
- ✅ 拖拽排序（影响保存顺序）
- ✅ 单个删除
- ✅ 数量提示 (已选 3/10)
- ✅ 正方形缩略图显示
