# GENIXGREEN — App Download Site

GENIXGREEN「Household Smart APP (LV)」官方下载站。纯静态站点：原生 HTML + CSS + JS，零框架、零构建、零依赖。

- **线上地址**：https://www.genixgreen.cloud/
- **Android APK**：https://www.genixgreen.cloud/download/android/genixgreen.apk
- **App Store**：https://apps.apple.com/tw/app/genixgreen/id6479182549

---

## 目录结构

```
.
├── index.html                       单页站点（唯一页面）
├── assets/
│   ├── css/style.css                设计令牌 + 全部样式
│   ├── js/
│   │   ├── config.js                ★ 配置区：链接 / 二维码 / 信息，改这里就够了
│   │   └── main.js                  渲染与交互逻辑
│   └── img/
│       ├── logo.svg                 品牌 logo
│       ├── favicon.svg              站点图标
│       ├── og-cover.svg             社交分享封面
│       ├── qr-android.svg           安卓下载二维码（矢量）
│       ├── qr-ios.svg               iOS 下载二维码（矢量）
│       └── screens/                 应用界面配图（5 张，矢量）
│           ├── monitor.svg          实时监控主界面
│           ├── add-device.svg       添加设备
│           ├── scan-bind.svg        扫码绑定
│           ├── rename.svg           设备重命名
│           └── protocol.svg         逆变器协议选择
├── download/android/                ★ 安卓安装包存放目录
├── robots.txt
├── sitemap.xml
└── .gitignore
```

---

## 日常维护：只改 `assets/js/config.js`

所有会变的内容都集中在这一个文件里，改完全站自动同步，**不需要动 HTML**。

### 换下载链接

```js
links: {
  androidApk: 'https://www.genixgreen.cloud/download/android/genixgreen.apk',
  iosStore:   'https://apps.apple.com/tw/app/genixgreen/id6479182549',
}
```

### 换二维码

把新二维码图片放进 `assets/img/`，然后在 config.js 里指过去：

```js
qr: {
  android: 'assets/img/qr-android.png',
  ios:     'assets/img/qr-ios.png'
}
```

> 建议正方形 PNG，≥600×600px，白底，四周留 2 格空白（quiet zone），否则部分扫码器识别率会下降。

### 换联系方式

```js
company: {
  email: 'info05@genixgreen.com',
  phone: '+86 138 9298 1183',
  website: 'www.genixgreen.com'
}
```

页脚与 FAQ 里的邮箱、电话都从这里读取。

### 换截图 / 功能开关

- `screens` 数组控制截图区的标题与说明文字
- `features` 控制微信提示、移动端吸底条、二维码卡片、系统自动识别等开关

---

## 更新安卓安装包

把新的 `genixgreen.apk` 放到 `download/android/` 覆盖同名文件即可，**链接不变，页面不用改**。

详细步骤见 [`download/android/README.md`](download/android/README.md)。

---

## 部署

站点是纯静态的，任何静态托管都能跑。推荐 GitHub Pages：

1. 仓库 → **Settings → Pages**
2. Source 选 **Deploy from a branch** → 分支 `main`，目录 `/ (root)`
3. 保存后得到 `https://<用户名>.github.io/<仓库名>/`

### 绑定自定义域名

1. 在仓库根目录新建文件 `CNAME`，内容写一行 `www.genixgreen.cloud`（**注意：只有 DNS 已经指向 GitHub Pages 时才加，否则会打断现有站点**）
2. 在域名服务商处添加解析：
   - `www` → `CNAME` → `<用户名>.github.io`
   - 根域名 `@` → `A` → GitHub Pages 的 4 个 IP，或直接做 `www` 跳转
3. 回到 Pages 设置勾选 **Enforce HTTPS**

> ⚠️ 目前 `www.genixgreen.cloud` 由旧服务器 / CDN 提供服务。切换前请先确认 DNS 由谁管理，
> 避免新旧站点互相覆盖。

---

## 设计说明

| 项目 | 值 |
|---|---|
| 主色 | `#009944`（取自 logo 实际用色） |
| 强调色 | `#F08300`（logo 橙色） |
| 正文墨色 | `#0B1A12` |
| 圆角 | 卡片 24px / 按钮全圆角 |
| 字体 | 系统字体栈，不依赖任何外部 CDN |
| 断点 | 1040px / 860px / 620px |

**导航栏行为**：页面顶部时完全透明，滚动超过 12px 后渐变为毛玻璃实色底，同时高度由 76px 收缩到 62px、出现细边框与柔和投影。移动端（≤860px）收起为汉堡菜单，展开时按钮图标动画变为关闭叉号。

**交互**：自动识别 iOS / Android 并高亮对应下载按钮；二维码区域可一键复制下载链接；检测到微信内置浏览器会提示「用浏览器打开」；移动端滚动超过 520px 后底部常驻下载条。

---

## 已做与待办

**已完成**
- 单页 11 个区块：导航 / 首屏 / 数据条 / 功能矩阵 / 截图 / 安装指引 / 兼容与协议 / FAQ / 转化区 / 页脚 / 移动吸底条
- 导航栏透明→实色渐变 + 移动端适配
- 两个下载链接的真实二维码（已解码校验）
- 从官方 APP 使用手册整理的三步安装指引、2.4 GHz 提示、协议预设清单
- SEO：canonical、Open Graph、`SoftwareApplication` 结构化数据、sitemap、robots

**待办 / 建议补充**
- [ ] 应用版本号与更新日期（当前页面未展示，避免写错）
- [ ] 若需更真实的界面观感，可把 `screens/` 下的矢量图替换为真机截图
- [ ] 英文之外的语种（如泰文）如需上线，建议加语言切换
- [ ] 绑定自定义域名后，提交 sitemap 到 Google Search Console

---

© Dongguan ZWAYN New Energy Co., Ltd. · 粤ICP备2024223439号-1
