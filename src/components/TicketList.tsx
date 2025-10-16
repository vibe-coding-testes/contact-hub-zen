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

export const TicketList = ({ tickets, onTicketClick }: TicketListProps) => {
  return (
    <div className="space-y-3">
      {tickets.map((ticket) => {
        const ChannelIcon = channelIcons[ticket.channel];
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
                    <h3 className="font-semibold text-foreground truncate">{ticket.clientName}</h3>
                    <Badge className={cn("text-xs", statusColors[ticket.status])}>
                      {statusLabels[ticket.status]}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate mb-2">{ticket.subject}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className={priorityColors[ticket.priority]}>
                      {priorityLabels[ticket.priority]}
                    </Badge>
                    <span>•</span>
                    <span>{ticket.lastUpdate}</span>
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
