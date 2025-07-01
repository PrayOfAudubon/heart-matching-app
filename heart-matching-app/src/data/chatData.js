// チャットメッセージのサンプルデータ
export const sampleChatMessages = {
  'HF-ABC123': [
    {
      id: 'msg_001',
      chatId: 'chat_HF-ABC123',
      senderId: '押上クリニック',
      senderName: '押上クリニック',
      message: 'こちらの患者様について、受け入れ可能でしょうか？',
      messageType: 'text',
      timestamp: '2024-07-01T09:30:00Z',
      isRead: true
    },
    {
      id: 'msg_002', 
      chatId: 'chat_HF-ABC123',
      senderId: '墨田区訪問診療センター',
      senderName: '墨田区訪問診療センター',
      message: '詳細を確認させていただきます。現在の服薬状況を教えていただけますか？',
      messageType: 'text',
      timestamp: '2024-07-01T10:15:00Z',
      isRead: true
    },
    {
      id: 'msg_003',
      chatId: 'chat_HF-ABC123', 
      senderId: '押上クリニック',
      senderName: '押上クリニック',
      message: 'フロセミド40mg、カルベジロール2.5mgを服用中です。ADL状況のレポートを添付いたします。',
      messageType: 'text',
      timestamp: '2024-07-01T10:45:00Z',
      isRead: false
    }
  ],
  'HF-DEF456': [
    {
      id: 'msg_004',
      chatId: 'chat_HF-DEF456',
      senderId: '豊洲総合病院',
      senderName: '豊洲総合病院',
      message: '80代女性、NYHA class Ⅲの患者様です。訪問看護での対応は可能でしょうか？',
      messageType: 'text',
      timestamp: '2024-07-01T11:00:00Z',
      isRead: true
    }
  ]
};

// マッチングステータスのサンプルデータ
export const sampleMatchingStatus = {
  'HF-ABC123': {
    id: 'matching_001',
    patientId: 'HF-ABC123',
    requestingFacility: '押上クリニック',
    respondingFacility: '墨田区訪問診療センター',
    status: 'consulting', // requesting, consulting, matched, completed, declined
    createdAt: '2024-07-01T09:30:00Z',
    updatedAt: '2024-07-01T10:45:00Z'
  },
  'HF-DEF456': {
    id: 'matching_002',
    patientId: 'HF-DEF456',
    requestingFacility: '豊洲総合病院',
    respondingFacility: null,
    status: 'requesting',
    createdAt: '2024-07-01T11:00:00Z',
    updatedAt: '2024-07-01T11:00:00Z'
  }
};

// 定型メッセージのサンプルデータ
export const templateMessages = [
  '詳細を確認いたします',
  '受け入れ可能です',
  '検討中です', 
  '追加情報をお教えください',
  '受け入れが困難です',
  'ありがとうございました'
];
