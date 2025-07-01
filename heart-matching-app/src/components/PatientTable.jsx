import React from 'react';
import { Download, Send, Eye, Clock, CheckCircle, XCircle } from 'lucide-react';
import { canApplyForPatient, getPatientApplicationStatus, hasApprovedApplication } from '../utils/patientUtils';

const PatientTable = ({ 
  filteredPatients, 
  setSelectedPatient, 
  facilityName, 
  onApplyForPatient,
  onViewPatientDetail
}) => {
  const getApplicationButton = (patient) => {
    const status = getPatientApplicationStatus(patient, facilityName);
    const canApply = canApplyForPatient(patient, facilityName);
    const isApproved = hasApprovedApplication(patient);

    // 既に承認済みの申請がある場合（他の施設からの申請が承認済み）
    if (isApproved && patient.facility !== facilityName) {
      return (
        <div className="flex items-center space-x-1 text-green-600">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm">承認済み</span>
        </div>
      );
    }

    // 自分の施設が登録した患者の場合
    if (patient.facility === facilityName) {
      return (
        <button
          onClick={() => setSelectedPatient(patient)}
          className="bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-700 flex items-center space-x-1"
        >
          <Eye className="h-4 w-4" />
          <span>詳細</span>
        </button>
      );
    }

    // 申請ボタンの表示
    switch (status) {
      case 'none':
        if (canApply) {
          return (
            <button
              onClick={() => onApplyForPatient(patient)}
              className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 flex items-center space-x-1"
            >
              <Send className="h-4 w-4" />
              <span>申請</span>
            </button>
          );
        }
        break;
      case 'pending':
        return (
          <div className="flex items-center space-x-1 text-yellow-600">
            <Clock className="h-4 w-4" />
            <span className="text-sm">審査中</span>
          </div>
        );
      case 'approved':
        return (
          <div className="flex items-center space-x-1 text-green-600">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">承認済み</span>
          </div>
        );
      case 'rejected':
        return (
          <div className="flex items-center space-x-1 text-red-600">
            <XCircle className="h-4 w-4" />
            <span className="text-sm">拒否済み</span>
          </div>
        );
      case 'others':
        return (
          <span className="text-sm text-gray-500">申請済み</span>
        );
      default:
        break;
    }

    // 申請不可の場合の表示
    return (
      <div className="flex items-center space-x-1 text-gray-500">
        <span className="text-sm">申請不可</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-800">
            検索結果: {filteredPatients.length}件
          </h3>
          <button className="text-blue-600 hover:text-blue-800 flex items-center space-x-1">
            <Download className="h-4 w-4" />
            <span>CSVダウンロード</span>
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">年齢・性別</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">診断・NYHA</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">処置・介護度</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">地域</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">希望サービス</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">登録施設</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">アクション</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPatients.map((patient) => (
              <tr key={patient.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <button
                    onClick={() => onViewPatientDetail(patient)}
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {patient.id}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {patient.ageGroup}・{patient.gender}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {patient.diagnosis}・{patient.nyhaClass}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {patient.medicalTreatment}・{patient.careLevel}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {patient.area}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {patient.desiredService}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {patient.facility}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex space-x-2">
                    {getApplicationButton(patient)}
                    <button
                      onClick={() => onViewPatientDetail(patient)}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-200 flex items-center space-x-1"
                    >
                      <Eye className="h-4 w-4" />
                      <span>詳細</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientTable;
