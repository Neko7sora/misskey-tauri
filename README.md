# misskey-isolated-browser

Tauri 2 + React + TypeScript + Vite で構築した、複数の Misskey インスタンスを扱う Windows 向けデスクトップアプリです。  
ローカルの管理画面だけに Tauri 権限を持たせ、Misskey のリモート表示は capability を与えない別ウィンドウで開く設計にしています。

## 前提条件

- Windows 11
- [Volta](https://volta.sh/) 導入済み
- Microsoft C++ Build Tools 導入済み
- Rust / rustup
- WebView2 Runtime

WebView2 が無い場合は Tauri の起動やビルド後の実行に失敗します。Windows 11 では通常は同梱済みです。

## 採用ツールチェーン

- Node.js: `24.14.0` via Volta
- pnpm: `10.32.1` via Volta
- Rust: stable
- Tauri CLI / API: `2.10.1`

## 確認コマンド

```powershell
volta list
node --version
pnpm --version
rustup show active-toolchain
rustc --version
pnpm exec tauri --version
```

## セットアップ手順

```powershell
volta install node@24
volta install pnpm@latest
rustup update stable
pnpm install
```

このリポジトリでは Volta を `package.json` に固定しているため、ディレクトリ内では指定版の Node.js / pnpm が優先されます。

## 開発起動

フロントエンドだけ起動する場合:

```powershell
pnpm dev
```

Tauri アプリとして起動する場合:

```powershell
pnpm tauri:dev
```

## Windows ビルド

```powershell
pnpm build
pnpm tauri:build
```

生成物は通常、以下に出力されます。

- `src-tauri/target/release/misskey_isolated_browser.exe`
- `src-tauri/target/release/bundle/`

インストーラー形式は Tauri の bundle 設定とビルド環境に応じて生成されます。

## スクリプト

- `pnpm dev`: Vite 開発サーバー
- `pnpm build`: TypeScript チェック込みの本番ビルド
- `pnpm lint`: ESLint
- `pnpm typecheck`: TypeScript strict チェック
- `pnpm tauri:dev`: Tauri 開発起動
- `pnpm tauri:build`: Tauri 本番ビルド

## 隔離モードの考え方

- メインのローカル管理 UI は `main` ウィンドウとして起動し、ここにだけ capability を付与します。
- Misskey を開くリモートウィンドウには capability を割り当てません。
- capability が一致しないため、リモートの Misskey ページは Tauri IPC にアクセスできません。
- インスタンス一覧の保存は localStorage ではなく、Tauri のアプリデータ領域に JSON として保存します。
- リモートウィンドウからのポップアップや別窓要求はアプリ内で開かず、外部ブラウザへ委譲します。
- `開く` はインスタンスごとに再利用可能なウィンドウ、`隔離して開く` は毎回新しい一意ラベルのウィンドウを生成します。

## 実装済み機能

- Misskey インスタンス一覧の初期プリセット表示
- URL バリデーション付きの追加・編集・削除
- 複数インスタンスの同時オープン
- 外部ブラウザ起動
- アプリ再起動後の設定再読込
- TypeScript strict
- ESLint / Prettier 設定

## 制限事項

- リモート Misskey のセッション分離は WebView の実装依存であり、完全なブラウザプロファイル分離までは行っていません。
- 通常のページ遷移までは強制的に制御していません。別窓要求のみ外部ブラウザへ委譲します。
- Misskey サイト固有の UI 崩れやログイン導線の差異までは個別調整していません。
- WebView2 が欠けている環境では動作しません。

## 主要依存の理由

- `@tauri-apps/api`: ローカル管理画面から Rust コマンドを呼び出すため
- `@tauri-apps/cli`: `tauri dev` / `tauri build` を pnpm から統一実行するため
- `zod`: URL とフォーム入力の厳密な検証のため
- `open` (Rust): 外部ブラウザへの安全なフォールバックのため
