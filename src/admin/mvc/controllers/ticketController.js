import { ticketService } from "../services/ticketServices";

export class ticketController {
  constructor() {
    this.tickets = [];
    this.loading = false;
    this.error = null;
  }

  // Get all tickets for admin
  async getAllData() {
    this.loading = true;
    this.error = null;

    const tickets = await ticketService.GetAllService();
    return tickets;
  }

  // Get ticket details for admin
  async GetDetailByIDAdminServices(id) {
    this.loading = true;
    this.error = null;

    const ticket = await ticketService.GetDetailByIDAdminService(id);
    return ticket;
  }

  // Get tickets for a specific user
  async getUserTickets(userId) {
    this.loading = true;
    this.error = null;

    try {
      const tickets = await ticketService.getUserTickets(userId);
      this.tickets = tickets;
      return tickets;
    } catch (error) {
      this.error = error.message;
      throw error;
    } finally {
      this.loading = false;
    }
  }

  // Get ticket details for user
  async getTicketDetails(ticketId) {
    this.loading = true;
    this.error = null;

    try {
      const ticket = await ticketService.getTicketDetails(ticketId);
      return ticket;
    } catch (error) {
      this.error = error.message;
      throw error;
    } finally {
      this.loading = false;
    }
  }

  // Create new ticket
  async createTicket(ticketData) {
    this.loading = true;
    this.error = null;

    try {
      const newTicket = await ticketService.createTicket(ticketData);
      return newTicket;
    } catch (error) {
      this.error = error.message;
      throw error;
    } finally {
      this.loading = false;
    }
  }

  // Send reply to ticket
  async sendReply(replyData) {
    this.loading = true;
    this.error = null;

    try {
      const reply = await ticketService.sendReply(replyData);
      return reply;
    } catch (error) {
      this.error = error.message;
      throw error;
    } finally {
      this.loading = false;
    }
  }
}