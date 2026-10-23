## assets/og-image.png 生成说明

全站 20 个页面的 `og:image` / `twitter:image` 都指向 `https://jichangduo.com/assets/og-image.png`。

**该文件目前尚未生成，缺失会导致所有分享卡片无图。**

### 生成方式

```bash
python3 tools/make-og-image.py
```

脚本只用标准库（zlib + struct），无需安装 Pillow 或 ImageMagick，输出 1200×630 的 PNG。

### 为什么用 PNG 而不是 JPEG

PNG 无损、文字边缘清晰，且 Facebook / X / 微信 / Telegram 全部支持。
体积略大于 JPEG，但这个尺寸下通常在 100–300 KB，可接受。

### 设计要点

- 配色取自 `site.css`（深绿渐变 + 米白卡片 + 橙色强调）
- 左侧展示关键数据：14 个条目、¥1–¥30 价格区间、IEPL/CN2/IPLC 线路
- 右侧三张卡片模拟目录条目，直接传达站点内容
- 底部标注 `SNAPSHOT 2026-10`，与站内「资料快照」口径一致
  （提醒：这是设计选择。如你不想在分享图上强调"快照"字样，可改脚本里的这行文案）

### 上线前请确认

1. 文件已生成且能正常打开
2. `https://jichangduo.com/assets/og-image.png` 可公开访问（无需登录、无防盗链）
3. 用微信、X、Facebook 各自的调试工具预览一次分享效果