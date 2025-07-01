import { useState, useEffect } from 'react';
import { samplePatients } from '../data/sampleDataNew';
import { 
  generatePatientId, 
  validatePatientData,
  createApplication,
  getReceivedApplications,
  getSentApplications,
  updatePatientStatusOnApproval
} from '../utils/patientUtils';

export const usePatients = () => {
  const [patients, setPatients] = useState([]);

  // 患者データの復元
  useEffect(() => {
    const savedPatients = localStorage.getItem('heartMatchingPatients');
    console.log('保存されている患者データ:', savedPatients); // デバッグ用
    if (savedPatients) {
      try {
        const patientsData = JSON.parse(savedPatients);
        if (Array.isArray(patientsData) && patientsData.length > 0) {
          // 既存データに新しいフィールドがない場合は追加
          const updatedPatientsData = patientsData.map(patient => ({
            ...patient,
            status: patient.status || 'available',
            applications: patient.applications || [],
            coordinates: patient.coordinates || { 
              lat: 35.6762 + Math.random() * 0.1, 
              lng: 139.6503 + Math.random() * 0.1 
            }
          }));
          console.log('復元された患者データ:', updatedPatientsData); // デバッグ用
          setPatients(updatedPatientsData);
        } else {
          console.log('サンプルデータを使用します'); // デバッグ用
          setPatients(samplePatients);
        }
      } catch (error) {
        console.error('患者データの復元に失敗しました:', error);
        localStorage.removeItem('heartMatchingPatients');
        console.log('エラーのためサンプルデータを使用します'); // デバッグ用
        setPatients(samplePatients);
      }
    } else {
      console.log('初回起動: サンプルデータを使用します'); // デバッグ用
      setPatients(samplePatients);
    }
  }, []);

  // 患者データが変更されたときにローカルストレージに保存
  useEffect(() => {
    // 初期化後（patients.length > 0）にのみ保存
    if (patients.length > 0) {
      console.log('患者データを保存:', patients); // デバッグ用
      localStorage.setItem('heartMatchingPatients', JSON.stringify(patients));
    }
  }, [patients]);

  const registerPatient = (patientData, facilityName) => {
    // バリデーション
    const errors = validatePatientData(patientData);

    if (Object.keys(errors).length > 0) {
      return { success: false, errors };
    }

    const newPatient = {
      id: generatePatientId(),
      ...patientData,
      facility: facilityName,
      registrationDate: new Date().toISOString().split('T')[0],
      coordinates: { lat: 35.6762 + Math.random() * 0.1, lng: 139.6503 + Math.random() * 0.1 },
      status: 'available',
      applications: []
    };

    setPatients(prev => [...prev, newPatient]);
    return { success: true, errors: {} };
  };

  const submitApplication = (patientId, facilityName, note) => {
    const application = createApplication(patientId, facilityName, note);
    
    setPatients(prevPatients => 
      prevPatients.map(patient => 
        patient.id === patientId 
          ? { 
              ...patient, 
              applications: [...(patient.applications || []), application]
            }
          : patient
      )
    );
  };

  const approveApplication = (applicationId, responseNote = '') => {
    setPatients(prevPatients => {
      const updatedPatients = prevPatients.map(patient => ({
        ...patient,
        applications: patient.applications?.map(app => 
          app.id === applicationId
            ? { 
                ...app, 
                status: 'approved', 
                responseNote,
                responseDate: new Date().toISOString()
              }
            : app
        ) || []
      }));
      
      // 申請承認後に患者のステータスを更新
      return updatePatientStatusOnApproval(updatedPatients, applicationId);
    });
  };

  const rejectApplication = (applicationId, responseNote = '') => {
    setPatients(prevPatients => 
      prevPatients.map(patient => ({
        ...patient,
        applications: patient.applications?.map(app => 
          app.id === applicationId
            ? { 
                ...app, 
                status: 'rejected', 
                responseNote,
                responseDate: new Date().toISOString()
              }
            : app
        ) || []
      }))
    );
  };

  const getApplications = (facilityName) => {
    return {
      received: getReceivedApplications(patients, facilityName),
      sent: getSentApplications(patients, facilityName)
    };
  };

  return {
    patients,
    registerPatient,
    submitApplication,
    approveApplication,
    rejectApplication,
    getApplications
  };
};
