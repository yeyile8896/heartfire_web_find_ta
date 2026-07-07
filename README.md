# 心火欧洲青年事工官网

心火欧洲青年事工（Hearts on Fire）官网项目。  
这是一个用于介绍团队异象、使命、目标策略、参与方式与联系方式的官网项目，现已支持中英双语、正式分享卡片、分页面导航，以及 Google Form 参与入口。

## 线上访问

- 当前官网地址：<https://www.hofeu.org>

## 页面内容

官网当前包含以下主要区块：

- 关于我们
- 名称由来
- 异象、使命、目标与策略
- 我们在做什么
- 寻找那个 TA
- 参与方式
- 联系我们

## 技术栈

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- lucide-react
- qrcode

## 本地开发

```bash
npm install
npm run dev
```

默认访问：

```text
http://localhost:3000
```

## 生产构建

```bash
npm run build
```

如果仓库已经连接 Vercel，推送到 `main` 后会自动重新部署。

## 项目结构

```text
app/
  api/
    find-ta/
      rooms/
        route.ts
  [section]/page.tsx
  find-ta/
    host/page.tsx
    join/[code]/page.tsx
    room/[code]/me/[participantId]/page.tsx
  en/
    [section]/page.tsx
    page.tsx
  globals.css
  layout.tsx
  page.tsx
  robots.ts
  sitemap.ts
components/
  CTAButton.tsx
  ContactForm.tsx
  Container.tsx
  FeatureCard.tsx
  FindTaHostRoom.tsx
  FindTaJoinRoom.tsx
  FindTaParticipantView.tsx
  LogoMark.tsx
  Navbar.tsx
  SectionHeading.tsx
lib/
  find-ta-room-store.ts
  find-ta-types.ts
  site-content.ts
  site-routes.ts
  site.ts
public/
  logo.jpg
```

## 常用修改入口

1. 中文首页与共享页面结构：`app/page.tsx`
2. 中英文主要文案内容：`lib/site-content.ts`
3. 顶部导航与页面路由：`components/Navbar.tsx`、`lib/site-routes.ts`
4. 「寻找那个 TA」活动页内容：`lib/site-content.ts`、`components/LandingPage.tsx`
5. Google Form 与邮箱联系入口：`components/ContactForm.tsx`
6. 联系邮箱、官网域名、Instagram 与 Google Form 链接：`lib/site.ts`
7. Logo 图片资源：`public/logo.jpg`

## 活动入口

- 中文页面：`/find-ta`
- 英文页面：`/en/find-ta`
- 主持人后台：`/find-ta/host`
- 营员加入页：`/find-ta/join/[房间码]`
- 营员个人配对页：`/find-ta/room/[房间码]/me/[营员ID]`

「寻找那个 TA」现在支持两种预览流程：

1. 房间制配对：主持人创建房间并展示加入二维码；营员填写真实身份与匿名线索；主持人后台可见真实姓名并一键随机配对；营员端只显示对方匿名线索，完成线下相认后点击“成功会合”。
2. 个人 QR 线索卡：营员填写匿名线索、生成个人 QR、复制或下载二维码，扫码后查看对方线索卡。

当前房间制配对使用服务器内存保存数据，适合本地预览与流程确认。正式营会部署时应接入数据库，避免网站服务重启后房间数据清空。

## 当前联系信息

- 联系邮箱：`info@hofeu.org`
- Google Form：<https://forms.gle/dgpcTWEg5YgmrMXr8>
- Instagram：<https://www.instagram.com/heartsonfire.eu?igsh=MTMxdHhzd3IwZXMyaQ%3D%3D&utm_source=qr>

## 说明

- 网站当前提供 Google Form 与邮箱两种联系方式。
- 当前项目使用 Next.js `14.2.5`。
- 如官网域名后续变更，请同步更新本 README 中的“线上访问”链接。
