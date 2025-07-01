import React from 'react';
import { Heart } from 'lucide-react';

const LoginView = ({ facilityName, setFacilityName, handleLogin }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-red-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
      <div className="text-center mb-8">
        <Heart className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          心不全患者マッチング
        </h1>
        <p className="text-gray-600">医療・介護施設向け患者検索システム</p>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            施設名を入力してください
          </label>
          <input
            type="text"
            value={facilityName}
            onChange={(e) => setFacilityName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="例：○○○クリニック"
            maxLength={100}
            autoComplete="organization"
          />
        </div>
        
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
        >
          ログイン
        </button>
      </div>
      
      <div className="mt-8 text-xs text-gray-500 text-center">
        ※ このシステムは医療・介護施設専用です
      </div>
    </div>
  </div>
);

export default LoginView;
