# 心不全患者マッチングアプリ

医療・介護施設向けの匿名患者情報登録・検索・マッチング機能を提供するWebアプリケーションです。

## 🏥 プロジェクト概要

このアプリケーションは、心不全患者の情報を匿名で管理し、医療・介護施設間での患者情報共有とマッチングを支援します。

### 主な機能
- 📝 患者情報の匿名登録・管理
- 🔍 高度な検索・フィルタリング機能
- 🏢 施設間での患者情報共有
- 📱 レスポンシブ対応（PC・タブレット・スマートフォン）
- 🔒 プライバシー保護・セキュリティ対応

## 🛠 技術スタック

- **フロントエンド**: React 18 + Vite
- **スタイリング**: TailwindCSS v3.4.0
- **アイコン**: Lucide React
- **状態管理**: React Hooks
- **開発環境**: Node.js + npm

## 🚀 セットアップ

### 前提条件
- Node.js (v16以上)
- npm または yarn

### インストール手順

```bash
# リポジトリのクローン
git clone [repository-url]
cd heart-matching-app

# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ブラウザで http://localhost:5173 にアクセス
```

### ビルド
```bash
# 本番用ビルド
npm run build

# プレビュー
npm run preview
```

## 📁 プロジェクト構造

```
heart-matching-app/
├── src/
│   ├── components/       # UIコンポーネント
│   │   ├── LoginView.jsx
│   │   ├── Dashboard.jsx
│   │   ├── RegisterView.jsx
│   │   └── ...
│   ├── data/            # 定数・サンプルデータ
│   │   ├── constants.js
│   │   └── sampleData.js
│   ├── utils/           # ユーティリティ関数
│   │   └── patientUtils.js
│   ├── App.jsx          # メインアプリケーション
│   ├── index.css        # TailwindCSS設定
│   └── main.jsx         # エントリーポイント
├── docs/                # プロジェクト文書
│   ├── PROJECT_PLAN.md  # プロジェクト計画書
│   ├── TECHNICAL_SPECS.md # 技術仕様書
│   ├── BUG_FIX_GUIDE.md # バグ修正ガイド
│   └── CODING_GUIDELINES.md # コーディング指針
├── public/              # 静的ファイル
├── package.json         # 依存関係
├── tailwind.config.js   # TailwindCSS設定
├── postcss.config.js    # PostCSS設定
└── vite.config.js       # Vite設定
```

## 📋 現在のステータス

### ✅ 完了済み機能
- ログイン画面
- ダッシュボード
- 患者一覧表示
- 患者登録フォーム
- 検索・フィルタリング
- 患者照会モーダル

### 🔧 現在の課題
- **入力フィールドバグ**: 一文字ごとに入力が終了する問題（修正中）

### 📅 今後の予定
1. 入力バグの修正
2. 施設情報管理機能
3. マッチング・推薦システム
4. バックエンドAPI連携
5. セキュリティ強化

詳細は [`docs/PROJECT_PLAN.md`](docs/PROJECT_PLAN.md) を参照してください。

## 🎨 UI/UX

### デザインシステム
- **カラーパレット**: 医療現場に適したブルー・グレー基調
- **タイポグラフィ**: 読みやすさを重視したフォント設計
- **レスポンシブ**: モバイルファースト設計

### アクセシビリティ
- WCAG 2.1 AA準拠
- キーボードナビゲーション対応
- スクリーンリーダー対応

## 🔒 セキュリティ・プライバシー

### データ保護
- 個人情報の匿名化
- データ暗号化
- アクセスログ記録

### 医療情報管理
- HIPAA準拠を意識した設計
- 最小権限の原則
- データ保持期間の管理

## 🧪 テスト

### 実行方法
```bash
# 単体テスト
npm run test

# カバレッジレポート
npm run test:coverage

# E2Eテスト
npm run test:e2e
```

## 🤝 コントリビューション

1. フォークを作成
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。

## 📞 サポート

### 開発チーム連絡先
- 技術的な質問: [技術サポート]
- バグ報告: GitHub Issues
- 機能要望: GitHub Discussions

### 関連文書
- [プロジェクト計画書](docs/PROJECT_PLAN.md)
- [技術仕様書](docs/TECHNICAL_SPECS.md)
- [バグ修正ガイド](docs/BUG_FIX_GUIDE.md)
- [コーディング指針](docs/CODING_GUIDELINES.md) ⭐

---

**最終更新**: 2025年6月30日  
**バージョン**: v1.0.0-beta
