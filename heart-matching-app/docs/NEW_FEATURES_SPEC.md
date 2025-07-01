# 新機能仕様書 - マッチング申請・通知・自施設患者管理

## 1. マッチング申請機能

### 概要
施設間で患者のマッチングを申請・承認する機能

### 機能詳細

#### 1.1 マッチング申請送信
- **対象**: 他施設が登録した患者
- **申請内容**: 
  - 受入希望の表明
  - 申請理由・メッセージ
  - 提供可能サービス
  - 受入可能時期

#### 1.2 申請管理画面
```
申請一覧表示
├── 送信した申請
│   ├── 承認待ち
│   ├── 承認済み
│   └── 拒否済み
└── 受信した申請
    ├── 未対応
    ├── 承認済み
    └── 拒否済み
```

#### 1.3 申請ステータス
- `pending`: 承認待ち
- `approved`: 承認済み
- `rejected`: 拒否
- `expired`: 期限切れ

### UI仕様

#### 申請送信ボタン
```jsx
<button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
  マッチング申請
</button>
```

#### 申請フォーム
```jsx
const ApplicationForm = ({ patient }) => {
  const [message, setMessage] = useState('');
  const [services, setServices] = useState([]);
  const [acceptanceDate, setAcceptanceDate] = useState('');
  
  return (
    <form>
      <textarea placeholder="申請理由・メッセージ" />
      <CheckboxGroup options={serviceOptions} />
      <DatePicker label="受入可能時期" />
      <button type="submit">申請送信</button>
    </form>
  );
};
```

## 2. 通知・アラート機能

### 概要
リアルタイムでの通知とアラート表示機能

### 通知種別

#### 2.1 マッチング関連
- 新規マッチング申請受信
- 申請の承認・拒否
- マッチング成立通知

#### 2.2 患者情報関連
- 患者情報の更新
- 患者の状況変化

#### 2.3 システム通知
- メンテナンス情報
- 機能追加のお知らせ

### UI仕様

#### 通知ベル
```jsx
const NotificationBell = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  
  return (
    <div className="relative">
      <Bell className="h-6 w-6" />
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs px-1">
          {unreadCount}
        </span>
      )}
    </div>
  );
};
```

#### 通知一覧
```jsx
const NotificationList = () => {
  return (
    <div className="max-h-96 overflow-y-auto">
      {notifications.map(notification => (
        <div key={notification.id} className={`p-3 border-b ${!notification.isRead ? 'bg-blue-50' : ''}`}>
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium">{notification.title}</h4>
              <p className="text-sm text-gray-600">{notification.message}</p>
              <span className="text-xs text-gray-400">{notification.createdAt}</span>
            </div>
            {!notification.isRead && (
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
```

## 3. 自施設患者管理機能

### 概要
自分の施設が登録した患者の一覧表示・管理機能

### 機能詳細

#### 3.1 患者一覧表示
- 自施設が登録した患者のみ表示
- 患者のマッチング状況表示
- ステータス別フィルタリング

#### 3.2 患者情報管理
- 患者情報の編集・更新
- 患者の削除・アーカイブ
- マッチング履歴の表示

#### 3.3 マッチング状況表示
```
患者ステータス
├── 登録済み（マッチング待ち）
├── 申請受信中（他施設から申請あり）
├── マッチング成立
└── アーカイブ済み
```

### UI仕様

#### 自施設患者一覧
```jsx
const MyPatientsView = () => {
  const [myPatients, setMyPatients] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">自施設患者管理</h1>
        <div className="mt-4">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">すべて</option>
            <option value="waiting">マッチング待ち</option>
            <option value="applied">申請受信中</option>
            <option value="matched">マッチング成立</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map(patient => (
          <PatientCard key={patient.id} patient={patient} isMyPatient={true} />
        ))}
      </div>
    </div>
  );
};
```

#### 患者カード（自施設用）
```jsx
const PatientCard = ({ patient, isMyPatient }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-blue-600">{patient.id}</h3>
          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(patient.status)}`}>
            {getStatusText(patient.status)}
          </span>
        </div>
        {isMyPatient && (
          <div className="flex space-x-2">
            <button className="text-blue-600 hover:text-blue-800">
              <Edit className="h-4 w-4" />
            </button>
            <button className="text-red-600 hover:text-red-800">
              <Trash className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      
      {/* 患者情報表示 */}
      <div className="space-y-2 text-sm">
        {/* ...existing patient info... */}
      </div>
      
      {/* マッチング状況 */}
      {patient.applications && patient.applications.length > 0 && (
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
          <h4 className="font-medium text-yellow-800">申請状況</h4>
          <p className="text-sm text-yellow-700">
            {patient.applications.length}件の申請があります
          </p>
        </div>
      )}
      
      {isMyPatient && (
        <div className="mt-4 flex space-x-2">
          <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
            詳細管理
          </button>
          {patient.applications?.length > 0 && (
            <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700">
              申請確認
            </button>
          )}
        </div>
      )}
    </div>
  );
};
```

## 4. チャット・コミュニケーション機能

### 概要
施設間での患者情報共有・相談のためのリアルタイムチャット機能

### 機能詳細

#### 4.1 チャットルーム管理
- **自動作成**: マッチング申請時に自動でチャットルーム作成
- **手動作成**: 施設間で直接相談チャットを開始
- **参加者管理**: 1:1チャット（将来的にグループチャット対応）

#### 4.2 メッセージ機能
- **テキストメッセージ**: 基本的なテキスト送受信
- **ファイル共有**: 医療資料、検査結果等の共有
- **患者情報参照**: チャット内で患者情報へのリンク
- **メッセージ検索**: 過去のやり取り検索

#### 4.3 リアルタイム機能
- **即座配信**: WebSocketによるリアルタイム配信
- **既読機能**: メッセージ既読・未読管理
- **タイピング表示**: 相手の入力状況表示
- **オンライン状態**: 施設のオンライン/オフライン表示

### UI仕様

#### チャット一覧画面
```jsx
const ChatListView = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold flex items-center">
          <MessageCircle className="h-5 w-5 mr-2" />
          チャット
          {unreadCount > 0 && (
            <span className="ml-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
              {unreadCount}
            </span>
          )}
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {chatRooms.map(room => (
          <ChatRoomItem key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
};

const ChatRoomItem = ({ room }) => {
  return (
    <div className="p-4 border-b hover:bg-gray-50 cursor-pointer">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="font-medium">{room.facilityName}</h3>
            {room.isOnline && (
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            )}
          </div>
          {room.relatedPatient && (
            <p className="text-sm text-blue-600">患者: {room.relatedPatient.id}</p>
          )}
          <p className="text-sm text-gray-600 truncate">{room.lastMessage?.content}</p>
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-400">{room.lastMessage?.createdAt}</span>
          {room.unreadCount > 0 && (
            <div className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mt-1">
              {room.unreadCount}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
```

#### チャット画面
```jsx
const ChatView = ({ roomId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  return (
    <div className="h-full flex flex-col">
      {/* ヘッダー */}
      <div className="p-4 border-b bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold">{room.facilityName}</h2>
            {room.relatedPatient && (
              <p className="text-sm text-gray-600">
                患者ID: {room.relatedPatient.id}
              </p>
            )}
          </div>
          <div className="flex space-x-2">
            <button className="p-2 text-gray-600 hover:text-gray-800">
              <Paperclip className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-800">
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* メッセージエリア */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isTyping && (
          <div className="text-sm text-gray-500">相手が入力しています...</div>
        )}
      </div>
      
      {/* 入力エリア */}
      <div className="p-4 border-t bg-white">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="メッセージを入力..."
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const MessageBubble = ({ message }) => {
  const isOwn = message.senderId === currentFacilityId;
  
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
          isOwn
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-800'
        }`}
      >
        {message.messageType === 'file' ? (
          <div className="flex items-center space-x-2">
            <Paperclip className="h-4 w-4" />
            <a href={message.fileUrl} className="underline">
              {message.fileName}
            </a>
          </div>
        ) : (
          <p>{message.content}</p>
        )}
        <div className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
          {message.createdAt}
          {isOwn && message.isRead && (
            <span className="ml-1">✓✓</span>
          )}
        </div>
      </div>
    </div>
  );
};
```

## 5. データベース設計

### チャットルームテーブル
```sql
CREATE TABLE chat_rooms (
  id VARCHAR(255) PRIMARY KEY,
  participant_1_id VARCHAR(255) NOT NULL,
  participant_2_id VARCHAR(255) NOT NULL,
  patient_id VARCHAR(255),
  application_id VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (participant_1_id) REFERENCES facilities(id),
  FOREIGN KEY (participant_2_id) REFERENCES facilities(id),
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (application_id) REFERENCES matching_applications(id)
);
```

### チャットメッセージテーブル
```sql
CREATE TABLE chat_messages (
  id VARCHAR(255) PRIMARY KEY,
  chat_room_id VARCHAR(255) NOT NULL,
  sender_id VARCHAR(255) NOT NULL,
  message_type ENUM('text', 'file', 'system') DEFAULT 'text',
  content TEXT NOT NULL,
  file_name VARCHAR(255),
  file_url VARCHAR(255),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  edited_at TIMESTAMP NULL,
  FOREIGN KEY (chat_room_id) REFERENCES chat_rooms(id),
  FOREIGN KEY (sender_id) REFERENCES facilities(id)
);
```

### マッチング申請テーブル
```sql
CREATE TABLE matching_applications (
  id VARCHAR(255) PRIMARY KEY,
  patient_id VARCHAR(255) NOT NULL,
  from_facility_id VARCHAR(255) NOT NULL,
  to_facility_id VARCHAR(255) NOT NULL,
  status ENUM('pending', 'approved', 'rejected', 'expired') DEFAULT 'pending',
  message TEXT,
  services_offered JSON,
  acceptance_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  responded_at TIMESTAMP NULL,
  expires_at TIMESTAMP NOT NULL,
  FOREIGN KEY (patient_id) REFERENCES patients(id),
  FOREIGN KEY (from_facility_id) REFERENCES facilities(id),
  FOREIGN KEY (to_facility_id) REFERENCES facilities(id)
);
```

### 通知テーブル
```sql
CREATE TABLE notifications (
  id VARCHAR(255) PRIMARY KEY,
  facility_id VARCHAR(255) NOT NULL,
  type ENUM('matching', 'application', 'system') NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  related_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (facility_id) REFERENCES facilities(id)
);
```

## 6. 患者詳細画面・チャット機能 💬

### 概要
フリマアプリライクな患者詳細画面と施設間リアルタイムチャット機能を実装し、マッチング前のコミュニケーションを効率化する。

### 主要機能

#### 6.1 患者詳細画面
**詳細情報表示**
- 患者の基本情報・医療情報の詳細表示
- 希望サービス・介入可能日時の詳細
- 地域・アクセス情報
- 視覚的で分かりやすいレイアウト

**アクション機能**
- 「相談する」ボタン → チャット画面遷移
- 「直接連絡」ボタン → 従来の連絡方法
- 情報の印刷・共有機能

#### 6.2 リアルタイムチャット
**基本チャット機能**
- フリマアプリ風のチャットUI
- リアルタイムメッセージング
- 既読・未読ステータス
- メッセージ履歴の保存

**ファイル共有機能**
- 検査結果画像の共有
- PDF資料（紹介状等）の共有
- ファイルプレビュー機能
- セキュアなファイル管理

**定型メッセージ**
- よく使用される質問の定型文
- クイック返信機能
- カスタム定型メッセージ

#### 6.3 マッチング進行管理
**ステータス管理**
```
照会申請 → 相談中 → マッチング成立 → 連携完了
```

**通知システム**
- 新着メッセージ通知
- ステータス変更通知
- ブラウザ・メール通知

#### 6.4 外部システム連携
**MCS連携**
- マッチング成立後のMCS誘導
- 患者情報の引き継ぎ
- 既存ワークフローとの統合

### 技術仕様
- React + TypeScript
- Socket.io（リアルタイム通信）
- ファイルアップロード機能
- 通知API

### UI設計例

#### 患者詳細画面
```jsx
const PatientDetailView = ({ patientId }) => {
  const [patient, setPatient] = useState(null);
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        {/* 基本情報セクション */}
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold mb-4">患者詳細: {patient.id}</h1>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">基本情報</label>
              <p>{patient.ageGroup}・{patient.gender}</p>
            </div>
            <div>
              <label className="text-sm text-gray-600">診断・重症度</label>
              <p>{patient.diagnosis}・NYHA {patient.nyhaClass}</p>
            </div>
          </div>
        </div>
        
        {/* アクションボタン */}
        <div className="p-6 bg-gray-50">
          <div className="flex space-x-4">
            <button 
              onClick={() => openChat(patient.id)}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              相談する
            </button>
            <button 
              onClick={() => openContact(patient)}
              className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
            >
              直接連絡
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
```

#### チャット画面
```jsx
const ChatInterface = ({ patientId, currentFacility }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  
  return (
    <div className="flex h-screen">
      {/* チャットエリア */}
      <div className="flex-1 flex flex-col">
        {/* ヘッダー */}
        <div className="bg-white border-b p-4">
          <h2 className="font-bold">患者: {patientId}</h2>
          <p className="text-sm text-gray-600">相談中</p>
        </div>
        
        {/* メッセージリスト */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender === currentFacility ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs p-3 rounded-lg ${
                msg.sender === currentFacility ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}>
                <p>{msg.content}</p>
                <p className="text-xs mt-1 opacity-70">{msg.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* メッセージ入力 */}
        <div className="border-t p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 border rounded-md px-3 py-2"
              placeholder="メッセージを入力..."
            />
            <button 
              onClick={() => sendMessage(newMessage)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              送信
            </button>
          </div>
        </div>
      </div>
      
      {/* サイドバー（患者情報） */}
      <div className="w-80 bg-gray-50 border-l p-4">
        <h3 className="font-bold mb-4">患者情報</h3>
        {/* 患者詳細情報の表示 */}
      </div>
    </div>
  );
};
```

### 実装優先度
**高**: この機能は利用者のワークフロー改善に大きく貢献する

### 期待効果
- マッチング成立までの時間短縮（50%削減目標）
- 事前相談による適切な照会率向上（85%目標）
- 24時間対応可能な非同期コミュニケーション
- 医療資料の迅速な共有
- 施設間の信頼関係構築

### 実装ロードマップ
1. **フェーズ1**: 患者詳細画面の実装（2週間）
2. **フェーズ2**: 基本チャット機能（3週間）
3. **フェーズ3**: ファイル共有・通知（2週間）
4. **フェーズ4**: マッチング管理・外部連携（3週間）

---

**作成日**: 2025年6月27日  
**バージョン**: 1.0  
**関連文書**: PROJECT_PLAN.md, TECHNICAL_SPECS.md
