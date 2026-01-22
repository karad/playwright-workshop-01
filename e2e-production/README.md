# Playwright E2E サンプル (開発や本番サーバーに向けてのテスト用)

## セットアップ
```sh
npm install
npx playwright install
npm i -D playwright-lighthouse
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

