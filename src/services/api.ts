import axios from "axios";
import { Ticket } from "@/types/ticket";

const API_BASE_URL = "http://localhost:5001/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getTickets = () => api.get<Ticket[]>("/tickets");
export const getTicket = (id: string) => api.get<Ticket>(`/tickets/${id}`);
export const createTicket = (data: Partial<Ticket>) =>
  api.post<Ticket>("/tickets", data);
export const updateTicket = (id: string, data: Partial<Ticket>) =>
  api.put<Ticket>(`/tickets/${id}`, data);
export const updateTicketStatus = (id: string, status: Ticket["status"]) =>
  api.patch<Ticket>(`/tickets/${id}/status`, { status });
export const deleteTicket = (id: string) => api.delete(`/tickets/${id}`);
export const addMessageToTicket = (
  id: string,
  message: string,
  fromClient: boolean = true
) => api.post(`/tickets/${id}/messages`, { message, fromClient });

// Twilio WhatsApp
export const sendWhatsAppMessage = (to: string, message: string) =>
  api.post("/integrations/whatsapp/send", { to, message });
