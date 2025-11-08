import { API_BASE_URL } from "../../../config/config.js";

export class videoCategoryService {
  static async createCategory(formData) {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: "POST",
      
      body: formData,
    });
    if (!response.ok) throw new Error("Failed to create video category");
    return response.json();
  }

  static async getCategories(filter) {
    const response = await fetch(
      `${API_BASE_URL}/categories/filter?${new URLSearchParams(filter)}`
    );
    if (!response.ok) throw new Error("Failed to fetch video categories");
    return response.json();
  }

  static async updateCategory(id, formData) {
    const response = await fetch(`${API_BASE_URL}/categories/update/${id}`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) throw new Error("Failed to update video category");
    return response.json();
  }
  static async getDetailCategorys(id) { 
    // https://api.3hstation.com/categories/filter?courseId=1&limit=1000
    const response = await fetch(`${API_BASE_URL}/categories/filter/?courseId=${id}&limit=1000`);
    if (!response.ok) throw new Error("Failed to fetch video category details");
    return response.json();
  }
}



