import { API_BASE_URL } from "@/config/config.js";

export class documentsService {
  static async list() {
    const res = await fetch(`${API_BASE_URL}/api/documents`);
    if (!res.ok) throw new Error("Failed to fetch documents");
    return res.json();
  }

  static async detail(id) {
    const res = await fetch(`${API_BASE_URL}/api/documents/${id}`);
    if (!res.ok) throw new Error("Failed to fetch document detail");
    return res.json();
  }

  static async create(payload) {
    const res = await fetch(`${API_BASE_URL}/api/documents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Failed to create document");
    return res.json();
  }

  static async update(id, payload) {
    const res = await fetch(`${API_BASE_URL}/api/documents/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Failed to update document");
    return res.json();
  }

  static async remove(id) {
    const res = await fetch(`${API_BASE_URL}/api/documents/${id}`, {
      method: "DELETE"
    });
    if (!res.ok) throw new Error("Failed to delete document");
    return res.json();
  }
}




