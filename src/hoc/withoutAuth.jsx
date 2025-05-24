import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const withoutAuth = (WrappedComponent) => {
  const WithOutAuth = (props) => {
    const navigate = useNavigate();
    const isLoggedIn = !!sessionStorage.getItem('authToken');

    useEffect(() => {
      if (isLoggedIn) {
        navigate('/dashboard');
      }
    }, [isLoggedIn, navigate]);
    return !isLoggedIn ? <WrappedComponent {...props} /> : null; 
  };
  return WithOutAuth;
};
export default withoutAuth;
