import React from 'react';
import { CheckCircle } from 'lucide-react';

const RegistrationSuccessModal = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md text-center">
      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-gray-800 mb-2">登録完了</h3>
      <p className="text-gray-600">患者情報が正常に登録されました</p>
    </div>
  </div>
);

export default RegistrationSuccessModal;
