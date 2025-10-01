## 准备阶段

### TypeScript 配置

**moduleResolution 弃用警告修复：**

- 问题：VSCode 提示 `moduleResolution=node10` 已弃用
- 位置：`/internal/tsconfig/base.json` 第 14 行
- 解决：将 `"moduleResolution": "node"` 改为 `"moduleResolution": "bundler"`
- 原因：项目使用 Vite 构建，bundler 是现代化最佳选择

### Git Commit规范

```bash
# feat: 新功能
# fix: 修复bug
# perf: 性能优化
# refactor: 重构代码
# docs: 文档更新
# style: 代码格式

git commit -m 'fix: add xxxxx'
# 忽略提交规范
git commit -m 'feat: 商品管理页面 UI' --no-verify
```

## 需求

> 当前项目针对的是 apps/web-antd 应用

1. 所有的表和 API 直接访问本地的 http://localhost:9500/http.json 获取 Swagger JSON 即可
2. 页面UI 模板 参考： playground/src/views 中的所有页面 以供参考
3. 页面有关表格筛选的功能，参考 apps/web-antd/src/utils/filter.ts 文件
4. 当需要新增/编辑页面时，优先参考 playground/src/views 文件夹下的所有页面，例如：
   - playground/src/views/system/menu/list.vue 页面有搜索筛选Panel 和 正文Panel 等可以参考的区域
   - playground/src/views/examples/form 文件夹下 提供了表单的参考
5. API 参考： #/api 文件夹下的所有文件，并且有 apiPrefix 配置(从config.ts 中获取)，要利用上
6. 不同的数据结构要放在合理的文件夹下，例如

- apps/web-antd/src/api/store/spu.ts

### 商品功能

#### 商品 Menu 以及 UI 设计

- 商品
  - 商品统计 Panel
    - 商品概况
      - 数据
        - 商品浏览量
          - 环比增长: xxx
        - 商品访客数
          - 环比增长: xxx
        - 支付件数
          - 环比增长: xxx
        - 支付金额
          - 环比增长: xxx
        - 退款件数
          - 环比增长: xxx
        - 退款金额
          - 环比增长: xxx
      - 图表
    - 商品排行 Panel
      - 搜索框
        - 排行类型
          - 商品浏览量
          - 商品访客数
          - 加购件数
          - 支付金额
          - 收藏数量
          - 访客-支付转化率
        - 时间范围，两个时间选择框 (根据天数搜索 例如 今天 9 月 28 日，默认显示 2025/08/28-2025/09/28)
          - 不设置快捷时间按钮
      - 表格展示即可
        - id
        - 商品图片
        - 商品名称
        - 后续的字段都是筛选字段
  - 商品管理
    - 搜索框 Panel
      - 商品名称/关键字/ID 搜索
      - 商品类型搜索
        - 全部
        - 实物商品
        - 卡密商品
        - 优惠券商品
        - 酒店订单
      - 商品状态搜索
        - 全部
        - 正常
        - 已下架
      - 库存数量搜索
        - 最小值-最大值
      - 价格范围搜索
        - 最小值-最大值
      - 创建时间范围搜索
        - 最小值-最大值
    - 商品正文 Panel
      - 有个 Switch Tab 按钮 [出售中的商品/已下架的商品/售罄的商品]每个 Tab 名称右侧紧跟(数据数量)，点击后自动切换表格
      - 按钮区域
        - 添加商品
        - 商品采集按钮
        - 批量修改(暂不实现)
        - 数据导出
      - 表格区域 根据后端字段进行展示
        - 支持编辑和删除
  - 商品分类
    - 搜索框 Panel
      - 商品分类名称 搜索
    - 正文
      - 添加分类按钮
      - 表格区域 根据后端字段进行展示 并且分类名称应该是 Tree 结构
        - 支持编辑和删除
  - 商品规格(暂不实现)
    - 规格模板表 和 规格表 是1对多关系
      - name
    - 规格表
      - name
      - value
  - 商品参数(暂不实现)
  - 商品标签(暂不实现)
  - 商品保障(暂不实现)
  - 商品评论(暂不实现)

### 资源组件支持

- 商品编辑页面
- 商品描述富文本编辑页面
  - 这里如果想在富文本中如果想插入图片，必须从资源库中选择，也就是说要上传到资源的某个目录中，然后选择才可以

```text
# 资源组件结构
src/components/resource/
├── ResourcePickerModal.vue    # 资源选择弹窗（通用）
├── ResourceList.vue           # 资源列表（通用）
├── ResourceFolderTree.vue     # 资源目录树（通用）
└── ResourcePreview.vue        # 资源预览（通用）

src/views/spu/management/components/
└── SpuResourceSelector.vue  # 商品资源选择器（业务专用）

## ResourcePreview 组件
- 显示资源缩略图，点击后可以查看大图，并且如果是视频，点击后视频播放

## ResourceList 组件
- 只负责渲染列表 + 发出点击事件，选择逻辑由父组件控制

## ResourcePickerModal 组件（选择弹窗）
### 布局： 弹窗 = 左侧目录树 + 右侧文件列表
左侧：
- 目录树（ResourceFolderTree）
- 点击目录切换右侧文件列表
右侧：
- 文件列表（ResourceList）
- 支持搜索、筛选类型
- 文件列表带复选框（单选/多选）
- 支持直接上传到当前目录
底部：
- 显示已选数量
- 取消/确认按钮
### 需支持：
- 初始选中状态（传入已选IDs进行回显）
- 单选/多选模式切换
- 类型过滤（image/video/file）
- 上传后自动选中
- 上传限制最大 30个文件

## SpuResourceSelector
## 组件职责
<SpuResourceSelector
  v-model="carousels"
  :max="10"
  accept-types="image"
/>

包含：
- 预览区域：显示已选资源缩略图网格
- 拖拽排序：支持调整顺序（影响保存到后端的sort）
- 删除功能：单个移除
- 数量提示：已选 3/10
- 选择按钮：打开 ResourcePickerModal

数据绑定方式建议：
- v-model 绑定 Resource[]（完整对象，包含id、url、name等）
- 编辑回显：后端返回 carousels: Resource[] 直接赋值
- 提交时：提取 carousels.map(r => r.id) 或直接传完整对象

ResourcePickerModal 需支持：


# 完整数据流
##  场景1：SPU 编辑 - 轮播图
<FormItem label="轮播图">
  <ResourceSelector v-model="carouselImageIds" :max="10" />
</FormItem>

流程：
1. 加载编辑：
  - 后端返回 carousels: [{...}] 资源详情
  - 显示资源预览
2. 选择资源：
  - 点击"选择资源" → 打开 ResourcePickerModal 时 交互 IDs 进行数据回显
  - 对文件进行操作 → 返回 Resource[]
  - 更新 v-model
3. 保存：
  - 提交 carousels: [{...}] 到后端，注意顺序，前端传入的顺序就是后端保存的顺序
  - 后端处理 resource_relation 表：
      - 删除旧关联（relation_type=1, relation_id=spu_id）
    - 插入新关联（resource_id + sort）
## 场景2：富文本编辑 - 插入图片
配置：
<RichEditor
  v-model="description"
  :image-handler="handleInsertImage"
/>
逻辑：
async function handleInsertImage() {
  const resources = await openResourcePicker({
    mode: 'single',
    acceptTypes: [ResourceType.Image]
  });
  return resources[0].file_path; // 返回 URL
}
存储：
- 富文本直接存储 HTML：<img src="完整 URL" />
- 不存储 resource_relation 记录
```

1. 这个资源组件，任何地方都可以调用，选择文件列表后，组件会返回文件列表数据
2. 假设是商品编辑窗口 有商品轮播图字段，右侧就是[资源组件] 显示默认的 待添加的按钮(具体样式先不定)，点击后弹出资源组件，选择文件列表后，组件会返回文件列表数据，进而展示，但是此时数据不请求后端，点击保存后请求进行信息存储
3. 疑惑点：

- 假设场景：商品编辑窗口 轮播图右侧的实际展示资源列表的地方 究竟是如何设计，是制作成一个 资源选择组件 还是？

实现前的流程思考：

1. 思考 当前的设计是否合理，是否需要优化
2. 实现所有相关的 API 和 组件 大纲
3. 按照功能 分成若干个小功能 逐个实现

实现流程细节：

1. Resource API + 类型定义
2. 基础组件：ResourceFolderTree → ResourceList → ResourcePickerModal
3. 业务组件：SpuResourceSelector
4. 集成测试：在SPU编辑表单中使用

## 总结遇到的问题以及解决方案

### 1. VbenDrawer 使用规范

**问题 1：drawerApi.setData/open 方法无效**

- 原因：使用 `connectedComponent` 参数导致方法绑定问题
- 方案：移除该参数，在模板中直接放入组件 `<Drawer><Form /></Drawer>`

**问题 2：抽屉内表单数据传递**

- 错误做法：使用 `drawerApi.setData()` + `drawerApi.getData()` 在子组件内部获取
- 正确做法：使用 props 传递数据，父组件通过 ref 状态管理

```vue
// 父组件 const editData = ref(); const onCreate = () => { editData.value = {
onSuccess: async (data) => { ... } }; drawerApi.open(); }; // 子组件
<CategoryForm :edit-data="editData" />
```

**问题 3：抽屉与表单按钮冲突**

- 方案：VbenForm 设置 `showDefaultActions: false`，由 VbenDrawer 的 `onConfirm` 统一处理

### 2. VbenForm 使用规范

**基础配置建议：**

```javascript
useVbenForm({
  compact: true, // 紧凑间距（pb-2 替代 pb-4）
  layout: 'horizontal', // 水平布局
  commonConfig: {
    labelWidth: 80, // 标签宽度统一
    disabledOnChangeListener: false, // 启用 change 事件（自动搜索时需要）
    disabledOnInputListener: false, // 启用 input 事件（自动搜索时需要）
  },
});
```

**搜索表单配置：**

```javascript
useVbenForm({
  // 按钮布局
  actionLayout: 'newLine',    // 按钮新起一行占满整行
  actionPosition: 'right',    // 按钮靠右对齐
  showDefaultActions: true,   // 显示内置按钮

  // 自动搜索（任意字段值改变即触发）
  handleValuesChange: (values) => {
    emit('search', values);
  },

  // 按钮回调
  handleSubmit: async (values) => { ... },
  handleReset: async () => { ... },
})
```

**样式规范：**

```vue
<!-- 搜索框容器统一样式 -->
<div class="mb-4 rounded-lg bg-white shadow">
  <div class="p-4">
    <SearchForm />
  </div>
</div>
```

**表单验证：**

- 验证返回结构：`{ valid: boolean, errors: object }`
- 验证失败时抛出异常阻止后续流程

```javascript
const { valid } = await formApi.validate();
if (!valid) throw new Error('表单验证失败');
```

**选择器配置：**

- 使用 `defaultValue: undefined` 避免显示 0
- 使用 `rules: 'selectRequired'` 而非复杂 zod 规则
- 异步数据需等待加载完成再 setValues

### 3. ApiTreeSelect 使用规范

**必需配置（三要素）：**

```javascript
{
  component: 'ApiTreeSelect',
  componentProps: {
    childrenField: 'children',  // 子节点字段（必须显式指定）
    valueField: 'id',           // 值字段
    labelField: 'name',         // 标签字段
    api: async () => { ... },
  }
}
```

- 即使使用默认字段名也必须显式配置，否则会出现 `TreeNode value is invalidate: undefined` 警告

### 4. VxeGrid 表格操作按钮

**CellOperation 渲染器配置：**

- 需在 `/apps/web-antd/src/adapter/vxe-table.ts` 中注册
- 支持预设操作：`'edit'`, `'delete'` 和自定义操作

```javascript
{
  cellRender: {
    name: 'CellOperation',
    attrs: {
      nameField: 'name',
      onClick: onActionClick,
    },
    options: [
      { code: 'append', text: '新增子分类' },
      'edit',
      'delete',
    ],
  },
}
```

### 5. 常见问题速查

| 问题 | 原因 | 解决方案 |
| --- | --- | --- |
| 搜索框上下间距不一致 | 表单字段自带 `pb-4` | 设置 `compact: true` |
| 编辑时显示 ID 不显示文本 | 异步数据未加载完成 | await 数据加载后再 setValues |
| 表单验证失败仍提交 | 未正确检查 valid | 检查 `validateResult.valid` |
| 按钮不靠右 | 缺少布局配置 | `actionLayout: 'newLine'`, `actionPosition: 'right'` |
| 自动搜索不生效 | 事件监听被禁用 | `disabledOnChangeListener: false` |
| 递归函数类型推断错误 | TypeScript 无法推断递归返回类型 | 显式声明变量类型 `const result: Type[] = ...` |

### 6. 最佳实践

1. **优先参考 playground 示例**：遇到问题先查看 `playground/src/views` 标准用法
2. **组件模块化**：复杂页面拆分为 search-form.vue、table.vue、form.vue
3. **数据类型一致**：确保 API 数据类型与组件期望类型一致
4. **统一配置**：labelWidth、compact、样式等在项目中保持一致
