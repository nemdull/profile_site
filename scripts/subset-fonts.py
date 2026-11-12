#!/usr/bin/env python3
"""サイトで使っている文字だけを入れた書体ファイルを作る。

使い方:
    pip install fonttools brotli
    python3 scripts/subset-fonts.py

やること:
    1. src/ と index.html から、使っている文字を集める（ひらがな・カタカナ・英数字・記号は全部入れる）
    2. 元の書体（BIZ UDPGothic / BIZ UDPMincho。SIL Open Font License 1.1）を Google Fonts の GitHub から取ってくる
    3. 集めた文字だけを残した WOFF2 を src/assets/fonts/ に書き出す

文字を足したのに作り直さなかった場合も、表示は壊れない（足りない文字だけ端末の書体になる）。
`npm run check` が、足りない文字を教えてくれる。
"""

from __future__ import annotations

import hashlib
import sys
import urllib.request
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "src" / "assets" / "fonts"
CACHE = ROOT / "node_modules" / ".cache" / "fonts"

GOTHIC = "https://github.com/googlefonts/morisawa-biz-ud-gothic/raw/main/fonts/ttf"
MINCHO = "https://github.com/googlefonts/morisawa-biz-ud-mincho/raw/main/fonts/ttf"

# (元のファイル, 置き場所, 出力名, 入れる文字。None なら集めた文字すべて)
FONTS = [
    ("BIZUDPGothic-Regular.ttf", GOTHIC, "BIZUDPGothic-Regular.subset.woff2", None),
    ("BIZUDPGothic-Bold.ttf", GOTHIC, "BIZUDPGothic-Bold.subset.woff2", None),
    # 明朝は日付印の 3 文字にしか使わない
    ("BIZUDPMincho-Bold.ttf", MINCHO, "BIZUDPMincho-Bold.subset.woff2", "検証済"),
]

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
    options.hinting = False  # ヒント情報は外す。Windows は端末に入っている BIZ UDP を使う（CSS の local()）
    font = TTFont(source)
    subsetter = subset.Subsetter(options)
    subsetter.populate(text=text)
    subsetter.subset(font)
    font.flavor = "woff2"
    font.save(target)
    digest = hashlib.sha256(target.read_bytes()).hexdigest()[:12]
    print(f"作成: {target.relative_to(ROOT)}  {target.stat().st_size / 1024:.0f} KB  sha256:{digest}")


def main() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    text = collect_chars()
    (OUT / "charset.txt").write_text(text, encoding="utf-8")
    print(f"文字数: {len(text)}")
    for name, base, output, only in FONTS:
        make_subset(fetch(name, base), OUT / output, only or text)
    return 0


if __name__ == "__main__":
    sys.exit(main())
