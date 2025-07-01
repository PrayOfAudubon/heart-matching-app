import { useState, useEffect } from 'react';

/**
 * ナビゲーション関連の状態とロジックを管理するカスタムフック
 */
export const useNavigation = (isLoggedIn, saveAppState, getAppState) => {
  const [currentView, setCurrentView] = useState('login');
  const [selectedPatientForDetail, setSelectedPatientForDetail] = useState(null);
  const [currentChatPatient, setCurrentChatPatient] = useState(null);
  const [searchFilters, setSearchFilters] = useState({
    ageGroup: '',
    gender: '',
    nyhaClass: '',
    careLevel: '',
    area: '',
    service: ''
  });
  const [isStateRestored, setIsStateRestored] = useState(false);

  // 認証状態とアプリケーション状態の復元（一度だけ実行）
  useEffect(() => {
    if (isLoggedIn && !isStateRestored) {
      // ログイン済みの場合、保存されたアプリケーション状態を復元
      const savedAppState = getAppState();
      if (savedAppState) {
        if (savedAppState.currentView) {
          setCurrentView(savedAppState.currentView);
        } else {
          setCurrentView('dashboard');
        }
        if (savedAppState.searchFilters) {
          setSearchFilters(savedAppState.searchFilters);
        }
      } else {
        setCurrentView('dashboard');
      }
      setIsStateRestored(true);
    } else if (!isLoggedIn) {
      setIsStateRestored(false);
      setCurrentView('login');
    }
  }, [isLoggedIn, isStateRestored, getAppState]);

  // currentViewまたはsearchFiltersが変更された時に状態を保存（状態復元完了後のみ）
  useEffect(() => {
    if (isLoggedIn && isStateRestored && currentView !== 'login') {
      saveAppState(currentView, searchFilters);
    }
  }, [currentView, searchFilters, isLoggedIn, isStateRestored, saveAppState]);

  // カスタム setCurrentView 関数（状態保存付き）
  const handleSetCurrentView = (view) => {
    setCurrentView(view);
  };

  // カスタム setSearchFilters 関数（状態保存付き）
  const handleSetSearchFilters = (filters) => {
    setSearchFilters(filters);
  };

  // 患者詳細画面の表示
  const handleViewPatientDetail = (patient) => {
    setSelectedPatientForDetail(patient);
    setCurrentView('patientDetail');
  };

  // 患者詳細画面から戻る
  const handleBackFromPatientDetail = () => {
    setSelectedPatientForDetail(null);
    setCurrentView('dashboard');
  };

  // チャット開始
  const handleStartChat = (patient, markMessagesAsRead, facilityName) => {
    setCurrentChatPatient(patient);
    setCurrentView('chat');
    // 既読にする
    markMessagesAsRead(patient.id, facilityName);
  };

  // チャット一覧からチャット選択
  const handleSelectChat = (patient, markMessagesAsRead, facilityName) => {
    setCurrentChatPatient(patient);
    setCurrentView('chat');
    // 既読にする
    markMessagesAsRead(patient.id, facilityName);
  };

  // チャットから戻る
  const handleBackFromChat = () => {
    setCurrentChatPatient(null);
    setCurrentView('dashboard');
  };

  // 検索フィルターをリセット
  const resetSearchFilters = () => {
    setSearchFilters({
      ageGroup: '',
      gender: '',
      nyhaClass: '',
      careLevel: '',
      area: '',
      service: ''
    });
  };

  return {
    // State
    currentView,
    selectedPatientForDetail,
    currentChatPatient,
    searchFilters,
    isStateRestored,
    
    // Handlers
    handleSetCurrentView,
    handleSetSearchFilters,
    handleViewPatientDetail,
    handleBackFromPatientDetail,
    handleStartChat,
    handleSelectChat,
    handleBackFromChat,
    resetSearchFilters,
    
    // Internal state setters (for specific use cases)
    setCurrentView,
    setIsStateRestored
  };
};
