import React from 'react';
import { Heart } from 'lucide-react';
import { 
  AREA_OPTIONS, 
  AGE_GROUP_OPTIONS, 
  GENDER_OPTIONS, 
  NYHA_CLASS_OPTIONS, 
  CARE_LEVEL_OPTIONS,
  SERVICE_OPTIONS,
  DAY_OPTIONS,
  TIME_SLOT_OPTIONS,
  FREQUENCY_OPTIONS
} from '../data/constants';

const RegisterView = ({ formData, setFormData, validationErrors, setCurrentView, handlePatientRegistration }) => {
  const handleSubmit = () => {
    handlePatientRegistration(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-red-500" />
              <h1 className="text-xl font-bold text-gray-800">患者登録</h1>
            </div>
            <button
              onClick={() => setCurrentView('dashboard')}
              className="text-gray-600 hover:text-gray-800"
            >
              ダッシュボードに戻る
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  年齢層 *
                </label>
                <select
                  value={formData.ageGroup}
                  onChange={(e) => setFormData({...formData, ageGroup: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {AGE_GROUP_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {validationErrors.ageGroup && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.ageGroup}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  性別 *
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {GENDER_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {validationErrors.gender && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.gender}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  診断名 *
                </label>
                <input
                  type="text"
                  value={formData.diagnosis}
                  onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例：慢性心不全"
                  required
                />
                {validationErrors.diagnosis && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.diagnosis}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NYHA分類 *
                </label>
                <select
                  value={formData.nyhaClass}
                  onChange={(e) => setFormData({...formData, nyhaClass: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {NYHA_CLASS_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {validationErrors.nyhaClass && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.nyhaClass}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  医療処置
                </label>
                <input
                  type="text"
                  value={formData.medicalTreatment}
                  onChange={(e) => setFormData({...formData, medicalTreatment: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例：在宅酸素、点滴、バルーン"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  介護度
                </label>
                <select
                  value={formData.careLevel}
                  onChange={(e) => setFormData({...formData, careLevel: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {CARE_LEVEL_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  地域 *
                </label>
                <select
                  value={formData.area}
                  onChange={(e) => setFormData({...formData, area: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {AREA_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {validationErrors.area && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.area}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  希望サービス *
                </label>
                <select
                  value={formData.desiredService}
                  onChange={(e) => setFormData({...formData, desiredService: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {SERVICE_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {validationErrors.desiredService && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.desiredService}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  希望頻度 *
                </label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {FREQUENCY_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {validationErrors.frequency && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.frequency}</p>
                )}
              </div>
            </div>

            {/* 希望曜日 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                希望曜日（複数選択可）
              </label>
              <div className="grid grid-cols-7 gap-2">
                {DAY_OPTIONS.map(day => (
                  <label key={day.value} className="flex items-center justify-center p-2 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.preferredDays?.includes(day.value) || false}
                      onChange={(e) => {
                        const currentDays = formData.preferredDays || [];
                        if (e.target.checked) {
                          setFormData({...formData, preferredDays: [...currentDays, day.value]});
                        } else {
                          setFormData({...formData, preferredDays: currentDays.filter(d => d !== day.value)});
                        }
                      }}
                      className="sr-only"
                    />
                    <span className={`text-sm font-medium ${formData.preferredDays?.includes(day.value) ? 'text-blue-600' : 'text-gray-700'}`}>
                      {day.value}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* 希望時間帯 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                希望時間帯（複数選択可）
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {TIME_SLOT_OPTIONS.map(timeSlot => (
                  <label key={timeSlot.value} className="flex items-center p-3 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.preferredTimeSlots?.includes(timeSlot.value) || false}
                      onChange={(e) => {
                        const currentTimeSlots = formData.preferredTimeSlots || [];
                        if (e.target.checked) {
                          setFormData({...formData, preferredTimeSlots: [...currentTimeSlots, timeSlot.value]});
                        } else {
                          setFormData({...formData, preferredTimeSlots: currentTimeSlots.filter(t => t !== timeSlot.value)});
                        }
                      }}
                      className="mr-3"
                    />
                    <span className="text-sm">{timeSlot.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  連絡先電話番号
                </label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例：03-1234-5678"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  連絡先メール
                </label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="例：info@clinic.jp"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setCurrentView('dashboard')}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                登録する
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegisterView;
