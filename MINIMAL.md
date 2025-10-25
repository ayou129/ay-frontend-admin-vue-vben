简化说明（仅保留 apps/web-antd）

保留内容

- 应用：`apps/web-antd`
- 内部配置：`internal/{vite-config,tailwind-config,tsconfig}`（继续复用，避免大改）
- 依赖包：`packages` 下被 `web-antd` 直接或间接依赖的包均保留（如 `@vben/{styles,layouts,common-ui,...}` 及 `@vben-core/*`）

已移除

- 其他应用：`apps/web-naive`、`apps/web-ele`、`apps/backend-mock`
- 示例与文档：`playground`、`docs`
- 未用样式变体：`packages/styles/src/naive`、`packages/styles/src/ele`
- 仓库协作元信息：`.changeset`、`.github`、`.claude`、`.vscode`

工作区配置

- `pnpm-workspace.yaml` 已移除 `docs`、`playground` 条目。
- 根 `package.json` 已移除无效的 `build:*`、`dev:*`（naive/ele/docs/playground）脚本。

如何运行

- 安装依赖：`pnpm install`
- 开发：`pnpm -F @vben/web-antd run dev`
- 构建：`pnpm run build:antd`
- 预览（可选）：`pnpm -F @vben/web-antd run preview`

注意事项

- 若未来需要彻底去除内部配置包，可将 `apps/web-antd` 的 `vite.config.mts`、`tailwind.config.mjs`、`postcss.config.mjs`、`tsconfig*.json` 内联为本地配置后，再删除 `internal/*` 对应包。
- `scripts/`、`Dockerfile` 等部署脚本仍保留。如不需要，可后续自行移除。
