import { apiConfig } from './api/config';
import { httpAuthApi } from './httpAuthApi';
import { mockAuthApi } from './mockAuthApi';

export const authServiceMode = apiConfig.dataSource === 'http' ? 'http' : 'mock';
export const authService = authServiceMode === 'http' ? httpAuthApi : mockAuthApi;
