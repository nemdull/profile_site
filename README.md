# nemdull engineer profile site

NemDull（ねむだる）のエンジニアプロフィールサイトを構築するための Vite + React + TypeScript プロジェクトです。shadcn/ui を基盤に Tailwind CSS でテーマを調整し、Atomic Design に沿ったコンポーネント構成へリファクタリングしています。最新の公開版は [https://www.nemdull.com/](https://www.nemdull.com/) から閲覧できます。

## プロジェクト概要

- **フロントエンド基盤**: Vite + React 19 + TypeScript
- **スタイリング**: Tailwind CSS（shadcn/ui コンポーネントと tailwind-merge を活用）
- **UI コンポーネント**: `Button` / `Badge` / `Card` / `Progress` などの Atom
- **設計指針**: Atomic Design（Atoms → Molecules → Organisms → Templates → Pages）
- **アイコン**: [lucide-react](https://lucide.dev)
- **主要セクション**（Organisms 配下）:
  - `Navigation` / `Hero` / `SocialLinks`
  - `Experience` / `Skills` / `Certifications`
  - `CommunityShowcase` / `Projects` / `Contact`

## 必要環境

- Node.js 20.19 以上 もしくは 22.12 以上  
- npm（または互換パッケージマネージャー）

## セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# 型チェックを伴うビルド
npm run build

# ビルド成果物のプレビュー
npm run preview
```

## ディレクトリ構成（抜粋）

```
├─ src/
│  ├─ assets/
│  │  └─ images/              # プロフィール写真や背景画像
│  ├─ components/
│  │  ├─ atoms/               # Shadcn ベースの UI パーツ（Button, Card, …）
│  │  ├─ molecules/           # 将来追加予定の小さな複合コンポーネント
│  │  ├─ organisms/           # 各セクション（Navigation, Hero, etc.）
│  │  └─ templates/           # ページレイアウト（MainLayout など）
│  ├─ lib/utils.ts            # `cn`（className 結合ユーティリティ）
│  ├─ pages/
│  │  └─ home/HomePage.tsx    # トップページの構成
│  ├─ index.css               # テーマトークンと Tailwind 設定
│  └─ main.tsx                # エントリーポイント
├─ package.json               # 依存関係と npm scripts
├─ vite.config.ts             # Vite 設定（`@` エイリアス含む）
└─ tsconfig.*                 # TypeScript 設定
```

## 開発 Tips

- **Atomic Design の層構造**:  
  - Atoms は汎用 UI パーツ、Organisms はセクション単位の UI を収容。  
  - Template でレイアウト（ヘッダー等）をまとめ、Pages から呼び出します。  
  - Molecules は必要になったタイミングで配置してください。
- **テーマ変更**: `src/index.css` の CSS 変数を編集すると配色・タイポグラフィを一括調整できます。
- **文言・リンク更新**: セクション単位のテキストは `src/components/organisms/` 内の各ファイルで管理しています。
- **UI 拡張**: shadcn/ui からの追加分は `src/components/atoms/` に配置し、`cn` を使って Tailwind クラスを整理すると保守しやすくなります。
- **Lint / Format**: `npm run lint` で ESLint、`npm run build` で型チェック込みのビルドを実行できます。

## デプロイ

`npm run build` で生成される `dist/` ディレクトリを静的ホスティリング（Vercel / Netlify / GitHub Pages など）に配置するだけでデプロイできます。必要に応じてカスタムドメインや計測タグを設定してください。

## ライセンス

特に記載がない限り、本リポジトリのコードは MIT ライセンスで提供されています。利用の際はライセンス条件に従ってください。
