# nemdull engineer profile site

このリポジトリは、NemDull（ねむだる）のエンジニアプロフィールサイトを構築するための Vite + React + TypeScript プロジェクトです。shadcn/ui のコンポーネントをベースに、ポートフォリオ向けのセクションを構成しています。最新の公開版は [https://www.nemdull.com/](https://www.nemdull.com/) から閲覧できます。

## プロジェクト概要

- **フロントエンド基盤**: Vite + React 19 + TypeScript
- **スタイリング**: Tailwind CSS（shadcn/ui 互換のトークン構成）
- **UI コンポーネント**: `Button` / `Badge` / `Card` / `Progress` など shadcn/ui 由来のコンポーネント
- **アイコン**: [lucide-react](https://lucide.dev)
- **主要セクション**:
  - `Navigation` : ページヘッダーとグローバルナビゲーション
  - `Hero` : ファーストビュー
  - `SocialLinks` : SNS / 外部リンクまとめ
  - `About` : 自己紹介
  - `Experience` : 職務経歴
  - `Skills` : スキルスタック
  - `Certifications` : 資格・認定一覧（職務経歴書準拠）
  - `Community` : コミュニティ / ハッカソン参加歴
  - `Projects` : 業務・個人開発の実績
  - `Contact` : 連絡先フォーム

## 必要環境

- Node.js 20 以上
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

## ディレクトリ構成

```
├─ public/
│  └─ vite.svg                # favicon など静的アセット
├─ src/
│  ├─ components/             # 各セクションおよび UI コンポーネント
│  │  ├─ hero.tsx             # Hero セクション
│  │  ├─ about.tsx            # 自己紹介
│  │  ├─ experience.tsx       # 職務経歴
│  │  ├─ skills.tsx           # スキルスタック
│  │  ├─ certifications.tsx   # 資格セクション
│  │  ├─ community.tsx        # コミュニティ・ハッカソン
│  │  ├─ projects.tsx         # プロジェクト
│  │  ├─ contact.tsx          # お問い合わせ
│  │  ├─ social-links.tsx     # SNS リンク
│  │  └─ ui/                  # shadcn/ui ベースの UI コンポーネント
│  ├─ lib/utils.ts            # クラス結合ユーティリティ `cn`
│  ├─ index.css               # テーマトークンと Tailwind 設定
│  ├─ App.tsx                 # ページ構成ルート
│  └─ main.tsx                # エントリーポイント
├─ package.json               # 依存関係と npm scripts
├─ vite.config.ts             # Vite 設定（`@` エイリアス含む）
└─ tsconfig.*                 # TypeScript 設定
```

## 開発 Tips

- **テーマ変更**: `src/index.css` の CSS 変数を編集すると配色やタイポグラフィを一括調整できます。
- **セクション編集**: 文言・リンクは `src/components/` 以下の各ファイルを直接更新します。
- **UI 拡張**: 追加で shadcn/ui から取り込みたい場合は `src/components/ui/` にコンポーネントを追加し、`Button` などと同様に利用してください。
- **Lint / Format**: `npm run lint` で ESLint、`npm run build` で型チェック込みのビルドを実行できます。

## デプロイ

`npm run build` で生成される `dist/` ディレクトリを静的ホスティング（Vercel / Netlify / GitHub Pages など）に配置するだけでデプロイできます。必要に応じてカスタムドメインや計測タグを設定してください。

## ライセンス

特に記載がない限り、本リポジトリのコードは MIT ライセンスで提供されています。利用の際はライセンス条件に従ってください。

