# nemdull engineer profile site

このリポジトリは、NemDull（ねむだる）のエンジニアプロフィールサイトを構築するためのVite + React + TypeScriptプロジェクトです。shadcn/uiのコンポーネントをベースに、ポートフォリオ向けのセクションを構成しています。

## プロジェクト概要

- **フレームワーク**: Vite + React 19 + TypeScript
- **スタイル**: Tailwind CSS（shadcn/uiに合わせたトークン設定）
- **コンポーネント**: shadcn/uiから移植した`Button` / `Badge` / `Card` / `Progress`などを活用
- **アイコン**: [lucide-react](https://lucide.dev)
- **構成セクション**:
  - ナビゲーション（Navigation）
  - ヒーローセクション（Hero）
  - 自己紹介（About）
  - 職歴（Experience）
  - 技術スタック（Skills）
  - プロジェクト一覧（Projects）
  - SNSリンク（SocialLinks）
  - お問い合わせ（Contact）

## 必要環境

- Node.js 20 以上
- npm または任意のパッケージマネージャー

## セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# 型チェック + ビルド
npm run build

# プレビュー表示（ビルド確認用）
npm run preview
```

## ディレクトリ構成

```
├─ public/
│  └─ vite.svg               # デフォルトのFavicon（必要に応じて差し替え）
├─ src/
│  ├─ components/            # 主要セクションとUIコンポーネント
│  │  ├─ hero.tsx            # HEROセクション
│  │  ├─ about.tsx           # 自己紹介
│  │  ├─ experience.tsx      # 職歴
│  │  ├─ skills.tsx          # 技術スタック
│  │  ├─ projects.tsx        # プロジェクト
│  │  ├─ contact.tsx         # お問い合わせ
│  │  ├─ social-links.tsx    # SNSリンク
│  │  └─ ui/                 # shadcn/uiベースのUIコンポーネント
│  ├─ lib/utils.ts           # クラス結合ヘルパー `cn`
│  ├─ index.css              # Tailwind設定とテーマトークン
│  ├─ App.tsx                # ページ全体の構成
│  └─ main.tsx               # エントリーポイント
├─ package.json              # 依存関係・スクリプト
├─ vite.config.ts            # Vite設定（`@`エイリアスなど）
└─ tsconfig.*                # TypeScript設定
```

## カスタマイズのポイント

- **テーマ／配色**: `src/index.css`内のCSS変数を調整することで、サイト全体のトーンを変更可能です。
- **セクション内容**: 各セクションは`src/components/`配下に分割されているため、文言やリンクを直接編集できます。
- **コンポーネント追加**: shadcn/uiから必要なパーツを取り込みたい場合は、`src/components/ui/`にコンポーネントを追加し、`Button`等と同様に利用してください。

## デプロイ

Vite標準のビルド成果物（`dist`）を静的ホスティング（Vercel、Netlify、GitHub Pagesなど）に配置することでデプロイできます。ビルドコマンドは以下です。

```bash
npm run build
```

必要に応じて環境変数や計測ツールを追加し、本番環境向けに調整してください。

## ライセンス

本リポジトリのコードは、特に指定がない限りMITライセンスで提供されています。利用時はライセンス条件に従ってください。
