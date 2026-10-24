"""
生成站点社交分享图 og-image（1200x630）。
纯标准库实现（zlib + struct），无需 Pillow / ImageMagick。

用法：
    python3 tools/make-og-image.py

输出：
    assets/og-image.png   —— 无损位图，可直接上传
说明：
    多数平台（含微信、Facebook、X）要求 JPEG/PNG，SVG 不被支持。
    若需 JPEG，可用系统工具转换：
        magick assets/og-image.png assets/og-image.jpg
        或  convert assets/og-image.png assets/og-image.jpg
"""
import os
import struct
import zlib

W, H = 1200, 630
OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets")
OUT_PNG = os.path.normpath(os.path.join(OUT_DIR, "og-image.png"))

# 取自 site.css 的配色
BG_TOP = (0x2B, 0x4B, 0x38)
BG_BOTTOM = (0x21, 0x3A, 0x2C)
CARD = (0xF4, 0xF8, 0xF3)
INK = (0x24, 0x35, 0x2A)
MUTED = (0x6E, 0x7D, 0x72)
ACCENT = (0xC4, 0xDE, 0xC3)
ORANGE = (0xE8, 0x75, 0x4E)

# ---- 5x7 点阵字体：仅覆盖本图用到的字符 ---------------------------------
FONT = {
    "J": ["00100", "00100", "00100", "00100", "00100", "00100", "01110"],
    "I": ["11111", "00100", "00100", "00100", "00100", "00100", "11111"],
    " " : ["00000"] * 7,
    "-": ["00000", "00000", "00000", "11111", "00000", "00000", "00000"],
    "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
    "1": ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
    "2": ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
    "3": ["11111", "00010", "00100", "00010", "00001", "10001", "01110"],
    "4": ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
    "5": ["11111", "10000", "11110", "00001", "00001", "10001", "01110"],
    "6": ["00110", "01000", "10000", "11110", "10001", "10001", "01110"],
    "7": ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
    "8": ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
    "9": ["01110", "10001", "10001", "01111", "00001", "00010", "01100"],
    "A": ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
    "C": ["01110", "10001", "10000", "10000", "10000", "10001", "01110"],
    "D": ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
    "E": ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
    "G": ["01110", "10001", "10000", "10111", "10001", "10001", "01111"],
    "H": ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
    "I2": None,  # 占位，保持字典键为 str
    "L": ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
    "K": ["10001", "10010", "10100", "11000", "10100", "10010", "10001"],
    "M": ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
    "N": ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
    "O": ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
    "P": ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
    "R": ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
    "S": ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
    "T": ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
    "U": ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
    "V": ["10001", "10001", "10001", "10001", "01010", "01010", "00100"],
    "Y": ["10001", "10001", "01010", "00100", "00100", "00100", "00100"],
    "¥": ["10001", "10001", "01010", "11111", "00100", "11111", "00100"],
    "多": None,  # 中文另行用矩形图形绘制，见 draw_logo
}
del FONT["I2"]

GLYPH_W, GLYPH_H, SCALE = 5, 7, 4


def blend(dst, src, alpha):
    return tuple(int(d + (s - d) * alpha) for d, s in zip(dst, src))


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


class Canvas:
    def __init__(self, w, h):
        self.w, self.h = w, h
        self.px = bytearray(w * h * 3)

    def fill_gradient(self, top, bottom):
        for y in range(self.h):
            row = lerp(top, bottom, y / max(1, self.h - 1))
            base = y * self.w * 3
            for x in range(self.w):
                self.px[base + x * 3:base + x * 3 + 3] = bytes(row)

    def rect(self, x, y, w, h, color, radius=0):
        for yy in range(max(0, y), min(self.h, y + h)):
            for xx in range(max(0, x), min(self.w, x + w)):
                # 简单圆角：四角像素裁掉
                if radius:
                    cx = min(xx - x, x + w - 1 - xx)
                    cy = min(yy - y, y + h - 1 - yy)
                    if cx < radius and cy < radius:
                        dx, dy = radius - cx, radius - cy
                        if dx * dx + dy * dy > radius * radius:
                            continue
                o = (yy * self.w + xx) * 3
                self.px[o:o + 3] = bytes(color)

    def text(self, x, y, s, color, scale=SCALE, spacing=1):
        cursor = x
        for ch in s:
            glyph = FONT.get(ch)
            if glyph:
                for gy, line in enumerate(glyph):
                    for gx, bit in enumerate(line):
                        if bit == "1":
                            self.rect(cursor + gx * scale, y + gy * scale, scale, scale, color)
            cursor += (GLYPH_W + spacing) * scale
        return cursor

    def save_png(self, path):
        raw = bytearray()
        for y in range(self.h):
            raw.append(0)  # filter type 0
            raw += self.px[y * self.w * 3:(y + 1) * self.w * 3]
        compressed = zlib.compress(bytes(raw), 9)

        def chunk(tag, data):
            out = struct.pack(">I", len(data)) + tag + data
            return out + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)

        png = b"\x89PNG\r\n\x1a\n"
        png += chunk(b"IHDR", struct.pack(">IIBBBBB", self.w, self.h, 8, 2, 0, 0, 0))
        png += chunk(b"IDAT", compressed)
        png += chunk(b"IEND", b"")
        with open(path, "wb") as f:
            f.write(png)


def draw_logo(c, x, y, size, bg, fg):
    """用方块拼出「多」的抽象标记，替代中文字形。"""
    c.rect(x, y, size, size, bg, radius=int(size * 0.22))
    u = size // 8
    # 上部：一条横
    c.rect(x + 2 * u, y + 2 * u, size - 4 * u, u + 1, fg)
    # 中部：交叉斜线
    for i in range(size - 5 * u):
        c.rect(x + 2 * u + i, y + 3 * u + i, u + 1, u + 1, fg)
    for i in range(size - 5 * u):
        c.rect(x + 3 * u + i, y + 3 * u + (size - 5 * u) - i - u, u + 1, u + 1, fg)
    # 下部：两条竖
    c.rect(x + 2 * u, y + size - 3 * u, u + 1, 2 * u, fg)
    c.rect(x + size - 3 * u - u, y + size - 3 * u, u + 1, 2 * u, fg)


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    c = Canvas(W, H)
    c.fill_gradient(BG_TOP, BG_BOTTOM)

    # 左侧品牌标记
    draw_logo(c, 80, 84, 96, ACCENT, BG_TOP)

    # 品牌名（点阵字近似：JICHANGDUODUO）
    c.text(200, 104, "JICHANGDUODUO", ACCENT, scale=5)

    # 主标题
    c.text(80, 250, "14 AIRPORTS", CARD, scale=9)
    c.text(80, 350, "¥1 - ¥30", CARD, scale=9)
    c.text(80, 450, "IEPL - CN2 - IPLC", ACCENT, scale=6)

    # 底部说明卡
    c.rect(80, 520, 620, 56, blend(BG_BOTTOM, (0xFF, 0xFF, 0xFF), 0.10), radius=10)
    c.rect(80, 520, 5, 56, ORANGE, radius=2)
    c.text(104, 540, "SNAPSHOT 2026-10", ACCENT, scale=3)

    # 右侧卡片：模拟目录条目
    for i, (label, price) in enumerate([("IEPL", "20"), ("VLESS", "1"), ("CN2", "30")]):
        top = 96 + i * 150
        c.rect(760, top, 360, 124, CARD, radius=14)
        c.rect(760, top, 6, 124, ACCENT, radius=3)
        c.text(790, top + 26, label, INK, scale=4)
        c.text(790, top + 70, "¥" + price, MUTED, scale=4)

    c.save_png(OUT_PNG)
    print("written:", OUT_PNG)
    print("size:", W, "x", H)
    print("提示：转换为 JPEG 以兼容更多平台：")
    print("  magick %s %s" % (OUT_PNG, os.path.splitext(OUT_PNG)[0] + ".jpg"))


if __name__ == "__main__":
    main()