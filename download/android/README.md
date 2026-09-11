# Android APK 存放目录

把安卓安装包放在这里，文件名保持 **`genixgreen.apk`**，下载链接即为：

```
https://www.genixgreen.cloud/download/android/genixgreen.apk
```

## 怎么替换

**方式一：GitHub 网页上传（推荐，不用装任何工具）**

1. 打开 https://github.com/benzhujohn/genixgreen.cloud/tree/main/download/android
2. 点右上角 **Add file → Upload files**
3. 把新的 `genixgreen.apk` 拖进去
4. 在下方 Commit changes 里留一句话，点 **Commit changes**

同名文件会被自动覆盖，链接不变，页面不用改任何代码。

**方式二：本地 git**

```bash
cp /path/to/新版本.apk download/android/genixgreen.apk
git add download/android/genixgreen.apk
git commit -m "Update Android APK"
git push
```

## 注意事项

- 单文件超过 **100 MB** 时 GitHub 会拒绝，请先确认包体积。
- GitHub 对单文件超过 **50 MB** 会给出警告，但仍可提交。
- 上传后建议清一次 CDN / 浏览器缓存再验证，因为旧包可能被缓存。
- 目前站点上的下载按钮指向的是 `https://www.genixgreen.cloud/download/android/genixgreen.apk`。
  如果域名还没切到 GitHub Pages，这个文件不会被访问到，需要先在域名解析层面把
  `www.genixgreen.cloud` 指向 GitHub Pages（或在旧服务器上同步放置该文件）。
