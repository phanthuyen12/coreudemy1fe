import { memeberService } from "../services/membersServices";

export class memeberController {
  constructor() {
    this.memeber = [];
    this.loading = false;
    this.error = null;
  }

  // 🟢 Tạo mới member
  async createMemeber(user) {
    this.loading = true;
    this.error = null;
    try {
      const newMemeber = await memeberService.createMemeber(user);
      this.memeber.push(newMemeber);
      return newMemeber;
    } catch (err) {
      this.error = err.message;
      throw err;
    } finally {
      this.loading = false;
    }
  }

  // 🟢 Lấy danh sách member
  async getMemeber(filter) {
    this.loading = true;
    this.error = null;
    try {
      const memeberData = await memeberService.getMemeber(filter);
      this.memeber = memeberData.data;
      return memeberData;
    } catch (err) {
      this.error = err.message;
      throw err;
    } finally {
      this.loading = false;
    }
  }

  // 🟢 Lấy chi tiết member
  async getDetailMemebers(id) {
    this.loading = true;
    this.error = null;
    try {
      const memeberData = await memeberService.getDetailMemeber(id);
      this.memeber = memeberData.data;
      return memeberData;
    } catch (err) {
      this.error = err.message;
      throw err;
    } finally {
      this.loading = false;
    }
  }

  // 🟢 Bật/tắt trạng thái member
  async toggleMemberStatus(id) {
    this.loading = true;
    this.error = null;
    try {
      const memeberData = await memeberService.activeMemeber(id);
      return memeberData;
    } catch (err) {
      this.error = err.message;
      throw err;
    } finally {
      this.loading = false;
    }
  }

  // 🟢 Lấy thông tin token
  async getInfoToken(token) {
    try {
      const res = await memeberService.getInfoToken(token);
      return res;
    } catch (err) {
      this.error = err.message;
      throw err;
    }
  }

  // 🟢 Đổi mật khẩu
  async changePassword(email, oldPassword, newPassword) {
    this.loading = true;
    this.error = null;
    try {
      const res = await memeberService.changePassword(email, oldPassword, newPassword);
      return res;
    } catch (err) {
      this.error = err.message;
      throw err;
    } finally {
      this.loading = false;
    }
  }
}
