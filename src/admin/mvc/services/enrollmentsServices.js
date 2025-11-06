import { API_BASE_URL } from "../../../config/config.js";

export const enrollmentsService = {
  async getEnrollments(filter = {}) {
    // query param: ?user_id&course_id&status&page&limit
    const params = new URLSearchParams();
    if (filter.userId) params.append('user_id', filter.userId);
    if (filter.courseId) params.append('course_id', filter.courseId);
    if (filter.status) params.append('status', filter.status);
    if (filter.page) params.append('page', filter.page);
    if (filter.limit) params.append('limit', filter.limit);
    const res = await fetch(`${API_BASE_URL}/enrollments?${params.toString()}`);
    return await res.json();
  },
  async createEnrollment(payload) {
    const res = await fetch(`${API_BASE_URL}/enrollments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await res.json();
  },
  async updateEnrollment(id, payload) {
    const res = await fetch(`${API_BASE_URL}/enrollments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await res.json();
  },
  async deleteEnrollment(id) {
    const res = await fetch(`${API_BASE_URL}/enrollments/${id}`, {
      method: "DELETE" });
    return await res.json();
  }
}










