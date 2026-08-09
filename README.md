# misskey-tauri

Tauri 2 + React + TypeScript + Vite で構築した Misskey 向けデスクトップブラウザです。
現在は `https://misskey.io` のみをアプリ内 WebView で開き、それ以外の `http/https` 遷移や新規ウィンドウ要求は既定の外部ブラウザへ委譲する構成になっています。

## 現在の挙動

- 起動時に `misskey.io` をメインウィンドウで開く
- ウィンドウタイトルをページタイトルに追従させる
- `https://misskey.io` だけを WebView 内で許可する
- `misskey.io` 以外への `http/https` 通常遷移を外部ブラウザで開く
- `window.open` などの別窓要求で `misskey.io` 以外へ出る場合も外部ブラウザで開く
- 非 `http/https` スキームの遷移は WebView 内で拒否する
- Tauri の capability は `main` ウィンドウにだけ割り当て、IPC 権限は付与しない

## 技術スタック

- Tauri 2
- TypeScript 6
- Vite 8
- Rust 2021
- npm + Volta

フロントエンドは軽量化のため、React を使わず最小の Vite + TypeScript 構成にしています。

## 必要環境

ローカル開発は主に Windows を想定しています。

- Node.js `24.19.0`
- npm `12.0.2`
- Rust stable
- WebView2 Runtime
- Microsoft C++ Build Tools

`package.json` に Volta 設定があるため、Volta を使うと Node.js / npm の版を合わせやすくなります。

## セットアップ

```powershell
volta install node@24.19.0
volta install npm@12.0.2
rustup update stable
npm install
```

バージョン確認:

```powershell
node --version
npm --version
rustc --version
npm exec -- tauri --version
```

## 開発

フロントエンドのみ起動:

```powershell
npm run dev
```

Tauri アプリとして起動:

```powershell
npm run tauri:dev
```

## ビルド

```powershell
npm run build
npm run tauri:build
```

`npm run build` と `npm run typecheck` は `tsc -b` を使うため、2 系統の TypeScript 設定をインクリメンタルにまとめて検査します。

主な生成先:

- `dist/`
- `src-tauri/target/release/`
- `src-tauri/target/release/bundle/`

## 利用できるスクリプト

- `npm run dev`: Vite 開発サーバー
- `npm run build`: TypeScript チェック + Vite 本番ビルド
- `npm run lint`: ESLint
- `npm run typecheck`: TypeScript 型チェック
- `npm run format`: Prettier チェック
- `npm run format:write`: Prettier 整形
- `npm run tauri`: Tauri CLI
- `npm run tauri:dev`: Tauri 開発起動
- `npm run tauri:build`: Tauri 本番ビルド

## リリース

GitHub Actions の [`.github/workflows/tauri-action.yml`](./.github/workflows/tauri-action.yml) で、`release` ブランチへの push または手動実行時にリリース用ビルドを作成します。

- macOS
- Ubuntu 24.04
- Windows

生成された成果物は GitHub Release の draft に添付されます。

## 関連ファイル

- [`src-tauri/src/main.rs`](./src-tauri/src/main.rs): WebView の起動とナビゲーション制御
- [`src-tauri/capabilities/main-window.json`](./src-tauri/capabilities/main-window.json): `main` ウィンドウ向けの最小 capability
- [`src-tauri/tauri.conf.json`](./src-tauri/tauri.conf.json): Tauri 設定
- [`package.json`](./package.json): Node.js / npm / スクリプト定義
