import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { usePatients } from '../hooks/usePatients';
import { useFacilities } from '../hooks/useFacilities';

const PatientMatching = ({ onBack }) => {
  const { patients } = usePatients();
  const { facilities, findMatchingFacilities, calculateMatchScore } = useFacilities();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [matchingResults, setMatchingResults] = useState([]);

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    
    // マッチング処理
    const matchingFacilities = findMatchingFacilities(patient);
    
    // マッチング度を計算してソート
    const resultsWithScore = matchingFacilities.map(facility => ({
      facility,
      score: calculateMatchScore(patient, facility),
      reasons: getMatchingReasons(patient, facility)
    })).sort((a, b) => b.score - a.score);
    
    setMatchingResults(resultsWithScore);
  };

  const getMatchingReasons = (patient, facility) => {
    const reasons = [];
    
    if (facility.area === patient.area) {
      reasons.push('エリアが一致');
    }
    
    if (facility.providedServices.includes(patient.desiredService)) {
      reasons.push('希望サービスを提供');
    }
    
    if (patient.preferredDays && patient.preferredDays.length > 0) {
      const commonDays = patient.preferredDays.filter(day => 
        facility.availableDays.includes(day)
      );
      if (commonDays.length > 0) {
        reasons.push(`対応可能曜日: ${commonDays.join(', ')}`);
      }
    }
    
    if (patient.preferredTimeSlots && patient.preferredTimeSlots.length > 0) {
      const commonTimeSlots = patient.preferredTimeSlots.filter(timeSlot => 
        facility.availableTimeSlots.includes(timeSlot)
      );
      if (commonTimeSlots.length > 0) {
        reasons.push(`対応可能時間: ${commonTimeSlots.join(', ')}`);
      }
    }
    
    if (facility.currentPatients < facility.maxPatients) {
      const availability = facility.maxPatients - facility.currentPatients;
      reasons.push(`受入可能: ${availability}名`);
    }
    
    return reasons;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return '高適合';
    if (score >= 60) return '中適合';
    return '低適合';
  };

  return (
    <div className="p-6">
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>ダッシュボードに戻る</span>
        </button>
        <h2 className="text-2xl font-bold text-gray-800">患者-医療機関マッチング</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 患者リスト */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">患者一覧</h3>
            <p className="text-sm text-gray-600">患者を選択してマッチング結果を表示</p>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {patients.filter(p => p.status === 'available').map(patient => (
              <div
                key={patient.id}
                onClick={() => handlePatientSelect(patient)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  selectedPatient?.id === patient.id ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-800">{patient.id}</h4>
                    <p className="text-sm text-gray-600">
                      {patient.ageGroup} {patient.gender} / {patient.diagnosis}
                    </p>
                    <p className="text-sm text-gray-600">
                      {patient.area} / {patient.desiredService}
                    </p>
                    {patient.preferredDays && patient.preferredDays.length > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        希望曜日: {patient.preferredDays.join(', ')}
                      </p>
                    )}
                    {patient.frequency && (
                      <p className="text-xs text-gray-500">
                        頻度: {patient.frequency}
                      </p>
                    )}
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    {patient.status === 'available' ? '受付中' : patient.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* マッチング結果 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">マッチング結果</h3>
            {selectedPatient && (
              <p className="text-sm text-gray-600">
                患者ID: {selectedPatient.id} のマッチング結果
              </p>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {!selectedPatient ? (
              <div className="p-8 text-center text-gray-500">
                患者を選択してください
              </div>
            ) : matchingResults.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                マッチする医療機関がありません
              </div>
            ) : (
              matchingResults.map((result, index) => (
                <div key={result.facility.id} className="p-4 border-b border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-gray-800">{result.facility.name}</h4>
                      <p className="text-sm text-gray-600">{result.facility.facilityType}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getScoreColor(result.score)}`}>
                        {result.score}点 ({getScoreLabel(result.score)})
                      </span>
                      <p className="text-xs text-gray-500 mt-1">#{index + 1}</p>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    <p>{result.facility.area}</p>
                    <p>{result.facility.address}</p>
                    <p>患者数: {result.facility.currentPatients}/{result.facility.maxPatients}名</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-700">マッチング理由:</p>
                    {result.reasons.map((reason, reasonIndex) => (
                      <p key={reasonIndex} className="text-xs text-gray-600">
                        • {reason}
                      </p>
                    ))}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {result.facility.providedServices.map(service => (
                      <span key={service} className={`text-xs px-2 py-1 rounded ${
                        service === selectedPatient.desiredService 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {service}
                      </span>
                    ))}
                  </div>

                  <div className="mt-2 flex justify-end">
                    <button 
                      className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      onClick={() => {
                        // ここで申請処理などを実装
                        alert(`${result.facility.name}への申請機能は今後実装予定です`);
                      }}
                    >
                      申請する
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 統計情報 */}
      {selectedPatient && matchingResults.length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">マッチング統計</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{matchingResults.length}</p>
              <p className="text-sm text-gray-600">マッチした施設数</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {matchingResults.filter(r => r.score >= 80).length}
              </p>
              <p className="text-sm text-gray-600">高適合施設</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {matchingResults.filter(r => r.score >= 60 && r.score < 80).length}
              </p>
              <p className="text-sm text-gray-600">中適合施設</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-600">
                {matchingResults.length > 0 ? Math.round(matchingResults.reduce((sum, r) => sum + r.score, 0) / matchingResults.length) : 0}
              </p>
              <p className="text-sm text-gray-600">平均適合度</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientMatching;
