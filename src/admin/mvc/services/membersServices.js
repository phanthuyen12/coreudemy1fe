import {API_BASE_URL} from '../../../config/config.js'
export class memeberService{
    static async createMemeber(user){
      const response = await fetch(`${API_BASE_URL}/user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });
        if(!response.ok) throw new Error('Faild to fetch user')
        return response.json();
    }
static async changePassword(email, oldPassword, newPassword) {
    const response = await fetch(`${API_BASE_URL}/user/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, oldPassword, newPassword }),
    });
    if (!response.ok) throw new Error('Failed to change password');
    return response.json();
  }    static async getMemeber(filter){
      const response = await fetch(`${API_BASE_URL}/user?${new URLSearchParams(filter)}`);
        if(!response.ok) throw new Error('Faild to fetch user')
        return response.json();
    }
    static async getDetailMemeber(id){ 
      const response = await fetch(`${API_BASE_URL}/user/${id}`);
        if(!response.ok) throw new Error('Faild to fetch user')
        return response.json();
    }

    static async activeMemeber(id){
      const response = await fetch(`${API_BASE_URL}/user/inactive/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' } 
      });
        if(!response.ok) throw new Error('Faild to activate user')
        return response.json(); 
    }
    static async getInfoToken(token){
      const response = await fetch(`${API_BASE_URL}/auth/me/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // gắn token vào đây
      },
    });
          if(!response.ok) throw new Error('Faild to activate user')
        return response.json();
  
  }
  }