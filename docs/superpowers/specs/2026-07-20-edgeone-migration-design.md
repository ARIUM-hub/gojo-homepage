# 五条悟个人主页 EdgeOne 迁移设计

## 背景

当前站点已通过 Vercel 发布，正式地址为 <https://gojo-homepage.vercel.app>。生产构建体积较小，页面不依赖第三方字体或外部接口；但在中国大陆手机蜂窝网络下，Vercel 页面和独立图片资源都可能长时间卡住并最终无法打开。现象表明主要问题是运营商网络到 `vercel.app` 节点的访问质量，而不是应用代码或资源体积。

本次迁移使用 EdgeOne Pages/Makers 提供面向国内访问更友好的发布入口，同时保留现有 Vercel 部署作为备用。

## 目标

- 将 GitHub 仓库 `ARIUM-hub/gojo-homepage` 的 `master` 分支自动部署到 EdgeOne。
- 每次合并或推送到 `master` 后，由 EdgeOne 自动执行生产构建并发布。
- 确保首页、个人档案页、客户端 404 页面、JavaScript、CSS 和人物图片均能正常访问。
- 重点验证手机蜂窝网络下的首次加载和直接打开 `/profile` 的行为。
- 保留现有 Vercel 配置和线上地址，作为迁移期间及迁移后的备用入口。

## 非目标

- 本次不购买或接入自定义域名，不处理 ICP 备案。
- 不删除 Vercel 项目、`vercel.json` 或现有 Vercel 部署。
- 不修改页面视觉设计、人物资料或交互功能。
- 不引入 GitHub Actions、EdgeOne CLI Token 或额外部署服务。

## 方案比较

### 方案 A：EdgeOne 直接关联 GitHub（已选定）

EdgeOne 获得用户授权后读取 GitHub 仓库，监听 `master`，自动执行 `npm run build`，并发布 `dist` 目录。

优点是配置最少、无需保存部署令牌、后续更新自动化程度高；限制是构建及路由回退行为受 EdgeOne Pages 平台能力约束，需要在首次部署后进行针对性验证。

### 方案 B：GitHub Actions 调用 EdgeOne CLI 或 API

由 GitHub Actions 负责构建和发布。它能提供更细粒度的流程控制，但需要创建并维护 Token、GitHub Secrets 和工作流文件，增加安全与排障成本。当前项目规模不需要这层复杂度。

### 方案 C：手动上传生产目录

本地构建后直接上传 `dist`。它适合紧急恢复或验证平台，但不满足用户要求的 GitHub 自动部署，因此只作为应急思路，不作为正式方案。

## 部署架构与流程

正式发布链路为：

1. 将现有草稿 PR #1 合并到 GitHub 的 `master` 分支。
2. 用户本人注册并登录 EdgeOne Makers，完成 GitHub 授权。
3. 在 EdgeOne 中导入 `ARIUM-hub/gojo-homepage`，生产分支选择 `master`。
4. 使用 Vite 项目配置：安装依赖后执行 `npm run build`，发布目录为 `dist`。
5. EdgeOne 为首次部署生成默认域名；先使用默认域名验证，不在本阶段引入自定义域名。
6. 后续每次更新 `master` 时，EdgeOne 自动触发新的生产部署。

用户必须亲自完成账号注册、登录和 GitHub 授权。代码修改、构建检查、部署参数建议及部署结果验证可由 Codex 协助完成。

## 配置文件策略

- 保留 `vercel.json`，确保 Vercel 备用站继续支持 SPA 路由回退。
- 新增 `edgeone.json` 时，仅使用 EdgeOne 官方支持的配置能力，例如静态资源缓存响应头。
- 不把 Vercel 的 `/(.*) -> /index.html` 重写规则原样复制到 EdgeOne。EdgeOne 普通重写规则不保证支持 SPA 前端路由回退，错误迁移可能导致 `/profile` 无法直接打开。
- 对带内容哈希的 `/assets/*` 资源设置长期缓存，目标为 `Cache-Control: public, max-age=31536000, immutable`；HTML 入口不设置长期缓存，避免发布后仍命中旧版本。

`edgeone.json` 的最终字段以实施时的 EdgeOne 官方文档和平台校验结果为准，不写入未经平台支持的猜测配置。

## SPA 路由处理

应用使用 `BrowserRouter`，包含 `/`、`/profile` 和客户端 `path="*"`。客户端 404 路由只能在 `index.html` 已加载后生效，因此以下行为属于发布阻断项：

- 直接打开 EdgeOne 默认域名的 `/profile` 必须返回应用入口，而不是平台 404。
- 在 `/profile` 刷新页面后必须仍能进入个人档案页。
- 访问不存在的应用路径后，必须由 React 渲染项目自己的 404 页面。

首次部署优先使用 EdgeOne 的 Vite/SPA 框架预设验证自动回退行为。若平台预设没有回退到 `index.html`，实施阶段只采用 EdgeOne 官方明确支持的 SPA 输出或路由方案；在方案被验证前不使用普通 catch-all rewrite 冒充 SPA fallback，也不把 `404.html` 放入输出目录。

## 缓存与性能

- JavaScript、CSS 及构建产生的哈希资源采用长期缓存。
- 人物图片可采用长期缓存；更换图片时必须通过文件名或构建产物变化完成缓存失效。
- `index.html` 保持短缓存或遵循 EdgeOne Pages 默认发布策略，保证新部署及时生效。
- 不引入第三方字体、统计脚本或运行时 API，以维持现有轻量页面结构。

EdgeOne 迁移的成功标准不是仅看构建完成，而是比较真实网络下的可达性。最终必须使用未连接 Wi-Fi 的大陆手机蜂窝网络测试。

## 错误处理与回退

- 如果 EdgeOne 构建失败，先读取平台构建日志，区分依赖安装、TypeScript、Vite 构建和输出目录错误；在本地复现通过后再推送修复。
- 如果只有 `/profile` 直接访问失败，视为 SPA 托管配置问题，不修改 React 页面逻辑掩盖问题。
- 如果 EdgeOne 默认域名在手机网络下仍不可达，记录运营商、时间和具体资源 URL，并保留 Vercel 链接；不删除任何可用部署。
- 新部署验证失败时，GitHub `master` 保留可构建版本，EdgeOne 回退使用平台的历史部署能力；Vercel 继续作为外部备用入口。

## 安全与权限

- EdgeOne 登录、腾讯云账号注册和 GitHub OAuth 授权均由用户本人完成。
- 授权范围尽量限制到 `ARIUM-hub/gojo-homepage` 仓库。
- 不在代码、终端历史、聊天内容或仓库中保存 EdgeOne Token。
- 本方案不需要设置 `VERCEL_TOKEN` 或新的 GitHub Secrets。

## 验证与验收

### 合并前验证

- `npm test` 全部通过。
- `npm run build` 成功，并生成 `dist`。
- 工作树仅包含经过确认的迁移相关变更。

### EdgeOne 部署验证

- EdgeOne 构建状态成功，发布目录识别为 `dist`。
- 首页 `/` 可打开，样式、人物图片和交互正常。
- `/profile` 可通过页面内按钮进入。
- `/profile` 可直接打开并刷新。
- 不存在的路径显示应用自己的 404 页面。
- JavaScript、CSS 和 JPEG 请求返回成功，浏览器控制台无资源加载错误。
- 哈希静态资源的缓存头符合长期缓存设计，HTML 不被错误地长期缓存。

### 真实网络验收

- 在手机关闭 Wi-Fi 后，通过蜂窝网络打开 EdgeOne 默认域名。
- 首次加载能在可接受时间内完成，不再卡在接近完成后报“无法打开”。
- 连续测试首页、个人档案页、人物图片和刷新操作。
- EdgeOne 验收通过后，将新地址作为面向国内访问的主链接；Vercel 地址继续保留为备用链接。

## 官方参考

- [导入 Git 仓库](https://pages.edgeone.ai/document/importing-a-git-repository)
- [Vite 部署](https://pages.edgeone.ai/document/vite)
- [EdgeOne JSON 配置](https://pages.edgeone.ai/document/edgeone-json)
- [缓存配置](https://pages.edgeone.ai/document/configuring-cache)
- [从 Vercel 迁移](https://pages.edgeone.ai/document/migrating-from-vercel-to-edgeone-pages)
