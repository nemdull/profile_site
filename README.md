# nemdull.com

nemdull（ねむだる）のポートフォリオです。公開先は https://www.nemdull.com/ 。

Vite、React 19、TypeScript、Tailwind CSS 4 で作っています。

## 考え方

- 載せる内容は `src/content/profile.json` の 1 か所にまとめる。文言やリンクを変えるときは、ここだけ直す
- 「できること」に書く主張には、根拠を 1 つ以上付ける。付いていなければビルドが止まる
- 書体は、使っている文字だけを入れたファイルを同梱する（外部の配信に頼らない）

## 使い方

```bash
npm install
npm run dev      # 開発サーバー
npm run check    # 内容の点検だけ
npm run build    # 内容の点検 → 型チェック → ビルド
npm run preview  # ビルド結果の確認
npm run lint
```

Node.js は 20.19 以上、または 22.12 以上。

## 内容の点検

`scripts/check-content.mjs` が、`npm run build` の最初に走ります。

| 見ていること | 見つかったとき |
| --- | --- |
| 「できること」の各行に根拠があるか | ビルドを止める |
| リンクが https で、形が正しいか | ビルドを止める |
| リンク先が、決めた一覧の中にあるか | ビルドを止める |
| 書体のファイルに入っていない文字が無いか | 警告を出す |

## 書体

BIZ UDPGothic と BIZ UDPMincho（どちらも SIL Open Font License 1.1）から、このサイトで使う文字だけを取り出して `src/assets/fonts/` に置いています。文言に新しい漢字を足したら、作り直します。

```bash
pip install fonttools brotli
npm run fonts
```

作り直さなくても表示は壊れません（足りない文字だけ、端末の書体になります）。

## 構成

```
src/
├─ content/        # profile.json（載せる内容）と、その型
├─ components/
│  ├─ atoms/       # リンク、チェックの印
│  ├─ molecules/   # 節の枠、日付印、明るい／暗いの切り替え
│  ├─ organisms/   # 画面の各部分（Hero、SpecSheet、Experience など）
│  └─ templates/   # ページの骨組み
├─ pages/home/     # トップページ
├─ assets/         # 画像と書体
└─ index.css       # 色・書体・動きの定義
scripts/
├─ check-content.mjs  # 内容の点検
└─ subset-fonts.py    # 書体の作り直し
```

## デプロイ

main に入ると、Vercel が自動で公開します。プルリクエストごとに、確認用の URL ができます。

## ライセンス

コードは MIT ライセンスです。書体のライセンスは `src/assets/fonts/` にあります。
