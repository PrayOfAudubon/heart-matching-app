import { useState, useEffect, useCallback } from 'react';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [facilityName, setFacilityName] = useState('');

  // ページロード時にローカルストレージから認証状態を復元
  useEffect(() => {
    const savedAuthState = localStorage.getItem('heartMatchingAuth');
    if (savedAuthState) {
      try {
        const { isLoggedIn: savedIsLoggedIn, facilityName: savedFacilityName } = JSON.parse(savedAuthState);
        if (savedIsLoggedIn && savedFacilityName) {
          setIsLoggedIn(true);
          setFacilityName(savedFacilityName);
        }
      } catch (error) {
        console.error('認証状態の復元に失敗しました:', error);
        localStorage.removeItem('heartMatchingAuth');
      }
    }
  }, []);

  // アプリケーション状態を保存する関数
  const saveAppState = useCallback((currentView, searchFilters) => {
    try {
      localStorage.setItem('heartMatchingAppState', JSON.stringify({
        currentView,
        searchFilters
      }));
    } catch (error) {
      console.error('アプリケーション状態の保存に失敗しました:', error);
    }
  }, []);

  // アプリケーション状態を取得する関数
  const getAppState = useCallback(() => {
    try {
      const savedAppState = localStorage.getItem('heartMatchingAppState');
      if (savedAppState) {
        return JSON.parse(savedAppState);
      }
    } catch (error) {
      console.error('アプリケーション状態の取得に失敗しました:', error);
      localStorage.removeItem('heartMatchingAppState');
    }
    return null;
  }, []);

  const login = (name) => {
    if (name.trim()) {
      setIsLoggedIn(true);
      setFacilityName(name.trim());
      
      // ログイン状態をローカルストレージに保存
      localStorage.setItem('heartMatchingAuth', JSON.stringify({
        isLoggedIn: true,
        facilityName: name.trim()
      }));
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setFacilityName('');
    
    // ローカルストレージから認証情報とアプリケーション状態を削除（患者データは保持）
    localStorage.removeItem('heartMatchingAuth');
    localStorage.removeItem('heartMatchingAppState');
  };

  return {
    isLoggedIn,
    facilityName,
    setFacilityName,
    login,
    logout,
    saveAppState,
    getAppState
  };
};
