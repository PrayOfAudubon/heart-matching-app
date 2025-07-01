import React from 'react';
import { Map } from 'lucide-react';

const MapPlaceholder = () => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <Map className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">地図機能は準備中です</p>
        <p className="text-sm text-gray-500 mt-2">
          Google Maps APIと連携予定
        </p>
      </div>
    </div>
  </div>
);

export default MapPlaceholder;
