# コーディング指針

このプロジェクトでは、保守性と可読性を重視したコード構造を維持するための指針を定めています。

## 📁 ファイル構造の原則

### 1. ファイルサイズの制限
- **単一ファイルは200行を目安とする**
- 300行を超える場合は分割を検討する
- 500行を超えるファイルは必ず分割する

### 2. 関心の分離
```
src/
├── components/     # UIコンポーネント（画面・部品）
├── data/          # 定数・サンプルデータ
├── utils/         # ユーティリティ関数・ビジネスロジック
├── hooks/         # カスタムフック（必要に応じて）
└── types/         # TypeScript型定義（必要に応じて）
```

### 3. コンポーネント分割の基準
- **機能ごとに分割**：ログイン、登録、検索など
- **再利用性を考慮**：モーダル、テーブル、フォームなど
- **複雑さによる分割**：100行を超えるコンポーネントは小さな部品に分ける

## 🔧 実装の原則

### 1. 定数の管理
- **ハードコードを避ける**：選択肢、エラーメッセージなどは定数ファイルに
- **一箇所で管理**：同じ定数を複数箇所で定義しない
- **意味のある名前**：`AREA_OPTIONS`、`VALIDATION_MESSAGES`など

### 2. ユーティリティ関数
- **純粋関数を心がける**：副作用のない関数
- **単一責任の原則**：一つの関数は一つの役割
- **テストしやすい設計**：入力と出力が明確

### 3. 状態管理
- **状態の最小化**：必要最小限の状態のみ管理
- **適切なスコープ**：グローバル状態vs局所状態の使い分け
- **状態の正規化**：重複や矛盾を避ける

## 📝 コード品質の基準

### 1. 命名規則
- **コンポーネント**：PascalCase（`LoginView`、`PatientTable`）
- **関数・変数**：camelCase（`handleLogin`、`patientData`）
- **定数**：SCREAMING_SNAKE_CASE（`AREA_OPTIONS`）
- **ファイル名**：PascalCase（コンポーネント）、camelCase（その他）

### 2. インポートの整理
```javascript
// 1. React関連
import React, { useState, useEffect } from 'react';

// 2. 外部ライブラリ
import { Heart, Plus } from 'lucide-react';

// 3. 内部コンポーネント
import LoginView from './components/LoginView';
import Dashboard from './components/Dashboard';

// 4. 内部ユーティリティ・データ
import { samplePatients } from './data/sampleData';
import { generatePatientId } from './utils/patientUtils';
```

### 3. コメントとドキュメント
- **複雑なロジックには説明を追加**
- **TODO、FIXMEタグの活用**
- **API仕様の変更は必ずドキュメント更新**

## 🚨 リファクタリングのタイミング

### 以下の場合は即座にリファクタリングを検討：
1. **ファイルが300行を超えた時**
2. **同じコードが3箇所以上に存在する時**
3. **関数が50行を超えた時**
4. **ネストが4層を超えた時**
5. **新機能追加時に既存コードの大幅な修正が必要な時**

## 🔄 分割の手順

### 1. コンポーネント分割
```javascript
// Before: 大きなコンポーネント
const LargeComponent = () => {
  // 300行のコード
};

// After: 小さなコンポーネントに分割
const Header = () => { /* ヘッダー部分 */ };
const Sidebar = () => { /* サイドバー部分 */ };
const MainContent = () => { /* メインコンテンツ */ };
const LargeComponent = () => (
  <div>
    <Header />
    <Sidebar />
    <MainContent />
  </div>
);
```

### 2. ロジック分割
```javascript
// Before: コンポーネント内にロジック
const Component = () => {
  const handleComplexLogic = () => {
    // 複雑な処理...
  };
};

// After: ユーティリティ関数に分離
// utils/businessLogic.js
export const handleComplexLogic = (data) => {
  // 複雑な処理...
};

// Component.jsx
import { handleComplexLogic } from '../utils/businessLogic';
```

## 📋 チェックリスト

新機能追加・修正時のチェック項目：

- [ ] ファイルサイズは適切か？（200行以内推奨）
- [ ] 定数はハードコードされていないか？
- [ ] 関数は単一責任を満たしているか？
- [ ] コンポーネントは再利用可能か？
- [ ] エラーハンドリングは適切か？
- [ ] 名前は意味を表しているか？
- [ ] 不要なコメントアウトや console.log は削除したか？

## 🎯 目標

**「3ヶ月後に別の開発者が見ても理解できるコード」**

これを基準に、常に保守性と可読性を意識した開発を心がけましょう。

---

*このドキュメントは定期的に見直し、プロジェクトの成長に合わせて更新していきます。*
