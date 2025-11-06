import { API_BASE_URL } from "@/config/config.js";

export const documentApi = {
  async listCategories() {
    const res = await fetch(`${API_BASE_URL}/api/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    const data = await res.json();
    return Array.isArray(data) ? data : (data?.data ?? data?.items ?? []);
  },
  async listDocuments() {
    const res = await fetch(`${API_BASE_URL}/api/documents`);
    if (!res.ok) throw new Error('Failed to fetch documents');
    const data = await res.json();
    return Array.isArray(data) ? data : (data?.data ?? data?.items ?? []);
  },
  async listDocumentsByCategory(categoryId) {
    const res = await fetch(`${API_BASE_URL}/api/categories/${categoryId}/documents`);
    if (!res.ok) throw new Error('Failed to fetch documents by category');
    const data = await res.json();
    return Array.isArray(data) ? data : (data?.data ?? data?.items ?? []);
  },
  async getDocument(id) {
    const res = await fetch(`${API_BASE_URL}/api/documents/${id}`);
    if (!res.ok) throw new Error('Failed to fetch document');
    const data = await res.json();
    return data?.data ?? data;
  }
};


