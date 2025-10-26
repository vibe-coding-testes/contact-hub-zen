import { Client } from "@/types/client";

export interface Ticket {
  id: string;
  clientName: string;
  subject: string;
  channel: "whatsapp" | "email" | "chat";
  status: "novo" | "em_andamento" | "resolvido";
  priority: "baixa" | "media" | "alta";
  lastUpdate?: string;
  topic?: string;
  messages?: {
    message: string;
    timestamp?: string;
    fromClient: boolean;
  }[];
  createdAt?: string;
  updatedAt?: string;
  client?: Client;
}
