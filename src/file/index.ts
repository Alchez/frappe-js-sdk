import type { AxiosProgressEvent } from 'axios';

import { FrappeApp } from '../frappe_app';
import type { FileArgs } from './types';
import { getRequestHeaders } from '../utils/axios';
import { handleError } from '../utils/error';

export class FrappeFileUpload extends FrappeApp {
  /**
   * Upload a file to the server
   * @param file to be uploaded
   * @param args arguments of the file
   * @param onProgress file upload progress
   * @param apiPath API path to upload the file
   * @returns Promise which resolves with the file object
   */
  async uploadFile<T = any>(
    file: File,
    args: FileArgs<T>,
    onProgress?: (bytesUploaded: number, totalBytes?: number, progress?: AxiosProgressEvent) => void,
    apiPath: string = 'upload_file',
  ) {
    const formData = new FormData();
    if (file) formData.append('file', file, file.name);

    const { isPrivate, folder, file_url, doctype, docname, fieldname, otherData } = args;

    if (isPrivate) {
      formData.append('is_private', '1');
    }
    if (folder) {
      formData.append('folder', folder);
    }
    if (file_url) {
      formData.append('file_url', file_url);
    }
    if (doctype && docname) {
      formData.append('doctype', doctype);
      formData.append('docname', docname);
      if (fieldname) {
        formData.append('fieldname', fieldname);
      }
    }

    if (otherData) {
      Object.keys(otherData).forEach((key: string) => {
        const v = otherData[key as keyof T] as any;
        formData.append(key, v);
      });
    }

    try {
      const { data } = await this.axios.post(`/api/method/${apiPath}`, formData, {
        headers: {
          ...getRequestHeaders(this.url, this.useToken, this.tokenType, this.token, this.customHeaders),
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            onProgress(progressEvent.loaded, progressEvent.total, progressEvent);
          }
        },
      });
      return data.data;
    } catch (error: any) {
      handleError(error, 'There was an error while uploading the file.');
    }
  }
}
