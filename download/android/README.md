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

光看下载能不能点开是不够的——**旧包也能下载，而且大小可能一模一样**。
必须核对内容。**不要整包下载 28 MB**（实测会卡到 5 分钟以上），用**分段比对**几秒就能出结论：

```bash
W="https://www.genixgreen.cloud/download/android/genixgreen.apk"
R="https://raw.githubusercontent.com/benzhujohn/genixgreen.cloud/main/download/android/genixgreen.apk"
L="/path/to/你的新包.apk"

# 逐段比对：源站(绕过ESA) vs 正式域名，并各自与本地新包核对
for r in "0-1048575" "14000000-15048575" "27207166-28257941"; do
  for base in "$R" "$W"; do
    curl -s -r "$r" "$base" -o /tmp/seg.bin
    a=$(sha256sum /tmp/seg.bin | cut -d' ' -f1)
    s=$(dd if="$L" bs=1 skip=${r%%-*} count=$(( ${r##*-} - ${r%%-*} + 1 )) 2>/dev/null | sha256sum | cut -d' ' -f1)
    [ "$a" = "$s" ] && echo "  $r  $base  一致 ✅" || echo "  $r  $base  不一致 ❌"
  done
done
```

判读：**源站那三行必然一致**（用来确认比对方法本身正确）；**正式域名那三行也必须全部一致**，
只要求里出现「不一致」，就是 ESA 缓存没刷干净，回上一步再刷一次。

> ⚠️ **不要再拿 `benzhujohn.github.io` 当「绕过 ESA 的源站」用了** ——
> 仓库里已有 `CNAME`，GitHub Pages 会把所有 github.io 请求 301 跳到 `www.genixgreen.cloud`，
> 等于又绕回了 ESA。可靠的源站地址是 `raw.githubusercontent.com`。

最快的判据（看文件头）：APK 是 ZIP 包，**前 16 字节里带着 CRC32 和编译时间**，
两份不同编译的包这一小段就不一样：

```bash
curl -s -r 0-63 "https://www.genixgreen.cloud/download/android/genixgreen.apk" | od -An -tx1 -v | head -2
```

正确响应头应当是：

```
HTTP/1.1 200 OK
Content-Type: application/vnd.android.package-archive
Content-Length: <你的新包字节数>
X-Site-Cache-Status: MISS   ← 或 HIT 但 Age 很小
```

> ⚠️ **注意：ESA 有多个边缘节点，各节点缓存状态不一致。**
> `HEAD` 请求可能报 `MISS` / `Age: 1`，但同一个 URL 的 `GET` 请求却仍在报
> `HIT` / `Age: 598880`（约 6.9 天）——**必须用 GET 的实际内容来判断**，
> 只看 `HEAD` 的响应头会被误导。

---

## 参考：一次真实的缓存事故（2026-09-14）

换包后实测的数据，可作为判断模板：

| 取法 | 前 16 字节（十六进制） | 判定 |
|---|---|---|
| `raw.githubusercontent.com`（真源站） | `50 4b 03 04 14 00 08 08 08 00 6d 5a a9 5c e9 7e 68 2c` | ✅ 新包 |
| 本地新包 | 同上 | ✅ 一致 |
| `www.genixgreen.cloud`（经 ESA） | `50 4b 03 04 14 00 08 08 08 00 15 8a 6a 5c ab 8b c0 de` | ❌ **旧包** |

两份包体积**恰好都是 28,257,942 字节**，只有内容和编译时间不同。
ESA 在 `HEAD` 上谎报 `MISS`、`Age: 1`、`Last-Modified: 今天`，
但 `GET` 上老实报 `HIT`、`Age: 598880`、`Last-Modified: Wed, 22 Apr 2026`。
**以 GET 为准。**

---

## 其他注意事项

- 单文件超过 **100 MB** GitHub 会拒绝；超过 **50 MB** 会警告但仍可提交。
- 当前包体积约 **27 MB**，属于正常范围。
- GitHub Pages 免费版带宽软上限约 **100 GB/月**，APK 下载会计入；
  若将来下载量很大，可考虑把 APK 单独放到对象存储，再改 `assets/js/config.js` 里的 `links.androidApk`。
- 站点所有可变内容都集中在 `assets/js/config.js`，换链接只改那一处。
