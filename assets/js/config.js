/* ==========================================================================
   GENIXGREEN App Download Site — CENTRAL CONFIG
   --------------------------------------------------------------------------
   ★ 这个文件是唯一的「配置区」。
     改链接、换二维码、改版本号、改联系方式，都只改这里，
     全站文案 / 按钮 / 二维码会自动同步，不需要动 HTML。
   ========================================================================== */

window.GG_CONFIG = {

  /* ---------- 1. 下载链接 ---------- */
  links: {
    // Android：APK 直链（仓库内已预留 download/android/ 目录，可直接替换文件）
    androidApk: 'https://www.genixgreen.cloud/download/android/genixgreen.apk',
    // iOS：App Store
    iosStore: 'https://apps.apple.com/tw/app/genixgreen/id6479182549',
    // 可选：Google Play（留空则对应按钮自动隐藏）
    googlePlay: '',
    // 公司官网（页脚「官网」入口）
    site: 'https://genixgreen.com/',
    // ICP 备案跳转
    icpUrl: 'https://beian.miit.gov.cn/'
  },

  /* ---------- 2. 二维码 ---------- */
  /* 已按上面两个链接自动生成（矢量 SVG，扫码已验证可识别）。
     换二维码：把新图片放进 assets/img/，再把文件名写到这里即可。 */
  qr: {
    android: 'assets/img/qr-android.svg',
    ios: 'assets/img/qr-ios.svg'
  },

  /* ---------- 3. 应用元信息 ---------- */
  app: {
    name: 'GENIXGREEN',
    tagline: 'Household Smart APP (LV)',
    badge: 'Low-voltage energy storage',
    androidSize: '27 MB',
    requirements: 'iOS 13+ / Android 8.0+',
    androidRequirement: 'Android 8.0 or later',
    iosRequirement: 'iOS 13.0 or later',
    apkFileName: 'genixgreen.apk'
  },

  /* ---------- 4. 数据条（全部为手册中可核实的参数） ---------- */
  stats: [
    { value: '5–16 kWh',    label: 'Battery models supported' },
    { value: '2.4 GHz',     label: 'Wi-Fi band required' },
    { value: '7+',          label: 'Inverter protocols built in' },
    { value: 'iOS + Android', label: 'Free on both stores' }
  ],

  /* ---------- 5. 应用截图（取自官方 APP 使用手册，已裁切优化） ---------- */
  screens: [
    { src: 'assets/img/screens/monitor.svg',    title: 'Live monitoring',   caption: 'State of charge, voltage, current and temperature at a glance.' },
    { src: 'assets/img/screens/add-device.svg', title: 'Add a device',     caption: 'Tap “Add now” to begin pairing a new battery.' },
    { src: 'assets/img/screens/scan-bind.svg',  title: 'Scan to bind',     caption: 'Point the viewfinder at the QR code on the battery.' },
    { src: 'assets/img/screens/rename.svg',     title: 'Name your device', caption: 'Give every battery a name you recognise at a glance.' },
    { src: 'assets/img/screens/protocol.svg',   title: 'Inverter protocol', caption: 'Match the protocol to your inverter and save.' }
  ],

  /* ---------- 6. 逆变器协议预设 ---------- */
  protocols: ['GNLG', 'SMA', 'SRTC', 'PYLN', 'VICT', 'LXPR', 'SOFA'],

  /* ---------- 7. 联系方式 ---------- */
  company: {
    legalName: 'Dongguan ZWAYN New Energy Co., Ltd.',
    address: 'Room 101, Building 1, No. 18 Hu Nan Road, Changping Town, Dongguan, Guangdong, China',
    phone: '+86 138 9298 1183',
    email: 'info05@genixgreen.com',
    website: 'genixgreen.com',
    icp: '粤ICP备2024223439号-1',
    police: '粤公网安备44190002007947号'
  },

  /* ---------- 8. 功能开关 ---------- */
  features: {
    showWechatHint: true,     // 微信内打开时提示「用浏览器打开」
    showStickyBar: true,      // 移动端底部吸底下载条
    showQrPanel: true,        // Hero 区二维码卡片
    autoDetectOS: true        // 自动识别系统并高亮对应按钮
  }
};
