# Android APK 存放目录

把安卓安装包放在这里，文件名保持 **`genixgreen.apk`**，下载链接即为：

```
https://www.genixgreen.cloud/download/android/genixgreen.apk
```

这个链接同时印在官网的安卓下载二维码里，所以**文件名不要改**——只换内容，链接和页面都不用动。

---

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

---

## ⚠️ 上传后必须做：清阿里云 ESA 缓存

**这是最容易踩的坑，已经实测踩过一次。**

站点走的是「阿里云 ESA（边缘加速）→ GitHub Pages（源站）」的结构。
ESA 会按 URL 缓存文件，而 `genixgreen.apk` 这个 URL 从旧服务器时代就在被缓存——
**替换仓库里的文件并不会让 ESA 换掉它缓存中的旧包**。

实测现象（2026-09-11 换包时）：

| 取法 | 结果 |
|---|---|
| 从 GitHub 源站直取 | ✅ 新包，sha256 `6db89453…` |
| 从 `www.genixgreen.cloud` 取 | ❌ **旧包**，sha256 `c4cd0692…` |

响应头会明确暴露这一点：

```
X-Site-Cache-Status: HIT
Age: 336373                    ← 缓存已存在约 3.9 天
Last-Modified: Wed, 22 Apr 2026 01:43:08 GMT   ← 旧服务器的时间戳（不是 GitHub 的）
ETag: "69e827ac-1af2e96"
```

带 `Cache-Control: no-cache` 请求头也**不能**绕过——必须在控制台手动刷新。

**操作**：阿里云控制台 → **ESA（边缘安全加速）** → 选中本站 → **缓存** → **刷新缓存 / 预热**
→ 类型选 **URL**，填：

```
https://www.genixgreen.cloud/download/android/genixgreen.apk
```

（如果刷新缓存入口不在「缓存」下，找「刷新预热」或「Cache Purge」字样。）

---

## 替换后怎么验证（务必做）

光看下载能不能点开是不够的——**旧包也能下载**。要核对哈希：

```bash
# 1) 看缓存是否已经换掉：这里的 sha256 必须和你的新包一致
curl -s "https://www.genixgreen.cloud/download/android/genixgreen.apk" -o /tmp/dl.apk
sha256sum /tmp/dl.apk

# 2) 对照源站（绕过 ESA，一定是新的）
curl -s -L "https://benzhujohn.github.io/genixgreen.cloud/download/android/genixgreen.apk" -o /tmp/src.apk
sha256sum /tmp/src.apk

# 3) 确认文件头是 APK/ZIP 魔数
curl -s -r 0-3 "https://www.genixgreen.cloud/download/android/genixgreen.apk" | od -An -c
# 期望输出：P   K 003 004
```

正确响应头应当是：

```
HTTP/1.1 200 OK
Content-Type: application/vnd.android.package-archive
Content-Length: <你的新包字节数>
X-Site-Cache-Status: MISS   ← 或 HIT 但 Age 很小
```

---

## 其他注意事项

- 单文件超过 **100 MB** GitHub 会拒绝；超过 **50 MB** 会警告但仍可提交。
- 当前包体积约 **27 MB**，属于正常范围。
- GitHub Pages 免费版带宽软上限约 **100 GB/月**，APK 下载会计入；
  若将来下载量很大，可考虑把 APK 单独放到对象存储，再改 `assets/js/config.js` 里的 `links.androidApk`。
- 站点所有可变内容都集中在 `assets/js/config.js`，换链接只改那一处。
