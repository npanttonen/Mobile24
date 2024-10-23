import React, { createContext, useState, useContext } from 'react';

// Create the Auth Context
const AuthContext = createContext();

// Create a custom provider
export const AuthProvider = ({ children }) => {
    const [savedtoken, setToken] = useState('');

    return (
        <AuthContext.Provider value={{ savedtoken, setToken }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the Auth Context
export const useAuth = () => {
    return useContext(AuthContext);
};