import { AxiosInstance, type RawAxiosRequestHeaders } from 'axios';

import { FrappeAuth } from '..';
import { FrappeCall } from '../call';
import { FrappeDB } from '../db';
import { FrappeFileUpload } from '../file';
import { getAxiosClient } from '../utils/axios';
import { TokenParams } from './types';

export class FrappeApp {
  /** URL of the Frappe instance */
  readonly url: string;

  /** Name of the Frappe App instance */
  readonly name: string;

  /** Whether to use token based auth */
  readonly useToken: boolean;

  /** Function that returns the token to be used for authentication */
  readonly token?: () => string;

  /** Type of token to be used for authentication */
  readonly tokenType?: 'Bearer' | 'token';

  /** Custom Headers to be passed in each request */
  readonly customHeaders?: RawAxiosRequestHeaders;

  /** Axios instance */
  readonly axios: AxiosInstance;

  /** A FrappeAuth class instance for the app */
  auth: () => FrappeAuth;

  /** A FrappeDB class instance for the app */
  db: () => FrappeDB;

  /** A FrappeFileUpload class instance for the app */
  file: () => FrappeFileUpload;

  /** A FrappeCall class instance for the app */
  call: () => FrappeCall;

  constructor(url: string, tokenParams?: TokenParams, name?: string, customHeaders?: RawAxiosRequestHeaders) {
    this.url = url;
    this.name = name ?? 'FrappeApp';
    this.useToken = tokenParams?.useToken ?? false;
    this.token = tokenParams?.token;
    this.tokenType = tokenParams?.type ?? 'Bearer';
    this.customHeaders = customHeaders;
    this.axios = getAxiosClient(this.url, this.useToken, this.tokenType, this.token, this.customHeaders);

    this.auth = () => new FrappeAuth(url, tokenParams, name, customHeaders);
    this.db = () => new FrappeDB(url, tokenParams, name, customHeaders);
    this.file = () => new FrappeFileUpload(url, tokenParams, name, customHeaders);
    this.call = () => new FrappeCall(url, tokenParams, name, customHeaders);
  }
}
