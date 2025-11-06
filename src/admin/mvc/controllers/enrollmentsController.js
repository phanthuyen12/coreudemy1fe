import { enrollmentsService } from "../services/enrollmentsServices.js";

export class enrollmentsController {
  constructor() {
    this.enrollments = [];
    this.loading = false;
    this.error = null;
  }

  async getEnrollments(filter) {
    this.loading = true;
    this.error = null;
    try {
      const enrollmentsData = await enrollmentsService.getEnrollments(filter);
      this.enrollments = enrollmentsData.data;
      return enrollmentsData;
    } catch (err) {
      this.error = err.message;
      throw err;
    } finally {
      this.loading = false;
    }
  }

  async createEnrollment(enrollment) {
    this.loading = true;
    this.error = null;
    try {
      const newEnrollment = await enrollmentsService.createEnrollment(enrollment);
      // this.enrollments.push(newEnrollment); // thể bổ sung nếu cần
      return newEnrollment;
    } catch (err) {
      this.error = err.message;
      throw err;
    } finally {
      this.loading = false;
    }
  }

  async updateEnrollment(id, updateData) {
    this.loading = true;
    this.error = null;
    try {
      const updated = await enrollmentsService.updateEnrollment(id, updateData);
      return updated;
    } catch (err) {
      this.error = err.message;
      throw err;
    } finally {
      this.loading = false;
    }
  }

  async deleteEnrollment(id) {
    this.loading = true;
    this.error = null;
    try {
      const res = await enrollmentsService.deleteEnrollment(id);
      return res;
    } catch (err) {
      this.error = err.message;
      throw err;
    } finally {
      this.loading = false;
    }
  }
}










