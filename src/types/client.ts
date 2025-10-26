export interface ClientContact {
  type: "whatsapp" | "phone" | "email";
  value: string;
}

export interface Client {
  id: string;
  name?: string;
  email?: string;
  whatsapp?: string;
  phones?: string[];
  contacts?: ClientContact[];
  createdAt?: string;
  updatedAt?: string;
}
