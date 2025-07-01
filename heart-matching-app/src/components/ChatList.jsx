import React from 'react';

const ChatList = ({ chats, patients, facilityName, onSelectChat }) => {
  const getPatientInfo = (patientId) => {
    return patients.find(p => p.id === patientId);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('ja-JP', { 
        hour: '2-digit', 
        minute: '2-digit'
      });
    } else {
      return date.toLocaleDateString('ja-JP', { 
        month: 'short', 
        day: 'numeric'
      });
    }
  };

  const getStatusDisplay = (status) => {
    const statusMap = {
      requesting: { text: '相談申請中', color: 'bg-blue-100 text-blue-800' },
      consulting: { text: '相談中', color: 'bg-yellow-100 text-yellow-800' },
      matched: { text: 'マッチング成立', color: 'bg-green-100 text-green-800' },
      completed: { text: '連携完了', color: 'bg-gray-100 text-gray-800' },
      declined: { text: 'お断り', color: 'bg-red-100 text-red-800' }
    };
    return statusMap[status] || statusMap.requesting;
  };

  if (chats.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>チャットがありません</p>
        <p className="text-sm mt-2">患者一覧から「相談する」を選択してチャットを開始しましょう</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {chats.map((chat) => {
        const patient = getPatientInfo(chat.patientId);
        const statusDisplay = getStatusDisplay(chat.status);

        if (!patient) return null;

        return (
          <div
            key={chat.patientId}
            onClick={() => onSelectChat(patient)}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-medium text-gray-900">
                    患者ID: {chat.patientId}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusDisplay.color}`}>
                    {statusDisplay.text}
                  </span>
                  {chat.unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>
                
                <div className="text-sm text-gray-600 mb-2">
                  {patient.ageGroup}・{patient.gender}・{patient.diagnosis}・{patient.desiredService}
                </div>

                {chat.lastMessage && (
                  <div className="text-sm text-gray-500 truncate">
                    <span className="font-medium">{chat.lastMessage.senderName}:</span>
                    <span className="ml-1">{chat.lastMessage.message}</span>
                  </div>
                )}
              </div>
              
              <div className="text-xs text-gray-400 ml-4">
                {chat.lastMessage && formatTimestamp(chat.lastMessage.timestamp)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatList;
