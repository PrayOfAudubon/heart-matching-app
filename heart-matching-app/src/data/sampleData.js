// サンプル患者データ
export const samplePatients = [
  {
    id: 'HF-ABC123',
    ageGroup: '70代',
    gender: '男性',
    diagnosis: '慢性心不全',
    nyhaClass: 'Ⅱ',
    medicalTreatment: '在宅酸素',
    careLevel: '要介護2',
    area: '墨田区押上エリア',
    desiredService: '訪問診療',
    preferredDays: ['月', '水', '金'],
    preferredTimeSlots: ['9:00-12:00'],
    frequency: '週3回',
    facility: '押上クリニック',
    contactPhone: '03-1234-5678',
    contactEmail: 'info@oshiage-clinic.jp',
    registrationDate: '2024-06-15',
    status: 'available', // available, pending, accepted, rejected
    applications: [], // 申請の配列
    coordinates: { lat: 35.6762, lng: 139.6503 }
  },
  {
    id: 'HF-DEF456',
    ageGroup: '80代以上',
    gender: '女性',
    diagnosis: '心不全',
    nyhaClass: 'Ⅲ',
    medicalTreatment: '点滴',
    careLevel: '要介護3',
    area: '江東区豊洲エリア',
    desiredService: '訪問看護',
    preferredDays: ['火', '木', '土'],
    preferredTimeSlots: ['13:00-17:00'],
    frequency: '週3回',
    facility: '豊洲総合病院',
    contactPhone: '03-9876-5432',
    contactEmail: 'contact@toyosu-hospital.jp',
    registrationDate: '2024-06-20',
    status: 'available',
    applications: [],
    coordinates: { lat: 35.6580, lng: 139.7946 }
  },
  {
    id: 'HF-GHI789',
    ageGroup: '60代',
    gender: '男性',
    diagnosis: '拡張型心筋症',
    nyhaClass: 'Ⅱ',
    medicalTreatment: 'ペースメーカー',
    careLevel: '要介護1',
    area: '江戸川区西葛西エリア',
    desiredService: '訪問リハビリ',
    preferredDays: ['月', '水', '金'],
    preferredTimeSlots: ['13:00-17:00'],
    frequency: '週3回',
    facility: '西葛西メディカルセンター',
    contactPhone: '03-5555-1234',
    contactEmail: 'info@nishikasai-mc.jp',
    registrationDate: '2024-06-22',
    status: 'available',
    applications: [],
    coordinates: { lat: 35.6648, lng: 139.8585 }
  }
];

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

// 医療機関サンプルデータ
export const sampleMedicalFacilities = [
  {
    id: 'FAC001',
    name: '押上クリニック',
    facilityType: 'クリニック',
    area: '墨田区押上エリア',
    address: '東京都墨田区押上1-1-1',
    phone: '03-1234-5678',
    email: 'info@oshiage-clinic.jp',
    availableDays: ['月', '火', '水', '木', '金'],
    availableTimeSlots: ['9:00-12:00', '13:00-17:00'],
    providedServices: ['訪問診療', '心臓リハビリ', '栄養指導'],
    specialties: ['循環器内科', '内科'],
    maxPatients: 30,
    currentPatients: 15,
    features: ['24時間対応', '往診車配備'],
    registrationDate: '2024-06-01',
    coordinates: { lat: 35.6762, lng: 139.6503 }
  },
  {
    id: 'FAC002',
    name: '豊洲総合病院',
    facilityType: '病院',
    area: '江東区豊洲エリア',
    address: '東京都江東区豊洲2-2-2',
    phone: '03-9876-5432',
    email: 'contact@toyosu-hospital.jp',
    availableDays: ['月', '火', '水', '木', '金', '土'],
    availableTimeSlots: ['9:00-12:00', '13:00-17:00', '18:00-21:00'],
    providedServices: ['訪問診療', '訪問看護', '心臓リハビリ', '緊急対応'],
    specialties: ['循環器内科', '心臓血管外科', '内科'],
    maxPatients: 50,
    currentPatients: 35,
    features: ['24時間緊急対応', 'ICU完備', '専門医常駐'],
    registrationDate: '2024-05-15',
    coordinates: { lat: 35.6580, lng: 139.7946 }
  },
  {
    id: 'FAC003',
    name: '西葛西メディカルセンター',
    facilityType: 'クリニック',
    area: '江戸川区西葛西エリア',
    address: '東京都江戸川区西葛西3-3-3',
    phone: '03-5555-1234',
    email: 'info@nishikasai-mc.jp',
    availableDays: ['月', '火', '水', '金', '土'],
    availableTimeSlots: ['9:00-12:00', '13:00-17:00'],
    providedServices: ['訪問リハビリ', '心臓リハビリ', '栄養指導'],
    specialties: ['リハビリテーション科', '循環器内科'],
    maxPatients: 25,
    currentPatients: 18,
    features: ['リハビリ専門', '理学療法士常駐'],
    registrationDate: '2024-06-10',
    coordinates: { lat: 35.6684, lng: 139.8578 }
  },
  {
    id: 'FAC004',
    name: 'ハートケア訪問看護ステーション',
    facilityType: '訪問看護ステーション',
    area: '墨田区錦糸町エリア',
    address: '東京都墨田区錦糸町4-4-4',
    phone: '03-7777-8888',
    email: 'contact@heartcare-vn.jp',
    availableDays: ['月', '火', '水', '木', '金', '土', '日'],
    availableTimeSlots: ['9:00-12:00', '13:00-17:00', '18:00-21:00'],
    providedServices: ['訪問看護', '薬剤指導', '緊急対応'],
    specialties: ['心不全ケア', '在宅医療'],
    maxPatients: 40,
    currentPatients: 28,
    features: ['24時間対応', '看護師24名体制', '薬剤師連携'],
    registrationDate: '2024-05-20',
    coordinates: { lat: 35.6969, lng: 139.8147 }
  }
];
