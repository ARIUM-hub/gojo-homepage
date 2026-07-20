# EdgeOne Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将五条悟个人主页从 GitHub `master` 自动部署到 EdgeOne，并验证中国大陆手机网络可达性，同时保留 Vercel 备用站。

**Architecture:** EdgeOne Pages/Makers 直接关联 `ARIUM-hub/gojo-homepage`，以 `master` 为生产分支，执行 `npm ci` 和 `npm run build`，发布 Vite 的 `dist`。仓库只新增 EdgeOne 缓存配置及其测试，不复制 Vercel 的 SPA rewrite；直接路由回退由 EdgeOne 的 Vite/SPA 托管能力提供，并通过 HTTP、浏览器和手机蜂窝网络三层验证。

**Tech Stack:** React 18、TypeScript、Vite 6、Vitest 3、GitHub、GitHub CLI、EdgeOne Pages/Makers、PowerShell

---

## 文件结构

- 创建 `edgeone.json`：只负责 EdgeOne 静态资源响应头；不包含 SPA rewrite、令牌或环境变量。
- 创建 `src/tests/deployment-config.test.ts`：锁定 EdgeOne 缓存规则，并防止以后误加普通 rewrite。
- 保留 `vercel.json`：继续为 Vercel 备用站提供 SPA 回退，不在本计划中修改。
- 保留 `src/AppRoutes.tsx`：现有 `/`、`/profile` 和 `path="*"` 客户端路由已经满足应用层需求，不修改页面代码。

### Task 1: 用测试锁定 EdgeOne 配置边界

**Files:**
- Create: `src/tests/deployment-config.test.ts`
- Reference: `vercel.json`
- Reference: `src/AppRoutes.tsx`

- [ ] **Step 1: 确认基线分支和测试状态**

Run:

```powershell
git status --short --branch
npm test
npm run build
```

Expected: 当前分支为 `codex/gojo-homepage`；除计划允许的文件外工作树干净；现有 24 个测试全部通过；生产构建成功并生成 `dist`。

- [ ] **Step 2: 写入会失败的部署配置测试**

Create `src/tests/deployment-config.test.ts`:

```ts
import { describe, expect, it } from 'vitest'

import edgeOneConfig from '../../edgeone.json'

const immutableCacheHeader = {
  key: 'Cache-Control',
  value: 'public, max-age=31536000, immutable',
}

describe('EdgeOne deployment config', () => {
  it('长期缓存带哈希的构建资源和人物图片', () => {
    expect(edgeOneConfig.headers).toEqual([
      {
        source: '/assets/*',
        headers: [immutableCacheHeader],
      },
      {
        source: '/images/*',
        headers: [immutableCacheHeader],
      },
    ])
  })

  it('不使用普通 rewrite 模拟 SPA fallback', () => {
    expect(edgeOneConfig).not.toHaveProperty('rewrites')
  })
})
```

- [ ] **Step 3: 运行测试并确认它因为配置文件不存在而失败**

Run:

```powershell
npx vitest run src/tests/deployment-config.test.ts
```

Expected: FAIL，错误指出无法解析 `../../edgeone.json`。如果测试因其他原因失败，先修正测试环境，不创建配置文件掩盖错误。

### Task 2: 添加最小 EdgeOne 缓存配置

**Files:**
- Create: `edgeone.json`
- Test: `src/tests/deployment-config.test.ts`

- [ ] **Step 1: 创建经过官方格式核对的配置**

Create `edgeone.json`:

```json
{
  "headers": [
    {
      "source": "/assets/*",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/images/*",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

不要添加 `rewrites`。`/profile` 的服务器回退必须由 EdgeOne 的 Vite/SPA 托管能力处理。

- [ ] **Step 2: 运行定向测试并确认通过**

Run:

```powershell
npx vitest run src/tests/deployment-config.test.ts
```

Expected: 2 个测试全部 PASS。

- [ ] **Step 3: 运行完整测试和生产构建**

Run:

```powershell
npm test
npm run build
```

Expected: 26 个测试全部通过；TypeScript 与 Vite 构建成功；`dist/assets` 包含带哈希的 JavaScript 和 CSS；`dist/images/gojo-placeholder.jpg` 存在。

- [ ] **Step 4: 检查编码和差异**

Run:

```powershell
$utf8 = [System.Text.UTF8Encoding]::new($false, $true)
$paths = @('edgeone.json', 'src/tests/deployment-config.test.ts')
foreach ($path in $paths) {
  $bytes = [System.IO.File]::ReadAllBytes((Resolve-Path $path))
  $text = $utf8.GetString($bytes)
  if ($text.Contains([char]0xFFFD)) { throw "$path 包含乱码替换字符" }
  if ($text -match '\\u[0-9a-fA-F]{4}') { throw "$path 包含 Unicode 转义" }
}
git diff --check
git diff -- edgeone.json src/tests/deployment-config.test.ts vercel.json
```

Expected: 两个文件都是有效 UTF-8；无乱码、Unicode 转义和空白错误；`vercel.json` 没有变化。

- [ ] **Step 5: 提交 EdgeOne 配置和测试**

Run:

```powershell
git add -- edgeone.json src/tests/deployment-config.test.ts
git commit -m "chore: add EdgeOne deployment config"
```

Expected: 新提交只包含 `edgeone.json` 和 `src/tests/deployment-config.test.ts`。

### Task 3: 推送分支并将 PR #1 合并到 master

**Files:**
- No file changes

- [ ] **Step 1: 对待推送提交执行最终本地验证**

Run:

```powershell
git status --short --branch
npm test
npm run build
git log --oneline origin/master..HEAD
```

Expected: 工作树干净；26 个测试和生产构建通过；提交列表只包含已经审阅的主页、设计、实施计划和 EdgeOne 配置相关提交。

- [ ] **Step 2: 推送功能分支**

Run:

```powershell
git push origin codex/gojo-homepage
```

Expected: `origin/codex/gojo-homepage` 更新到当前 `HEAD`。

- [ ] **Step 3: 检查 PR 范围和检查状态**

Run:

```powershell
gh pr view 1 --json url,state,isDraft,mergeStateStatus,headRefName,baseRefName,files
gh pr checks 1
```

Expected: PR 地址为 `https://github.com/ARIUM-hub/gojo-homepage/pull/1`，源分支为 `codex/gojo-homepage`，目标分支为 `master`，没有失败的检查。若仓库未配置 CI，`gh pr checks 1` 显示没有检查即可继续。

- [ ] **Step 4: 将草稿 PR 标记为可审阅并安全合并**

Run:

```powershell
$pr = gh pr view 1 --json isDraft | ConvertFrom-Json
if ($pr.isDraft) { gh pr ready 1 }
$headSha = git rev-parse HEAD
gh pr merge 1 --merge --match-head-commit $headSha
```

Expected: PR #1 合并成功。不要删除分支，因为当前工作树仍在使用它。

- [ ] **Step 5: 验证远端 master 已包含当前提交**

Run:

```powershell
git fetch origin
$headSha = git rev-parse HEAD
git merge-base --is-ancestor $headSha origin/master
if ($LASTEXITCODE -ne 0) { throw 'origin/master 尚未包含已审阅提交' }
gh pr view 1 --json state,mergedAt,mergeCommit,url
```

Expected: 祖先检查退出码为 0；PR 状态为 `MERGED`，并显示合并时间和 merge commit。

### Task 4: 由用户完成 EdgeOne 注册、GitHub 授权和仓库导入

**Files:**
- No file changes

- [ ] **Step 1: 打开 EdgeOne Makers 注册入口**

Open: <https://edgeone.ai/register?s_url=https://console.tencentcloud.com/edgeone/makers>

Expected: 显示 EdgeOne/Tencent Cloud 注册或登录页面。

- [ ] **Step 2: 在凭据输入前交还用户操作**

用户本人完成注册、验证码、登录及服务条款确认。Codex 不读取、代填或保存密码、验证码和恢复信息。

Expected: 用户明确回复“已登录”，并停留在 EdgeOne Makers 控制台。

- [ ] **Step 3: 创建 Pages/Makers 项目并选择 GitHub 导入**

在控制台选择从 Git 仓库导入，发起 GitHub OAuth。授权范围尽量限制到 `ARIUM-hub/gojo-homepage`；授权确认由用户本人点击。

Expected: EdgeOne 可以列出并选择 `ARIUM-hub/gojo-homepage`，仓库中不新增任何 Token 或 Secret。

- [ ] **Step 4: 配置生产构建参数**

使用以下确定值：

```text
Repository: ARIUM-hub/gojo-homepage
Production branch: master
Root directory: /
Framework preset: Vite
Install command: npm ci
Build command: npm run build
Output directory: dist
Environment variables: none
```

Expected: EdgeOne 接受配置并开始首次 Git 自动部署；部署详情显示的来源提交属于 `master`。

- [ ] **Step 5: 等待首次部署并记录默认域名**

查看构建日志，依次确认依赖安装、`tsc -b`、`vite build` 和静态资源发布成功。

Expected: 状态为成功，平台生成一个可访问的 EdgeOne 默认 HTTPS 域名。若失败，保存完整构建日志，回到本地复现；不要改用手动上传绕过错误。

### Task 5: 自动验证 EdgeOne HTTP、路由和缓存行为

**Files:**
- No file changes

- [ ] **Step 1: 对默认域名运行 HTTP 验证脚本**

Run in PowerShell:

```powershell
$base = (Read-Host '请粘贴 EdgeOne 默认域名').Trim().TrimEnd('/')
$requiredRoutes = @('/', '/profile', '/route-that-does-not-exist')

foreach ($route in $requiredRoutes) {
  $response = Invoke-WebRequest -Uri "$base$route" -UseBasicParsing -TimeoutSec 30
  if ($response.StatusCode -ne 200) { throw "$route 返回 $($response.StatusCode)" }
  if ($response.Content -notmatch '<div id="root"></div>') {
    throw "$route 没有返回 Vite 应用入口"
  }
}

$home = Invoke-WebRequest -Uri "$base/" -UseBasicParsing -TimeoutSec 30
$assetPaths = [regex]::Matches(
  $home.Content,
  '(?:src|href)="([^"]+\.(?:js|css))"'
) | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique

if ($assetPaths.Count -lt 2) { throw '没有从首页发现 JavaScript 和 CSS 资源' }

foreach ($path in $assetPaths) {
  $assetUrl = [System.Uri]::new([System.Uri]("$base/"), $path).AbsoluteUri
  $asset = Invoke-WebRequest -Uri $assetUrl -UseBasicParsing -TimeoutSec 30
  $cacheControl = ($asset.Headers['Cache-Control'] -join ',')
  if ($asset.StatusCode -ne 200) { throw "$path 加载失败" }
  if ($cacheControl -notmatch 'max-age=31536000') {
    throw "$path 缺少一年缓存：$cacheControl"
  }
}

$image = Invoke-WebRequest -Uri "$base/images/gojo-placeholder.jpg" -UseBasicParsing -TimeoutSec 30
$imageCache = ($image.Headers['Cache-Control'] -join ',')
if ($image.StatusCode -ne 200) { throw '人物图片加载失败' }
if ($imageCache -notmatch 'max-age=31536000') {
  throw "人物图片缺少一年缓存：$imageCache"
}

$htmlCache = ($home.Headers['Cache-Control'] -join ',')
if ($htmlCache -match 'max-age=31536000') {
  throw "HTML 被错误地长期缓存：$htmlCache"
}

[pscustomobject]@{
  BaseUrl = $base
  Routes = $requiredRoutes.Count
  Assets = $assetPaths.Count
  Image = 'OK'
  HtmlCache = $htmlCache
} | Format-List
```

Expected: 三个路由均返回 Vite 应用入口；JavaScript、CSS 和 JPEG 返回 200；静态资源具有一年缓存；HTML 没有一年缓存。任何一项失败都先停止发布验收并保存对应 URL、状态码和响应头。

- [ ] **Step 2: 确认 Vercel 备用站仍可用**

Run:

```powershell
$backup = Invoke-WebRequest -Uri 'https://gojo-homepage.vercel.app/' -UseBasicParsing -TimeoutSec 30
if ($backup.StatusCode -ne 200) { throw "Vercel 备用站返回 $($backup.StatusCode)" }
$backup.StatusCode
```

Expected: 输出 `200`；本次迁移没有删除或覆盖 Vercel 部署。

### Task 6: 浏览器与真实手机网络验收

**Files:**
- No file changes

- [ ] **Step 1: 在浏览器验证客户端路由和资源渲染**

依次直接打开 EdgeOne 默认域名的 `/`、`/profile` 和 `/route-that-does-not-exist`。

Expected:

- `/` 显示完整主页和五条悟人物图片。
- 点击“进入个人档案”可进入 `/profile`。
- `/profile` 直接打开及刷新后仍显示五条悟档案和人物图片。
- 不存在的路径由 React 显示项目自己的 404 页面。
- 浏览器控制台没有 JavaScript、CSS、JPEG 或路由加载错误。

- [ ] **Step 2: 在 EdgeOne 控制台确认 Git 自动部署关系**

检查项目来源、生产分支和最近一次部署提交。

Expected: 来源仓库为 `ARIUM-hub/gojo-homepage`，生产分支为 `master`，首次发布由 Git 提交触发而非 Direct Upload；后续推送到 `master` 会自动建立新部署。

- [ ] **Step 3: 由用户执行中国大陆手机蜂窝网络验收**

用户关闭手机 Wi-Fi，使用蜂窝网络依次打开默认域名首页、个人档案页和人物图片，并在 `/profile` 执行一次刷新。

Expected: 页面能完成加载，不再卡在接近完成后显示“无法打开”；首页、档案、图片及刷新全部成功。

- [ ] **Step 4: 根据验收结果确定主备用链接**

如果 EdgeOne 的 HTTP、浏览器和蜂窝网络验证全部通过，将 EdgeOne 默认域名作为面向国内访问的主链接，并保留 <https://gojo-homepage.vercel.app> 作为备用。

如果任一发布阻断项失败，保留 Vercel 为当前可用链接，记录失败路由、运营商、时间、构建日志和响应信息；优先修复 EdgeOne 托管配置，禁止通过修改 React 路由或删除 Vercel 部署掩盖问题。
