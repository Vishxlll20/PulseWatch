import { useState } from 'react';

export const useAuthStore = () => {
  const [resetEmail, setResetEmail] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  

  return {
    resetEmail,
    setResetEmail,
    isOtpVerified,
    setIsOtpVerified
  };
};
