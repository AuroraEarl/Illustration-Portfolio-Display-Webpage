# Illustration Portfolio

一个精美的插画作品集网站，基于 React 18 + TypeScript + Vite + Tailwind CSS 构建，支持云端数据存储和跨设备同步。

🌐 **在线预览**: https://aurora-illustration-collection.netlify.app/

---

## 🛠️ 环境配置

### 1. 安装 Node.js
- 推荐版本：**Node.js 18+**
- 官网下载：https://nodejs.org/

### 2. 安装 pnpm（推荐）或 npm
```bash
# 使用 npm 安装
npm install -g pnpm

# 或使用 npm
npm install -g npm
```

### 3. 安装依赖
```bash
# 进入项目目录
cd my-react-app

# 安装依赖
pnpm install
# 或
npm install
```

### 4. 本地运行
```bash
pnpm dev
# 或
npm run dev
```
访问 http://localhost:5173

### 5. 构建生产版本
```bash
pnpm build
# 或
npm run build
```

---

## ⚙️ 需要自定义的配置

### 1. Supabase 数据库配置（必须）

**文件**: `src/lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-project.supabase.co';
const supabaseKey = 'your-anon-or-service-role-key';

export const supabase = createClient(supabaseUrl, supabaseKey);
```

#### 如何获取 Supabase 配置：

1. 注册 Supabase：https://supabase.com
2. 创建新项目
3. 进入 **Settings** → **API**
4. 复制 **Project URL** 和 **anon public** 或 **service_role** key

#### 创建数据库表：

在 Supabase SQL Editor 中执行：

```sql
-- 创建 artworks 表
CREATE TABLE artworks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  tags TEXT[],
  thumbnail_url TEXT NOT NULL,
  full_image_url TEXT,
  series_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建 series 表
CREATE TABLE series (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建存储桶
INSERT INTO storage.buckets (id, name, public) VALUES ('artworks', 'artworks', true);

-- 禁用 RLS（如果使用 anon key）
ALTER TABLE artworks DISABLE ROW LEVEL SECURITY;
ALTER TABLE series DISABLE ROW LEVEL SECURITY;

-- 授予权限
GRANT ALL PRIVILEGES ON TABLE artworks TO anon;
GRANT ALL PRIVILEGES ON TABLE series TO anon;
GRANT ALL PRIVILEGES ON TABLE storage.objects TO anon;
```

---

### 2. 管理员密码（可选）

**文件**: `src/components/PasswordModal.tsx`

```typescript
const ADMIN_PASSWORD = 'your-password'; // 修改为您的密码
```

---

### 3. 封面信息（可选）

**文件**: `src/components/CoverPage.tsx`
- 作者名称
- 封面副标题

**文件**: `src/components/Header.tsx`
- 网站标题：插画集

---

### 4. 图片压缩设置（可选）

**文件**: `src/lib/storage.ts`

```typescript
export const compressImage = (file: File, maxWidth: number = 1200, quality: number = 0.6): Promise<string> => {
  // maxWidth: 最大宽度（默认1200px）
  // quality: 压缩质量（默认0.6，即60%）
```

---

## 🚀 部署到云平台

### 火山引擎 IGA Pages（可选）
```bash
# 安装 IGA CLI
npm install -g iga-cli

# 部署
iga pages deploy
```

### Vercel
```bash
# 安装 Vercel CLI
npm install -g vercel

# 部署
vercel
```

### Netlify
1. 构建项目：`npm run build`
2. 将 `dist` 文件夹拖拽到 https://app.netlify.com/drop

### GitHub Pages
1. 上传代码到 GitHub
2. 在仓库 Settings → Pages 中启用
3. 选择 `gh-pages` 分支

---

## 📝 项目结构说明

```
src/
├── components/           # UI 组件
│   ├── ArtworkDetail.tsx # 作品详情弹窗
│   ├── CoverPage.tsx      # 封面页
│   ├── Footer.tsx         # 页脚
│   ├── Gallery.tsx        # 瀑布流画廊
│   ├── Header.tsx         # 顶部导航
│   ├── NewSeriesModal.tsx # 新建系列弹窗
│   ├── PasswordModal.tsx  # 密码验证弹窗
│   ├── SeriesTabs.tsx     # 系列切换标签
│   └── UploadModal.tsx   # 上传作品弹窗
├── hooks/                 # React Hooks
│   ├── useArtworks.ts     # localStorage 版本
│   └── useSupabaseArtworks.ts  # Supabase 版本
├── lib/                   # 工具库
│   ├── storage.ts         # 图片上传/压缩
│   └── supabase.ts        # Supabase 客户端
└── types/                 # TypeScript 类型
    └── artwork.ts          # 作品和系列类型定义
```

---

## ✨ 功能特性

- 🎨 小红书式瀑布流布局
- 📱 响应式设计（1-4列自适应）
- ☁️ 云端数据存储（Supabase）
- 🖼️ 图片自动压缩上传
- 💧 低画质图片预览
- 💧 带水印图片下载
- 🔐 管理员密码保护
- 🏷️ 系列分类管理
- 🌈 渐变色主题设计

---

## 📄 License

MIT License
---

如有问题，请提交 Issue 或联系作者。
