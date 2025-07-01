/**
 * アプリケーション固有のビジネスロジック用カスタムフック
 */
export const useAppHandlers = ({
  facilityName,
  login,
  logout,
  registerPatient,
  submitApplication,
  setValidationErrors,
  resetForm,
  showRegistrationSuccess,
  sendMessage,
  markMessagesAsRead,
  handleSetCurrentView,
  setCurrentView,
  setIsStateRestored,
  resetSearchFilters
}) => {
  
  const handleLogin = () => {
    if (login(facilityName)) {
      // ログイン成功時は状態復元がuseEffectで行われるため、ここでは何もしない
    }
  };

  const handleLogout = () => {
    logout();
    setCurrentView('login');
    setIsStateRestored(false);
    // 検索フィルターもリセット
    resetSearchFilters();
  };

  const handlePatientRegistration = (patientData) => {
    const result = registerPatient(patientData, facilityName);

    if (!result.success) {
      setValidationErrors(result.errors);
      return;
    }

    resetForm();
    showRegistrationSuccess();
    setTimeout(() => {
      handleSetCurrentView('dashboard');
    }, 2000);
  };

  const handleSubmitApplication = (patientId, note) => {
    submitApplication(patientId, facilityName, note);
  };

  // メッセージ送信
  const handleSendMessage = (patientId, message) => {
    sendMessage(patientId, message, facilityName);
  };

  // チャット開始（既読処理付き）
  const handleStartChat = (patient, handleStartChatBase) => {
    handleStartChatBase(patient, markMessagesAsRead, facilityName);
  };

  // チャット選択（既読処理付き）
  const handleSelectChat = (patient, handleSelectChatBase) => {
    handleSelectChatBase(patient, markMessagesAsRead, facilityName);
  };

  return {
    handleLogin,
    handleLogout,
    handlePatientRegistration,
    handleSubmitApplication,
    handleSendMessage,
    handleStartChat,
    handleSelectChat
  };
};
