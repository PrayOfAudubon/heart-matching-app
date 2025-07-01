// 地域選択肢
export const AREA_OPTIONS = [
  { value: '', label: '選択してください' },
  { value: '墨田区押上エリア', label: '墨田区押上エリア' },
  { value: '墨田区錦糸町エリア', label: '墨田区錦糸町エリア' },
  { value: '墨田区両国エリア', label: '墨田区両国エリア' },
  { value: '墨田区向島エリア', label: '墨田区向島エリア' },
  { value: '江東区豊洲エリア', label: '江東区豊洲エリア' },
  { value: '江東区有明エリア', label: '江東区有明エリア' },
  { value: '江東区門前仲町エリア', label: '江東区門前仲町エリア' },
  { value: '江東区亀戸エリア', label: '江東区亀戸エリア' },
  { value: '江東区大島エリア', label: '江東区大島エリア' },
  { value: '江戸川区西葛西エリア', label: '江戸川区西葛西エリア' },
  { value: '江戸川区葛西エリア', label: '江戸川区葛西エリア' },
  { value: '江戸川区船堀エリア', label: '江戸川区船堀エリア' },
  { value: '江戸川区小岩エリア', label: '江戸川区小岩エリア' },
  { value: '江戸川区平井エリア', label: '江戸川区平井エリア' },
];

// 年齢層選択肢
export const AGE_GROUP_OPTIONS = [
  { value: '', label: '選択してください' },
  { value: '〜50代', label: '〜50代' },
  { value: '60代', label: '60代' },
  { value: '70代', label: '70代' },
  { value: '80代以上', label: '80代以上' },
];

// 性別選択肢
export const GENDER_OPTIONS = [
  { value: '', label: '選択してください' },
  { value: '男性', label: '男性' },
  { value: '女性', label: '女性' },
];

// NYHA分類選択肢
export const NYHA_CLASS_OPTIONS = [
  { value: '', label: '選択してください' },
  { value: 'Ⅰ', label: 'Ⅰ' },
  { value: 'Ⅱ', label: 'Ⅱ' },
  { value: 'Ⅲ', label: 'Ⅲ' },
  { value: 'Ⅳ', label: 'Ⅳ' },
];

// 介護度選択肢
export const CARE_LEVEL_OPTIONS = [
  { value: '', label: '選択してください' },
  { value: 'なし', label: 'なし' },
  { value: '要支援1', label: '要支援1' },
  { value: '要支援2', label: '要支援2' },
  { value: '要介護1', label: '要介護1' },
  { value: '要介護2', label: '要介護2' },
  { value: '要介護3', label: '要介護3' },
  { value: '要介護4', label: '要介護4' },
  { value: '要介護5', label: '要介護5' },
];

// サービス選択肢
export const SERVICE_OPTIONS = [
  { value: '', label: '選択してください' },
  { value: '訪問診療', label: '訪問診療' },
  { value: '訪問看護', label: '訪問看護' },
  { value: '訪問リハビリ', label: '訪問リハビリ' },
  { value: '居宅介護支援', label: '居宅介護支援' },
];

// 曜日選択肢
export const DAY_OPTIONS = [
  { value: '月', label: '月曜日' },
  { value: '火', label: '火曜日' },
  { value: '水', label: '水曜日' },
  { value: '木', label: '木曜日' },
  { value: '金', label: '金曜日' },
  { value: '土', label: '土曜日' },
  { value: '日', label: '日曜日' },
];

// 時間帯選択肢
export const TIME_SLOT_OPTIONS = [
  { value: '9:00-12:00', label: '午前（9:00-12:00）' },
  { value: '13:00-17:00', label: '午後（13:00-17:00）' },
  { value: '18:00-21:00', label: '夜間（18:00-21:00）' },
];

// 頻度選択肢
export const FREQUENCY_OPTIONS = [
  { value: '', label: '選択してください' },
  { value: '週1回', label: '週1回' },
  { value: '週2回', label: '週2回' },
  { value: '週3回', label: '週3回' },
  { value: '週4回以上', label: '週4回以上' },
  { value: '月1-2回', label: '月1-2回' },
  { value: '月3-4回', label: '月3-4回' },
];

// 医療機関タイプ選択肢
export const FACILITY_TYPE_OPTIONS = [
  { value: '', label: '選択してください' },
  { value: 'クリニック', label: 'クリニック' },
  { value: '病院', label: '病院' },
  { value: '訪問看護ステーション', label: '訪問看護ステーション' },
  { value: 'リハビリセンター', label: 'リハビリセンター' },
  { value: '居宅介護支援事業所', label: '居宅介護支援事業所' },
];

// 医療機関の提供可能サービス選択肢
export const PROVIDER_SERVICE_OPTIONS = [
  { value: '訪問診療', label: '訪問診療' },
  { value: '訪問看護', label: '訪問看護' },
  { value: '訪問リハビリ', label: '訪問リハビリ' },
  { value: '居宅介護支援', label: '居宅介護支援' },
  { value: '心臓リハビリ', label: '心臓リハビリ' },
  { value: '栄養指導', label: '栄養指導' },
  { value: '薬剤指導', label: '薬剤指導' },
  { value: '緊急対応', label: '緊急対応' },
];
