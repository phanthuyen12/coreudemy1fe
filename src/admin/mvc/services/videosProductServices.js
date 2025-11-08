
import { API_BASE_URL } from "../../../config/config.js";

export class videoProductService {
    static async createVideoProduct(formData) {
        const response = await fetch(`${API_BASE_URL}/videos`, {
            method: "POST",
            body: formData,
        });
        if (!response.ok) throw new Error("Failed to create video product");
        return response.json(); 
    }
    static async getVideoProducts(filter) {
        const query = await new URLSearchParams(filter).toString();
        const response = await fetch(`${API_BASE_URL}/videos/filter?${query}`);
        if (!response.ok) throw new Error("Failed to fetch video products");
        return response.json();
    }
    static async getVideoProductById(id) {
        const response = await fetch(`${API_BASE_URL}/videos/${id}`);
        if (!response.ok) throw new Error("Failed to fetch video product");
        return response.json();
    }
    static async updateVideoProduct(id, formData) { 
        const response = await fetch(`${API_BASE_URL}/videos/update/${id}`, {
            method: "POST",
            body: formData,
        });
        if (!response.ok) throw new Error("Failed to update video product");
        return response.json();
    }

    static async deleteVideo(id) {
        const response = await fetch(`${API_BASE_URL}/videos/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to delete video");
        }
        return response.json();
    }
}