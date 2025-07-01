import React from 'react';
import LoginView from '../components/LoginView';
import RegisterView from '../components/RegisterView';
import Dashboard from '../components/Dashboard';
import PatientDetailView from '../components/PatientDetailView';
import ChatInterface from '../components/ChatInterface';
import ContactModal from '../components/ContactModal';
import ApplicationModal from '../components/ApplicationModal';
import RegistrationSuccessModal from '../components/RegistrationSuccessModal';
import FacilityManagement from '../components/FacilityManagement';
import PatientMatching from '../components/PatientMatching';
import MapDashboard from '../components/MapDashboard';

/**
 * アプリケーションのルーティングとレンダリングロジックを管理するコンポーネント
 */
const AppRouter = ({
  // Navigation state
  currentView,
  selectedPatientForDetail,
  currentChatPatient,
  
  // Auth state
  isLoggedIn,
  facilityName,
  setFacilityName,
  
  // Modal state
  selectedPatient,
  showQR,
  setShowQR,
  registrationSuccess,
  showApplicationModal,
  applicationPatient,
  
  // Form state
  formData,
  setFormData,
  validationErrors,
  
  // Data
  filteredPatients,
  searchFilters,
  receivedApplications,
  sentApplications,
  chats,
  patients,
  totalUnreadCount,
  messages,
  
  // Handlers
  handleLogin,
  handleLogout,
  handleSetCurrentView,
  handleSetSearchFilters,
  handlePatientRegistration,
  handleViewPatientDetail,
  handleBackFromPatientDetail,
  handleStartChat,
  handleSelectChat,
  handleBackFromChat,
  handleSendMessage,
  handleSubmitApplication,
  
  // Modal handlers
  openContactModal,
  closeContactModal,
  openApplicationModal,
  closeApplicationModal,
  
  // Application handlers
  approveApplication,
  rejectApplication
}) => {
  // 登録成功モーダル
  if (registrationSuccess) {
    return <RegistrationSuccessModal />;
  }

  if (!isLoggedIn) {
    return (
      <LoginView 
        facilityName={facilityName} 
        setFacilityName={setFacilityName} 
        handleLogin={handleLogin} 
      />
    );
  }

  // 医療機関管理画面の表示
  if (currentView === 'facilities') {
    return (
      <>
        <FacilityManagement
          facilityName={facilityName}
          onBack={() => handleSetCurrentView('dashboard')}
        />
        
        {/* モーダル群 */}
        {selectedPatient && (
          <ContactModal 
            patient={selectedPatient} 
            onClose={closeContactModal}
            showQR={showQR}
            setShowQR={setShowQR}
          />
        )}
        {showApplicationModal && applicationPatient && (
          <ApplicationModal
            patient={applicationPatient}
            onClose={closeApplicationModal}
            onSubmit={handleSubmitApplication}
            facilityName={facilityName}
          />
        )}
      </>
    );
  }

  // マッチング画面の表示
  if (currentView === 'matching') {
    return (
      <>
        <PatientMatching
          onBack={() => handleSetCurrentView('dashboard')}
          onApplyForPatient={openApplicationModal}
          onStartChat={handleStartChat}
        />
        
        {/* モーダル群 */}
        {selectedPatient && (
          <ContactModal 
            patient={selectedPatient} 
            onClose={closeContactModal}
            showQR={showQR}
            setShowQR={setShowQR}
          />
        )}
        {showApplicationModal && applicationPatient && (
          <ApplicationModal
            patient={applicationPatient}
            onClose={closeApplicationModal}
            onSubmit={handleSubmitApplication}
            facilityName={facilityName}
          />
        )}
      </>
    );
  }

  // 地図画面の表示
  if (currentView === 'map') {
    return (
      <>
        <MapDashboard onBack={() => handleSetCurrentView('dashboard')} />
        
        {/* モーダル群 */}
        {selectedPatient && (
          <ContactModal 
            patient={selectedPatient} 
            onClose={closeContactModal}
            showQR={showQR}
            setShowQR={setShowQR}
          />
        )}
        {showApplicationModal && applicationPatient && (
          <ApplicationModal
            patient={applicationPatient}
            onClose={closeApplicationModal}
            onSubmit={handleSubmitApplication}
            facilityName={facilityName}
          />
        )}
      </>
    );
  }

  // 患者詳細画面の表示
  if (currentView === 'patientDetail' && selectedPatientForDetail) {
    return (
      <>
        <PatientDetailView
          patient={selectedPatientForDetail}
          onBack={handleBackFromPatientDetail}
          onStartChat={handleStartChat}
          onDirectContact={openContactModal}
        />
        
        {/* モーダル群 */}
        {selectedPatient && (
          <ContactModal 
            patient={selectedPatient} 
            onClose={closeContactModal}
            showQR={showQR}
            setShowQR={setShowQR}
          />
        )}
        {showApplicationModal && applicationPatient && (
          <ApplicationModal
            patient={applicationPatient}
            onClose={closeApplicationModal}
            onSubmit={handleSubmitApplication}
            facilityName={facilityName}
          />
        )}
      </>
    );
  }

  // チャット画面の表示
  if (currentView === 'chat' && currentChatPatient) {
    return (
      <>
        <ChatInterface
          patient={currentChatPatient}
          facilityName={facilityName}
          onBack={handleBackFromChat}
          messages={messages}
          onSendMessage={handleSendMessage}
        />
        
        {/* モーダル群 */}
        {selectedPatient && (
          <ContactModal 
            patient={selectedPatient} 
            onClose={closeContactModal}
            showQR={showQR}
            setShowQR={setShowQR}
          />
        )}
        {showApplicationModal && applicationPatient && (
          <ApplicationModal
            patient={applicationPatient}
            onClose={closeApplicationModal}
            onSubmit={handleSubmitApplication}
            facilityName={facilityName}
          />
        )}
      </>
    );
  }

  return (
    <>
      {currentView === 'register' ? (
        <>
          <RegisterView 
            formData={formData} 
            setFormData={setFormData} 
            validationErrors={validationErrors}
            setCurrentView={handleSetCurrentView}
            handlePatientRegistration={handlePatientRegistration}
          />
          
          {/* モーダル群 */}
          {selectedPatient && (
            <ContactModal 
              patient={selectedPatient} 
              onClose={closeContactModal}
              showQR={showQR}
              setShowQR={setShowQR}
            />
          )}
          {showApplicationModal && applicationPatient && (
            <ApplicationModal
              patient={applicationPatient}
              onClose={closeApplicationModal}
              onSubmit={handleSubmitApplication}
              facilityName={facilityName}
            />
          )}
        </>
      ) : (
        <>
          <Dashboard 
            currentView={currentView}
            setCurrentView={handleSetCurrentView}
            facilityName={facilityName}
            handleLogout={handleLogout}
            filteredPatients={filteredPatients}
            searchFilters={searchFilters}
            setSearchFilters={handleSetSearchFilters}
            setSelectedPatient={openContactModal}
            onApplyForPatient={openApplicationModal}
            onViewPatientDetail={handleViewPatientDetail}
            receivedApplications={receivedApplications}
            sentApplications={sentApplications}
            onApproveApplication={approveApplication}
            onRejectApplication={rejectApplication}
            chats={chats}
            patients={patients}
            totalUnreadCount={totalUnreadCount}
            onSelectChat={handleSelectChat}
          />
          
          {/* モーダル群 */}
          {selectedPatient && (
            <ContactModal 
              patient={selectedPatient} 
              onClose={closeContactModal}
              showQR={showQR}
              setShowQR={setShowQR}
            />
          )}
          {showApplicationModal && applicationPatient && (
            <ApplicationModal
              patient={applicationPatient}
              onClose={closeApplicationModal}
              onSubmit={handleSubmitApplication}
              facilityName={facilityName}
            />
          )}
        </>
      )}
    </>
  );
};

export default AppRouter;
