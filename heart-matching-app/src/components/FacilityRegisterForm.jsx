import React, { useState } from 'react';
import { 
  AREA_OPTIONS, 
  FACILITY_TYPE_OPTIONS, 
  PROVIDER_SERVICE_OPTIONS,
  DAY_OPTIONS,
  TIME_SLOT_OPTIONS
} from '../data/constants';

const FacilityRegisterForm = ({ onRegister, onCancel, initialData = null, isEdit = false, facilityName = null }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || facilityName || '',
    facilityType: initialData?.facilityType || '',
    area: initialData?.area || '',
    address: initialData?.address || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    availableDays: initialData?.availableDays || [],
    availableTimeSlots: initialData?.availableTimeSlots || [],
    providedServices: initialData?.providedServices || [],
    specialties: initialData?.specialties ? initialData.specialties.join(', ') : '',
    maxPatients: initialData?.maxPatients || '',
    features: initialData?.features ? initialData.features.join(', ') : ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // エラーをクリア
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleCheckboxChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = '施設名は必須です';
    if (!formData.facilityType) newErrors.facilityType = '施設タイプは必須です';
    if (!formData.area) newErrors.area = 'エリアは必須です';
    if (!formData.address.trim()) newErrors.address = '住所は必須です';
    if (!formData.phone.trim()) newErrors.phone = '電話番号は必須です';
    if (!formData.email.trim()) newErrors.email = 'メールアドレスは必須です';
    if (formData.availableDays.length === 0) newErrors.availableDays = '対応可能曜日を選択してください';
    if (formData.availableTimeSlots.length === 0) newErrors.availableTimeSlots = '対応可能時間帯を選択してください';
    if (formData.providedServices.length === 0) newErrors.providedServices = '提供サービスを選択してください';
    if (!formData.maxPatients || formData.maxPatients <= 0) newErrors.maxPatients = '受入可能患者数は1以上で入力してください';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const facilityData = {
        ...formData,
        maxPatients: parseInt(formData.maxPatients),
        specialties: formData.specialties.split(',').map(s => s.trim()).filter(s => s),
        features: formData.features.split(',').map(f => f.trim()).filter(f => f)
      };
      onRegister(facilityData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {isEdit ? '自施設情報編集' : '自施設情報登録'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 基本情報 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  施設名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full border rounded-md px-3 py-2 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="例：ハートケアクリニック"
                  disabled={facilityName} // facilityNameが設定されている場合は編集不可
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  施設タイプ <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.facilityType}
                  onChange={(e) => handleInputChange('facilityType', e.target.value)}
                  className={`w-full border rounded-md px-3 py-2 ${errors.facilityType ? 'border-red-500' : 'border-gray-300'}`}
                >
                  {FACILITY_TYPE_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                {errors.facilityType && <p className="text-red-500 text-xs mt-1">{errors.facilityType}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  エリア <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                  className={`w-full border rounded-md px-3 py-2 ${errors.area ? 'border-red-500' : 'border-gray-300'}`}
                >
                  {AREA_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                {errors.area && <p className="text-red-500 text-xs mt-1">{errors.area}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  受入可能患者数 <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.maxPatients}
                  onChange={(e) => handleInputChange('maxPatients', e.target.value)}
                  className={`w-full border rounded-md px-3 py-2 ${errors.maxPatients ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="例：30"
                />
                {errors.maxPatients && <p className="text-red-500 text-xs mt-1">{errors.maxPatients}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  住所 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className={`w-full border rounded-md px-3 py-2 ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="例：東京都墨田区押上1-1-1"
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  電話番号 <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full border rounded-md px-3 py-2 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="例：03-1234-5678"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                メールアドレス <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full border rounded-md px-3 py-2 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="例：info@example.jp"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* 対応可能曜日 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                対応可能曜日 <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-7 gap-2">
                {DAY_OPTIONS.map(day => (
                  <label key={day.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.availableDays.includes(day.value)}
                      onChange={() => handleCheckboxChange('availableDays', day.value)}
                      className="mr-1"
                    />
                    <span className="text-sm">{day.label}</span>
                  </label>
                ))}
              </div>
              {errors.availableDays && <p className="text-red-500 text-xs mt-1">{errors.availableDays}</p>}
            </div>

            {/* 対応可能時間帯 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                対応可能時間帯 <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {TIME_SLOT_OPTIONS.map(timeSlot => (
                  <label key={timeSlot.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.availableTimeSlots.includes(timeSlot.value)}
                      onChange={() => handleCheckboxChange('availableTimeSlots', timeSlot.value)}
                      className="mr-2"
                    />
                    <span className="text-sm">{timeSlot.label}</span>
                  </label>
                ))}
              </div>
              {errors.availableTimeSlots && <p className="text-red-500 text-xs mt-1">{errors.availableTimeSlots}</p>}
            </div>

            {/* 提供可能サービス */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                提供可能サービス <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {PROVIDER_SERVICE_OPTIONS.map(service => (
                  <label key={service.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.providedServices.includes(service.value)}
                      onChange={() => handleCheckboxChange('providedServices', service.value)}
                      className="mr-2"
                    />
                    <span className="text-sm">{service.label}</span>
                  </label>
                ))}
              </div>
              {errors.providedServices && <p className="text-red-500 text-xs mt-1">{errors.providedServices}</p>}
            </div>

            {/* 専門分野 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                専門分野（カンマ区切り）
              </label>
              <input
                type="text"
                value={formData.specialties}
                onChange={(e) => handleInputChange('specialties', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="例：循環器内科, 内科, 心臓血管外科"
              />
            </div>

            {/* 特徴・設備 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                特徴・設備（カンマ区切り）
              </label>
              <input
                type="text"
                value={formData.features}
                onChange={(e) => handleInputChange('features', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="例：24時間対応, 往診車配備, ICU完備"
              />
            </div>

            {/* ボタン */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-200"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
              >
                {isEdit ? '更新する' : '登録する'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FacilityRegisterForm;
