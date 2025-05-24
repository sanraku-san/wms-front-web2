
import React, { useState } from 'react';
import { FaUser, FaLock, FaWarehouse, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth'; 
import withoutAuth from '../hoc/withoutAuth';

 function Login() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const responseData = await loginUser(credentials);
      console.log('Login successful:', responseData);
      const authToken = responseData.data.token;
      sessionStorage.setItem('authToken', authToken);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 via-gray-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
      {/* Background elements contained within the parent */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Add a subtle pattern overlay */}
        <div className="absolute inset-0 bg-opacity-10 pointer-events-none"></div>
        
        {/* Position blobs with more subdued colors */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-indigo-700 rounded-full mix-blend-soft-light filter blur-3xl opacity-15 animate-blob"></div>
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-blue-800 rounded-full mix-blend-soft-light filter blur-3xl opacity-15 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/3 w-60 h-60 bg-slate-600 rounded-full mix-blend-soft-light filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="max-w-md w-full space-y-8 bg-gradient-to-b from-white to-gray-50 p-10 rounded-xl shadow-2xl border border-gray-200/50 backdrop-blur-sm relative z-10">
        <div className="flex flex-col items-center">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-3 rounded-full mb-4 shadow-lg transform transition-all duration-300 hover:scale-110">
            <FaWarehouse className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-center text-3xl font-bold text-gray-900">WMS</h1>
          <h2 className="mt-3 text-center text-lg font-medium text-gray-600">Welcome back</h2>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 animate-shake">
            <p className="text-red-700 text-center text-sm font-medium">{error}</p>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors duration-200" />
              </div>
              <input
                id="email"
                name="email"
                type="text"
                required
                className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out sm:text-sm hover:border-indigo-300"
                placeholder="Email"
                value={credentials.email}
                onChange={handleChange}
              />
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors duration-200" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="appearance-none block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out sm:text-sm hover:border-indigo-300"
                placeholder="Password"
                value={credentials.password}
                onChange={handleChange}
              />
              <div 
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-indigo-500 transition-colors duration-200" />
                ) : (
                  <FaEye className="h-5 w-5 text-gray-400 hover:text-indigo-500 transition-colors duration-200" />
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 hover:text-indigo-600 cursor-pointer transition-colors duration-200">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200 hover:underline">
                Forgot password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white ${
                loading ? 'bg-indigo-400' : 'bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ease-in-out shadow-md hover:shadow-lg transform hover:-translate-y-0.5`}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center">
                  Sign in
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              )}
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need help? <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">Contact support</a>
          </p>
        </div>
      </div>
    </div>
  );
}
export default withoutAuth(Login);
