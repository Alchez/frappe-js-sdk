import axios, { AxiosInstance, RawAxiosRequestHeaders } from 'axios';

export function getAxiosClient(
  appURL: string,
  useToken?: boolean,
  token?: () => string,
  tokenType?: 'Bearer' | 'token',
  customHeaders?: object
): AxiosInstance {
  return axios.create({
    baseURL: appURL,
    headers: getRequestHeaders(useToken, tokenType, token, appURL, customHeaders),
    withCredentials: true,
  });
}

export function getRequestHeaders(
  useToken: boolean = false,
  tokenType?: 'Bearer' | 'token',
  token?: () => string,
  appURL?: string,
  customHeaders?: object
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
    ...(customHeaders ?? {})
  };
}
