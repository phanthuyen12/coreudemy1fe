import { API_BASE_URL } from "../../../config/config.js";

export class AuthService {
  // Login user with email and password
  static async Login(email, password) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: "Login failed" }));
      throw new Error(errorData.error || "Failed to login");
    }

    return res.json();
  }

  // Forgot password - Request password reset email
  static async ForgotPassword(email, resetUrl = null) {
    const body = { email };
    if (resetUrl) {
      body.resetUrl = resetUrl;
    }

    const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: "Failed to send reset email" }));
      const errorMessage = errorData.message || errorData.error || "Failed to send reset email";
      // Handle array of messages (validation errors)
      const message = Array.isArray(errorMessage) ? errorMessage.join(", ") : errorMessage;
      throw new Error(message);
    }

    return res.json();
  }

  // Reset password - Set new password using token
  static async ResetPassword(token, newPassword) {
    const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        newPassword: newPassword,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: "Failed to reset password" }));
      const errorMessage = errorData.message || errorData.error || "Failed to reset password";
      // Handle array of messages (validation errors)
      const message = Array.isArray(errorMessage) ? errorMessage.join(", ") : errorMessage;
      throw new Error(message);
    }

    return res.json();
  }
}






