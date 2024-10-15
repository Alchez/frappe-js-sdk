import { FrappeApp } from '../frappe_app';
import { handleError } from '../utils/error';
import type { AuthCredentials, AuthResponse, OTPCredentials, UserPassCredentials } from './types';

export class FrappeAuth extends FrappeApp {
  /** Logs in the user using username and password */
  async loginWithUsernamePassword(credentials: AuthCredentials): Promise<AuthResponse> {
    try {
      const { data } = await this.axios.post<AuthResponse>('/api/method/login', {
        usr: (credentials as UserPassCredentials).username,
        pwd: (credentials as UserPassCredentials).password,
        otp: (credentials as OTPCredentials).otp,
        tmp_id: (credentials as OTPCredentials).tmp_id,
        device: credentials.device,
      });
      return data;
    } catch (error) {
      handleError(error, 'There was an error while logging in');
    }
  }

  /** Gets the currently logged in user */
  async getLoggedInUser(): Promise<string> {
    try {
      const { data } = await this.axios.get<{ message: string }>('/api/method/frappe.auth.get_logged_user');
      return data.message;
    } catch (error) {
      handleError(error, 'There was an error while fetching the logged in user');
    }
  }

  /** Logs the user out */
  async logout(): Promise<void> {
    try {
      await this.axios.post('/api/method/logout', {});
    } catch (error) {
      handleError(error, 'There was an error while logging out');
    }
  }

  /** Sends password reset email */
  async forgetPassword(user: string): Promise<void> {
    try {
      await this.axios.post('/', {
        cmd: 'frappe.core.doctype.user.user.reset_password',
        user,
      });
    } catch (error) {
      handleError(error, 'There was an error sending password reset email');
    }
  }
}
