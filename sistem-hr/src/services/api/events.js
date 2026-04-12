const unauthorizedEventName = 'sistem-hr:api-unauthorized';
const forbiddenEventName = 'sistem-hr:api-forbidden';

export function emitUnauthorizedEvent(detail = {}) {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new CustomEvent(unauthorizedEventName, { detail }));
}

export function subscribeUnauthorizedEvent(listener) {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handler = (event) => listener(event.detail ?? {});
  window.addEventListener(unauthorizedEventName, handler);

  return () => {
    window.removeEventListener(unauthorizedEventName, handler);
  };
}

export function emitForbiddenEvent(detail = {}) {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new CustomEvent(forbiddenEventName, { detail }));
}

export function subscribeForbiddenEvent(listener) {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handler = (event) => listener(event.detail ?? {});
  window.addEventListener(forbiddenEventName, handler);

  return () => {
    window.removeEventListener(forbiddenEventName, handler);
  };
}
