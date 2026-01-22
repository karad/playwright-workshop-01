# Playwright E2E サンプル (MCP のテスト用)

## playwright mcp のセットアップ

Codex CLI の場合は `~/.codex/config.toml` に以下を追加。Claude Code などではそれぞれの設定方法に準じる

```
[mcp_servers.playwright]
command = "npx"
args = ["@playwright/mcp@latest"]
```

生成してもらったドキュメントとテスト

- `e2e-mcp/docs/codex-playwright-mcp-ui-demo.md`
- `e2e-mcp/tests/e2e.spec.js`

## セットアップ
```sh
npm install
npx playwright install
```

## 起動
```sh
npm run dev
```
ブラウザで `http://localhost:3000` を開いて確認できます。

## E2Eテスト
```sh
npm run test:e2e
```

HTMLレポート:
```sh
npm run report
```

