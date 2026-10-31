import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/helpers';

const AuthContext = createContext(null);

const DEMO_USERS = {
  admin: {
    id: 'USR-ADMIN-01',
    name: 'Admin',
    email: 'admin@brightloop.io',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    title: 'Platform Administrator',
  },
  staff: {
    id: 'USR-STAFF-01',
    name: 'Staff Member',
    email: 'staff@brightloop.io',
    role: 'staff',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'Billing & Operations Staff',
  },
  customer: {
    id: 'CUST-001',
    name: 'John Doe',
    email: 'john.doe@abcltd.com',
    role: 'customer',
    company: 'ABC Ltd',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Managing Director, ABC Ltd',
  },
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    return storage.get('brightloop_auth_user', DEMO_USERS.admin);
  });

  useEffect(() => {
    if (currentUser) {
      storage.set('brightloop_auth_user', currentUser);
    } else {
      storage.remove('brightloop_auth_user');
    }
  }, [currentUser]);

  const loginAs = (role) => {
    const user = DEMO_USERS[role];
    if (user) {
      setCurrentUser(user);
    }
  };

  const login = (email, password, selectedRole = 'admin') => {
    const user = DEMO_USERS[selectedRole] || {
      id: `USR-${Date.now()}`,
      name: email.split('@')[0],
      email,
      role: selectedRole,
      title: 'Authenticated User',
    };
    setCurrentUser(user);
    return user;
  };

  const registerCustomer = (customerData) => {
    const newCustomer = {
      id: `CUST-${Date.now().toString().slice(-4)}`,
      name: customerData.name,
      email: customerData.email,
      role: 'customer',
      company: customerData.company || customerData.name,
      title: 'Registered Customer',
    };
    setCurrentUser(newCustomer);
    return newCustomer;
  };

  const updateProfile = (updates) => {
    setCurrentUser((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser?.role || null,
        isAuthenticated: !!currentUser,
        login,
        loginAs,
        registerCustomer,
        updateProfile,
        logout,
        demoUsers: DEMO_USERS,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
