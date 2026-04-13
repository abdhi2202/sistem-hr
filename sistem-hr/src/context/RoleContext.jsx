import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authService, authServiceMode } from '../services/authService';
import { subscribeUnauthorizedEvent } from '../services/api/events';
import {
  buildAnonymousSession,
  clearSession,
  readSession,
  writeSession,
} from '../services/authStorage';

const RoleContext = createContext(null);

export function RoleProvider({ children }) {
  const [session, setSession] = useState(readSession);
  const [authNotice, setAuthNotice] = useState('');

  useEffect(() => {
    if (authServiceMode !== 'http') {
      return;
    }

    const hasMockToken =
      typeof session.token === 'string' && session.token.startsWith('mock-token-');
    const hasBrokenHttpSession = session.isAuthenticated && !session.token;

    if (!hasMockToken && !hasBrokenHttpSession) {
      return;
    }

    const nextSession = buildAnonymousSession();
    setSession(nextSession);
    clearSession();
  }, [session.isAuthenticated, session.token]);

  useEffect(() => {
    return subscribeUnauthorizedEvent((detail) => {
      const nextSession = buildAnonymousSession();
      setSession(nextSession);
      setAuthNotice(detail.message || 'Sesi Anda berakhir. Silakan login kembali.');
      clearSession();
    });
  }, []);

  async function login(credentials) {
    const result = await authService.login(credentials);
    const nextSession = {
      isAuthenticated: true,
      role: result.role,
      email: result.user.email,
      name: result.user.name,
      token: result.token,
    };

    setSession(nextSession);
    setAuthNotice('');
    writeSession(nextSession);

    return nextSession;
  }

  async function logout(options = {}) {
    if (session.isAuthenticated && authService.logout) {
      try {
        await authService.logout();
      } catch {
        // Always clear local session even if backend logout fails.
      }
    }

    const nextSession = buildAnonymousSession();
    setSession(nextSession);
    setAuthNotice(options.notice ?? '');
    clearSession();
  }

  async function changePassword(form) {
    return authService.changePassword({
      ...form,
      email: session.email,
    });
  }

  function setRole(role) {
    setSession((current) => {
      const nextSession = {
        ...current,
        role,
        name: role === 'admin_hr' ? 'Admin HR Demo' : 'Karyawan Demo',
        email: role === 'admin_hr' ? 'admin@ssms.test' : 'karyawan@ssms.test',
        token: current.token || `mock-token-${role}`,
      };

      writeSession(nextSession);
      return nextSession;
    });
  }

  const value = useMemo(
    () => ({
      role: session.role,
      isAuthenticated: session.isAuthenticated,
      email: session.email,
      name: session.name,
      token: session.token,
      authNotice,
      authMode: authServiceMode,
      canPreviewRole: authServiceMode === 'mock',
      setRole,
      login,
      logout,
      changePassword,
      clearAuthNotice: () => setAuthNotice(''),
    }),
    [authNotice, session],
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const context = useContext(RoleContext);

  if (!context) {
    throw new Error('useRole harus digunakan di dalam RoleProvider.');
  }

  return context;
}
