"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie'; // Import js-cookie

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Start with null for loading state

  useEffect(() => {
    // Only run this on the client-side
    if (typeof window !== "undefined") {
      const token = Cookies.get('token');
      console.log('token from cookies:', token, !!token);
      setIsAuthenticated(!!token); // Set the authentication state based on cookie
    }
  }, []);

  if (isAuthenticated === null) {

    return (
    <div className='flex justify-center items-center h-screen'>
        <span className="loading loading-spinner text-primary"></span>
    </div>
    ); // Optionally show a loading state while determining authentication
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
