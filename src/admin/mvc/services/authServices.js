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
}



