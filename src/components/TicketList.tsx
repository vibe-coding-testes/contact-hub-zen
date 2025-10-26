import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Mail, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Ticket } from "@/types/ticket";

interface TicketListProps {
  tickets: Ticket[];
  onTicketClick?: (ticket: Ticket) => void;
}

const channelIcons = {
  whatsapp: Phone,
  email: Mail,
  chat: MessageSquare,
};

const statusColors = {
  novo: "bg-warning text-warning-foreground",
  em_andamento: "bg-primary text-primary-foreground",
  resolvido: "bg-accent text-accent-foreground",
};

const statusLabels = {
  novo: "Novo",
  em_andamento: "Em Andamento",
  resolvido: "Resolvido",
};

const priorityColors = {
  baixa: "bg-muted text-muted-foreground",
  media: "bg-warning/20 text-warning-foreground border border-warning",
  alta: "bg-destructive/20 text-destructive-foreground border border-destructive",
};

const priorityLabels = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
};

const topicLabels: Record<string, string> = {
  geral: "Geral",
  suporte: "Suporte",
  comercial: "Comercial",
  financeiro: "Financeiro",
};

const formatLastUpdate = (value?: string) => {
  if (!value) return "--";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? value
    : parsed.toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
      });
};

export const TicketList = ({ tickets, onTicketClick }: TicketListProps) => {
  const orderedTickets = [...tickets].sort((a, b) => {
    const aDate = new Date(a.lastUpdate ?? a.updatedAt ?? 0).getTime();
    const bDate = new Date(b.lastUpdate ?? b.updatedAt ?? 0).getTime();
    return bDate - aDate;
  });
  return (
    <div className="space-y-3">
      {orderedTickets.map((ticket) => {
        const ChannelIcon = channelIcons[ticket.channel];
        const displayName =
          ticket.client?.name ||
          ticket.clientName ||
          ticket.client?.whatsapp ||
          ticket.client?.email ||
          "Cliente";
        const contactInfo = ticket.client?.email || ticket.client?.whatsapp;
        return (
          <Card
            key={ticket.id}
            className="p-4 cursor-pointer transition-all hover:shadow-[var(--shadow-elevated)] hover:scale-[1.01]"
            onClick={() => onTicketClick?.(ticket)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="mt-1">
                  <ChannelIcon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex flex-col">
                      <h3 className="font-semibold text-foreground truncate">
                        {displayName}
                      </h3>
                      {contactInfo && (
                        <span className="text-xs text-muted-foreground truncate">
                          {contactInfo}
                        </span>
                      )}
                    </div>
                    <Badge
                      className={cn("text-xs", statusColors[ticket.status])}
                    >
                      {statusLabels[ticket.status]}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground truncate mb-2">
                    <span className="truncate">{ticket.subject}</span>
                    {ticket.topic &&
                      !["geral", "whatsapp", "email", "chat"].includes(
                        ticket.topic
                      ) && (
                        <Badge variant="secondary" className="text-[10px]">
                          {topicLabels[ticket.topic] || ticket.topic}
                        </Badge>
                      )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge
                      variant="outline"
                      className={priorityColors[ticket.priority]}
                    >
                      {priorityLabels[ticket.priority]}
                    </Badge>
                    <span>•</span>
                    <span>
                      {formatLastUpdate(ticket.lastUpdate ?? ticket.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
