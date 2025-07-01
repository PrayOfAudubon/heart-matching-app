import { useState } from 'react';

export const useModals = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationPatient, setApplicationPatient] = useState(null);

  const openContactModal = (patient) => {
    setSelectedPatient(patient);
  };

  const closeContactModal = () => {
    setSelectedPatient(null);
    setShowQR(false);
  };

  const openApplicationModal = (patient) => {
    setApplicationPatient(patient);
    setShowApplicationModal(true);
  };

  const closeApplicationModal = () => {
    setShowApplicationModal(false);
    setApplicationPatient(null);
  };

  const showRegistrationSuccess = () => {
    setRegistrationSuccess(true);
    setTimeout(() => {
      setRegistrationSuccess(false);
    }, 2000);
  };

  return {
    selectedPatient,
    showQR,
    setShowQR,
    registrationSuccess,
    showApplicationModal,
    applicationPatient,
    openContactModal,
    closeContactModal,
    openApplicationModal,
    closeApplicationModal,
    showRegistrationSuccess
  };
};
