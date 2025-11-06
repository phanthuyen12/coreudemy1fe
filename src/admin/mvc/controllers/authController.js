import { AuthService } from "../services/authServices.js";

export class AuthController {
  constructor() {
    this.loading = false;
    this.error = null;
  }

  async login(email, password) {
    this.loading = true;
    this.error = null;
    try {
      const response = await AuthService.Login(email, password);
      
      // Check if response has access_token and user data
      if (response.access_token && response.user) {
        return {
          success: true,
          data: {
            access_token: response.access_token,
            user: response.user,
          },
        };
      }
      
      throw new Error("Invalid response format from server");
    } catch (err) {
      this.error = err.message;
      return {
        success: false,
        error: err.message,
      };
    } finally {
      this.loading = false;
    }
  }

  /**
   * Yêu cầu gửi email đặt lại mật khẩu
   * @param {string} email - Email của tài khoản cần đặt lại mật khẩu
   * @param {string} resetUrl - URL frontend để reset password (tùy chọn)
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  async forgotPassword(email, resetUrl = null) {
    this.loading = true;
    this.error = null;
    try {
      const response = await AuthService.ForgotPassword(email, resetUrl);
      
      return {
        success: true,
        data: response,
      };
    } catch (err) {
      this.error = err.message;
      return {
        success: false,
        error: err.message,
      };
    } finally {
      this.loading = false;
    }
  }

  /**
   * Đặt lại mật khẩu mới bằng token từ email
   * @param {string} token - Token từ link trong email
   * @param {string} newPassword - Mật khẩu mới (tối thiểu 6 ký tự)
   * @returns {Promise<{success: boolean, data?: object, error?: string}>}
   */
  async resetPassword(token, newPassword) {
    this.loading = true;
    this.error = null;
    try {
      // Validate input
      if (!token || token.trim() === "") {
        throw new Error("Token không được để trống");
      }
      if (!newPassword || newPassword.length < 6) {
        throw new Error("Mật khẩu mới phải có ít nhất 6 ký tự");
      }

      const response = await AuthService.ResetPassword(token, newPassword);
      
      return {
        success: true,
        data: response,
      };
    } catch (err) {
      this.error = err.message;
      return {
        success: false,
        error: err.message,
      };
    } finally {
      this.loading = false;
    }
  }
}






