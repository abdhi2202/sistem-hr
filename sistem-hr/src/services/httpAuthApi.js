import { apiRequest } from './api/client';
import { apiEndpoints } from './api/endpoints';
import {
  normalizeAuthResponse,
  toChangePasswordApiPayload,
  toLoginApiPayload,
} from './api/normalizers';

export const httpAuthApi = {
  async login(credentials) {
    const response = await apiRequest(apiEndpoints.auth.login, {
      method: 'POST',
      body: toLoginApiPayload(credentials),
      skipAuth: true,
    });

    return normalizeAuthResponse(response);
  },

  async logout() {
    return apiRequest(apiEndpoints.auth.logout, {
      method: 'POST',
    });
  },

  async changePassword(form) {
    return apiRequest(apiEndpoints.auth.changePassword, {
      method: 'POST',
      body: toChangePasswordApiPayload(form),
    });
  },
};
