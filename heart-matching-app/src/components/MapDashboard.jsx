import React, { useState } from 'react';
import PatientMap from './PatientMap';
import PatientDetailView from './PatientDetailView';
import { usePatients } from '../hooks/usePatients';

const MapDashboard = ({ onBack }) => {
  const { patients } = usePatients();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showChat, setShowChat] = useState(false);

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
  };

  const handleBackToMap = () => {
    setSelectedPatient(null);
    setShowChat(false);
  };

  const handleStartChat = (patient) => {
    setShowChat(true);
    // ここでチャット機能を開始する処理を追加
    console.log('チャット開始:', patient.id);
  };

  const handleDirectContact = (patient) => {
    // 直接連絡の処理
    console.log('直接連絡:', patient.contactPhone);
  };

  // 患者詳細ビューを表示中の場合
  if (selectedPatient) {
    return (
      <PatientDetailView
        patient={selectedPatient}
        onBack={handleBackToMap}
        onStartChat={handleStartChat}
        onDirectContact={handleDirectContact}
      />
    );
  }

  // 地図ビューを表示
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <span className="mr-2">←</span>
                ダッシュボードに戻る
              </button>
              <div className="h-6 border-l border-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">患者マップ</h1>
            </div>
          </div>
          <p className="text-gray-600 mt-1">
            エリア別の患者分布と詳細情報を確認できます
          </p>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 地図エリア */}
          <div className="lg:col-span-3">
            <PatientMap onPatientSelect={handlePatientSelect} />
          </div>

          {/* サイドバー - 統計情報 */}
          <div className="space-y-6">
            {/* 全体統計 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">全体統計</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">総患者数</span>
                  <span className="font-semibold">{patients.length}名</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">募集中</span>
                  <span className="font-semibold text-green-600">
                    {patients.filter(p => p.status === 'available').length}名
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">審査中</span>
                  <span className="font-semibold text-yellow-600">
                    {patients.filter(p => p.status === 'pending').length}名
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">受入決定</span>
                  <span className="font-semibold text-blue-600">
                    {patients.filter(p => p.status === 'accepted').length}名
                  </span>
                </div>
              </div>
            </div>

            {/* エリア別統計 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">エリア別統計</h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-blue-900">墨田区</span>
                    <span className="text-blue-700">
                      {patients.filter(p => p.area.includes('墨田区')).length}名
                    </span>
                  </div>
                  <div className="text-sm text-blue-600 mt-1">
                    募集中: {patients.filter(p => p.area.includes('墨田区') && p.status === 'available').length}名
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-green-900">江東区</span>
                    <span className="text-green-700">
                      {patients.filter(p => p.area.includes('江東区')).length}名
                    </span>
                  </div>
                  <div className="text-sm text-green-600 mt-1">
                    募集中: {patients.filter(p => p.area.includes('江東区') && p.status === 'available').length}名
                  </div>
                </div>
                
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-yellow-900">江戸川区</span>
                    <span className="text-yellow-700">
                      {patients.filter(p => p.area.includes('江戸川区')).length}名
                    </span>
                  </div>
                  <div className="text-sm text-yellow-600 mt-1">
                    募集中: {patients.filter(p => p.area.includes('江戸川区') && p.status === 'available').length}名
                  </div>
                </div>
              </div>
            </div>

            {/* 最近の更新 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">最近の更新</h3>
              <div className="space-y-2">
                {patients
                  .sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate))
                  .slice(0, 3)
                  .map(patient => (
                    <div 
                      key={patient.id}
                      className="p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handlePatientSelect(patient)}
                    >
                      <div className="text-sm font-medium text-gray-900">
                        {patient.id}
                      </div>
                      <div className="text-xs text-gray-600">
                        {patient.area} • {patient.registrationDate}
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapDashboard;