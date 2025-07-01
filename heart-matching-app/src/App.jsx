import React from 'react';
import AppRouter from './components/AppRouter';
import { filterPatients } from './utils/patientUtils';
import { useAuth } from './hooks/useAuth';
import { usePatients } from './hooks/usePatients';
import { usePatientForm } from './hooks/usePatientForm';
import { useModals } from './hooks/useModals';
import { useChat } from './hooks/useChat';
import { useNavigation } from './hooks/useNavigation';
import { useAppHandlers } from './hooks/useAppHandlers';
import { useFacilities } from './hooks/useFacilities';

const HeartFailureMatchingApp = () => {

  // カスタムフックを使用
  const { isLoggedIn, facilityName, setFacilityName, login, logout, saveAppState, getAppState } = useAuth();
  const { 
    patients, 
    registerPatient, 
    submitApplication, 
    approveApplication, 
    rejectApplication, 
    getApplications 
  } = usePatients();
  const { 
    formData, 
    setFormData, 
    validationErrors, 
    setValidationErrors, 
    resetForm 
  } = usePatientForm();
  const { facilities } = useFacilities();
  const {
    selectedPatient,
    showQR,
    setShowQR,
    registrationSuccess,
    showApplicationModal,
    applicationPatient,
    openContactModal,
    closeContactModal,
    openApplicationModal,
    closeApplicationModal,
    showRegistrationSuccess
  } = useModals();

  // チャットフック
  const {
    getMessagesForPatient,
    sendMessage,
    markMessagesAsRead,
    getTotalUnreadCount,
    getChatsForFacility
  } = useChat();

  // ナビゲーションフック
  const {
    currentView,
    selectedPatientForDetail,
    currentChatPatient,
    searchFilters,
    isStateRestored,
    handleSetCurrentView,
    handleSetSearchFilters,
    handleViewPatientDetail,
    handleBackFromPatientDetail,
    handleStartChat: handleStartChatBase,
    handleSelectChat: handleSelectChatBase,
    handleBackFromChat,
    resetSearchFilters,
    setCurrentView,
    setIsStateRestored
  } = useNavigation(isLoggedIn, saveAppState, getAppState);

  // アプリケーションハンドラーフック
  const {
    handleLogin,
    handleLogout,
    handlePatientRegistration,
    handleSubmitApplication,
    handleSendMessage,
    handleStartChat,
    handleSelectChat
  } = useAppHandlers({
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
  });

  // データの計算
  const filteredPatients = filterPatients(patients, searchFilters);
  const { received: receivedApplications, sent: sentApplications } = getApplications(facilityName);
  const chats = getChatsForFacility(facilityName);
  const totalUnreadCount = getTotalUnreadCount(facilityName);
  const messages = currentChatPatient ? getMessagesForPatient(currentChatPatient.id) : [];

  return (
    <AppRouter
      // Navigation state
      currentView={currentView}
      selectedPatientForDetail={selectedPatientForDetail}
      currentChatPatient={currentChatPatient}
      
      // Auth state
      isLoggedIn={isLoggedIn}
      facilityName={facilityName}
      setFacilityName={setFacilityName}
      
      // Modal state
      selectedPatient={selectedPatient}
      showQR={showQR}
      setShowQR={setShowQR}
      registrationSuccess={registrationSuccess}
      showApplicationModal={showApplicationModal}
      applicationPatient={applicationPatient}
      
      // Form state
      formData={formData}
      setFormData={setFormData}
      validationErrors={validationErrors}
      
      // Data
      filteredPatients={filteredPatients}
      searchFilters={searchFilters}
      receivedApplications={receivedApplications}
      sentApplications={sentApplications}
      chats={chats}
      patients={patients}
      totalUnreadCount={totalUnreadCount}
      messages={messages}
      
      // Handlers
      handleLogin={handleLogin}
      handleLogout={handleLogout}
      handleSetCurrentView={handleSetCurrentView}
      handleSetSearchFilters={handleSetSearchFilters}
      handlePatientRegistration={handlePatientRegistration}
      handleViewPatientDetail={handleViewPatientDetail}
      handleBackFromPatientDetail={handleBackFromPatientDetail}
      handleStartChat={(patient) => handleStartChat(patient, handleStartChatBase)}
      handleSelectChat={(patient) => handleSelectChat(patient, handleSelectChatBase)}
      handleBackFromChat={handleBackFromChat}
      handleSendMessage={handleSendMessage}
      handleSubmitApplication={handleSubmitApplication}
      
      // Modal handlers
      openContactModal={openContactModal}
      closeContactModal={closeContactModal}
      openApplicationModal={openApplicationModal}
      closeApplicationModal={closeApplicationModal}
      
      // Application handlers
      approveApplication={approveApplication}
      rejectApplication={rejectApplication}
    />
  );
};

export default HeartFailureMatchingApp;
