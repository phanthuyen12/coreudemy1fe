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
}



