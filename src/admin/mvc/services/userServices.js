import { API_BASE_URL } from "../../../config/config.js";

export class UserService {
  // Get info user with Bearer token
  static async GetInfoUser(token) {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ thêm token vào header
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch user info");
    }

    return res.json();
  }
  static async UpdateInfoUser(token, id, email, username) {
    const res = await fetch(`${API_BASE_URL}/user/${id}/profile`, { 
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: email,
        username: username,
      }),
      
    });
        if (!res.ok) {
      throw new Error("Failed to fetch user info");
    }

    return res.json();

  }

  static async ChangePassword(email, passwordLast, passwordNew,token) {
    const res = await fetch(`${API_BASE_URL}/user/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email: email,
        oldPassword: passwordLast,
        newPassword: passwordNew,
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to change password");
    }

    return res.json();
  }
}
