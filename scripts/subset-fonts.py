#!/usr/bin/env python3
"""サイトで使っている文字だけを入れた書体ファイルを作る。

使い方:
    pip install fonttools brotli
    python3 scripts/subset-fonts.py

やること:
    1. src/ と index.html から、使っている文字を集める（ひらがな・カタカナ・英数字・記号は全部入れる）
    2. 元の書体（Zen Kaku Gothic New / Dela Gothic One / DotGothic16。どれも SIL Open Font License 1.1）を
       Google Fonts の GitHub から取ってくる
    3. 集めた文字だけを残した WOFF2 を src/assets/fonts/ に書き出す
    4. sakujiru の欄で線を描いて見せる「作字」の 2 文字を、輪郭のデータにして書き出す

文字を足したのに作り直さなかった場合も、表示は壊れない（足りない文字だけ端末の書体になる）。
`npm run check` が、足りない文字を教えてくれる。
"""

from __future__ import annotations

import hashlib
import json
import sys
import urllib.request
from pathlib import Path

from fontTools import subset
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "src" / "assets" / "fonts"
CACHE = ROOT / "node_modules" / ".cache" / "fonts"

GFONTS = "https://github.com/google/fonts/raw/main/ofl"

# (元のファイル, 置き場所, 出力名)
FONTS = [
    ("ZenKakuGothicNew-Medium.ttf", f"{GFONTS}/zenkakugothicnew", "ZenKakuGothicNew-Medium.subset.woff2"),
    ("ZenKakuGothicNew-Bold.ttf", f"{GFONTS}/zenkakugothicnew", "ZenKakuGothicNew-Bold.subset.woff2"),
    ("DelaGothicOne-Regular.ttf", f"{GFONTS}/delagothicone", "DelaGothicOne-Regular.subset.woff2"),
    ("DotGothic16-Regular.ttf", f"{GFONTS}/dotgothic16", "DotGothic16-Regular.subset.woff2"),
]

# 輪郭にして書き出す文字（Dela Gothic One）
LETTERING = "作字"
LETTERING_OUT = ROOT / "src" / "content" / "lettering.json"

SOURCES = ["index.html", "src/**/*.json", "src/**/*.ts", "src/**/*.tsx"]


def always_included() -> set[str]:
    chars = {chr(code) for code in range(0x20, 0x7F)}  # 英数字と記号
    chars |= {chr(code) for code in range(0x3041, 0x3097)}  # ひらがな
    chars |= {chr(code) for code in range(0x30A1, 0x30FD)}  # カタカナ
    chars |= set("　、。，．・：；？！゛゜´｀¨＾￣＿ヽヾゝゞ〃仝々〆〇ー―‐／＼～∥｜…‥‘’“”（）〔〕［］｛｝〈〉《》「」『』【】＋－±×÷＝≠＜＞≦≧％＃＆＊＠§☆★○●◎◇◆□■△▲▽▼※〒→←↑↓©")
    chars |= {chr(code) for code in range(0xFF10, 0xFF1A)}  # 全角数字
    return chars


def collect_chars() -> str:
    chars = always_included()
    for pattern in SOURCES:
        for path in ROOT.glob(pattern):
            chars |= set(path.read_text(encoding="utf-8"))
    return "".join(sorted(ch for ch in chars if ch.isprintable() and ch not in "\n\r\t"))


def fetch(name: str, base: str) -> Path:
    CACHE.mkdir(parents=True, exist_ok=True)
    path = CACHE / name
    if not path.exists():
        print(f"取得: {base}/{name}")
        urllib.request.urlretrieve(f"{base}/{name}", path)
    return path


def make_subset(source: Path, target: Path, text: str) -> None:
    options = subset.Options()
    options.flavor = "woff2"
    options.layout_features = ["*"]
    options.name_IDs = ["*"]
    options.notdef_outline = True
    options.hinting = False  # ヒント情報は外して軽くする
    font = TTFont(source)
    subsetter = subset.Subsetter(options)
    subsetter.populate(text=text)
    subsetter.subset(font)
    font.flavor = "woff2"
    font.save(target)
    digest = hashlib.sha256(target.read_bytes()).hexdigest()[:12]
    print(f"作成: {target.relative_to(ROOT)}  {target.stat().st_size / 1024:.0f} KB  sha256:{digest}")


def write_lettering(source: Path) -> None:
    """文字の輪郭を SVG のパスにする。上下は SVG に合わせて反転させる。"""
    font = TTFont(source)
    glyphs = font.getGlyphSet()
    cmap = font.getBestCmap()
    ascent = font["hhea"].ascent
    descent = font["hhea"].descent
    letters = []
    for char in LETTERING:
        name = cmap[ord(char)]
        pen = SVGPathPen(glyphs, lambda value: str(round(value)))
        glyphs[name].draw(TransformPen(pen, (1, 0, 0, -1, 0, ascent)))
        letters.append({"char": char, "width": glyphs[name].width, "d": pen.getCommands()})
    data = {"height": ascent - descent, "letters": letters}
    LETTERING_OUT.write_text(json.dumps(data, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"作成: {LETTERING_OUT.relative_to(ROOT)}  {LETTERING_OUT.stat().st_size / 1024:.1f} KB")


def main() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    text = collect_chars()
    (OUT / "charset.txt").write_text(text, encoding="utf-8")
    print(f"文字数: {len(text)}")
    for name, base, output in FONTS:
        make_subset(fetch(name, base), OUT / output, text)
    write_lettering(fetch("DelaGothicOne-Regular.ttf", f"{GFONTS}/delagothicone"))
    return 0


if __name__ == "__main__":
    sys.exit(main())
