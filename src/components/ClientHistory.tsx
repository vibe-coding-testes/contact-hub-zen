import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, Mail, Phone, Clock } from "lucide-react";

interface HistoryItem {
  id: string;
  channel: "whatsapp" | "email" | "chat";
  message: string;
  timestamp: string;
  status: "novo" | "em_andamento" | "resolvido";
}

interface ClientHistoryProps {
  clientName: string;
  clientEmail: string;
  history: HistoryItem[];
}

const channelIcons = {
  whatsapp: Phone,
  email: Mail,
  chat: MessageSquare,
};

const channelLabels = {
  whatsapp: "WhatsApp",
  email: "E-mail",
  chat: "Chat Web",
};

const statusColors = {
  novo: "bg-warning text-warning-foreground",
  em_andamento: "bg-primary text-primary-foreground",
  resolvido: "bg-accent text-accent-foreground",
};

export const ClientHistory = ({ clientName, clientEmail, history }: ClientHistoryProps) => {
  return (
    <Card className="shadow-[var(--shadow-elevated)]">
      <CardHeader>
        <CardTitle className="text-2xl">{clientName}</CardTitle>
        <p className="text-sm text-muted-foreground">{clientEmail}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Histórico Unificado
            </h3>
            <div className="space-y-3">
              {history.map((item, index) => {
                const ChannelIcon = channelIcons[item.channel];
                return (
                  <div key={item.id}>
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="rounded-full bg-primary/10 p-2">
                          <ChannelIcon className="h-4 w-4 text-primary" />
                        </div>
                        {index < history.length - 1 && (
                          <div className="w-px h-full bg-border mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-muted-foreground">
                            {channelLabels[item.channel]}
                          </span>
                          <Badge className={statusColors[item.status]} variant="secondary">
                            {item.status === "novo" && "Novo"}
                            {item.status === "em_andamento" && "Em Andamento"}
                            {item.status === "resolvido" && "Resolvido"}
                          </Badge>
                        </div>
                        <p className="text-sm text-foreground mb-1">{item.message}</p>
                        <span className="text-xs text-muted-foreground">{item.timestamp}</span>
                      </div>
                    </div>
                    {index < history.length - 1 && <Separator className="my-2" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
