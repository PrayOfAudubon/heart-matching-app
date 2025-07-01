# バグ修正ガイド - 入力フィールド問題

## 現在の問題

### 症状
- すべてのテキスト入力フィールドで一文字入力するたびに入力が終了
- ユーザーは文字を入力するたびにフィールドを再クリックする必要がある
- フォームの使用性が著しく低下

### 発生場所
- 患者登録フォーム (`RegisterView` コンポーネント)
- ログイン画面の施設名入力
- 検索フィルターの入力フィールド

## 根本原因の分析

### React の再レンダリング問題
入力フィールドの問題は、Reactコンポーネントの不適切な再レンダリングが原因です。

#### 原因1: コンポーネント内でのuseState定義
現在の `test` ファイルでは、`RegisterView` コンポーネント内で `formData` の状態が定義されています：

```javascript
const RegisterView = () => {
  const [formData, setFormData] = useState({
    // フォームデータ
  });
  // ...
};
```

#### 原因2: 親コンポーネントの再レンダリング
`RegisterView` がメインコンポーネント内で関数として定義されているため、親コンポーネントが再レンダリングされるたびに新しい `RegisterView` インスタンスが作成されます。

## 修正方法

### 方法1: 状態の外部管理（推奨）
フォームの状態を親コンポーネントで管理し、プロパティとして渡す：

```javascript
// メインコンポーネントで状態管理
const [formData, setFormData] = useState({...});

// RegisterViewにプロパティとして渡す
const RegisterView = ({ formData, setFormData }) => {
  // useState を使わずにプロパティを使用
};
```

### 方法2: コンポーネントの外部定義
`RegisterView` を `HeartFailureMatchingApp` の外で定義する：

```javascript
// メインコンポーネントの外で定義
const RegisterView = () => {
  // コンポーネントロジック
};

const HeartFailureMatchingApp = () => {
  // メインロジック
};
```

### 方法3: React.memo の使用
コンポーネントのメモ化で不要な再レンダリングを防ぐ：

```javascript
const RegisterView = React.memo(() => {
  // コンポーネントロジック
});
```

## 修正手順

### 1. 現在のプロジェクトファイル確認
実際の `App.jsx` ファイルでは既に状態が適切に管理されている可能性があります。

### 2. testファイルの更新
`test` ファイルを実際のプロジェクトファイルと同期させる必要があります。

### 3. 入力フィールドの検証
各入力フィールドで以下を確認：
- `value` プロパティが正しく設定されているか
- `onChange` ハンドラーが適切に動作するか
- 再レンダリング時にフォーカスが失われないか

## 修正後の検証項目

### 機能テスト
- [ ] テキスト入力フィールドで連続入力が可能
- [ ] セレクトボックスで選択が正常に動作
- [ ] チェックボックスの状態が保持される
- [ ] フォーム送信が正常に完了

### パフォーマンステスト
- [ ] 入力時の遅延がない
- [ ] 大量データ入力時も安定動作
- [ ] メモリリークが発生しない

## 予防策

### 1. 状態管理のベストプラクティス
```javascript
// ✅ 良い例：状態を適切な場所で管理
const ParentComponent = () => {
  const [formData, setFormData] = useState({});
  return <ChildComponent formData={formData} setFormData={setFormData} />;
};

// ❌ 悪い例：コンポーネント内で状態管理
const ParentComponent = () => {
  const ChildComponent = () => {
    const [formData, setFormData] = useState({});
    return <form>...</form>;
  };
  return <ChildComponent />;
};
```

### 2. コンポーネント設計原則
- 状態は最も近い共通の親で管理
- プロパティの流れを一方向に保つ
- 副作用は適切に管理

### 3. デバッグ手法
```javascript
// React DevTools でコンポーネントの再レンダリングを監視
// useEffect でレンダリング回数をログ出力
useEffect(() => {
  console.log('Component rendered');
});
```

## 関連資料

### React公式ドキュメント
- [State の管理](https://react.dev/learn/managing-state)
- [コンポーネント間でのデータ共有](https://react.dev/learn/sharing-state-between-components)

### トラブルシューティング
- [よくある React の間違い](https://react.dev/learn/common-mistakes)
- [パフォーマンス最適化](https://react.dev/learn/optimizing-performance)

---

**作成日**: 2025年6月27日  
**優先度**: 高  
**担当者**: 開発チーム  
**ステータス**: 修正中
