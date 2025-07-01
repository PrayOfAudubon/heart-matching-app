import React, { useState, useEffect } from 'react';
import { ArrowLeft, Send, MessageCircle, Eye, Clock, CheckCircle, XCircle } from 'lucide-react';
import { usePatients } from '../hooks/usePatients';
import { useFacilities } from '../hooks/useFacilities';
import { useAuth } from '../hooks/useAuth';
import { canApplyForPatient, getPatientApplicationStatus, hasApprovedApplication } from '../utils/patientUtils';

const PatientMatching = ({ onBack, onApplyForPatient, onStartChat }) => {
  const { patients } = usePatients();
  const { facilities, findMatchingFacilities, calculateMatchScore, getFacilityByName } = useFacilities();
  const { facilityName } = useAuth();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [matchingResults, setMatchingResults] = useState([]);
  const [myFacilityMatches, setMyFacilityMatches] = useState([]);
  const [myPatientsMatches, setMyPatientsMatches] = useState([]);
  const [activeTab, setActiveTab] = useState('myFacilityMatches');

  // 自施設に適合する患者を計算
  useEffect(() => {
    if (facilityName) {
      const myFacility = getFacilityByName(facilityName);
      if (myFacility) {
        const availablePatients = patients.filter(p => p.status === 'available');
        const matches = availablePatients.map(patient => ({
          patient,
          score: calculateMatchScore(patient, myFacility),
          reasons: getMatchingReasons(patient, myFacility)
        })).filter(match => match.score > 0).sort((a, b) => b.score - a.score);
        
        setMyFacilityMatches(matches);
      }
    }
  }, [patients, facilities, facilityName]);

  // 自施設の患者にマッチする他の施設を計算
  useEffect(() => {
    if (facilityName) {
      const myPatients = patients.filter(p => p.facility === facilityName && p.status === 'available');
      const otherFacilities = facilities.filter(f => f.name !== facilityName);
      
      const patientMatches = myPatients.map(patient => {
        const matchingFacilities = otherFacilities.map(facility => ({
          facility,
          score: calculateMatchScore(patient, facility),
          reasons: getMatchingReasons(patient, facility)
        })).filter(match => match.score > 0).sort((a, b) => b.score - a.score);
        
        return {
          patient,
          matchingFacilities: matchingFacilities.slice(0, 5) // 上位5件のみ
        };
      }).filter(match => match.matchingFacilities.length > 0);
      
      setMyPatientsMatches(patientMatches);
    }
  }, [patients, facilities, facilityName]);

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

  // 申請ボタンの取得（PatientTableと同じロジック）
  const getApplicationButton = (patient) => {
    const status = getPatientApplicationStatus(patient, facilityName);
    const canApply = canApplyForPatient(patient, facilityName);
    const isApproved = hasApprovedApplication(patient);

    // 既に承認済みの申請がある場合（他の施設からの申請が承認済み）
    if (isApproved && patient.facility !== facilityName) {
      return (
        <div className="flex items-center space-x-1 text-green-600">
          <CheckCircle className="h-3 w-3" />
          <span className="text-xs">承認済み</span>
        </div>
      );
    }

    // 自分の施設が登録した患者の場合
    if (patient.facility === facilityName) {
      return null; // 自分の患者には申請ボタンを表示しない
    }

    // 申請ボタンの表示
    switch (status) {
      case 'none':
        if (canApply) {
          return (
            <button
              onClick={() => onApplyForPatient(patient)}
              className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 flex items-center space-x-1"
            >
              <Send className="h-3 w-3" />
              <span>申請</span>
            </button>
          );
        }
        break;
      case 'pending':
        return (
          <div className="flex items-center space-x-1 text-yellow-600">
            <Clock className="h-3 w-3" />
            <span className="text-xs">審査中</span>
          </div>
        );
      case 'approved':
        return (
          <div className="flex items-center space-x-1 text-green-600">
            <CheckCircle className="h-3 w-3" />
            <span className="text-xs">承認済み</span>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center space-x-1 text-red-600">
            <XCircle className="h-3 w-3" />
            <span className="text-xs">拒否済み</span>
          </div>
        );
      case 'others':
        return (
          <span className="text-xs text-gray-500">申請済み</span>
        );
      default:
        break;
    }

    // 申請不可の場合の表示
    return (
      <div className="flex items-center space-x-1 text-gray-500">
        <span className="text-xs">申請不可</span>
      </div>
    );
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

      {/* タブナビゲーション */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('myFacilityMatches')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'myFacilityMatches'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              自施設適合患者
            </button>
            <button
              onClick={() => setActiveTab('myPatientsMatches')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'myPatientsMatches'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              自施設患者適合先
            </button>
            <button
              onClick={() => setActiveTab('allMatching')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'allMatching'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              全患者・全施設マッチング
            </button>
          </nav>
        </div>
      </div>

      {/* タブコンテンツ */}
      {activeTab === 'myFacilityMatches' && renderMyFacilityMatches()}
      {activeTab === 'myPatientsMatches' && renderMyPatientsMatches()}
      {activeTab === 'allMatching' && renderAllMatching()}
    </div>
  );

  // 自施設適合患者の表示
  function renderMyFacilityMatches() {
    return (
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            {facilityName} に適合度の高い患者
          </h3>
          <p className="text-sm text-blue-600">
            あなたの施設で受け入れ可能性が高い患者を適合度順に表示しています
          </p>
        </div>
        
        {myFacilityMatches.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500">
            現在、適合する患者はありません
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {myFacilityMatches.map((match, index) => (
              <div key={match.patient.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-gray-800">{match.patient.id}</h4>
                    <p className="text-sm text-gray-600">
                      {match.patient.ageGroup} {match.patient.gender} / {match.patient.diagnosis}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getScoreColor(match.score)}`}>
                      {match.score}点 ({getScoreLabel(match.score)})
                    </span>
                    <p className="text-xs text-gray-500 mt-1">#{index + 1}</p>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 mb-3">
                  <p>{match.patient.area}</p>
                  <p>希望: {match.patient.desiredService}</p>
                  <p>登録施設: {match.patient.facility}</p>
                </div>

                <div className="space-y-1 mb-3">
                  <p className="text-xs font-medium text-gray-700">適合理由:</p>
                  {match.reasons.map((reason, reasonIndex) => (
                    <p key={reasonIndex} className="text-xs text-gray-600">
                      • {reason}
                    </p>
                  ))}
                </div>

                <div className="flex justify-between items-center space-x-2">
                  {getApplicationButton(match.patient)}
                  <button 
                    className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 flex items-center space-x-1"
                    onClick={() => onStartChat(match.patient)}
                  >
                    <MessageCircle className="h-3 w-3" />
                    <span>チャット</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // 自施設患者適合先の表示
  function renderMyPatientsMatches() {
    return (
      <div className="space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            {facilityName} の患者に適合する施設
          </h3>
          <p className="text-sm text-green-600">
            あなたの施設が登録した患者に適合度の高い他の医療機関を表示しています
          </p>
        </div>
        
        {myPatientsMatches.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500">
            現在、適合する施設がある患者はありません
          </div>
        ) : (
          <div className="space-y-6">
            {myPatientsMatches.map((patientMatch) => (
              <div key={patientMatch.patient.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* 患者情報ヘッダー */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <h4 className="font-medium text-gray-800 mb-1">
                    患者ID: {patientMatch.patient.id}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {patientMatch.patient.ageGroup} {patientMatch.patient.gender} / {patientMatch.patient.diagnosis} / {patientMatch.patient.desiredService}
                  </p>
                </div>
                
                {/* 適合施設リスト */}
                <div className="p-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">適合施設 (上位5件)</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {patientMatch.matchingFacilities.map((facilityMatch, index) => (
                      <div key={facilityMatch.facility.id} className="border border-gray-200 rounded p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h6 className="font-medium text-gray-800 text-sm">{facilityMatch.facility.name}</h6>
                            <p className="text-xs text-gray-600">{facilityMatch.facility.facilityType}</p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getScoreColor(facilityMatch.score)}`}>
                              {facilityMatch.score}点
                            </span>
                            <p className="text-xs text-gray-500 mt-1">#{index + 1}</p>
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-600 mb-2">
                          <p>{facilityMatch.facility.area}</p>
                        </div>

                        <div className="space-y-1 mb-2">
                          {facilityMatch.reasons.slice(0, 2).map((reason, reasonIndex) => (
                            <p key={reasonIndex} className="text-xs text-gray-600">
                              • {reason}
                            </p>
                          ))}
                        </div>

                        <div className="flex justify-end">
                          <button 
                            className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                            onClick={() => {
                              alert(`${facilityMatch.facility.name}への紹介機能は今後実装予定です`);
                            }}
                          >
                            紹介
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // 全マッチングの表示（既存の機能）
  function renderAllMatching() {
    return (
      <div className="space-y-6">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            全患者・全施設マッチング
          </h3>
          <p className="text-sm text-gray-600">
            システム内の全患者と全施設のマッチング結果を表示します
          </p>
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

                    <div className="mt-2 flex justify-between items-center space-x-2">
                      {selectedPatient && (
                        <div className="flex space-x-2">
                          {(() => {
                            const status = getPatientApplicationStatus(selectedPatient, facilityName);
                            const canApply = canApplyForPatient(selectedPatient, facilityName);
                            
                            // 自分の施設が登録した患者の場合は申請ボタンを表示しない
                            if (selectedPatient.facility === facilityName) {
                              return (
                                <button 
                                  className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 flex items-center space-x-1"
                                  onClick={() => onStartChat(selectedPatient)}
                                >
                                  <MessageCircle className="h-3 w-3" />
                                  <span>チャット</span>
                                </button>
                              );
                            }
                            
                            // 申請可能な場合のみ申請ボタンを表示
                            if (status === 'none' && canApply) {
                              return (
                                <>
                                  <button 
                                    className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 flex items-center space-x-1"
                                    onClick={() => onApplyForPatient(selectedPatient)}
                                  >
                                    <Send className="h-3 w-3" />
                                    <span>申請</span>
                                  </button>
                                  <button 
                                    className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 flex items-center space-x-1"
                                    onClick={() => onStartChat(selectedPatient)}
                                  >
                                    <MessageCircle className="h-3 w-3" />
                                    <span>チャット</span>
                                  </button>
                                </>
                              );
                            }
                            
                            // その他の状態（審査中、承認済み等）の場合はチャットのみ
                            return (
                              <button 
                                className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 flex items-center space-x-1"
                                onClick={() => onStartChat(selectedPatient)}
                              >
                                <MessageCircle className="h-3 w-3" />
                                <span>チャット</span>
                              </button>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* 統計情報 */}
        {selectedPatient && matchingResults.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
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
  }
};

export default PatientMatching;
