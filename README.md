# CRM-FE

Novel CRM の Frontend アプリケーション。
顧客（Customer）・商談（Deal）・活動ログ（ActivityLog）を管理する CRM。
sales・manager・admin の 3 ロールを持つ。

## 技術スタック

| 用途              | 採用技術                       |
| ----------------- | ------------------------------ |
| フレームワーク    | React 19 + Vite                |
| 言語              | TypeScript                     |
| UI ライブラリ     | Chakra UI v3                   |
| サーバー状態管理  | TanStack React Query v5        |
| HTTP クライアント | Axios                          |
| ルーティング      | React Router v7                |
| バリデーション    | Zod                            |
| Linter            | ESLint                         |
| Formatter         | Prettier                       |
| テスト            | Vitest + React Testing Library |
| E2Eテスト         | Playwright                     |
| パッケージ管理    | yarn                           |

## 前提条件

- Node.js 18 以上
- yarn
- `CRM-BE` が起動済みであること（`http://localhost:8000`）

### E2E テストを実行する場合の追加前提条件

**フォルダ配置**: `CRM-FE` と `CRM-BE` が**同じ階層**に配置されていること。

```
任意のフォルダ/
├── CRM-FE/   ← このリポジトリ
└── CRM-BE/   ← 同階層に配置すること
```

## セットアップ

```bash
# 依存パッケージのインストール
yarn install

# 環境変数ファイルの作成（.env.example をコピーして使用）
cp .env.example .env

# 開発サーバーの起動
yarn dev
```

ブラウザで `http://localhost:5173` を開いてください。

## 動作確認用アカウント

CRM-FE はシードを行わないため、`CRM-BE` を `SEED_PROFILE=development` で起動した際に投入される以下のアカウントでログインする（パスワードは共通で `password`）。

| メール                | ロール  |
| --------------------- | ------- |
| `sales@example.com`   | sales   |
| `manager@example.com` | manager |

admin アカウントは CRM-BE の `.env` に設定した `ADMIN_EMAIL` / `ADMIN_PASSWORD` でログインする。

## ロールと認可

| ロール    | 権限                                            |
| --------- | ----------------------------------------------- |
| `sales`   | 自分が担当する customer / deal のみ閲覧・編集可 |
| `manager` | 全ての customer / deal を閲覧・編集可           |
| `admin`   | ユーザー管理のみ（CRM 業務データは扱わない）    |

認証はバックエンドが発行する JWT を httponly Cookie（`access_token`）に格納する方式。`services/internal/backend/v1/client.ts` で `withCredentials: true` を設定し、リクエストに Cookie を自動送信する。ログイン状態は `useGetMeQuery`（`GET /auth/me`）で取得し、`RequireAuth`（`routes/RequireAuth.tsx`）がルート単位で未ログイン・ロール不一致を判定して `/login` または `/403` にリダイレクトする。

## 画面構成

| URL              | 画面                                   | アクセス可能なロール |
| ---------------- | -------------------------------------- | -------------------- |
| `/login`         | ログイン                               | 全員（未認証時）     |
| `/customers`     | 顧客一覧                               | 全ロール             |
| `/customers/:id` | 顧客詳細（紐づく商談・活動ログを含む） | 全ロール             |
| `/admin/users`   | アカウント管理                         | admin のみ           |
| `/403`           | 権限エラー                             | —                    |

## よく使うコマンド

```bash
yarn dev            # 開発サーバー起動
yarn build          # 本番ビルド
yarn preview        # ビルド済みアプリのプレビュー
yarn lint           # Linter 実行
yarn lint:fix       # Linter 実行（自動修正）
yarn format         # Formatter チェック
yarn format:fix     # Formatter 実行（自動修正）
yarn test           # テスト実行（1回）
yarn test:watch     # テスト実行（ウォッチモード）
yarn test:coverage  # テスト実行（カバレッジ付き）
yarn test:e2e       # E2E テスト実行（ローカル）
yarn test:e2e:ui    # E2E テスト実行（UIモード）
```

## テスト

単体・コンポーネントテストは Vitest + React Testing Library。対象ファイルと同じディレクトリの `__test__/` に配置する（例: `src/components/atoms/RoleBadge.tsx` → `src/components/atoms/__test__/RoleBadge.test.tsx`）。カバレッジは `src/**` を対象に、型定義のみのファイル・エントリポイント（`main.tsx` / `App.tsx`）・`routes/**` などのルーティング定義・`components/ui/**`（Chakra UI 生成コード）を除外している（詳細は `vite.config.ts` の `coverage.exclude` を参照）。

```bash
yarn test           # 1回実行
yarn test:watch     # ウォッチモード
yarn test:coverage  # カバレッジ付き
```

E2E テストは Playwright を使い、`CRM-BE` の E2E 専用バックエンドと繋いで結合させる。

```bash
# 1. Playwright ブラウザをインストール（初回のみ）
yarn playwright install

# 2. .env.e2e.example をコピー（初回のみ）
cp .env.e2e.example .env.e2e

# 3. CRM-BE で E2E 専用バックエンドを起動（初回はイメージビルドあり）
cd ../CRM-BE
make e2e-up

# 4. CRM-FE に戻り E2E テストを実行
#    （FE 開発サーバーは playwright.config.ts の webServer が自動起動）
cd ../CRM-FE
yarn test:e2e

# 5. 使い終わったら E2E 専用バックエンドを停止
cd ../CRM-BE
make e2e-down
```

## ディレクトリ構成

```
src/
├── core/           # アプリ全体の設定（環境変数の検証、React Query の QueryClient）
├── features/       # 画面単位のロジック・UI（Root/Container パターン、[id] は詳細画面）
├── components/      # Atomic Design（atoms → molecules → organisms → templates → pages）
├── services/        # API 通信層
│   ├── base/         #   axios クライアントのファクトリ
│   └── internal/backend/v1/  # バックエンド v1 API のクライアント・型定義
├── share/           # 複数 feature をまたぐ共有物
│   ├── types/         #   ドメインの型（ロール・商談ステータス等）
│   ├── constants/      #   定数・ラベル定義
│   ├── logic/          #   純粋なロジック関数
│   └── hooks/          #   共有 React Query hooks（queries/mutations）
├── routes/          # ルーティング定義・認証/認可ガード（RequireAuth）
└── tests/           # テストの共通セットアップ（Vitest setupFiles）
```

各 `features/*` 配下は「`Root`（一覧画面など起点）」「`[id]`（詳細画面などの動的セグメント）」という単位でディレクトリを切る。その中は `Container`（データ取得・状態管理）＋`Presentational`（見た目）に分離し、`ui/` に画面内で使う個別コンポーネント（ダイアログ等）、`hooks/queries` `hooks/mutations` `hooks/handlers` にそれぞれ React Query hooks とイベントハンドラを置く構成になっている。

## 環境変数

`.env.example` / `.env.e2e.example` を参照。

| ファイル   | 用途                                                                |
| ---------- | ------------------------------------------------------------------- |
| `.env`     | ローカル開発（`yarn dev`）                                          |
| `.env.e2e` | E2E テスト（`yarn test:e2e`、CRM-BE の E2E 専用バックエンドに接続） |

主要な変数：

| 変数名             | 説明                                                                        |
| ------------------ | --------------------------------------------------------------------------- |
| `VITE_BACKEND_URL` | 接続先バックエンドの URL。起動時に `core/config.ts` で Zod により検証される |
