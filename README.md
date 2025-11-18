# Supabase Hero App

这是一个使用 [Next.js](https://nextjs.org) 构建的应用程序，集成了 [Supabase](https://supabase.com) 作为后端服务，实现了实时数据展示和交互。

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/anonymc0der/supabase-hero.git
cd supabase-hero
```

### 2. 安装依赖

```bash
npm install
# 或者
yarn install
# 或者
pnpm install
```

### 3. 配置 Supabase

#### 3.1 创建 `.env.local` 文件

在项目根目录下创建 `.env.local` 文件，并添加您的 Supabase 项目 URL 和 Anon Key：

```
NEXT_PUBLIC_SUPABASE_URL=您的Supabase项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=您的Supabase匿名公共密钥
```

**重要提示：**
*   `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 可以在您的 Supabase 项目设置中找到（"Project Settings" -> "API"）。
*   请确保 `.env.local` 文件已添加到 `.gitignore` 中，以防止敏感信息泄露。

#### 3.2 设置数据库表 (`supabase-hero`)

在您的 Supabase 项目中，执行以下 SQL 语句来创建 `supabase-hero` 表：

```sql
-- 启用 uuid-ossp 扩展（如果尚未启用）
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE public.supabase_hero (
  supabase_hero_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  number_input NUMERIC
);
```

**说明：**
*   `supabase_hero_id`：使用 `uuid_generate_v4()` 自动生成 UUID 作为主键。
*   `created_at`：自动记录创建时间。
*   `number_input`：用于存储用户输入的数字。

#### 3.3 配置行级安全 (RLS)

为了保护您的数据，强烈建议启用行级安全 (RLS)。

**如果您希望匿名用户可以插入和读取数据（仅用于测试或特定场景）：**

1.  **启用 RLS**：在 Supabase 仪表板中，导航到 "Table Editor"，选择 `supabase_hero` 表，然后点击 "Enable RLS"。
2.  **创建 SELECT 策略**：
    *   导航到 "Authentication" -> "Policies"。
    *   为 `supabase_hero` 表创建一个新策略。
    *   选择 "FOR SELECT operations"。
    *   在 "USING expression" 中输入 `true`。
    *   这将允许所有用户读取所有数据。
3.  **创建 INSERT 策略**：
    *   为 `supabase_hero` 表创建一个新策略。
    *   选择 "FOR INSERT operations"。
    *   在 "WITH CHECK expression" 中输入 `true`。
    *   这将允许所有用户插入数据。

**重要提示：**
*   上述 RLS 策略允许匿名用户完全访问，这在生产环境中可能不安全。请根据您的实际需求调整 RLS 策略，例如，只允许用户读取自己创建的数据，或者只允许认证用户插入数据。
*   如果您在测试过程中遇到 RLS 相关的错误（例如 `new row violates row-level security policy`），请仔细检查您的 RLS 策略配置。

### 4. 运行开发服务器

```bash
npm run dev
# 或者
yarn dev
# 或者
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000) 即可在浏览器中查看应用程序。
