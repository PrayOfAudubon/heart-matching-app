# 技術仕様書 - 心不全患者マッチングアプリ

## システム概要

### アーキテクチャ
- **フロントエンド**: React 18 + Vite
- **スタイリング**: TailwindCSS v3.4.0
- **アイコン**: Lucide React
- **状態管理**: React Hooks (useState, useEffect)
- **開発環境**: Node.js + npm

## コンポーネント設計

### メインコンポーネント構成

```javascript
HeartFailureMatchingApp (Root)
├── LoginView
├── Dashboard
│   ├── Header
│   ├── FilterSection
│   ├── PatientList
│   └── MapView
├── RegisterView
│   ├── FormFields
│   └── ValidationErrors
└── ContactModal
```

### 状態管理

#### グローバル状態
```javascript
// メインアプリケーション状態
const [currentView, setCurrentView] = useState('login');
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [facilityName, setFacilityName] = useState('');
const [patients, setPatients] = useState([]);

// フィルター状態
const [searchFilters, setSearchFilters] = useState({
  ageGroup: '',
  gender: '',
  nyhaClass: '',
  careLevel: '',
  area: '',
  service: ''
});

// UI状態
const [selectedPatient, setSelectedPatient] = useState(null);
const [registrationSuccess, setRegistrationSuccess] = useState(false);
const [validationErrors, setValidationErrors] = useState({});
```

#### フォーム状態
```javascript
const [formData, setFormData] = useState({
  // 基本情報
  ageGroup: '',
  gender: '',
  diagnosis: '',
  nyhaClass: '',
  medicalTreatment: '',
  careLevel: '',
  
  // 地域情報
  area: '',
  district: '',
  
  // サービス情報
  desiredService: [],
  visitingNursing: false,
  visitingRehabilitation: false,
  
  // 特殊対応
  livelihoodProtection: false,
  bedsore: false,
  bloodTransfusion: false,
  endOfLifeCare: false,
  
  // スケジュール
  availableDays: [],
  availableHours: '',
  
  // 医療データ
  weight: '',
  bnp: '',
  ef: '',
  medications: [],
  
  // 連絡先
  contactPhone: '',
  contactEmail: ''
});
```

## データ構造

### 患者データ型
```typescript
interface Patient {
  id: string;                    // 患者ID (例: HF-ABC123)
  ageGroup: string;             // 年齢層
  gender: string;               // 性別
  diagnosis: string;            // 診断名
  nyhaClass: string;            // NYHA分類
  medicalTreatment: string;     // 医療処置
  careLevel: string;            // 介護度
  area: string;                 // 地域
  district?: string;            // 地区
  desiredService: string[];     // 希望サービス
  facility: string;             // 登録施設
  contactPhone?: string;        // 連絡先電話
  contactEmail?: string;        // 連絡先メール
  registrationDate: string;     // 登録日
  coordinates: {                // 座標情報
    lat: number;
    lng: number;
  };
  
  // 拡張項目
  visitingNursing?: boolean;
  visitingRehabilitation?: boolean;
  livelihoodProtection?: boolean;
  bedsore?: boolean;
  bloodTransfusion?: boolean;
  endOfLifeCare?: boolean;
  availableDays?: string[];
  availableHours?: string;
  weight?: string;
  bnp?: string;
  ef?: string;
  medications?: string[];
}
```

### マッチングアプリケーション型 (将来実装)
```typescript
interface MatchingApplication {
  id: string;
  patientId: string;           // 申請対象患者ID
  fromFacilityId: string;      // 申請元施設ID
  toFacilityId: string;        // 申請先施設ID
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  message?: string;            // 申請メッセージ
  createdAt: string;
  respondedAt?: string;
  expiryDate: string;          // 申請期限
}
```

### チャットメッセージデータ型 (将来実装)
```typescript
interface ChatMessage {
  id: string;
  chatRoomId: string;          // チャットルームID
  senderId: string;            // 送信者施設ID
  receiverId: string;          // 受信者施設ID
  messageType: 'text' | 'file' | 'system';
  content: string;             // メッセージ内容
  fileName?: string;           // ファイル名（fileタイプの場合）
  fileUrl?: string;           // ファイルURL（fileタイプの場合）
  isRead: boolean;
  createdAt: string;
  editedAt?: string;
  relatedPatientId?: string;   // 関連患者ID
}

interface ChatRoom {
  id: string;
  participants: string[];      // 参加施設ID配列
  patientId?: string;         // 関連患者ID
  applicationId?: string;     // 関連申請ID
  lastMessage?: ChatMessage;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}
```typescript
interface Notification {
  id: string;
  facilityId: string;          // 通知先施設ID
  type: 'matching' | 'application' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  relatedId?: string;          // 関連するID（患者ID、申請IDなど）
}
```
```typescript
interface Facility {
  id: string;
  name: string;
  type: string;                 // 施設種別
  address: string;
  contactPhone: string;
  contactEmail: string;
  services: string[];           // 提供サービス
  acceptanceConditions: {       // 受入条件
    ageRange: string[];
    nyhaClasses: string[];
    careLevels: string[];
    specialCare: string[];
  };
  capacity: {                   // 受入可能数
    total: number;
    current: number;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
}
```

## API設計 (将来実装)

### エンドポイント一覧

#### 認証関連
```
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/profile
```

#### 患者管理
```
GET    /api/patients          # 患者一覧取得
POST   /api/patients          # 患者登録
GET    /api/patients/:id      # 患者詳細取得
PUT    /api/patients/:id      # 患者情報更新
DELETE /api/patients/:id      # 患者削除
```

#### 施設管理
```
GET    /api/facilities        # 施設一覧取得
POST   /api/facilities        # 施設登録
GET    /api/facilities/:id    # 施設詳細取得
PUT    /api/facilities/:id    # 施設情報更新
```

#### マッチング申請
```
POST   /api/matching/applications      # マッチング申請送信
GET    /api/matching/applications      # 申請一覧取得
PUT    /api/matching/applications/:id  # 申請承認・拒否
DELETE /api/matching/applications/:id  # 申請取消
```

#### 自施設患者管理
```
GET    /api/facilities/patients        # 自施設患者一覧
PUT    /api/facilities/patients/:id    # 自施設患者情報更新
DELETE /api/facilities/patients/:id    # 自施設患者削除
GET    /api/facilities/patients/:id/matches # 患者のマッチング状況
```

#### チャット・コミュニケーション
```
GET    /api/chat/rooms                 # チャットルーム一覧取得
POST   /api/chat/rooms                 # チャットルーム作成
GET    /api/chat/rooms/:id/messages    # メッセージ履歴取得
POST   /api/chat/rooms/:id/messages    # メッセージ送信
PUT    /api/chat/rooms/:id/messages/:messageId/read  # メッセージ既読化
POST   /api/chat/rooms/:id/files       # ファイルアップロード
GET    /api/chat/rooms/:id/files/:fileId  # ファイルダウンロード
```

### レスポンス形式
```json
{
  "success": true,
  "data": {
    // データ内容
  },
  "message": "Success message",
  "timestamp": "2025-06-27T10:00:00Z"
}
```

## セキュリティ仕様

### データ保護
- 個人情報の匿名化処理
- データ暗号化 (AES-256)
- アクセスログ記録

### 認証・認可
- JWT トークンベース認証
- ロールベースアクセス制御 (RBAC)
- セッション管理

### 通信セキュリティ
- HTTPS 強制
- CORS 設定
- CSP (Content Security Policy) 適用

## パフォーマンス要件

### レスポンス時間
- 初期ロード: < 2秒
- ページ遷移: < 0.5秒
- 検索処理: < 1秒

### 同時利用者数
- 想定: 100ユーザー
- 最大: 500ユーザー

## 開発・デプロイ

### ローカル開発
```bash
# 開発サーバー起動
npm run dev

# ビルド実行
npm run build

# プレビュー
npm run preview
```

### 本番環境 (将来)
- **ホスティング**: Vercel / Netlify
- **CDN**: CloudFront
- **データベース**: PostgreSQL / MongoDB
- **監視**: Sentry / DataDog

## テスト戦略

### 単体テスト
- React Testing Library
- Jest
- カバレッジ目標: 80%以上

### 統合テスト
- Cypress / Playwright
- E2Eテストシナリオ

### パフォーマンステスト
- Lighthouse CI
- WebPageTest

## ブラウザサポート

### 対応ブラウザ
- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

### モバイル対応
- iOS Safari 14+
- Android Chrome 90+
- レスポンシブデザイン

## ログ・監視

### フロントエンドログ
```javascript
// エラーログ
console.error('Error:', error);

// 操作ログ
console.log('User action:', action);

// パフォーマンスログ
console.time('Operation');
```

### 監視項目
- ページロード時間
- エラー発生率
- ユーザー操作フロー
- API レスポンス時間

---

**作成日**: 2025年6月27日  
**バージョン**: 1.0  
**最終更新**: 2025年6月27日
