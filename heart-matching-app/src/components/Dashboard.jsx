import React from 'react';
import { Heart, Plus, List, Map, FileText, MessageCircle, Building, Users } from 'lucide-react';
import SearchFilters from './SearchFilters';
import PatientTable from './PatientTable';
import MapPlaceholder from './MapPlaceholder';
import ApplicationManagement from './ApplicationManagement';
import ChatList from './ChatList';

const Dashboard = ({ 
  currentView, 
  setCurrentView, 
  facilityName, 
  handleLogout, 
  filteredPatients, 
  searchFilters, 
  setSearchFilters, 
  setSelectedPatient,
  onApplyForPatient,
  onViewPatientDetail,
  receivedApplications,
  sentApplications,
  onApproveApplication,
  onRejectApplication,
  // チャット関連のprops
  chats,
  patients,
  totalUnreadCount,
  onSelectChat
}) => (
  <div className="min-h-screen bg-gray-50">
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <Heart className="h-8 w-8 text-red-500" />
            <h1 className="text-xl font-bold text-gray-800">
              心不全患者マッチング
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{facilityName}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              ログアウト
            </button>
          </div>
        </div>
      </div>
    </header>

    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {currentView === 'applications' ? '申請管理' : 
             currentView === 'chats' ? 'チャット一覧' : 
             currentView === 'facilities' ? '医療機関管理' :
             currentView === 'matching' ? '患者マッチング' : '患者検索'}
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCurrentView('register')}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>患者登録</span>
            </button>
            <button
              onClick={() => setCurrentView('matching')}
              className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
                currentView === 'matching'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>マッチング</span>
            </button>
            <button
              onClick={() => setCurrentView('facilities')}
              className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
                currentView === 'facilities'
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Building className="h-4 w-4" />
              <span>医療機関</span>
            </button>
            <button
              onClick={() => setCurrentView('chats')}
              className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
                currentView === 'chats'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <MessageCircle className="h-4 w-4" />
              <span>チャット</span>
              {totalUnreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {totalUnreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setCurrentView('applications')}
              className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
                currentView === 'applications'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>申請管理</span>
              {(receivedApplications.filter(app => app.status === 'pending').length > 0) && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {receivedApplications.filter(app => app.status === 'pending').length}
                </span>
              )}
            </button>
            <button
              onClick={() => setCurrentView('list')}
              className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
                currentView === 'list' || currentView === 'dashboard'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <List className="h-4 w-4" />
              <span>一覧表示</span>
            </button>
            <button
              onClick={() => setCurrentView('map')}
              className={`px-4 py-2 rounded-md flex items-center space-x-2 ${
                currentView === 'map'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Map className="h-4 w-4" />
              <span>地図表示</span>
            </button>
          </div>
        </div>

        {currentView === 'applications' ? (
          <ApplicationManagement 
            receivedApplications={receivedApplications}
            sentApplications={sentApplications}
            onApproveApplication={onApproveApplication}
            onRejectApplication={onRejectApplication}
            facilityName={facilityName}
          />
        ) : currentView === 'chats' ? (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-800">
                チャット一覧
              </h3>
            </div>
            <div className="p-6">
              <ChatList 
                chats={chats}
                patients={patients}
                facilityName={facilityName}
                onSelectChat={onSelectChat}
              />
            </div>
          </div>
        ) : (
          <>
            <SearchFilters 
              searchFilters={searchFilters} 
              setSearchFilters={setSearchFilters} 
            />

            {currentView === 'map' ? (
              <MapPlaceholder />
            ) : (
              <PatientTable 
                filteredPatients={filteredPatients} 
                setSelectedPatient={setSelectedPatient}
                facilityName={facilityName}
                onApplyForPatient={onApplyForPatient}
                onViewPatientDetail={onViewPatientDetail}
              />
            )}
          </>
        )}
      </div>
    </main>
  </div>
);

export default Dashboard;
