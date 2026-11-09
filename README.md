# 给妈妈的 46 岁生日信

一个适配手机与桌面的 React 生日纪念网页，采用复古剪贴簿、旧明信片与家庭相册的视觉语言。

## 修改内容

只需要编辑 `src/content.js`：这里集中放了页面文字、回忆相册、旅行照片、祝福信、18 岁蜡烛和落款文案。

照片统一放入 `public/images/`，再在 `content.js` 修改对应路径。旅行照片目前已整理在 `public/images/trips/`。

## 本地预览

电脑需要安装 Node.js。进入项目文件夹后运行：

```bash
npm install
npm run dev
```

## 发布到 GitHub Pages

仓库已包含 `.github/workflows/deploy.yml` 和适配仓库路径的 Vite 配置。将项目文件上传到 GitHub 仓库的 `main` 分支后，GitHub Actions 会自动构建并发布。到仓库 Settings → Pages，将部署来源设为 GitHub Actions。发布完成后会显示可用网址。

网页包含贺卡开场、可翻页复古相册、旅行回忆贩卖机、吹灭 18 根蜡烛、生日信与制作人落款；没有时间轴板块。布局针对手机屏幕做了响应式调整。
