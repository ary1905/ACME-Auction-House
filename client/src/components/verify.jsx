import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

export const VerifyEmail = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const redirectPath = searchParams.get('redirect') || '/';

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await axios.get(`http://localhost:8000/verify-email?token=${token}`);
        navigate(redirectPath);
      } catch (error) {
        console.error('Verification error:', error);
        navigate('/error');
      }
    };

    if (token) {
      verifyEmail();
    } else {
      navigate('/');
    }
  }, [token, navigate, redirectPath]);

  return <div>Verifying...</div>;
};
