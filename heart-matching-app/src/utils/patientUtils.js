// 患者ID生成
export const generatePatientId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'HF-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// 申請ID生成
export const generateApplicationId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'APP-';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// 患者フィルタリング
export const filterPatients = (patients, searchFilters) => {
  return patients.filter(patient => {
    return (
      (!searchFilters.ageGroup || patient.ageGroup === searchFilters.ageGroup) &&
      (!searchFilters.gender || patient.gender === searchFilters.gender) &&
      (!searchFilters.nyhaClass || patient.nyhaClass === searchFilters.nyhaClass) &&
      (!searchFilters.careLevel || patient.careLevel === searchFilters.careLevel) &&
      (!searchFilters.area || patient.area === searchFilters.area) &&
      (!searchFilters.service || patient.desiredService.includes(searchFilters.service))
    );
  });
};

// バリデーション
export const validatePatientData = (patientData) => {
  const errors = {};
  if (!patientData.ageGroup) errors.ageGroup = '年齢層は必須です';
  if (!patientData.gender) errors.gender = '性別は必須です';
  if (!patientData.diagnosis) errors.diagnosis = '診断名は必須です';
  if (!patientData.nyhaClass) errors.nyhaClass = 'NYHA分類は必須です';
  if (!patientData.area) errors.area = '地域は必須です';
  if (!patientData.desiredService) errors.desiredService = '希望サービスは必須です';
  return errors;
};

// 申請作成
export const createApplication = (patientId, applicantFacility, note = '') => {
  return {
    id: generateApplicationId(),
    patientId,
    applicantFacility,
    applicationDate: new Date().toISOString(),
    status: 'pending', // pending, approved, rejected
    note,
    responseDate: null,
    responseNote: ''
  };
};

// 患者の申請状況取得
export const getPatientApplicationStatus = (patient, facilityName) => {
  if (!patient.applications || patient.applications.length === 0) {
    return 'none'; // 申請なし
  }
  
  const myApplication = patient.applications.find(app => app.applicantFacility === facilityName);
  if (myApplication) {
    return myApplication.status; // pending, approved, rejected
  }
  
  return 'others'; // 他の施設からの申請あり
};

// 申請可能かチェック
export const canApplyForPatient = (patient, facilityName) => {
  // 自分の施設が登録した患者には申請できない
  if (patient.facility === facilityName) {
    return false;
  }
  
  // 既に申請済みの場合は申請できない
  const existingApplication = patient.applications?.find(app => app.applicantFacility === facilityName);
  if (existingApplication) {
    return false;
  }
  
  // 既に承認済みの申請がある場合は申請できない
  const approvedApplication = patient.applications?.find(app => app.status === 'approved');
  if (approvedApplication) {
    return false;
  }
  
  // 患者のステータスがavailableの場合のみ申請可能
  return patient.status === 'available';
};

// 受信した申請を取得（自分の施設が登録した患者への申請）
export const getReceivedApplications = (patients, facilityName) => {
  const receivedApplications = [];
  
  patients.forEach(patient => {
    if (patient.facility === facilityName && patient.applications) {
      patient.applications.forEach(application => {
        receivedApplications.push({
          ...application,
          patient: patient
        });
      });
    }
  });
  
  return receivedApplications.sort((a, b) => new Date(b.applicationDate) - new Date(a.applicationDate));
};

// 送信した申請を取得（自分の施設が申請した患者）
export const getSentApplications = (patients, facilityName) => {
  const sentApplications = [];
  
  patients.forEach(patient => {
    if (patient.applications) {
      const myApplication = patient.applications.find(app => app.applicantFacility === facilityName);
      if (myApplication) {
        sentApplications.push({
          ...myApplication,
          patient: patient
        });
      }
    }
  });
  
  return sentApplications.sort((a, b) => new Date(b.applicationDate) - new Date(a.applicationDate));
};

// 申請承認時に患者のステータスを更新
export const updatePatientStatusOnApproval = (patients, applicationId) => {
  return patients.map(patient => {
    const application = patient.applications?.find(app => app.id === applicationId);
    if (application && application.status === 'approved') {
      return {
        ...patient,
        status: 'accepted' // 承認済みの患者は受け入れ済みステータスに変更
      };
    }
    return patient;
  });
};

// 承認済み申請があるかチェック
export const hasApprovedApplication = (patient) => {
  return patient.applications?.some(app => app.status === 'approved') || false;
};
