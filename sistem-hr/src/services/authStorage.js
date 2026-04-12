const storageKey = 'sistem-hr-session';

export function buildAnonymousSession() {
  return {
    isAuthenticated: false,
    role: 'admin_hr',
    email: '',
    name: '',
    token: '',
  };
}

export function readSession() {
  if (typeof window === 'undefined') {
    return buildAnonymousSession();
  }

  const saved = window.localStorage.getItem(storageKey);

  if (!saved) {
    return buildAnonymousSession();
  }

  try {
    return {
      ...buildAnonymousSession(),
      ...JSON.parse(saved),
    };
  } catch {
    return buildAnonymousSession();
  }
}

export function writeSession(session) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(session));
}

export function clearSession() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(storageKey);
}

export function getAccessToken() {
  return readSession().token ?? '';
}
