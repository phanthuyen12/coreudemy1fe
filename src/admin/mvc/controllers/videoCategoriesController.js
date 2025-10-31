import { videoCategoryService } from "../services/videoCategoriesServices.js";

export class videoCategoriesController {
  constructor() {
    this.categories = [];
    this.loading = false;
    this.error = null;
  }

  async createCategory(formData) {
    this.loading = true;
    this.error = null;
    const created = await videoCategoryService.createCategory(formData);
    return created;
  }

  async getCategories(filter) {
    this.loading = true;
    this.error = null;
    const data = await videoCategoryService.getCategories(filter);
    this.categories = data?.data || [];
    return data;
  }

  async updateCategory(id, formData) {
    this.loading = true;
    this.error = null;
    const updated = await videoCategoryService.updateCategory(id, formData);
    this.loading = false;
    return updated;
  }
  async getDetailCategory(id) {
    this.loading = true;
    this.error = null;
    const data = await videoCategoryService.getDetailCategorys(id);
    this.loading = false;
    return data;

  }
}



