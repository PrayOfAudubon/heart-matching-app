// 統合サンプルデータ - 各データファイルからインポートして再エクスポート
import { samplePatients } from './patientData';
import { sampleMedicalFacilities } from './facilityData';
import { sampleChatMessages, sampleMatchingStatus, templateMessages } from './chatData';

// 患者データ
export { samplePatients };

// 医療機関データ
export { sampleMedicalFacilities };

// チャット関連データ
export { sampleChatMessages, sampleMatchingStatus, templateMessages };

// 便利な統計関数
export const getPatientsByArea = (area) => {
  return samplePatients.filter(patient => patient.area.includes(area));
};

export const getPatientsByStatus = (status) => {
  return samplePatients.filter(patient => patient.status === status);
};

export const getPatientStatistics = () => {
  return {
    total: samplePatients.length,
    available: samplePatients.filter(p => p.status === 'available').length,
    pending: samplePatients.filter(p => p.status === 'pending').length,
    accepted: samplePatients.filter(p => p.status === 'accepted').length,
    rejected: samplePatients.filter(p => p.status === 'rejected').length
  };
};

export const getAreaStatistics = () => {
  const areas = ['墨田区', '江東区', '江戸川区'];
  return areas.map(area => ({
    name: area,
    total: getPatientsByArea(area).length,
    available: getPatientsByArea(area).filter(p => p.status === 'available').length
  }));
};
