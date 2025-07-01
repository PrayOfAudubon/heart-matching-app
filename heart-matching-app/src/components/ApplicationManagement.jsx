import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, Eye, MessageSquare } from 'lucide-react';

const ApplicationManagement = ({ 
  receivedApplications, 
  sentApplications, 
  onApproveApplication, 
  onRejectApplication,
  facilityName 
}) => {
  const [activeTab, setActiveTab] = useState('received');
  const [responseNote, setResponseNote] = useState('');
  const [respondingApplication, setRespondingApplication] = useState(null);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return '審査中';
      case 'approved':
        return '承認済み';
      case 'rejected':
        return '拒否済み';
      default:
        return status;
    }
  };

  const handleApprove = (applicationId) => {
    onApproveApplication(applicationId, responseNote);
    setRespondingApplication(null);
    setResponseNote('');
  };

  const handleReject = (applicationId) => {
    onRejectApplication(applicationId, responseNote);
    setRespondingApplication(null);
    setResponseNote('');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* タブ */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex">
          <button
            onClick={() => setActiveTab('received')}
            className={`py-2 px-4 border-b-2 font-medium text-sm ${
              activeTab === 'received'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            受信した申請 ({receivedApplications.length})
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`py-2 px-4 border-b-2 font-medium text-sm ${
              activeTab === 'sent'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            送信した申請 ({sentApplications.length})
          </button>
        </nav>
      </div>

      {/* 受信した申請 */}
      {activeTab === 'received' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">
            受信した申請 - {facilityName}に登録された患者への申請
          </h3>
          {receivedApplications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              受信した申請はありません
            </div>
          ) : (
            receivedApplications.map((application) => (
              <div key={application.id} className="bg-white border rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(application.status)}
                    <span className="font-medium text-gray-800">
                      {getStatusText(application.status)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    申請日: {formatDate(application.applicationDate)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="font-medium text-gray-600">患者ID:</span>
                    <span className="ml-2">{application.patient.id}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">申請施設:</span>
                    <span className="ml-2">{application.applicantFacility}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">患者情報:</span>
                    <span className="ml-2">
                      {application.patient.ageGroup}・{application.patient.gender}・
                      {application.patient.diagnosis}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">希望サービス:</span>
                    <span className="ml-2">{application.patient.desiredService}</span>
                  </div>
                </div>

                {application.note && (
                  <div className="mb-4">
                    <span className="font-medium text-gray-600">申請理由:</span>
                    <p className="mt-1 text-gray-800 bg-gray-50 p-3 rounded">
                      {application.note}
                    </p>
                  </div>
                )}

                {application.status === 'pending' && (
                  <div className="border-t pt-4">
                    {respondingApplication === application.id ? (
                      <div className="space-y-3">
                        <textarea
                          value={responseNote}
                          onChange={(e) => setResponseNote(e.target.value)}
                          placeholder="回答メッセージ（任意）"
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleApprove(application.id)}
                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center space-x-2"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>承認</span>
                          </button>
                          <button
                            onClick={() => handleReject(application.id)}
                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center space-x-2"
                          >
                            <XCircle className="h-4 w-4" />
                            <span>拒否</span>
                          </button>
                          <button
                            onClick={() => {
                              setRespondingApplication(null);
                              setResponseNote('');
                            }}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                          >
                            キャンセル
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setRespondingApplication(application.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>回答する</span>
                      </button>
                    )}
                  </div>
                )}

                {application.responseNote && (
                  <div className="border-t pt-4 mt-4">
                    <span className="font-medium text-gray-600">回答:</span>
                    <p className="mt-1 text-gray-800 bg-blue-50 p-3 rounded">
                      {application.responseNote}
                    </p>
                    {application.responseDate && (
                      <span className="text-sm text-gray-500">
                        回答日: {formatDate(application.responseDate)}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* 送信した申請 */}
      {activeTab === 'sent' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">
            送信した申請 - {facilityName}からの申請
          </h3>
          {sentApplications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              送信した申請はありません
            </div>
          ) : (
            sentApplications.map((application) => (
              <div key={application.id} className="bg-white border rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(application.status)}
                    <span className="font-medium text-gray-800">
                      {getStatusText(application.status)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    申請日: {formatDate(application.applicationDate)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <span className="font-medium text-gray-600">患者ID:</span>
                    <span className="ml-2">{application.patient.id}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">登録施設:</span>
                    <span className="ml-2">{application.patient.facility}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">患者情報:</span>
                    <span className="ml-2">
                      {application.patient.ageGroup}・{application.patient.gender}・
                      {application.patient.diagnosis}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">希望サービス:</span>
                    <span className="ml-2">{application.patient.desiredService}</span>
                  </div>
                </div>

                {application.note && (
                  <div className="mb-4">
                    <span className="font-medium text-gray-600">申請理由:</span>
                    <p className="mt-1 text-gray-800 bg-gray-50 p-3 rounded">
                      {application.note}
                    </p>
                  </div>
                )}

                {application.responseNote && (
                  <div className="border-t pt-4">
                    <span className="font-medium text-gray-600">回答:</span>
                    <p className="mt-1 text-gray-800 bg-blue-50 p-3 rounded">
                      {application.responseNote}
                    </p>
                    {application.responseDate && (
                      <span className="text-sm text-gray-500">
                        回答日: {formatDate(application.responseDate)}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ApplicationManagement;
