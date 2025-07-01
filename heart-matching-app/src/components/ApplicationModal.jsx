import React, { useState } from 'react';
import { X, Send } from 'lucide-react';

const ApplicationModal = ({ patient, onClose, onSubmit, facilityName }) => {
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit(patient.id, note);
      onClose();
    } catch (error) {
      console.error('申請の送信に失敗しました:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">患者受け取り申請</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {/* 患者情報 */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">患者情報</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">患者ID:</span>
                <span className="ml-2 text-gray-800">{patient.id}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">年齢・性別:</span>
                <span className="ml-2 text-gray-800">{patient.ageGroup}・{patient.gender}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">診断:</span>
                <span className="ml-2 text-gray-800">{patient.diagnosis}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">NYHA分類:</span>
                <span className="ml-2 text-gray-800">{patient.nyhaClass}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">処置:</span>
                <span className="ml-2 text-gray-800">{patient.medicalTreatment}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">介護度:</span>
                <span className="ml-2 text-gray-800">{patient.careLevel}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">地域:</span>
                <span className="ml-2 text-gray-800">{patient.area}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">希望サービス:</span>
                <span className="ml-2 text-gray-800">{patient.desiredService}</span>
              </div>
              <div className="col-span-2">
                <span className="font-medium text-gray-600">登録施設:</span>
                <span className="ml-2 text-gray-800">{patient.facility}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                申請理由・備考
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="患者受け取りの理由や、提供可能なサービス内容をご記入ください..."
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-blue-800 mb-2">申請について</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 申請後、登録施設（{patient.facility}）による承認が必要です</li>
                <li>• 承認されるまで患者情報の詳細は閲覧できません</li>
                <li>• 申請状況は申請管理画面で確認できます</li>
              </ul>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                <span>{isSubmitting ? '送信中...' : '申請を送信'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplicationModal;
