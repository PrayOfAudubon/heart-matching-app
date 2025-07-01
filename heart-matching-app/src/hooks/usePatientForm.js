import { useState } from 'react';

export const usePatientForm = () => {
  const [formData, setFormData] = useState({
    ageGroup: '',
    gender: '',
    diagnosis: '',
    nyhaClass: '',
    medicalTreatment: '',
    careLevel: '',
    area: '',
    desiredService: '',
    preferredDays: [],
    preferredTimeSlots: [],
    frequency: '',
    contactPhone: '',
    contactEmail: ''
  });

  const [validationErrors, setValidationErrors] = useState({});

  const resetForm = () => {
    setFormData({
      ageGroup: '',
      gender: '',
      diagnosis: '',
      nyhaClass: '',
      medicalTreatment: '',
      careLevel: '',
      area: '',
      desiredService: '',
      preferredDays: [],
      preferredTimeSlots: [],
      frequency: '',
      contactPhone: '',
      contactEmail: ''
    });
    setValidationErrors({});
  };

  const setErrors = (errors) => {
    setValidationErrors(errors);
  };

  return {
    formData,
    setFormData,
    validationErrors,
    setValidationErrors: setErrors,
    resetForm
  };
};
