import { UserService } from "../services/userServices.js";

export class userController {
  constructor() {
    this.tickets = [];
    this.loading = false;
    this.error = null;
  }
    async getInfoUser(token) {
      this.loading = true;
      this.error = null;
      try {
        const memeberData = await UserService.GetInfoUser(token);
        this.memeber = memeberData.data;
        return memeberData;
      } catch (err) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    }

    async updateInfoUser(token, id, email, username) {  
        this.loading = true;
        this.error = null;
        try {
            const res = await UserService.UpdateInfoUser(token, id, email, username);
            return res;
            } catch (err) {
            this.error = err.message;
            throw err;
            } finally {
            this.loading = false;
            }   
    }
    async changePassword(email, passwordLast, passwordNew, token) {    
        this.loading = true;
        this.error = null;
        try {
            const res = await UserService.ChangePassword(email, passwordLast, passwordNew, token);
            return res;
            } catch (err) {
            this.error = err.message;
            throw err;
            } finally {
            this.loading = false;
            }
    }
    
}