# Codex + Playwright MCP UIデモ手順（このリポジトリ用）

目的: Playwright MCP 経由でローカルUIを操作し、UI観点（空送信/Tab順/送信中表示/エラー表示）を短時間でデモできるようにする。

## 前提
- 作業ディレクトリ: `e2e-mcp/`
- Node.js / npm が利用可能
- Playwright のブラウザが未インストールなら `npx playwright install` が必要
- 環境によってはローカルポート listen に権限が必要（その場合は許可して実行）

## セットアップ/起動
```sh
npm ci
node server.js
```
別ターミナルで `curl -I http://127.0.0.1:3000` が `200` になることを確認。

## デモシナリオ（Playwright MCP）
以下は「MCPツールで何を呼べば同じ確認になるか」を順序立てたもの。

### 0) 表示確認
- `browser_resize`（例: 1200x800）
- `browser_navigate` → `http://127.0.0.1:3000/`
- `browser_snapshot`（要素と初期状態を確認）
- 任意で `browser_take_screenshot(fullPage: true)` を保存

期待:
- 見出し `Playwright E2E Sample`
- 入力 `Message` とボタン `送信`
- `Result` が `(not sent)`

### 1) 空送信（HTMLバリデーションでブロック）
- `browser_click` で `送信` をクリック（Messageは空のまま）
- `browser_evaluate` で `#message.validity.valueMissing` と `checkValidity()` を確認

期待:
- `checkValidity() === false`
- `#result` は `(not sent)` のまま
- フォーカスが `Message` 入力へ戻る（ブラウザの標準挙動）

`browser_evaluate` 例:
```js
() => {
  const input = document.getElementById("message");
  return {
    value: input.value,
    valueMissing: input.validity.valueMissing,
    valid: input.checkValidity(),
  };
}
```

### 2) Tab順（Message → 送信）
- いったん見出しなどをクリックして初期フォーカスを外す
- `browser_press_key` で `Tab`（1回目）
- `browser_press_key` で `Tab`（2回目）

期待:
- 1回目: `Message` 入力がアクティブ
- 2回目: `送信` ボタンがアクティブ

### 3) 送信中表示（(sending...) → JSON）
実ネットワークをいじらずに、ページ内で `fetch` を遅延させてUIの中間状態を再現する。

- `browser_evaluate` で `window.fetch` を 800ms 遅延させる
- `browser_type` で `Message` に `delayed-2` を入力
- `browser_press_key` で `Enter`（送信）
- 直後に `browser_snapshot`（`#result` が `(sending...)` になっているのを確認）
- `browser_wait_for` で `delayed-2` の表示を待つ

`browser_evaluate` 例:
```js
() => {
  const origFetch = window.fetch.bind(window);
  window.fetch = (...args) =>
    new Promise((resolve, reject) =>
      setTimeout(() => origFetch(...args).then(resolve, reject), 800),
    );
  return "fetch delayed";
}
```

期待:
- 送信直後に `#result` が `(sending...)`
- しばらく後に `#result` が JSON になり `"message": "delayed-2"` を含む

### 4) エラー表示（HTTP 500）
ページ内で `fetch` を強制的に 500 にして、エラー表示を再現する。

- `browser_evaluate` で `window.fetch` を 500 を返す関数に差し替え
- `browser_type` で `Message` に `will-fail` を入力
- `browser_press_key` で `Enter`
- `browser_snapshot` で `#result` の表示を確認

`browser_evaluate` 例:
```js
() => {
  window.fetch = async () => new Response("", { status: 500 });
  return "fetch forced to 500";
}
```

期待:
- `#result` が `Error: HTTP 500`

## すぐに回帰できる自動テスト
上記の観点は `tests/e2e.spec.js` に回帰テスト化してある。

```sh
npm run test:e2e
```

## 後片付け
- サーバを停止（`Ctrl+C`）
- Playwright MCP のブラウザを閉じる（必要なら）

