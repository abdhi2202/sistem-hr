import { apiConfig } from './config';
import { ApiError } from './errors';
import { emitForbiddenEvent, emitUnauthorizedEvent } from './events';
import { getAccessToken } from '../authStorage';

function buildUrl(path, query) {
  const url = new URL(path, apiConfig.baseUrl);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
}

async function parseResponse(response) {
  const contentType = response.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const validationErrors =
      typeof payload === 'object' && payload !== null && typeof payload.errors === 'object'
        ? payload.errors
        : {};
    const firstFieldError = Object.values(validationErrors)[0];
    const message =
      typeof payload === 'object' && payload !== null
        ? payload.message ??
          (Array.isArray(firstFieldError) ? firstFieldError[0] : firstFieldError) ??
          'Permintaan API gagal diproses.'
        : 'Permintaan API gagal diproses.';

    if (response.status === 401) {
      emitUnauthorizedEvent({
        status: response.status,
        message,
      });
    }

    if (response.status === 403) {
      emitForbiddenEvent({
        status: response.status,
        message,
      });
    }

    throw new ApiError(message, {
      status: response.status,
      payload,
    });
  }

  return payload;
}

export async function apiRequest(path, options = {}) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), apiConfig.timeoutMs);
  const token = options.skipAuth ? '' : getAccessToken();

  try {
    const response = await fetch(buildUrl(path, options.query), {
      method: options.method ?? 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers ?? {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });

    return await parseResponse(response);
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new ApiError('Permintaan ke server melebihi batas waktu. Coba lagi.', {
        status: 408,
      });
    }

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError('Tidak dapat terhubung ke server. Periksa backend lalu coba lagi.', {
      status: 503,
    });
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function getDownloadFilename(response, fallbackName) {
  const disposition = response.headers.get('content-disposition') ?? '';
  const match = disposition.match(/filename="?([^"]+)"?/i);

  return match?.[1] ?? fallbackName;
}

export async function apiDownload(path, options = {}) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), apiConfig.timeoutMs);
  const token = options.skipAuth ? '' : getAccessToken();

  try {
    const response = await fetch(buildUrl(path, options.query), {
      method: options.method ?? 'GET',
      headers: {
        Accept: options.accept ?? 'text/csv,application/octet-stream,application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers ?? {}),
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      await parseResponse(response);
    }

    const blob = await response.blob();
    const filename = getDownloadFilename(response, options.filename ?? 'download.csv');
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return {
      ok: true,
      filename,
    };
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new ApiError('Unduhan melebihi batas waktu. Coba lagi.', {
        status: 408,
      });
    }

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError('Tidak dapat mengunduh file dari server.', {
      status: 503,
    });
  } finally {
    window.clearTimeout(timeoutId);
  }
}
