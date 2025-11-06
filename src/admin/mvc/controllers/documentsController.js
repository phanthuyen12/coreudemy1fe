import { documentsService } from "../services/documentsService.js";

export class documentsController {
  async list() {
    return documentsService.list();
  }

  async detail(id) {
    return documentsService.detail(id);
  }

  async create(payload) {
    return documentsService.create(payload);
  }

  async update(id, payload) {
    return documentsService.update(id, payload);
  }

  async remove(id) {
    return documentsService.remove(id);
  }
}




