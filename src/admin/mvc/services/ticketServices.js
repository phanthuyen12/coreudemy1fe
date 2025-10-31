import {API_BASE_URL} from '../../../config/config.js'

export class ticketService {
  // Get all tickets for admin
  static async GetAllService() {
    const res = await fetch(`${API_BASE_URL}/tickets`);
    if (!res.ok) throw new Error("Failed to fetch tickets");
    return res.json();
  }

  // Get ticket details for admin
  static async GetDetailByIDAdminService(id) {
    const res = await fetch(`${API_BASE_URL}/tickets/${id}`);
    if (!res.ok) throw new Error("Failed to fetch ticket details");
    return res.json();
  }

  // Get tickets for a specific user
  static async getUserTickets(userId) {
    const res = await fetch(`${API_BASE_URL}/tickets/user/${userId}`);
    if (!res.ok) throw new Error("Failed to fetch user tickets");
    return res.json();
  }

  // Get ticket details for user
  static async getTicketDetails(ticketId) {
    const res = await fetch(`${API_BASE_URL}/tickets/${ticketId}`);
    if (!res.ok) throw new Error("Failed to fetch ticket details");
    return res.json();
  }

  // Create new ticket
  static async createTicket(ticketData) {
    const res = await fetch(`${API_BASE_URL}/tickets`, {
      method: "POST",
      body: ticketData, // FormData object
    });
    if (!res.ok) throw new Error("Failed to create ticket");
    return res.json();
  }

  // Send reply to ticket
  static async sendReply(replyData) {
    const res = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      body: replyData, // FormData object
    });
    if (!res.ok) throw new Error("Failed to send reply");
    return res.json();
  }
}