## Git Commit规范

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

1. 所有的数据表、表字段的枚举类型 和 API(请求参数/返回结构/API 路径/鉴权说明) 直接访问本地的 http://localhost:9500/http.json 获取 Swagger JSON 即可
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
      - 商品状态搜索
      - 库存数量搜索
      - 价格范围搜索
      - 创建时间范围搜索
    - 商品正文 Panel
      - 有个 Switch Tab 按钮 [出售中的商品/已下架的商品/售罄的商品]每个 Tab 名称右侧紧跟(数据数量)，点击后自动切换表格
      - 按钮区域
        - 添加商品
        - 商品采集按钮
        - 批量修改(暂不实现)
        - 数据导出
      - 表格区域 根据后端字段进行展示
        - 支持编辑和删除
      - 编辑商品窗口
        - 基础信息 spu
          - 商品分类 category_id
          - 轮播图 carousels
          - 上下架情况 status
          - 商品类型 type
          - 商品名称 name
          - ...
        - 库存相关 skus
        - 商品详情 detail
        - 物流设置(实物商品才能设置)
        - 营销设置 活动、优惠券等，这里先不实现
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

#### 商品管理

##### 商品编辑窗口设计

```text
| 方案          | 优点                   | 缺点              | 适用场景           |
|-------------|----------------------|-----------------|----------------|
| Tabs 分组 ✅   | 清晰分类、减少页面密度、易于在模块间切换 | 需要管理多个表单状态      | 字段多、分类明确、关联性不强 |
| Collapse 折叠 | 可同时展开多个、上下滚动连续       | 展开后页面很长、视觉层级不清晰 | 字段少、需要对比查看     |
| Divider 分割  | 实现简单、一页看完            | 页面很长、没有明显分组     | 字段少、逻辑简单       |
| Steps 步骤    | 引导性强、分步填写            | 来回切换麻烦、不适合编辑    | 新建向导类流程        |

SpuFormModal (Modal 60% 宽度)
└── Tabs(与顶部窗口的距离保持非常小的间隔即可)
    ├── TabPane "基础信息"
    │   └── VbenForm (基础字段)
    │       - 商品名称、分类、类型、状态
    │       - 轮播图、有效期等
    │
    ├── TabPane "库存管理"
    │   └── SkuManagement 组件
    │       - 规格属性配置
    │       - SKU 表格（价格、库存、编码）
    │
    ├── TabPane "商品详情"
    │   └── RichEditor (富文本)
    │       - 集成资源选择器插入图片
    │
    └── TabPane "物流设置" (v-if="商品类型 === 实物商品")
        └── VbenForm (物流字段)
            - 运费模板、发货地等

技术要点：
1. 状态管理：使用 ref 管理各 Tab 的表单数据，统一在 Modal 的 onConfirm 中收集提交
2. 条件渲染：监听商品类型字段，动态显示/隐藏物流Tab
3. 表单验证：每个 Tab 的表单独立验证，提交时依次验证所有 Tab
4. 数据回显：编辑时需要将后端数据分发到各个 Tab 的表单中
```

⚠️ 需要确认的问题：

1. SKU 管理 API：目前 Swagger 中 SPU 的创建/更新 API 不接受 skus 字段。请确认：

- SKU 不需要单独的 API 管理，他是和 spu 编辑一起请求保存的

2. 物流设置 Tab：READ.md 中提到了"物流设置"（仅实物商品显示），但 Swagger 中没有相关字段。请提供物流设置需要的字段列表。

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
└── index.ts                   # 资源组件入口

src/views/spu/management/components/
└── SpuResourceSelector.vue  # 商品资源选择器（业务专用）

## ResourcePreview 组件
- 显示资源缩略图，点击后可以查看大图，并且如果是视频，点击后视频播放

## ResourceList 组件
- 只负责渲染列表 + 发出点击事件，选择逻辑由父组件控制

## ResourceFolderTree 组件
- 左侧目录树，点击后右侧文件列表切换
  - 目录树 要显示顶级节点 全部资源
  - 存在子节点的节点左侧显示展开/折叠图标，不存在则不显示 svg 或图标
  - 每个节点右侧显示 ... 图标，点击后弹出菜单，菜单内容为：新建子目录、编辑、删除，目前已经有了但是三个点和左侧的节点文字间隔有点小，再略微增加一点点

## ResourcePickerModal 组件（选择弹窗）
### 布局： 弹窗 = 左侧目录树 + 右侧文件列表
左侧：
- 目录树（ResourceFolderTree）
- 点击目录切换右侧文件列表
右侧：
- 文件列表（ResourceList）
- 支持搜索、筛选类型（实时搜索，300ms防抖）
- 文件列表带复选框（单选/多选）
- 支持直接上传到当前目录
底部：
- 显示已选数量
- 取消/确认按钮
### 需支持：
- 初始选中状态（传入已选IDs进行回显）
- 单选/多选模式切换
- 类型过滤（image/video/file）
  - 选择栏组件应该支持 allow-clear
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

## VbenModal + Tabs 滚动布局解决方案

### 问题：VbenModal 中使用 Tabs 时的滚动问题

当在 VbenModal 中嵌套 Tabs 组件时，常见问题：

- Tab 标签无法固定在顶部（滚动时消失）
- 出现双滚动条（Modal body + TabPane）
- TabPane 内容无法滚动
- 全屏时高度不正确

### 解决方案

**核心原理：单一滚动容器 + 完整 Flex 布局链**

```
VbenModal (固定高度)
├── Modal Body (flex:1, overflow:hidden)
│   └── 内容组件 (flex:1)
│       └── Tabs (flex:1)
│           ├── TabNav (flex-shrink:0) ← 固定
│           └── TabPane (flex:1, overflow-y:auto) ← 唯一滚动点
```

**代码示例：**

```vue
<!-- Modal 配置 -->
<VbenModal
  content-class="!overflow-hidden !p-4 !flex-1 !flex !flex-col !min-h-0"
>
  <YourTabsComponent />
</VbenModal>

<!-- 非 scoped 样式 - 修改 Modal 宽高 -->
<style>
[role='dialog']:not(.size-full) {
  width: 75vw !important;
  height: 80vh !important;
}
[role='dialog'].size-full {
  width: 100vw !important;
  height: 100vh !important;
}
</style>

<!-- Tabs 组件样式 -->
<style scoped>
.tabs-wrapper {
  flex: 1; /* 使用 flex:1 而非 height:100% */
  display: flex;
  flex-direction: column;
  min-height: 0; /* 允许正确收缩 */
}

.tabs-wrapper :deep(.ant-tabs-tabpane) {
  flex: 1;
  min-height: 0;
  overflow-y: auto; /* 唯一滚动点 */
}
</style>
```

**关键点：**

1. `contentClass` 必须包含 `!overflow-hidden` 禁用 VbenModal 默认滚动
2. 使用 `flex: 1` 而非 `height: 100%` 进行高度传递
3. 每层都要添加 `min-height: 0` 允许 flex 子元素收缩
4. 修改 Modal 宽度必须用非 scoped 样式 + `!important`
5. 只在 TabPane 层设置 `overflow-y: auto`

## 表单提示文本样式

在表单字段下方显示提示信息时，使用统一的样式类：

```vue
<Form.Item label="字段名">
  <Input v-model:value="formState.field" />
  <div class="form-item-tip">
    这里是提示文本，说明字段的格式或使用说明
  </div>
</Form.Item>
```

**样式定义：**

```css
.form-item-tip {
  margin-top: 6px;
  margin-left: 4px;
  font-size: 12px;
  color: #6b7280;
}
```

**适用场景：**

- 字段格式说明（如：日期格式、数值范围）
- 操作提示（如：最多上传 10 张图片）
- 补充说明（如：动态有效期输入天数）
