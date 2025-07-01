import React from 'react';

const PatientDetailView = ({ patient, onBack, onStartChat, onDirectContact }) => {
  if (!patient) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <span className="mr-2">←</span>
            戻る
          </button>
          <h1 className="text-lg font-bold text-gray-900">
            患者ID: {patient.id}
          </h1>
          <div className="w-16"></div> {/* スペーサー */}
        </div>
      </div>

      {/* コンテンツ */}
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* 基本情報セクション */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
            基本情報
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-500">年齢・性別</span>
              <p className="text-lg text-gray-900">{patient.ageGroup}・{patient.gender}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">診断名</span>
              <p className="text-lg text-gray-900">{patient.diagnosis}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">NYHA分類</span>
              <p className="text-lg text-gray-900">Class {patient.nyhaClass}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">介護度</span>
              <p className="text-lg text-gray-900">{patient.careLevel}</p>
            </div>
          </div>
        </div>

        {/* 医療情報セクション */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
            医療情報
          </h2>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-500">現在の医療処置</span>
              <p className="text-lg text-gray-900">{patient.medicalTreatment}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">必要な医療機器</span>
              <p className="text-lg text-gray-900">在宅酸素濃縮器、パルスオキシメーター</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">服薬情報</span>
              <p className="text-lg text-gray-900">フロセミド、カルベジロール、エナラプリル</p>
            </div>
          </div>
        </div>

        {/* 希望サービスセクション */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
            希望サービス
          </h2>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-500">希望するサービス種別</span>
              <p className="text-lg text-gray-900">{patient.desiredService}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">介入希望頻度</span>
              <p className="text-lg text-gray-900">週1-2回</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">介入可能日時</span>
              <p className="text-lg text-gray-900">平日午前中優先、土曜日も対応可</p>
            </div>
          </div>
        </div>

        {/* 地域・アクセス情報セクション */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
            地域・アクセス情報
          </h2>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-500">対応エリア</span>
              <p className="text-lg text-gray-900">{patient.area}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">交通アクセス</span>
              <p className="text-lg text-gray-900">押上駅から徒歩10分、バス停「押上三丁目」から徒歩3分</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">駐車場情報</span>
              <p className="text-lg text-gray-900">近隣コインパーキング利用可（2台分確保済み）</p>
            </div>
          </div>
        </div>

        {/* 登録施設情報セクション */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">
            登録施設情報
          </h2>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-500">登録施設名</span>
              <p className="text-lg text-gray-900">{patient.facility}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">登録日</span>
              <p className="text-lg text-gray-900">{patient.registrationDate}</p>
            </div>
          </div>
        </div>

        {/* アクションボタン */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex space-x-4">
            <button
              onClick={() => onStartChat(patient)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              💬 相談する
            </button>
            <button
              onClick={() => onDirectContact(patient)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              📞 直接連絡
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2 text-center">
            ※個人情報の詳細な共有は電話・FAXまたは専用システムで行ってください
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatientDetailView;
