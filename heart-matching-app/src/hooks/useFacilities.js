import { useState, useEffect } from 'react';
import { sampleMedicalFacilities } from '../data/sampleDataNew';

export const useFacilities = () => {
  const [facilities, setFacilities] = useState([]);

  useEffect(() => {
    // ローカルストレージから医療機関データを読み込み
    const savedFacilities = localStorage.getItem('medicalFacilities');
    if (savedFacilities) {
      setFacilities(JSON.parse(savedFacilities));
    } else {
      // 初回はサンプルデータを使用
      setFacilities(sampleMedicalFacilities);
      localStorage.setItem('medicalFacilities', JSON.stringify(sampleMedicalFacilities));
    }
  }, []);

  // 医療機関を登録
  const registerFacility = (facilityData) => {
    const newFacility = {
      ...facilityData,
      id: `FAC${Date.now()}`, // 簡易的なID生成
      registrationDate: new Date().toISOString().split('T')[0],
      currentPatients: 0,
      coordinates: { lat: 35.6762, lng: 139.6503 } // デフォルト座標
    };

    const updatedFacilities = [...facilities, newFacility];
    setFacilities(updatedFacilities);
    localStorage.setItem('medicalFacilities', JSON.stringify(updatedFacilities));
    
    return newFacility;
  };

  // 医療機関情報を更新
  const updateFacility = (facilityId, updatedData) => {
    const updatedFacilities = facilities.map(facility =>
      facility.id === facilityId
        ? { ...facility, ...updatedData }
        : facility
    );
    setFacilities(updatedFacilities);
    localStorage.setItem('medicalFacilities', JSON.stringify(updatedFacilities));
  };

  // 医療機関を削除
  const deleteFacility = (facilityId) => {
    const updatedFacilities = facilities.filter(facility => facility.id !== facilityId);
    setFacilities(updatedFacilities);
    localStorage.setItem('medicalFacilities', JSON.stringify(updatedFacilities));
  };

  // IDで医療機関を取得
  const getFacilityById = (facilityId) => {
    return facilities.find(facility => facility.id === facilityId);
  };

  // 名前で医療機関を取得
  const getFacilityByName = (facilityName) => {
    return facilities.find(facility => facility.name === facilityName);
  };

  // エリアで医療機関をフィルター
  const getFacilitiesByArea = (area) => {
    return facilities.filter(facility => facility.area === area);
  };

  // サービスで医療機関をフィルター
  const getFacilitiesByService = (service) => {
    return facilities.filter(facility => 
      facility.providedServices.includes(service)
    );
  };

  // 患者の条件に合う医療機関を検索
  const findMatchingFacilities = (patientData) => {
    return facilities.filter(facility => {
      // エリアマッチング
      if (facility.area !== patientData.area) return false;
      
      // サービスマッチング
      if (!facility.providedServices.includes(patientData.desiredService)) return false;
      
      // 曜日マッチング（患者の希望曜日と施設の対応曜日の重複チェック）
      if (patientData.preferredDays && patientData.preferredDays.length > 0) {
        const hasCommonDay = patientData.preferredDays.some(day => 
          facility.availableDays.includes(day)
        );
        if (!hasCommonDay) return false;
      }
      
      // 時間帯マッチング
      if (patientData.preferredTimeSlots && patientData.preferredTimeSlots.length > 0) {
        const hasCommonTimeSlot = patientData.preferredTimeSlots.some(timeSlot => 
          facility.availableTimeSlots.includes(timeSlot)
        );
        if (!hasCommonTimeSlot) return false;
      }
      
      // 受け入れ可能患者数チェック
      if (facility.currentPatients >= facility.maxPatients) return false;
      
      return true;
    });
  };

  // マッチング度を計算（0-100のスコア）
  const calculateMatchScore = (patient, facility) => {
    let score = 0;
    let totalWeight = 0;

    // エリアマッチング (30点)
    if (facility.area === patient.area) {
      score += 30;
    }
    totalWeight += 30;

    // サービスマッチング (40点)
    if (facility.providedServices.includes(patient.desiredService)) {
      score += 40;
    }
    totalWeight += 40;

    // 曜日マッチング (15点)
    if (patient.preferredDays && patient.preferredDays.length > 0) {
      const commonDays = patient.preferredDays.filter(day => 
        facility.availableDays.includes(day)
      );
      const dayMatchRatio = commonDays.length / patient.preferredDays.length;
      score += 15 * dayMatchRatio;
    }
    totalWeight += 15;

    // 時間帯マッチング (15点)
    if (patient.preferredTimeSlots && patient.preferredTimeSlots.length > 0) {
      const commonTimeSlots = patient.preferredTimeSlots.filter(timeSlot => 
        facility.availableTimeSlots.includes(timeSlot)
      );
      const timeMatchRatio = commonTimeSlots.length / patient.preferredTimeSlots.length;
      score += 15 * timeMatchRatio;
    }
    totalWeight += 15;

    return Math.round((score / totalWeight) * 100);
  };

  return {
    facilities,
    registerFacility,
    updateFacility,
    deleteFacility,
    getFacilityById,
    getFacilityByName,
    getFacilitiesByArea,
    getFacilitiesByService,
    findMatchingFacilities,
    calculateMatchScore
  };
};
