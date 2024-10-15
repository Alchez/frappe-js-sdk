import axios, { AxiosInstance, RawAxiosRequestHeaders } from 'axios';

declare global {
  interface Window {
    csrf_token?: string;
  }
}

export function getAxiosClient(
  appURL: string,
  useToken?: boolean,
  tokenType?: 'Bearer' | 'token',
  token?: () => string,
  customHeaders?: RawAxiosRequestHeaders,
): AxiosInstance {
  return axios.create({
    baseURL: appURL,
    headers: getRequestHeaders(appURL, useToken, tokenType, token, customHeaders),
    withCredentials: true,
  });
}

export function getRequestHeaders(
  appURL?: string,
  useToken = false,
  tokenType?: 'Bearer' | 'token',
  token?: () => string,
  customHeaders?: RawAxiosRequestHeaders,
): RawAxiosRequestHeaders {
  const headers: RawAxiosRequestHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json; charset=utf-8',
  };

  if (useToken && tokenType && token) {
    headers.Authorization = `${tokenType} ${token()}`;
  }

  // in case of browser environments
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    if (window.location) {
      if (appURL && appURL !== window.location.origin) {
        // Do not set X-Frappe-Site-Name
      } else {
        headers['X-Frappe-Site-Name'] = window.location.hostname;
      }
    }
    if (window.csrf_token && window.csrf_token !== '{{ csrf_token }}') {
      headers['X-Frappe-CSRF-Token'] = window.csrf_token;
    }
  }

  return {
    ...headers,
    ...(customHeaders ?? {}),
  };
}
