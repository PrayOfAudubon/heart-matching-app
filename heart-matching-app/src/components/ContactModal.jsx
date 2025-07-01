import React from 'react';
import { QrCode, Phone } from 'lucide-react';

const ContactModal = ({ patient, onClose, showQR, setShowQR }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800">照会情報</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600">患者ID</p>
          <p className="font-medium">{patient.id}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">登録施設</p>
          <p className="font-medium">{patient.facility}</p>
        </div>
        
        <div>
          <p className="text-sm text-gray-600">連絡先</p>
          <div className="space-y-1">
            <p className="font-medium">{patient.contactPhone}</p>
            <p className="font-medium text-blue-600">{patient.contactEmail}</p>
          </div>
        </div>
        
        {showQR && (
          <div className="text-center">
            <div className="w-32 h-32 bg-gray-100 mx-auto mb-2 flex items-center justify-center">
              <QrCode className="h-16 w-16 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500">QRコード（準備中）</p>
          </div>
        )}
      </div>
      
      <div className="flex space-x-2 mt-6">
        <button
          onClick={() => setShowQR(!showQR)}
          className="flex-1 bg-gray-100 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-200 flex items-center justify-center space-x-1"
        >
          <QrCode className="h-4 w-4" />
          <span>QR表示</span>
        </button>
        <button
          onClick={() => {
            window.location.href = `tel:${patient.contactPhone}`;
          }}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center space-x-1"
        >
          <Phone className="h-4 w-4" />
          <span>電話する</span>
        </button>
      </div>
    </div>
  </div>
);

export default ContactModal;
