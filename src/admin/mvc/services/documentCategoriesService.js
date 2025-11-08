import { API_BASE_URL } from "@/config/config.js";

export class documentCategoriesService {
  static async list() {
    const res = await fetch(`${API_BASE_URL}/api/categories`);
    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
  }

  static async detail(id) {
    const res = await fetch(`${API_BASE_URL}/api/categories/${id}`);
    if (!res.ok) throw new Error("Failed to fetch category detail");
    return res.json();
  }

  static async create(payload) {
    const res = await fetch(`${API_BASE_URL}/api/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Failed to create category");
    return res.json();
  }

  static async update(id, payload) {
    const res = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Failed to update category");
    return res.json();
  }

  static async remove(id) {
    const res = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
      method: "DELETE"
    });
    if (!res.ok) throw new Error("Failed to delete category");
    return res.json();
  }

  static async documentsByCategory(id) {
    const res = await fetch(`${API_BASE_URL}/api/categories/${id}/documents`);
    if (!res.ok) throw new Error("Failed to fetch documents by category");
    return res.json();
  }
}






