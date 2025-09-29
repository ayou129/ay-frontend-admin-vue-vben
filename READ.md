## 准备阶段

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

1. 所有的表和 API 直接访问本地的 http://localhost:9500/http.json 获取即可
2. 页面UI 模板 参考： playground/src/views 中的所有页面 以供参考
3. 页面有关表格筛选的功能，参考 apps/web-antd/src/utils/filter.ts 文件
4. 当需要新增/编辑页面时，优先参考 playground/src/views 文件夹下的所有页面，例如：
   - playground/src/views/system/menu/list.vue 页面有搜索筛选Panel 和 正文Panel 等可以参考的区域
   - playground/src/views/examples/form 文件夹下 提供了表单的参考
5. API 参考： #/api 文件夹下的所有文件，并且有 apiPrefix 配置(从config.ts 中获取)，要利用上
6. 不同的数据结构要放在合理的文件夹下，例如

- apps/web-antd/src/api/store/product.ts

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
      - 商品分类状态搜索
        - 正常
        - 已禁用
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

资源类型：1=图片 2=音频 3=视频 4=文档 5=压缩包



## 总结遇到的问题以及解决方案
### 问题：使用 useVbenDrawer 时报错 drawerApi.open is not a function 和 drawerApi.setData is not a function

原因：当 useVbenDrawer 配置中使用了 connectedComponent 参数时，返回的 drawerApi 可能会有方法绑定或作用域问题

解决方案：
1. 移除 connectedComponent 配置参数
2. 直接在抽屉模板中放入组件内容
3. 使用简单的 drawerApi.open() 调用

修正前：
const [ProductFormDrawer, drawerApi] = useVbenDrawer({
  connectedComponent: ProductForm,  // 这个参数可能导致问题
  // ...其他配置
});

修正后：
const [ProductFormDrawer, drawerApi] = useVbenDrawer({
  // 移除 connectedComponent
  title: '标题',
  width: '60%',
});

// 模板中直接使用
<ProductFormDrawer>
  <ProductForm />
</ProductFormDrawer>

这个问题可能与 VbenDrawer 的内部实现和方法绑定机制有关。


### 商品管理功能实现问题总结

1. VbenDrawer 按钮冲突问题

问题：VbenDrawer 和 VbenForm 都有默认按钮，导致冲突
解决方案：
- VbenForm 设置 showDefaultActions: false 隐藏表单按钮
- VbenDrawer 通过 onConfirm 回调控制确认按钮行为

2. 选择器默认值显示0的问题

问题：Select 组件初始显示 0 而不是空状态
解决方案：
- 字段添加 defaultValue: undefined
- 使用内置验证规则 rules: 'selectRequired' 代替复杂的 zod 规则

3. 编辑时显示ID而非中文标签

问题：编辑商品时选择器显示数字ID，不显示中文
解决方案：
- 确保选项数据格式为 {label: '中文', value: ID}
- 异步加载分类数据并等待加载完成再设置表单值
- 正确的数据类型转换（String → Number）

4. 表单验证失败仍执行API调用

问题：点击确认按钮后，即使验证失败也会调用API并关闭抽屉
解决方案：
- 手动调用 productFormApi.validate() 进行验证
- 正确检查验证结果：validateResult.valid 而不是 validateResult 本身
- 验证失败时抛出异常阻止后续执行

5. 异步数据获取时序问题

问题：编辑时分类数据还未加载完成就设置表单值
解决方案：
- 在设置表单值前确保分类数据已加载：await loadCategoryOptions()
- 使用 Promise 处理异步加载时序

6. 表单验证逻辑理解错误

问题：误以为 VbenForm 的 submitForm() 会自动处理验证
解决方案：
- 理解 VbenForm 的验证返回对象结构：{valid: boolean, errors: object}
- 手动控制验证和提交流程，而不是依赖框架自动处理

7. 模块化设计问题

问题：单一组件过于复杂，难以维护
解决方案：
- 拆分为多个组件：search-form.vue, product-table.vue, product-form.vue
- 通过 props 和 events 进行组件通信
- 使用 defineExpose 暴露子组件方法给父组件

核心经验教训：

1. 阅读官方示例：遇到问题时优先参考 playground 中的标准用法
2. 理解框架机制：不要假设框架行为，要阅读源码理解实际机制
3. 正确的错误处理：使用 try-catch 和异常抛出来控制业务流程
4. 数据类型一致性：确保 API 数据类型与表单组件期望类型一致

