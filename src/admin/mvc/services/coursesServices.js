import { API_BASE_URL } from "../../../config/config.js";
export class courseService {
  // static async getCourses(filter) {}
  static async createCourses(course) {
    const response = await fetch(`${API_BASE_URL}/courses`, {
      method: "POST",
    //   headers: { "Content-Type": "application/json" },
      body: course,
    });

    if (!response.ok) throw new Error("Faild to fetch courses");
    return response.json();
  }
    //  static async getMemeber(filter){
    //   const response = await fetch(`${API_BASE_URL}/user?${new URLSearchParams(filter)}`);
    //     if(!response.ok) throw new Error('Faild to fetch user')
    //     return response.json();
    // }
  static async getCourses(filter) {
    const response = await fetch(`${API_BASE_URL}/courses/filter?${new URLSearchParams(filter)}`);
    if (!response.ok) throw new Error("Faild to fetch courses");
    return response.json();
  }
  static async updateCourse(id,filter) {
    const response = await fetch(`${API_BASE_URL}/courses/update/${id}`, {
      method: "POST",
      body: filter,
    });
    if (!response.ok) throw new Error("Faild to fetch courses");
    return response.json()
    }
  static async getDetailCoursesAndCategories(id){
    const res = await fetch(`${API_BASE_URL}/courses/detail-course/${id}`);
    if(!res.ok) throw new Error("Faild to fetch courses");
    return res.json();
  }

  static async getHeadOfficeCourse(){
    const res = await fetch(`${API_BASE_URL}/courses/head-office`);
    if(!res.ok) throw new Error("Failed to fetch head office course");
    return res.json();
  }

  static async deleteCourse(id) {
    const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete course");
    }
    return response.json();
  }

  
}
