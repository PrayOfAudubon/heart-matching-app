import React, { useState, useRef, useEffect } from 'react';
import { templateMessages } from '../data/sampleData';

const ChatInterface = ({ patient, facilityName, onBack, messages, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const messagesEndRef = useRef(null);

  // メッセージが更新された時に最下部にスクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(patient.id, newMessage.trim());
      setNewMessage('');
    }
  };

  const handleTemplateMessage = (template) => {
    setNewMessage(template);
    setShowTemplates(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ja-JP', { 
      hour: '2-digit', 
      minute: '2-digit',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* メインチャットエリア */}
      <div className="flex-1 flex flex-col">
        {/* ヘッダー */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <span className="mr-2">←</span>
              戻る
            </button>
            <div className="flex-1 text-center">
              <h1 className="text-lg font-bold text-gray-900">
                患者: {patient.id}
              </h1>
              <p className="text-sm text-gray-500">
                {patient.ageGroup}・{patient.gender}・{patient.diagnosis}
              </p>
            </div>
            <button
              onClick={() => setShowPatientDetails(!showPatientDetails)}
              className="text-blue-600 hover:text-blue-800 px-3 py-1 border border-blue-300 rounded"
            >
              詳細 {showPatientDetails ? '▲' : '▼'}
            </button>
          </div>
        </div>

        {/* 患者詳細情報（折りたたみ可能） */}
        {showPatientDetails && (
          <div className="bg-blue-50 border-b border-blue-200 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-blue-800">NYHA分類:</span>
                <span className="ml-2 text-blue-700">Class {patient.nyhaClass}</span>
              </div>
              <div>
                <span className="font-medium text-blue-800">医療処置:</span>
                <span className="ml-2 text-blue-700">{patient.medicalTreatment}</span>
              </div>
              <div>
                <span className="font-medium text-blue-800">希望サービス:</span>
                <span className="ml-2 text-blue-700">{patient.desiredService}</span>
              </div>
            </div>
          </div>
        )}

        {/* メッセージエリア */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages && messages.length > 0 ? (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.senderName === facilityName ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.senderName === facilityName
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-900'
                  }`}
                >
                  <div className="text-xs opacity-75 mb-1">
                    {message.senderName} {formatTimestamp(message.timestamp)}
                  </div>
                  <div className="text-sm">{message.message}</div>
                  {message.messageType === 'file' && (
                    <div className="mt-2 text-xs underline cursor-pointer">
                      📎 添付ファイル
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 mt-8">
              <p>まだメッセージがありません</p>
              <p className="text-sm mt-2">最初のメッセージを送信してチャットを開始しましょう</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 定型メッセージ */}
        {showTemplates && (
          <div className="bg-gray-100 border-t border-gray-200 p-4">
            <div className="flex flex-wrap gap-2">
              {templateMessages.map((template, index) => (
                <button
                  key={index}
                  onClick={() => handleTemplateMessage(template)}
                  className="bg-white hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg border border-gray-300 text-sm"
                >
                  {template}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* メッセージ入力エリア */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-end space-x-2">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="text-gray-500 hover:text-gray-700 p-2"
              title="定型メッセージ"
            >
              💬
            </button>
            <button
              className="text-gray-500 hover:text-gray-700 p-2"
              title="ファイル添付"
            >
              📎
            </button>
            <div className="flex-1">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="メッセージを入力..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="2"
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              送信
            </button>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            ※個人情報の詳細な共有は避け、必要に応じて電話・FAXを利用してください
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
