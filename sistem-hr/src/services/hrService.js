import { apiConfig } from './api/config';
import { hrApi as mockHrApi } from './hrApi';
import { httpHrApi } from './httpHrApi';

export const hrServiceMode = apiConfig.dataSource === 'http' ? 'http' : 'mock';
export const hrService = hrServiceMode === 'http' ? httpHrApi : mockHrApi;
