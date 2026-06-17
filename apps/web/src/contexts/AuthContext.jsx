import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (pb.authStore.isValid) {
      setCurrentUser(pb.authStore.model);
    }
    setInitialLoading(false);

    const unsubscribe = pb.authStore.onChange((token, model) => {
      setCurrentUser(model);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const authData = await pb.collection('users').authWithPassword(email, password, { $autoCancel: false });
      setCurrentUser(authData.record);
      toast.success('Login realizado com sucesso');
      return authData.record;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Credenciais inválidas');
      throw error;
    }
  };

  const signup = async (email, password, passwordConfirm, name) => {
    try {
      const data = {
        email,
        password,
        passwordConfirm,
        name,
        role: 'customer'
      };
      
      const record = await pb.collection('users').create(data, { $autoCancel: false });
      
      await pb.collection('users').authWithPassword(email, password, { $autoCancel: false });
      setCurrentUser(pb.authStore.model);
      
      toast.success('Conta criada com sucesso');
      return record;
    } catch (error) {
      console.error('Signup error:', error);
      if (error.data?.data?.email) {
        toast.error('Este email já está em uso');
      } else {
        toast.error('Erro ao criar conta');
      }
      throw error;
    }
  };

  const logout = () => {
    pb.authStore.clear();
    setCurrentUser(null);
    toast.success('Logout realizado');
    navigate('/');
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    login,
    signup,
    logout,
    initialLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};