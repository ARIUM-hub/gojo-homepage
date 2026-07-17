# 五条悟个人主页 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建并部署一个包含角色主页和独立档案页的五条悟非官方中文同人网站。

**Architecture:** 使用 Vite 构建 React + TypeScript 单页应用，React Router 管理 `/`、`/profile` 和 404 路由。角色内容集中在只读类型化数据模块中，页面由小型展示组件组合，交互状态保持在术式、关系和领域组件内部。

**Tech Stack:** Vite 6、React 18、TypeScript 5.7、React Router 6、Lucide React、Vitest、Testing Library、原生 CSS、Vercel 静态部署。

**Execution precondition:** 开始 Task 1 前，使用 `using-git-worktrees` 技能创建独立工作树；不要直接在主工作区执行实现步骤。

---

## 文件结构

```text
.
├── .npmrc                         # 国内 npm 镜像
├── package.json                   # 依赖与脚本
├── tsconfig.json                  # TypeScript 项目引用
├── tsconfig.app.json              # 浏览器代码配置
├── tsconfig.node.json             # Vite 配置代码
├── vite.config.ts                 # Vite 与 Vitest 配置
├── vercel.json                    # SPA 路由回退
├── index.html                     # HTML 入口
├── public/
│   └── images/
│       └── gojo-placeholder.jpg   # 已确认的临时角色图
├── src/
│   ├── main.tsx                   # 浏览器入口与 BrowserRouter
│   ├── AppRoutes.tsx              # 路由声明
│   ├── data/
│   │   └── gojo.ts                # 唯一角色资料源
│   ├── components/
│   │   ├── DomainExperience.tsx   # 领域全屏体验
│   │   ├── FanDisclaimer.tsx      # 非官方声明
│   │   ├── HeroCard.tsx           # 主页首屏
│   │   ├── PortraitImage.tsx      # 带降级的人物图片
│   │   ├── RelationshipTabs.tsx   # 人物关系标签
│   │   ├── SiteHeader.tsx         # 共用导航
│   │   ├── StoryTimeline.tsx      # 剧情时间线
│   │   └── TechniqueGrid.tsx      # 术式展开卡片
│   ├── pages/
│   │   ├── HomePage.tsx           # 主页组合层
│   │   ├── NotFoundPage.tsx       # 404 页面
│   │   └── ProfilePage.tsx        # 独立档案页
│   ├── styles/
│   │   └── index.css              # 令牌、组件与响应式样式
│   ├── test/
│   │   └── setup.ts               # jest-dom 设置
│   └── tests/
│       ├── data.test.ts            # 资料完整性
│       ├── interactions.test.tsx   # 术式、关系与领域
│       ├── portrait.test.tsx       # 图片降级
│       ├── profile.test.tsx        # 档案页
│       └── routing.test.tsx        # 路由与 404
└── README.md                       # 运行、素材与部署说明
```

### Task 1: 建立 Vite、React、TypeScript 与测试骨架

**Files:**
- Create: `.npmrc`
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `src/test/setup.ts`
- Create: `src/main.tsx`
- Create: `src/AppRoutes.tsx`
- Create: `src/tests/routing.test.tsx`

- [ ] **Step 1: 创建依赖与编译配置**

`.npmrc`：

```ini
registry=https://registry.npmmirror.com
```

`package.json`：

```json
{
  "name": "gojo-personal-homepage",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "lucide-react": "^0.468.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.30.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.1.0",
    "@testing-library/user-event": "^14.6.1",
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@vitejs/plugin-react": "^4.3.4",
    "jsdom": "^25.0.1",
    "typescript": "~5.7.3",
    "vite": "^6.1.0",
    "vitest": "^3.0.5"
  }
}
```

`tsconfig.json`：

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

`tsconfig.app.json`：

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
```

`tsconfig.node.json`：

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": true
  },
  "include": ["vite.config.ts"]
}
```

`vite.config.ts`：

```ts
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
});
```

`index.html`：

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="五条悟非官方中文同人个人主页" />
    <title>五条悟｜非官方个人主页</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 2: 安装依赖**

Run: `npm install`

Expected: 命令退出码为 0，生成 `node_modules/` 与 `package-lock.json`，下载源显示 `registry.npmmirror.com`。

- [ ] **Step 3: 写路由冒烟失败测试**

`src/test/setup.ts`：

```ts
import '@testing-library/jest-dom/vitest';
```

`src/tests/routing.test.tsx`：

```tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { AppRoutes } from '../AppRoutes';

describe('AppRoutes', () => {
  it('renders the home route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: '五条悟' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 4: 运行测试并确认失败**

Run: `npm test -- src/tests/routing.test.tsx`

Expected: FAIL，错误包含 `Cannot find module '../AppRoutes'`。

- [ ] **Step 5: 写最小路由实现**

`src/AppRoutes.tsx`：

```tsx
export function AppRoutes() {
  return <h1>五条悟</h1>;
}
```

`src/main.tsx`：

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './AppRoutes';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </React.StrictMode>,
);
```

- [ ] **Step 6: 运行测试和构建**

Run: `npm test -- src/tests/routing.test.tsx && npm run build`

Expected: 1 个测试 PASS；构建退出码为 0，并生成 `dist/`。

- [ ] **Step 7: 提交骨架**

```powershell
git add .npmrc package.json package-lock.json tsconfig.json tsconfig.app.json tsconfig.node.json vite.config.ts index.html src
git commit -m "chore: scaffold React homepage"
```

### Task 2: 建立唯一的类型化角色资料源

**Files:**
- Create: `src/data/gojo.ts`
- Create: `src/tests/data.test.ts`

- [ ] **Step 1: 写资料完整性失败测试**

`src/tests/data.test.ts`：

```ts
import { describe, expect, it } from 'vitest';
import { gojo } from '../data/gojo';

describe('gojo data', () => {
  it('contains unique technique and relationship ids', () => {
    expect(new Set(gojo.techniques.map((item) => item.id)).size).toBe(gojo.techniques.length);
    expect(new Set(gojo.relationships.map((item) => item.id)).size).toBe(gojo.relationships.length);
  });

  it('contains the complete public profile', () => {
    expect(gojo.name).toBe('五条悟');
    expect(gojo.techniques).toHaveLength(7);
    expect(gojo.relationships).toHaveLength(4);
    expect(gojo.timeline).toHaveLength(4);
  });
});
```

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm test -- src/tests/data.test.ts`

Expected: FAIL，错误包含 `Cannot find module '../data/gojo'`。

- [ ] **Step 3: 创建数据类型和完整数据**

`src/data/gojo.ts`：

```ts
export type Technique = {
  id: string;
  name: string;
  label: string;
  summary: string;
};

export type Relationship = {
  id: string;
  name: string;
  role: string;
  summary: string;
};

export type TimelineEntry = {
  id: string;
  era: string;
  title: string;
  summary: string;
};

export const gojo = {
  name: '五条悟',
  romanizedName: 'SATORU GOJO',
  title: '最强的现代咒术师',
  identity: '特级咒术师 · 教师',
  quote: '没关系，我可是最强的。',
  profile: {
    birthday: '12 月 7 日',
    height: '190cm 以上',
    grade: '特级',
    affiliation: '东京都立咒术高等专门学校',
  },
  bio: '拥有六眼与无下限术式的现代最强咒术师。作为教师，他试图培养能够改变咒术界的新一代。',
  techniques: [
    { id: 'six-eyes', name: '六眼', label: 'SPECIAL TRAIT', summary: '极致精密地观察咒力，并以近乎零损耗的方式控制术式。' },
    { id: 'limitless', name: '无下限术式', label: 'CURSED TECHNIQUE', summary: '把“无限”带入现实，控制空间与目标之间的距离。' },
    { id: 'blue', name: '术式顺转「苍」', label: 'LAPSE', summary: '制造强制收束的空间吸引。' },
    { id: 'red', name: '术式反转「赫」', label: 'REVERSAL', summary: '以反转术式产生强大的空间排斥。' },
    { id: 'purple', name: '虚式「茈」', label: 'HOLLOW', summary: '结合「苍」与「赫」形成毁灭性的虚式。' },
    { id: 'reverse', name: '反转术式', label: 'REVERSE ENERGY', summary: '把负面咒力相乘为正能量，用于修复身体。' },
    { id: 'void', name: '无量空处', label: 'DOMAIN', summary: '让目标接收无穷信息，从而停止思考与行动。' },
  ] satisfies Technique[],
  relationships: [
    { id: 'geto', name: '夏油杰', role: '挚友与分歧的起点', summary: '高专时代最重要的同伴。两人的道路最终分开，却始终深刻影响彼此。' },
    { id: 'yuji', name: '虎杖悠仁', role: '学生', summary: '被寄予打破旧秩序希望的年轻咒术师。' },
    { id: 'megumi', name: '伏黑惠', role: '学生与被保护者', summary: '拥有十种影法术的学生，也是五条长期关注和培养的对象。' },
    { id: 'yuta', name: '乙骨忧太', role: '学生与后继者', summary: '具备特级实力，被视为未来能够并肩甚至超越五条的人。' },
  ] satisfies Relationship[],
  timeline: [
    { id: 'hidden-inventory', era: '高专时代', title: '怀玉 · 玉折', summary: '护卫星浆体的任务改变了五条与夏油，也让五条真正成为最强。' },
    { id: 'night-parade', era: '教师时期', title: '百鬼夜行', summary: '面对曾经的挚友，同时继续培养能够改变咒术界的学生。' },
    { id: 'shibuya', era: '2018', title: '涉谷事变', summary: '在涉谷被狱门疆封印，咒术界的平衡由此崩塌。' },
    { id: 'final-battle', era: '最终决战', title: '宿命对决', summary: '解封后迎战两面宿傩，以最强之名走向最终战场。' },
  ] satisfies TimelineEntry[],
} as const;
```

- [ ] **Step 4: 运行资料测试**

Run: `npm test -- src/tests/data.test.ts`

Expected: 2 个测试 PASS。

- [ ] **Step 5: 提交资料模块**

```powershell
git add src/data/gojo.ts src/tests/data.test.ts
git commit -m "feat: add typed Gojo profile data"
```

### Task 3: 建立主页、档案页和 404 路由

**Files:**
- Modify: `src/AppRoutes.tsx`
- Create: `src/pages/HomePage.tsx`
- Create: `src/pages/ProfilePage.tsx`
- Create: `src/pages/NotFoundPage.tsx`
- Modify: `src/tests/routing.test.tsx`

- [ ] **Step 1: 用完整路由测试替换冒烟测试**

`src/tests/routing.test.tsx`：

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { AppRoutes } from '../AppRoutes';

function renderRoute(route: string) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AppRoutes />
    </MemoryRouter>,
  );
}

describe('AppRoutes', () => {
  it('navigates from home to profile', async () => {
    const user = userEvent.setup();
    renderRoute('/');
    await user.click(screen.getByRole('link', { name: '进入个人档案' }));
    expect(screen.getByRole('heading', { name: '个人档案' })).toBeInTheDocument();
  });

  it('renders a not found page', () => {
    renderRoute('/missing');
    expect(screen.getByRole('heading', { name: '页面不存在' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '返回主页' })).toHaveAttribute('href', '/');
  });
});
```

- [ ] **Step 2: 运行路由测试并确认失败**

Run: `npm test -- src/tests/routing.test.tsx`

Expected: FAIL，因为主页链接、档案标题和 404 页面尚未实现。

- [ ] **Step 3: 实现三个页面骨架和路由**

`src/pages/HomePage.tsx`：

```tsx
import { Link } from 'react-router-dom';
import { gojo } from '../data/gojo';

export function HomePage() {
  return (
    <main id="main-content">
      <p>{gojo.identity}</p>
      <h1>{gojo.name}</h1>
      <p>“{gojo.quote}”</p>
      <Link to="/profile">进入个人档案</Link>
    </main>
  );
}
```

`src/pages/ProfilePage.tsx`：

```tsx
import { Link } from 'react-router-dom';
import { gojo } from '../data/gojo';

export function ProfilePage() {
  return (
    <main id="main-content">
      <Link to="/">返回主页</Link>
      <h1>个人档案</h1>
      <h2>{gojo.name}</h2>
      <p>{gojo.bio}</p>
    </main>
  );
}
```

`src/pages/NotFoundPage.tsx`：

```tsx
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <main id="main-content">
      <p>404</p>
      <h1>页面不存在</h1>
      <Link to="/">返回主页</Link>
    </main>
  );
}
```

`src/AppRoutes.tsx`：

```tsx
import { Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProfilePage } from './pages/ProfilePage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
```

- [ ] **Step 4: 运行路由测试**

Run: `npm test -- src/tests/routing.test.tsx`

Expected: 2 个测试 PASS。

- [ ] **Step 5: 提交路由**

```powershell
git add src/AppRoutes.tsx src/pages src/tests/routing.test.tsx
git commit -m "feat: add home and profile routes"
```

### Task 4: 建立共用视觉系统、导航、声明和图片降级

**Files:**
- Create: `src/styles/index.css`
- Modify: `src/main.tsx`
- Create: `src/components/SiteHeader.tsx`
- Create: `src/components/FanDisclaimer.tsx`
- Create: `src/components/PortraitImage.tsx`
- Create: `src/tests/portrait.test.tsx`

- [ ] **Step 1: 写人物图片降级失败测试**

`src/tests/portrait.test.tsx`：

```tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PortraitImage } from '../components/PortraitImage';

describe('PortraitImage', () => {
  it('shows a readable fallback when the image fails', () => {
    render(<PortraitImage src="/missing.jpg" alt="五条悟人物图" />);
    fireEvent.error(screen.getByRole('img', { name: '五条悟人物图' }));
    expect(screen.getByRole('img', { name: '五条悟人物图加载失败' })).toHaveTextContent('五条悟');
    expect(document.querySelector('img')).toBeNull();
  });
});
```

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm test -- src/tests/portrait.test.tsx`

Expected: FAIL，错误包含 `Cannot find module '../components/PortraitImage'`。

- [ ] **Step 3: 实现共用组件**

`src/components/PortraitImage.tsx`：

```tsx
import { useState } from 'react';

type PortraitImageProps = {
  src: string;
  alt: string;
  className?: string;
};

export function PortraitImage({ src, alt, className }: PortraitImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <div className={`portrait-fallback ${className ?? ''}`} role="img" aria-label={`${alt}加载失败`}>五条悟</div>;
  }

  return <img className={className} src={src} alt={alt} width="768" height="1024" onError={() => setFailed(true)} />;
}
```

`src/components/SiteHeader.tsx`：

```tsx
import { Link } from 'react-router-dom';

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" to="/">GOJO / SATORU</Link>
      <nav aria-label="主要导航">
        <a href="/#profile-summary">档案</a>
        <a href="/#techniques">术式</a>
        <a href="/#relationships">关系</a>
        <a href="/#story">经历</a>
      </nav>
    </header>
  );
}
```

`src/components/FanDisclaimer.tsx`：

```tsx
export function FanDisclaimer() {
  return (
    <footer className="fan-disclaimer">
      <strong>非官方同人主页</strong>
      <p>本页面无商业用途。角色及相关作品版权归原作者与相关权利方所有。</p>
    </footer>
  );
}
```

- [ ] **Step 4: 建立全局令牌和基础样式**

`src/styles/index.css`：

```css
:root {
  color-scheme: dark;
  font-family: Inter, "Noto Sans SC", "Microsoft YaHei", system-ui, sans-serif;
  color: #eefaff;
  background: #06111f;
  --bg: #06111f;
  --surface: #0b1c2d;
  --surface-accent: #0d3657;
  --accent: #65d5ff;
  --text: #eefaff;
  --muted: #a9c3d3;
  --border: #1c4664;
  --radius-lg: 24px;
  --radius-md: 18px;
  --shadow: 0 24px 70px rgba(0, 0, 0, 0.28);
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; min-width: 320px; min-height: 100vh; background: var(--bg); }
body, button, a { font: inherit; }
a { color: inherit; }
img { display: block; max-width: 100%; }
button, .button { min-height: 44px; cursor: pointer; }
:focus-visible { outline: 3px solid var(--accent); outline-offset: 4px; }
.skip-link { position: fixed; left: 16px; top: -80px; z-index: 1000; background: #eefaff; color: #06111f; padding: 12px 16px; border-radius: 999px; }
.skip-link:focus { top: 16px; }
.page-shell { width: min(1180px, calc(100% - 32px)); margin: 0 auto; }
.site-header { min-height: 72px; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
.site-header nav { display: flex; gap: 24px; color: var(--muted); }
.brand { color: var(--accent); font-size: 0.75rem; font-weight: 900; letter-spacing: 0.14em; text-decoration: none; }
.button { display: inline-flex; align-items: center; justify-content: center; gap: 8px; border: 0; border-radius: 999px; padding: 0 20px; background: #eefaff; color: #071624; font-weight: 900; text-decoration: none; transition: transform 200ms ease-out, box-shadow 200ms ease-out; }
.button:hover { transform: translateY(-2px) scale(1.03); box-shadow: 0 14px 30px rgba(101, 213, 255, 0.24); }
.panel { border: 1px solid var(--border); border-radius: var(--radius-lg); background: var(--surface); box-shadow: var(--shadow); }
.portrait-fallback { display: grid; place-items: center; min-height: 320px; background: radial-gradient(circle at 60% 25%, #0d5b87, #07121f 65%); color: var(--accent); font-size: clamp(2rem, 8vw, 6rem); font-weight: 900; }
.fan-disclaimer { padding: 48px 0; color: var(--muted); font-size: 0.9rem; }
.fan-disclaimer strong { color: var(--text); }

@media (max-width: 720px) {
  .site-header nav { display: none; }
  .page-shell { width: min(100% - 24px, 1180px); }
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
  .button:hover { transform: none; }
}
```

在 `src/main.tsx` 顶部添加：

```ts
import './styles/index.css';
```

- [ ] **Step 5: 运行图片测试和构建**

Run: `npm test -- src/tests/portrait.test.tsx && npm run build`

Expected: 1 个测试 PASS；构建退出码为 0。

- [ ] **Step 6: 提交共用设计系统**

```powershell
git add src/components src/styles src/main.tsx src/tests/portrait.test.tsx
git commit -m "feat: add shared visual system"
```

### Task 5: 实现主页 Bento 内容与适度交互

**Files:**
- Create: `src/components/HeroCard.tsx`
- Create: `src/components/TechniqueGrid.tsx`
- Create: `src/components/RelationshipTabs.tsx`
- Create: `src/components/StoryTimeline.tsx`
- Modify: `src/pages/HomePage.tsx`
- Create: `src/tests/interactions.test.tsx`
- Modify: `src/styles/index.css`

- [ ] **Step 1: 写术式和人物关系失败测试**

`src/tests/interactions.test.tsx`：

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { RelationshipTabs } from '../components/RelationshipTabs';
import { TechniqueGrid } from '../components/TechniqueGrid';
import { gojo } from '../data/gojo';
import { HomePage } from '../pages/HomePage';

describe('homepage interactions', () => {
  it('renders the basic profile stats', () => {
    render(<MemoryRouter><HomePage /></MemoryRouter>);
    expect(screen.getByText('12 月 7 日')).toBeInTheDocument();
    expect(screen.getByText('190cm 以上')).toBeInTheDocument();
    expect(screen.getByText('东京都立咒术高等专门学校')).toBeInTheDocument();
  });

  it('expands and collapses a technique', async () => {
    const user = userEvent.setup();
    render(<TechniqueGrid techniques={gojo.techniques} />);
    const trigger = screen.getByRole('button', { name: '查看六眼详情' });
    await user.click(trigger);
    expect(screen.getByText(/近乎零损耗/)).toBeVisible();
    await user.click(trigger);
    expect(screen.queryByText(/近乎零损耗/)).not.toBeInTheDocument();
  });

  it('switches relationship content', async () => {
    const user = userEvent.setup();
    render(<RelationshipTabs relationships={gojo.relationships} />);
    await user.click(screen.getByRole('tab', { name: '乙骨忧太' }));
    expect(screen.getByRole('tabpanel')).toHaveTextContent('后继者');
  });
});
```

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm test -- src/tests/interactions.test.tsx`

Expected: FAIL，因为交互组件不存在。

- [ ] **Step 3: 实现主页组件**

`src/components/HeroCard.tsx`：

```tsx
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { gojo } from '../data/gojo';
import { PortraitImage } from './PortraitImage';

export function HeroCard() {
  return (
    <section className="hero panel" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">{gojo.identity}</p>
        <h1 id="hero-title">{gojo.name}</h1>
        <blockquote>“{gojo.quote}”</blockquote>
        <Link className="button" to="/profile">进入个人档案 <ArrowRight aria-hidden="true" size={18} /></Link>
      </div>
      <PortraitImage className="hero-portrait" src="/images/gojo-placeholder.jpg" alt="五条悟人物主视觉" />
      <span className="asset-note">网络图片 · 非官方同人展示</span>
    </section>
  );
}
```

`src/components/TechniqueGrid.tsx`：

```tsx
import { useState } from 'react';
import type { Technique } from '../data/gojo';

export function TechniqueGrid({ techniques }: { techniques: readonly Technique[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="bento-grid">
      {techniques.map((technique) => {
        const expanded = openId === technique.id;
        return (
          <article className="info-card" key={technique.id}>
            <p className="eyebrow">{technique.label}</p>
            <h3>{technique.name}</h3>
            {expanded && <p id={`${technique.id}-detail`}>{technique.summary}</p>}
            <button
              className="text-button"
              type="button"
              aria-expanded={expanded}
              aria-controls={`${technique.id}-detail`}
              onClick={() => setOpenId(expanded ? null : technique.id)}
            >
              {expanded ? `收起${technique.name}详情` : `查看${technique.name}详情`}
            </button>
          </article>
        );
      })}
    </div>
  );
}
```

`src/components/RelationshipTabs.tsx`：

```tsx
import { useState } from 'react';
import type { Relationship } from '../data/gojo';

export function RelationshipTabs({ relationships }: { relationships: readonly Relationship[] }) {
  const [selectedId, setSelectedId] = useState(relationships[0]?.id ?? '');
  const selected = relationships.find((item) => item.id === selectedId);

  if (!selected) return <p>资料暂缺</p>;

  return (
    <div className="relationship-panel panel">
      <div role="tablist" aria-label="人物关系">
        {relationships.map((relationship) => (
          <button
            key={relationship.id}
            role="tab"
            type="button"
            aria-selected={relationship.id === selectedId}
            aria-controls="relationship-detail"
            onClick={() => setSelectedId(relationship.id)}
          >
            {relationship.name}
          </button>
        ))}
      </div>
      <article id="relationship-detail" role="tabpanel">
        <p className="eyebrow">{selected.role}</p>
        <h3>{selected.name}</h3>
        <p>{selected.summary}</p>
      </article>
    </div>
  );
}
```

`src/components/StoryTimeline.tsx`：

```tsx
import type { TimelineEntry } from '../data/gojo';

export function StoryTimeline({ entries }: { entries: readonly TimelineEntry[] }) {
  return (
    <ol className="timeline">
      {entries.map((entry) => (
        <li key={entry.id}>
          <p className="eyebrow">{entry.era}</p>
          <h3>{entry.title}</h3>
          <p>{entry.summary}</p>
        </li>
      ))}
    </ol>
  );
}
```

- [ ] **Step 4: 组合完整主页**

`src/pages/HomePage.tsx`：

```tsx
import { FanDisclaimer } from '../components/FanDisclaimer';
import { HeroCard } from '../components/HeroCard';
import { RelationshipTabs } from '../components/RelationshipTabs';
import { SiteHeader } from '../components/SiteHeader';
import { StoryTimeline } from '../components/StoryTimeline';
import { TechniqueGrid } from '../components/TechniqueGrid';
import { gojo } from '../data/gojo';

export function HomePage() {
  return (
    <>
      <a className="skip-link" href="#main-content">跳到主要内容</a>
      <div className="page-shell"><SiteHeader /></div>
      <main className="page-shell" id="main-content">
        <HeroCard />
        <section id="profile-summary" className="section">
          <p className="eyebrow">PROFILE</p>
          <h2>{gojo.title}</h2>
          <p className="lead">{gojo.bio}</p>
          <dl className="quick-stats">
            <div><dt>生日</dt><dd>{gojo.profile.birthday}</dd></div>
            <div><dt>身高</dt><dd>{gojo.profile.height}</dd></div>
            <div><dt>等级</dt><dd>{gojo.profile.grade}</dd></div>
            <div><dt>所属</dt><dd>{gojo.profile.affiliation}</dd></div>
          </dl>
        </section>
        <section id="techniques" className="section"><p className="eyebrow">ABILITIES</p><h2>术式能力</h2><TechniqueGrid techniques={gojo.techniques} /></section>
        <section id="relationships" className="section"><p className="eyebrow">CONNECTIONS</p><h2>人物关系</h2><RelationshipTabs relationships={gojo.relationships} /></section>
        <section id="story" className="section"><p className="eyebrow">STORY FILE</p><h2>故事经历</h2><StoryTimeline entries={gojo.timeline} /></section>
        <blockquote className="quote-block">“天上天下，唯我独尊。”</blockquote>
        <FanDisclaimer />
      </main>
    </>
  );
}
```

- [ ] **Step 5: 追加主页布局样式**

在 `src/styles/index.css` 末尾追加：

```css
.hero { min-height: 620px; display: grid; grid-template-columns: 0.9fr 1.1fr; overflow: hidden; position: relative; background: linear-gradient(115deg, #081625 0%, #0a1f35 55%, #0d3657 100%); }
.hero-copy { align-self: end; padding: clamp(28px, 5vw, 64px); z-index: 2; }
.hero h1 { margin: 12px 0; font-size: clamp(4rem, 10vw, 8rem); line-height: 0.86; letter-spacing: -0.07em; }
.hero blockquote { margin: 20px 0 30px; color: var(--muted); }
.hero-portrait { width: 100%; height: 100%; object-fit: cover; filter: saturate(0.85) contrast(1.1) brightness(0.82); }
.asset-note { position: absolute; right: 16px; bottom: 14px; padding: 6px 10px; border-radius: 999px; background: rgba(6, 17, 31, 0.72); font-size: 0.7rem; }
.section { padding: clamp(72px, 10vw, 128px) 0 0; }
.section h2 { margin: 8px 0 28px; font-size: clamp(2.2rem, 5vw, 4rem); }
.lead { max-width: 720px; color: var(--muted); font-size: 1.15rem; line-height: 1.8; }
.eyebrow { color: var(--accent); font-size: 0.75rem; font-weight: 900; letter-spacing: 0.14em; }
.quick-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 32px 0 0; }
.quick-stats div { padding: 18px; border: 1px solid var(--border); border-radius: 14px; background: #081827; }
.quick-stats dt { color: var(--muted); font-size: 0.75rem; }
.quick-stats dd { margin: 8px 0 0; font-weight: 800; }
.bento-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.info-card { min-height: 220px; padding: 24px; border: 1px solid var(--border); border-radius: var(--radius-md); background: var(--surface); }
.info-card:nth-child(2), .info-card:nth-child(5) { background: #eefaff; color: #081625; }
.info-card h3 { font-size: 1.45rem; }
.text-button { border: 0; background: transparent; color: var(--accent); padding: 8px 0; font-weight: 800; }
.relationship-panel { display: grid; grid-template-columns: 0.8fr 1.2fr; overflow: hidden; }
.relationship-panel [role="tablist"] { display: grid; align-content: start; gap: 8px; padding: 20px; background: #081827; }
.relationship-panel [role="tab"] { min-height: 48px; border: 1px solid transparent; border-radius: 12px; background: transparent; color: var(--muted); text-align: left; padding: 0 14px; }
.relationship-panel [role="tab"][aria-selected="true"] { border-color: var(--accent); color: var(--text); background: var(--surface-accent); }
.relationship-panel [role="tabpanel"] { min-height: 280px; padding: 36px; }
.timeline { list-style: none; margin: 0; padding: 0 0 0 20px; border-left: 1px solid var(--border); }
.timeline li { position: relative; padding: 0 0 48px 28px; }
.timeline li::before { content: ""; position: absolute; left: -25px; top: 4px; width: 9px; height: 9px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 20px var(--accent); }
.quote-block { margin: 100px 0 20px; font-size: clamp(2.5rem, 7vw, 6rem); font-weight: 900; line-height: 1.1; letter-spacing: -0.05em; }

@media (max-width: 820px) {
  .hero { min-height: 720px; grid-template-columns: 1fr; }
  .hero-copy { align-self: end; background: linear-gradient(0deg, #081625 45%, transparent); }
  .hero-portrait { position: absolute; inset: 0; }
  .bento-grid { grid-template-columns: 1fr; }
  .quick-stats { grid-template-columns: repeat(2, 1fr); }
  .relationship-panel { grid-template-columns: 1fr; }
}
```

- [ ] **Step 6: 运行交互测试和全部测试**

Run: `npm test -- src/tests/interactions.test.tsx && npm test`

Expected: 主页测试 3 个 PASS；全部测试无失败。

- [ ] **Step 7: 提交主页**

```powershell
git add src/components src/pages/HomePage.tsx src/styles/index.css src/tests/interactions.test.tsx
git commit -m "feat: build interactive Gojo homepage"
```

### Task 6: 实现独立个人档案页和返回流程

**Files:**
- Modify: `src/pages/ProfilePage.tsx`
- Create: `src/tests/profile.test.tsx`
- Modify: `src/styles/index.css`

- [ ] **Step 1: 写档案页失败测试**

`src/tests/profile.test.tsx`：

```tsx
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { ProfilePage } from '../pages/ProfilePage';

describe('ProfilePage', () => {
  it('renders the portrait and core profile fields', () => {
    render(<MemoryRouter><ProfilePage /></MemoryRouter>);
    expect(screen.getByRole('img', { name: '五条悟档案页人物图' })).toBeInTheDocument();
    expect(screen.getByText('12 月 7 日')).toBeInTheDocument();
    expect(screen.getByText('190cm 以上')).toBeInTheDocument();
    expect(screen.getByText('无量空处')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '返回主页' })).toHaveAttribute('href', '/');
  });
});
```

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm test -- src/tests/profile.test.tsx`

Expected: FAIL，因为当前档案页没有人物图片和完整字段。

- [ ] **Step 3: 实现档案页**

`src/pages/ProfilePage.tsx`：

```tsx
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FanDisclaimer } from '../components/FanDisclaimer';
import { PortraitImage } from '../components/PortraitImage';
import { gojo } from '../data/gojo';

export function ProfilePage() {
  return (
    <>
      <a className="skip-link" href="#main-content">跳到主要内容</a>
      <main className="page-shell profile-page" id="main-content">
        <header className="profile-header">
          <Link className="button button-secondary" to="/"><ArrowLeft aria-hidden="true" size={18} />返回主页</Link>
          <span className="brand">GOJO / PERSONAL FILE</span>
        </header>
        <h1>个人档案</h1>
        <section className="profile-layout" aria-labelledby="profile-name">
          <div className="profile-portrait panel">
            <PortraitImage src="/images/gojo-placeholder.jpg" alt="五条悟档案页人物图" />
            <div><p className="eyebrow">SPECIAL GRADE SORCERER</p><h2 id="profile-name">{gojo.name}</h2></div>
          </div>
          <div className="profile-bento">
            <article className="profile-card profile-card-wide"><p className="eyebrow">PROFILE</p><h2>{gojo.title}</h2><p>{gojo.bio}</p></article>
            {gojo.techniques.filter(({ id }) => ['six-eyes', 'limitless', 'void'].includes(id)).map((technique) => (
              <article className="profile-card" key={technique.id}><p className="eyebrow">{technique.label}</p><h3>{technique.name}</h3><p>{technique.summary}</p></article>
            ))}
            <article className="profile-card"><p className="eyebrow">IDENTITY</p><h3>教师</h3><p>培养新一代，并试图改变咒术界。</p></article>
          </div>
        </section>
        <dl className="profile-stats">
          <div><dt>生日</dt><dd>{gojo.profile.birthday}</dd></div>
          <div><dt>身高</dt><dd>{gojo.profile.height}</dd></div>
          <div><dt>等级</dt><dd>{gojo.profile.grade}</dd></div>
          <div><dt>所属</dt><dd>{gojo.profile.affiliation}</dd></div>
        </dl>
        <FanDisclaimer />
      </main>
    </>
  );
}
```

- [ ] **Step 4: 追加档案页样式**

在 `src/styles/index.css` 末尾追加：

```css
.profile-page { padding-top: 24px; }
.profile-header { display: flex; align-items: center; justify-content: space-between; min-height: 72px; }
.profile-page > h1 { margin: 50px 0 24px; font-size: clamp(2.5rem, 6vw, 5rem); }
.button-secondary { background: var(--surface); color: var(--text); border: 1px solid var(--border); }
.profile-layout { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 16px; }
.profile-portrait { min-height: 640px; overflow: hidden; position: relative; }
.profile-portrait img { width: 100%; height: 100%; object-fit: cover; filter: saturate(0.85) contrast(1.1) brightness(0.82); }
.profile-portrait > div { position: absolute; inset: auto 24px 24px; z-index: 2; }
.profile-portrait::after { content: ""; position: absolute; inset: 0; background: linear-gradient(0deg, rgba(4, 14, 25, 0.94), transparent 52%); }
.profile-portrait h2 { margin: 6px 0 0; font-size: 2.4rem; }
.profile-bento { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
.profile-card { padding: 24px; border: 1px solid var(--border); border-radius: var(--radius-md); background: var(--surface); }
.profile-card-wide { grid-column: 1 / -1; background: var(--surface-accent); }
.profile-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin: 16px 0 0; }
.profile-stats div { padding: 18px; border: 1px solid var(--border); border-radius: 14px; background: #081827; }
.profile-stats dt { color: var(--muted); font-size: 0.75rem; }
.profile-stats dd { margin: 8px 0 0; font-weight: 800; }

@media (max-width: 820px) {
  .profile-layout { grid-template-columns: 1fr; }
  .profile-portrait { min-height: 520px; }
  .profile-bento { grid-template-columns: 1fr; }
  .profile-card-wide { grid-column: auto; }
  .profile-stats { grid-template-columns: repeat(2, 1fr); }
}
```

- [ ] **Step 5: 运行档案页和路由测试**

Run: `npm test -- src/tests/profile.test.tsx src/tests/routing.test.tsx`

Expected: 档案页 1 个、路由 2 个测试全部 PASS。

- [ ] **Step 6: 提交档案页**

```powershell
git add src/pages/ProfilePage.tsx src/styles/index.css src/tests/profile.test.tsx
git commit -m "feat: add detailed profile page"
```

### Task 7: 加入领域体验、键盘关闭和无障碍降级

**Files:**
- Create: `src/components/DomainExperience.tsx`
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/tests/interactions.test.tsx`
- Modify: `src/styles/index.css`

- [ ] **Step 1: 追加领域体验失败测试**

在 `src/tests/interactions.test.tsx` 顶部添加导入：

```tsx
import { DomainExperience } from '../components/DomainExperience';
```

在同一文件的 `describe('homepage interactions', ...)` 内追加测试：

```tsx

it('opens and closes the domain experience with Escape', async () => {
  const user = userEvent.setup();
  render(<DomainExperience />);
  await user.click(screen.getByRole('button', { name: '展开无量空处' }));
  expect(screen.getByRole('dialog', { name: '无量空处' })).toBeVisible();
  await user.keyboard('{Escape}');
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
```

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm test -- src/tests/interactions.test.tsx`

Expected: FAIL，错误包含 `Cannot find module '../components/DomainExperience'`。

- [ ] **Step 3: 实现可关闭的领域体验**

`src/components/DomainExperience.tsx`：

```tsx
import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export function DomainExperience() {
  const [open, setOpen] = useState(false);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    closeButton.current?.focus();
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <>
      <button className="button" type="button" onClick={() => setOpen(true)}>展开无量空处</button>
      {open && (
        <div className="domain-dialog" role="dialog" aria-modal="true" aria-label="无量空处">
          <button ref={closeButton} type="button" aria-label="关闭无量空处" onClick={() => setOpen(false)}><X aria-hidden="true" /></button>
          <div><p className="eyebrow">DOMAIN EXPANSION</p><h2>无量空处</h2><p>信息无穷地涌入，却什么也无法完成。</p></div>
        </div>
      )}
    </>
  );
}
```

在 `src/pages/HomePage.tsx` 的术式区块中，`TechniqueGrid` 后添加：

```tsx
<DomainExperience />
```

并在文件顶部添加：

```tsx
import { DomainExperience } from '../components/DomainExperience';
```

- [ ] **Step 4: 追加领域样式**

在 `src/styles/index.css` 末尾追加：

```css
.domain-dialog { position: fixed; inset: 0; z-index: 100; display: grid; place-items: center; padding: 24px; background: radial-gradient(circle at center, #174e77 0%, #08111f 38%, #02050a 100%); text-align: center; animation: domain-in 320ms ease-out both; }
.domain-dialog::before { content: "∞"; position: absolute; font-size: min(55vw, 42rem); color: rgba(101, 213, 255, 0.07); font-weight: 900; }
.domain-dialog > div { position: relative; max-width: 700px; }
.domain-dialog h2 { margin: 8px 0; font-size: clamp(4rem, 14vw, 10rem); letter-spacing: -0.08em; }
.domain-dialog > button { position: absolute; top: 24px; right: 24px; z-index: 2; width: 48px; height: 48px; border: 1px solid var(--border); border-radius: 50%; background: var(--surface); color: var(--text); }
@keyframes domain-in { from { opacity: 0; transform: scale(1.04); } to { opacity: 1; transform: scale(1); } }
```

- [ ] **Step 5: 运行所有测试与构建**

Run: `npm test && npm run build`

Expected: 全部测试 PASS；构建退出码为 0；没有 TypeScript 错误。

- [ ] **Step 6: 人工检查键盘与减少动态效果**

Run: `npm run dev`

Expected:

- `Tab` 可依次聚焦主页主要操作、术式按钮、关系标签和领域按钮。
- 领域打开后焦点落在关闭按钮，按 `Escape` 关闭。
- 在浏览器开发工具启用 `prefers-reduced-motion: reduce` 后，按钮不缩放、领域不执行明显转场。
- 375px 宽度无横向滚动，档案页卡片为单列或双列。

- [ ] **Step 7: 提交领域与无障碍行为**

```powershell
git add src/components/DomainExperience.tsx src/pages/HomePage.tsx src/styles/index.css src/tests/interactions.test.tsx
git commit -m "feat: add accessible domain experience"
```

### Task 8: 加入图片、来源说明、生产配置并部署

**Files:**
- Create: `public/images/gojo-placeholder.jpg`
- Create: `vercel.json`
- Create: `README.md`
- Verify: all source and test files

- [ ] **Step 1: 复制已确认的设计占位图**

Run:

```powershell
New-Item -ItemType Directory -Force -Path 'public\images' | Out-Null
Copy-Item -LiteralPath 'C:\Users\DF\Documents\1\.superpowers\brainstorm\20260717-112909-042\content\gojo-placeholder.jpg' -Destination 'public\images\gojo-placeholder.jpg'
```

Expected: `public/images/gojo-placeholder.jpg` 存在且文件大小大于 20KB。该图只用于非商业首版，页面与 README 必须保留来源和非官方声明。

- [ ] **Step 2: 写静态路由回退配置**

`vercel.json`：

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

- [ ] **Step 3: 写项目与素材说明**

`README.md`：

````markdown
# 五条悟非官方个人主页

一个使用 Vite、React 和 TypeScript 构建的非商业同人网站。

## 本地运行

```powershell
npm install
npm run dev
```

## 验证

```powershell
npm test
npm run build
```

## 素材与版权

- 当前人物图为设计阶段从公开图片搜索结果保存的临时占位素材，原始指向：<https://x.com/animetv_jp/status/1509509548167602184>。
- 页面为非官方同人作品，无商业用途。
- 《咒术回战》、五条悟及相关素材版权归原作者与相关权利方所有。
- 若获得许可素材或原创同人图，应替换 `public/images/gojo-placeholder.jpg` 并同步更新本节。
````

- [ ] **Step 4: 运行完整验证**

Run:

```powershell
npm test
npm run build
git diff --check
```

Expected: 所有测试 PASS；Vite 构建退出码为 0；`git diff --check` 无输出。

- [ ] **Step 5: 本地生产预览**

Run: `npm run preview -- --host 127.0.0.1`

Expected:

- 主页可访问。
- 点击“进入个人档案”进入 `/profile`。
- 直接刷新 `/profile` 在本地预览服务器中正常显示。
- 人物图加载，按钮悬停时轻微上浮和放大，页面不显示交互参数说明。

- [ ] **Step 6: 提交生产配置**

```powershell
git add public/images/gojo-placeholder.jpg vercel.json README.md
git commit -m "chore: add production assets and deployment config"
```

- [ ] **Step 7: 部署并验证公开链接**

Run: `npx vercel --prod`

Expected: 如未登录，CLI 要求用户完成 Vercel 登录；部署完成后输出一个 `https://*.vercel.app` 地址。

随后访问部署地址和 `<部署地址>/profile`，确认两者返回 200 且页面内容正确。将最终链接交付给用户。

---

## 最终验收命令

```powershell
npm test
npm run build
git status --short
```

预期结果：所有测试通过、生产构建成功、工作区没有未提交的实现文件。
