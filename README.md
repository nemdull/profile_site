# nemdull.com

nemdull（ねむだる）のポートフォリオです。公開先は https://www.nemdull.com/ 。

Vite、React 19、TypeScript、Tailwind CSS 4 で作っています。アニメーションのライブラリは入れておらず、動きは CSS と Canvas だけです。

## このサイトがやっていること

- **開くたびに、自分で自分を点検する。** ページの中の「発進前チェック」が、本物の DOM を見て 7 項目を確かめます（見出しがあるか、リンクがぜんぶ https か、行き先が決めたサイトだけか、「できること」に根拠が付いているか、など）
- **わざと壊して、点検が本当に見つけられるかを試せる。** 「隕石をぶつける」を押すと、見出し・アイコン・リンク・根拠のどれかが実際に壊れ、点検が落ちます。「修理する」で元に戻ります
- **同じ点検を、ビルドの前にもかける。** `npm run build` の最初に `scripts/check-content.mjs` が走り、問題があればビルドが止まります
- **「動きを減らす」設定に従う。** 端末でこの設定がオンなら、アニメーションはすべて止まります。止まっているかどうかも点検の 1 項目です

## 使い方

```bash
npm install
npm run dev      # 開発サーバー
npm run check    # 内容の点検だけ
npm run build    # 内容の点検 → 型チェック → ビルド
npm run preview  # ビルド結果の確認
npm run lint
npm run test:e2e # 画面を実際に開いて確かめるテスト（先に npm run build）
```

Node.js は 20.19 以上、または 22.12 以上。

## 文言やリンクを変えるとき

載せる内容は `src/content/profile.json` の 1 か所にまとめてあります。文言・リンク・経歴・資格は、ここだけ直せば画面に出ます。

新しいサイトへリンクを張るときは、先に `src/content/allowed-hosts.json` に足します。ビルド前の点検と、ページを開いたときの点検の両方が、この一覧を見ています。

## 点検の中身

| 見ていること | ビルドの前 | ページを開いたとき |
| --- | --- | --- |
| 「できること」の各行に根拠があるか | 止める | 落ちる |
| リンクが https か | 止める | 落ちる |
| リンク先が、決めた一覧の中にあるか | 止める | 落ちる |
| 見出し（h1）が 1 つあって、中身があるか | — | 落ちる |
| アイコンの画像が読み込めているか | — | 落ちる |
| 画面の横にはみ出していないか | — | 落ちる |
| 「動きを減らす」設定を守っているか | — | 落ちる |
| 書体のファイルに入っていない文字が無いか | 警告 | — |

ページを開いたときの点検は `src/systems/preflight.ts` にあります。

## テスト

`e2e/portfolio.spec.ts` が、Playwright で画面を実際に開いて確かめます。PC 幅とスマホ幅の両方で走ります。

- 開くと見出しが出て、点検が 7 項目とも通る
- **隕石を 5 回ぶつけると、5 種類の壊れ方をすべて見つけ、修理で元に戻る**（壊したのが 1 か所なら、落ちるのも 1 項目だけ）
- 「動きを減らす」設定では、動き続けるものが無い
- 幅 320 / 390 / 768 / 1280 px で、横にはみ出さない
- 外へのリンクは、ぜんぶ https で、決めたサイトだけ
- sf-meter のメーターの項目を押すと、その実現度を指す

初めて動かすときは、ブラウザーを入れます。

```bash
npx playwright install chromium
npm run build && npm run test:e2e
```

プルリクエストと main への push で、GitHub Actions が lint・ビルド・このテストを走らせます（`.github/workflows/ci.yml`）。

## 書体

Dela Gothic One（見出し）、Zen Kaku Gothic New（本文）、DotGothic16（計器の数字と点検の表示）から、このサイトで使う文字だけを取り出して `src/assets/fonts/` に置いています。どれも SIL Open Font License 1.1 です。文言に新しい漢字を足したら、作り直します。

```bash
pip install fonttools brotli
npm run fonts
```

作り直さなくても表示は壊れません（足りない文字だけ、端末の書体になります）。sakujiru の欄で描いている「作字」の輪郭（`src/content/lettering.json`）も、このとき一緒に作られます。

## 構成

```
src/
├─ content/        # profile.json（載せる内容）、allowed-hosts.json（リンクしてよいサイト）、型
├─ systems/        # 点検の定義（preflight.ts）と、その状態を配る Provider
├─ components/
│  ├─ space/       # 星空、上の帯、隕石
│  ├─ hero/        # いちばん上の見出しと、アイコンのまわりを回るリンク
│  ├─ preflight/   # 発進前チェックの計器盤
│  ├─ works/       # つくったもの（メーター、作字の線画）
│  ├─ sections/    # できること、仕事、書いたもの、道具、資格、連絡
│  └─ ui/          # 節の枠、リンク、パネル
├─ lib/            # 画面に入ったか・スクロール位置などのフック
├─ assets/         # 画像と書体
└─ index.css       # 色・書体・動きの定義（動きは 1 か所にまとめてある）
scripts/
├─ check-content.mjs  # ビルド前の点検
└─ subset-fonts.py    # 書体の作り直し
e2e/
└─ portfolio.spec.ts  # 画面を実際に開いて確かめるテスト（Playwright）
```

## デプロイ

main に入ると、Vercel が自動で公開します。プルリクエストごとに、確認用の URL ができます。

## 書体のライセンス

同梱している書体は、どれも SIL Open Font License 1.1 です。ライセンスの全文は `src/assets/fonts/` にあります。
