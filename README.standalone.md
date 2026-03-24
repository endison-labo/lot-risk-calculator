# lot-risk-calculator（PWA）

**リスク％・SL（ドル）・口座用の換算（1回登録）** から推奨ロットを出す静的 Web アプリ。ゴールド裁量・円口座の**目安**向け。

## 式（概要・開発者向け）

- **1回登録**: 実トレード1件から内部係数を算出（画面では「換算」と表示）
- **運用**: 許容損失 = 残高 × リスク% → ロット = 許容損失 ÷（換算 × SLドル）（刻み切り下げ）

## GitHub Pages

リポジトリ **Settings → Pages** で **Branch `main` / folder `/ (root)`** を選ぶと、

`https://endison-labo.github.io/lot-risk-calculator/`

で公開されます（反映まで1〜3分程度のことがあります）。

## iPhone（Chrome）

1. 上記 **https** の URL を Chrome で開く  
2. **⋯** → **ホーム画面に追加**

## ファイル

| ファイル | 役割 |
|----------|------|
| `index.html` | メイン（推奨ロット）・右上⚙で設定へ |
| `setup.html` | 初期設定（換算の1回登録） |
| `manifest.webmanifest` | PWA（standalone） |
| `sw.js` | Service Worker |
| `icon.svg` | アイコン（差し替え可） |

換算値は **ブラウザの localStorage** のみ（同期なし）。

## 免責

教育・目安用。実際の発注は口座・ブローカーで確認してください。
