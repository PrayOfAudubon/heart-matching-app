import { useState, useEffect } from 'react';
import { sampleChatMessages, sampleMatchingStatus } from '../data/sampleData';

export const useChat = () => {
  const [chatMessages, setChatMessages] = useState({});
  const [matchingStatuses, setMatchingStatuses] = useState({});

  // 初期データの読み込み
  useEffect(() => {
    // ローカルストレージからチャットデータを読み込み、なければサンプルデータを使用
    const savedMessages = localStorage.getItem('chatMessages');
    const savedStatuses = localStorage.getItem('matchingStatuses');

    if (savedMessages) {
      setChatMessages(JSON.parse(savedMessages));
    } else {
      setChatMessages(sampleChatMessages);
    }

    if (savedStatuses) {
      setMatchingStatuses(JSON.parse(savedStatuses));
    } else {
      setMatchingStatuses(sampleMatchingStatus);
    }
  }, []);

  // データの保存
  const saveData = (messages, statuses) => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    localStorage.setItem('matchingStatuses', JSON.stringify(statuses));
  };

  // 特定の患者のチャットメッセージを取得
  const getMessagesForPatient = (patientId) => {
    return chatMessages[patientId] || [];
  };

  // メッセージ送信
  const sendMessage = (patientId, message, senderName) => {
    const newMessage = {
      id: `msg_${Date.now()}`,
      chatId: `chat_${patientId}`,
      senderId: senderName,
      senderName: senderName,
      message: message,
      messageType: 'text',
      timestamp: new Date().toISOString(),
      isRead: false
    };

    const updatedMessages = {
      ...chatMessages,
      [patientId]: [...(chatMessages[patientId] || []), newMessage]
    };

    setChatMessages(updatedMessages);

    // マッチングステータスも更新（初回メッセージの場合）
    let updatedStatuses = { ...matchingStatuses };
    if (!matchingStatuses[patientId]) {
      updatedStatuses[patientId] = {
        id: `matching_${Date.now()}`,
        patientId: patientId,
        requestingFacility: senderName,
        respondingFacility: null,
        status: 'requesting',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    } else {
      updatedStatuses[patientId] = {
        ...matchingStatuses[patientId],
        status: 'consulting',
        updatedAt: new Date().toISOString()
      };
    }

    setMatchingStatuses(updatedStatuses);
    saveData(updatedMessages, updatedStatuses);

    return newMessage;
  };

  // メッセージの既読状態を更新
  const markMessagesAsRead = (patientId, facilityName) => {
    const messages = chatMessages[patientId];
    if (!messages) return;

    const updatedMessages = messages.map(message => 
      message.senderName !== facilityName ? { ...message, isRead: true } : message
    );

    const updatedChatMessages = {
      ...chatMessages,
      [patientId]: updatedMessages
    };

    setChatMessages(updatedChatMessages);
    saveData(updatedChatMessages, matchingStatuses);
  };

  // 未読メッセージ数を取得
  const getUnreadCount = (patientId, facilityName) => {
    const messages = chatMessages[patientId];
    if (!messages) return 0;

    return messages.filter(message => 
      message.senderName !== facilityName && !message.isRead
    ).length;
  };

  // 全ての未読メッセージ数を取得
  const getTotalUnreadCount = (facilityName) => {
    let total = 0;
    Object.keys(chatMessages).forEach(patientId => {
      total += getUnreadCount(patientId, facilityName);
    });
    return total;
  };

  // 特定施設のチャット一覧を取得
  const getChatsForFacility = (facilityName) => {
    const chats = [];
    
    Object.keys(chatMessages).forEach(patientId => {
      const messages = chatMessages[patientId];
      const facilityMessages = messages.filter(msg => 
        msg.senderName === facilityName || 
        (matchingStatuses[patientId] && 
         (matchingStatuses[patientId].requestingFacility === facilityName ||
          matchingStatuses[patientId].respondingFacility === facilityName))
      );

      if (facilityMessages.length > 0 || matchingStatuses[patientId]) {
        const lastMessage = messages[messages.length - 1];
        const unreadCount = getUnreadCount(patientId, facilityName);
        
        chats.push({
          patientId,
          lastMessage,
          unreadCount,
          status: matchingStatuses[patientId]?.status || 'requesting',
          updatedAt: matchingStatuses[patientId]?.updatedAt || new Date().toISOString()
        });
      }
    });

    // 最新の更新日時順にソート
    return chats.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  };

  // マッチングステータスの更新
  const updateMatchingStatus = (patientId, status) => {
    const updatedStatuses = {
      ...matchingStatuses,
      [patientId]: {
        ...matchingStatuses[patientId],
        status,
        updatedAt: new Date().toISOString()
      }
    };

    setMatchingStatuses(updatedStatuses);
    saveData(chatMessages, updatedStatuses);
  };

  return {
    chatMessages,
    matchingStatuses,
    getMessagesForPatient,
    sendMessage,
    markMessagesAsRead,
    getUnreadCount,
    getTotalUnreadCount,
    getChatsForFacility,
    updateMatchingStatus
  };
};
