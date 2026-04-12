export function getApiFieldErrors(error) {
  const payload = error?.payload;

  if (payload && typeof payload === 'object' && payload.errors && typeof payload.errors === 'object') {
    return payload.errors;
  }

  return {};
}

export function getFieldError(fieldErrors, ...keys) {
  for (const key of keys) {
    const value = fieldErrors?.[key];

    if (Array.isArray(value) && value.length > 0) {
      return value[0];
    }

    if (typeof value === 'string' && value) {
      return value;
    }
  }

  return '';
}

export function getApiErrorMessage(error, fallbackMessage) {
  const fieldErrors = getApiFieldErrors(error);
  const firstFieldError = Object.values(fieldErrors)[0];

  if (Array.isArray(firstFieldError) && firstFieldError[0]) {
    return firstFieldError[0];
  }

  if (typeof firstFieldError === 'string' && firstFieldError) {
    return firstFieldError;
  }

  return error?.message || fallbackMessage;
}
