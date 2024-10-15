import { FrappeApp } from '../frappe_app';
import { handleError } from '../utils/error';

export class FrappeCall extends FrappeApp {
  /** Makes a GET request to the specified endpoint */
  async get<T = any>(path: string, params?: Record<string, unknown>): Promise<T> {
    const encodedParams = new URLSearchParams();
    // TEMP Fix Issue #50
    if (params) {
      Object.entries(params).forEach((param) => {
        const [key, value] = param;
        if (value !== null && value !== undefined) {
          const val = typeof value === 'object' ? JSON.stringify(value) : value;
          // @ts-expect-error @typescript-eslint/no-unsafe-assignment
          encodedParams.set(key, val);
        }
      });
    }

    try {
      const { data } = await this.axios.get<T>(`/api/method/${path}`, { params: encodedParams });
      return data;
    } catch (error) {
      handleError(error);
    }
  }

  /** Makes a POST request to the specified endpoint */
  async post<T = any>(path: string, params?: any): Promise<T> {
    try {
      const { data } = await this.axios.post<T>(`/api/method/${path}`, { ...params });
      return data;
    } catch (error) {
      handleError(error);
    }
  }

  /** Makes a PUT request to the specified endpoint */
  async put<T = any>(path: string, params?: any): Promise<T> {
    try {
      const { data } = await this.axios.put<T>(`/api/method/${path}`, { ...params });
      return data;
    } catch (error) {
      handleError(error);
    }
  }

  /** Makes a DELETE request to the specified endpoint */
  async delete<T = any>(path: string, params?: any): Promise<T> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { data } = await this.axios.delete<T>(`/api/method/${path}`, { params });
      return data;
    } catch (error) {
      handleError(error);
    }
  }
}
