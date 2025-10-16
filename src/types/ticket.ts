export interface Ticket {
  id: string;
  clientName: string;
  subject: string;
  channel: "whatsapp" | "email" | "chat";
  status: "novo" | "em_andamento" | "resolvido";
  priority: "baixa" | "media" | "alta";
  lastUpdate: string;
}
