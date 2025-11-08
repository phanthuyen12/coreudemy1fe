import { documentCategoriesService } from "../services/documentCategoriesService.js";

export class documentCategoriesController {
  async list() {
    return documentCategoriesService.list();
  }

  async detail(id) {
    return documentCategoriesService.detail(id);
  }

  async create(payload) {
    return documentCategoriesService.create(payload);
  }

  async update(id, payload) {
    return documentCategoriesService.update(id, payload);
  }

  async remove(id) {
    return documentCategoriesService.remove(id);
  }

  async documentsByCategory(id) {
    return documentCategoriesService.documentsByCategory(id);
  }
}






