import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { User } from '../types';

// Host machine IP on local Wi-Fi (matches Metro bundler 192.168.1.4)
export const DEFAULT_API_BASE = 'http://192.168.1.4:4000/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface TotpSetup {
  qrCode: string;
  manualEntryKey: string;
  otpAuthUrl: string;
}

interface AuthContextType extends AuthState {
  register: (username: string, email: string, password: string, phone?: string) => Promise<{ totpSetup: TotpSetup; email: string }>;
  verifyTotpSetup: (email: string, totpCode: string) => Promise<void>;
  login: (email: string, password: string) => Promise<{ requiresTotpVerification: boolean; email?: string }>;
  verifyTotpLogin: (email: string, totpCode: string) => Promise<void>;
  forgotPassword: (emailOrPhone: string) => Promise<{ requiresTotpVerification: boolean; email?: string }>;
  verifyTotpForReset: (email: string, totpCode: string) => Promise<{ resetEmailSent: boolean; resetToken?: string }>;
  resetPassword: (resetToken: string, newPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  loginAsDemo: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = await AsyncStorage.getItem('dm_token');
  const res = await fetch(`${DEFAULT_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Network request failed');
  }
  return data as T;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    async function restoreSession() {
      try {
        const token = await AsyncStorage.getItem('dm_token');
        const userStr = await AsyncStorage.getItem('dm_user');
        if (token && userStr) {
          const user = JSON.parse(userStr);
          setState({ user, token, isAuthenticated: true, isLoading: false });
        } else {
          setState((s) => ({ ...s, isLoading: false }));
        }
      } catch {
        setState((s) => ({ ...s, isLoading: false }));
      }
    }
    restoreSession();
  }, []);

  const setAuth = useCallback(async (token: string, user: User) => {
    await AsyncStorage.setItem('dm_token', token);
    await AsyncStorage.setItem('dm_user', JSON.stringify(user));
    setState({ user, token, isAuthenticated: true, isLoading: false });
  }, []);

  const register = useCallback(async (username: string, email: string, password: string, phone?: string) => {
    const data = await apiFetch<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password, phone }),
    });
    return { totpSetup: data.totpSetup as TotpSetup, email: data.email };
  }, []);

  const verifyTotpSetup = useCallback(async (email: string, totpCode: string) => {
    const data = await apiFetch<any>('/auth/verify-totp-setup', {
      method: 'POST',
      body: JSON.stringify({ email, totpCode }),
    });
    await setAuth(data.token, data.user);
  }, [setAuth]);

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiFetch<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (!data.requiresTotpVerification) {
      await setAuth(data.token, data.user);
    }
    return {
      requiresTotpVerification: data.requiresTotpVerification,
      email: data.email,
    };
  }, [setAuth]);

  const verifyTotpLogin = useCallback(async (email: string, totpCode: string) => {
    const data = await apiFetch<any>('/auth/verify-totp-login', {
      method: 'POST',
      body: JSON.stringify({ email, totpCode }),
    });
    await setAuth(data.token, data.user);
  }, [setAuth]);

  const forgotPassword = useCallback(async (emailOrPhone: string) => {
    const data = await apiFetch<any>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ emailOrPhone }),
    });
    return {
      requiresTotpVerification: data.requiresTotpVerification,
      email: data.email,
    };
  }, []);

  const verifyTotpForReset = useCallback(async (email: string, totpCode: string) => {
    const data = await apiFetch<any>('/auth/verify-totp-reset', {
      method: 'POST',
      body: JSON.stringify({ email, totpCode }),
    });
    return { resetEmailSent: data.resetEmailSent, resetToken: data.resetToken };
  }, []);

  const resetPassword = useCallback(async (resetToken: string, newPassword: string) => {
    await apiFetch<any>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ resetToken, newPassword }),
    });
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem('dm_token');
    await AsyncStorage.removeItem('dm_user');
    setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
  }, []);

  const loginAsDemo = useCallback(async () => {
    try {
      const data = await apiFetch<any>('/auth/demo');
      await setAuth(data.token, data.user);
    } catch {
      // Local fallback if server unreachable
      const demoUser: User = {
        _id: 'usr_demo_101',
        username: 'SeniorCandidate',
        email: 'learner@dailymastery.dev',
        role: 'PRO_DEV',
        timezone: 'Asia/Kolkata',
        streaks: {
          easy: { current: 14, longest: 21, lastActiveDate: new Date().toISOString().slice(0, 10) },
          medium: { current: 8, longest: 14, lastActiveDate: new Date().toISOString().slice(0, 10) },
          advanced: { current: 3, longest: 7, lastActiveDate: new Date().toISOString().slice(0, 10) },
          freezeTokens: 2,
        },
        completedTopicIds: [],
        solvedProblemIds: [],
      };
      await setAuth('demo_jwt_token', demoUser);
    }
  }, [setAuth]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        register,
        verifyTotpSetup,
        login,
        verifyTotpLogin,
        forgotPassword,
        verifyTotpForReset,
        resetPassword,
        logout,
        loginAsDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
