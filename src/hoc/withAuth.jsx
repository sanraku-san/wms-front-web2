
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const withAuth = (WrappedComponent) => {
  const AuthWrapper = (props) => {
    const navigate = useNavigate();
    const authToken = sessionStorage.getItem('authToken'); 

    useEffect(() => {
      if (!authToken) {    
        navigate('/login');
      }
    }, [authToken, navigate]);
    return authToken ? <WrappedComponent {...props} /> : null;
  };

  AuthWrapper.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return AuthWrapper;
};
export default withAuth;