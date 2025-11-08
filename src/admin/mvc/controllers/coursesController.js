import {courseService} from "../services/coursesServices.js";

export class coursesController {
  constructor() {
    this.courses = [];
    this.loading = false;
    this.error = null;
  }
  async createCourses(course) {
    console.log("controller", course);
    this.loading = true;
    this.error = null;

    const newCourses = await courseService.createCourses(course);
    // this.courses.push(course);
    return newCourses;
  }
  async getCourses(filter) {
    this.loading = true;
    this.error = null;
    
    const coursesData = await courseService.getCourses(filter);
    this.courses = coursesData.data; // hoặc coursesData.data.data tùy backend
    return coursesData;
  }
  async updateCourse(id,filter) {
    this.loading = true;
    this.error = null;
    
    const coursesData = await courseService.updateCourse(id,filter);
    this.loading = false;
    return coursesData;
  }
  async fechDataCoursesAndVideos(id){
    this.loading = true;
    const res = await courseService.getDetailCoursesAndCategories(id);
    return res;
  }

  async getHeadOfficeCourse(){
    this.loading = true;
    this.error = null;
    try {
      const res = await courseService.getHeadOfficeCourse();
      this.loading = false;
      return res;
    } catch (err) {
      this.error = err.message;
      this.loading = false;
      throw err;
    }
  }

  async deleteCourse(id) {
    this.loading = true;
    this.error = null;
    try {
      const result = await courseService.deleteCourse(id);
      this.loading = false;
      return result;
    } catch (err) {
      this.error = err.message;
      this.loading = false;
      throw err;
    }
  }
}