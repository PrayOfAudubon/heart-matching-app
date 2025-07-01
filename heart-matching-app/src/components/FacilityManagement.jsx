import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useFacilities } from '../hooks/useFacilities';
import FacilityRegisterForm from './FacilityRegisterForm';

const FacilityManagement = ({ facilityName, onBack }) => {
  const { facilities, registerFacility, updateFacility, deleteFacility, getFacilityByName } = useFacilities();
  const [showMyFacilityForm, setShowMyFacilityForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterArea, setFilterArea] = useState('');

  // 自施設情報を取得
  const myFacility = getFacilityByName(facilityName);

  const handleMyFacilityUpdate = (facilityData) => {
    if (myFacility) {
      // 既存の自施設情報を更新
      updateFacility(myFacility.id, facilityData);
      alert('自施設情報を更新しました');
    } else {
      // 新規登録（施設名を設定）
      const newFacilityData = { ...facilityData, name: facilityName };
      registerFacility(newFacilityData);
      alert('自施設情報を登録しました');
    }
    setShowMyFacilityForm(false);
  };

  const handleDelete = (facilityId, facilityNameToDelete) => {
    // 自施設のみ削除可能
    if (facilityNameToDelete !== facilityName) {
      alert('他施設の情報は削除できません');
      return;
    }
    
    if (window.confirm('この医療機関を削除しますか？')) {
      deleteFacility(facilityId);
      alert('医療機関を削除しました');
    }
  };

  // フィルタリング
  const filteredFacilities = facilities.filter(facility => {
    const matchesSearch = facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         facility.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filterType || facility.facilityType === filterType;
    const matchesArea = !filterArea || facility.area === filterArea;
    
    return matchesSearch && matchesType && matchesArea;
  });

  const uniqueTypes = [...new Set(facilities.map(f => f.facilityType))];
  const uniqueAreas = [...new Set(facilities.map(f => f.area))];

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>ダッシュボードに戻る</span>
            </button>
            <h2 className="text-2xl font-bold text-gray-800">医療機関管理</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowMyFacilityForm(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200"
            >
              自施設情報{myFacility ? '編集' : '登録'}
            </button>
          </div>
        </div>

        {/* 自施設情報セクション */}
        <h3 className="text-xl font-semibold text-gray-800 mb-4">自施設情報</h3>
        <div className="mb-8">
          {myFacility ? (
            <div className="bg-white border-2 border-green-200 rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{myFacility.name}</h3>
                  <p className="text-sm text-gray-600">{myFacility.facilityType}</p>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    自施設
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <span className="font-medium w-16">エリア:</span>
                  <span>{myFacility.area}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium w-16">住所:</span>
                  <span>{myFacility.address}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium w-16">電話:</span>
                  <span>{myFacility.phone}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium w-16">患者数:</span>
                  <span>{myFacility.currentPatients}/{myFacility.maxPatients}名</span>
                  <div className="ml-2 bg-gray-200 rounded-full h-2 flex-1 max-w-20">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(myFacility.currentPatients / myFacility.maxPatients) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="text-sm">
                  <span className="font-medium">対応曜日:</span>
                  <div className="flex gap-1 mt-1">
                    {myFacility.availableDays.map(day => (
                      <span key={day} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <div className="text-sm">
                  <span className="font-medium">対応時間:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {myFacility.availableTimeSlots.map(timeSlot => (
                      <span key={timeSlot} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                        {timeSlot}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <div className="text-sm">
                  <span className="font-medium">提供サービス:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {myFacility.providedServices.map(service => (
                      <span key={service} className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {myFacility.specialties && myFacility.specialties.length > 0 && (
                <div className="mt-3">
                  <div className="text-sm">
                    <span className="font-medium">専門分野:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {myFacility.specialties.map((specialty, index) => (
                        <span key={index} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {myFacility.features && myFacility.features.length > 0 && (
                <div className="mt-3">
                  <div className="text-sm">
                    <span className="font-medium">特徴・設備:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {myFacility.features.map((feature, index) => (
                        <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-500">
                登録日: {myFacility.registrationDate}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <p className="text-gray-600 mb-4">自施設情報が登録されていません</p>
              <button
                onClick={() => setShowMyFacilityForm(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200"
              >
                自施設情報を登録する
              </button>
            </div>
          )}
        </div>

        {/* 他施設情報セクション */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">他施設情報（閲覧のみ）</h3>
          
          {/* 検索・フィルター */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <input
              type="text"
              placeholder="施設名・住所で検索"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            />
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">すべての施設タイプ</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <select
              value={filterArea}
              onChange={(e) => setFilterArea(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">すべてのエリア</option>
              {uniqueAreas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>

            <div className="text-sm text-gray-600 flex items-center">
              他施設数: {filteredFacilities.filter(f => f.name !== facilityName).length}件
            </div>
          </div>

          {/* 他施設情報一覧 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredFacilities.filter(f => f.name !== facilityName).map(facility => (
              <div key={facility.id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800">{facility.name}</h4>
                    <p className="text-sm text-gray-600">{facility.facilityType}</p>
                  </div>
                  <span className="text-gray-400 text-sm">閲覧のみ</span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <span className="font-medium w-16">エリア:</span>
                    <span>{facility.area}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium w-16">住所:</span>
                    <span>{facility.address}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium w-16">電話:</span>
                    <span>{facility.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium w-16">患者数:</span>
                    <span>{facility.currentPatients}/{facility.maxPatients}名</span>
                    <div className="ml-2 bg-gray-200 rounded-full h-2 flex-1 max-w-20">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(facility.currentPatients / facility.maxPatients) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-sm">
                    <span className="font-medium">対応曜日:</span>
                    <div className="flex gap-1 mt-1">
                      {facility.availableDays.map(day => (
                        <span key={day} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="text-sm">
                    <span className="font-medium">対応時間:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {facility.availableTimeSlots.map(timeSlot => (
                        <span key={timeSlot} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                          {timeSlot}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <div className="text-sm">
                    <span className="font-medium">提供サービス:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {facility.providedServices.map(service => (
                        <span key={service} className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {facility.specialties && facility.specialties.length > 0 && (
                  <div className="mt-3">
                    <div className="text-sm">
                      <span className="font-medium">専門分野:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {facility.specialties.map((specialty, index) => (
                          <span key={index} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {facility.features && facility.features.length > 0 && (
                  <div className="mt-3">
                    <div className="text-sm">
                      <span className="font-medium">特徴・設備:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {facility.features.map((feature, index) => (
                          <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-gray-200 text-xs text-gray-500">
                  登録日: {facility.registrationDate}
                </div>
              </div>
            ))}
          </div>

          {filteredFacilities.filter(f => f.name !== facilityName).length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">該当する他施設がありません</p>
            </div>
          )}
        </div>
      </div>

      {/* 自施設情報フォーム */}
      {showMyFacilityForm && (
        <FacilityRegisterForm
          initialData={myFacility}
          onRegister={handleMyFacilityUpdate}
          onCancel={() => setShowMyFacilityForm(false)}
          isEdit={!!myFacility}
          facilityName={facilityName}
        />
      )}
    </div>
  );
};

export default FacilityManagement;
