import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageSquare, Mail, Phone, Clock } from "lucide-react";

interface HistoryItem {
  id: string;
  channel: "whatsapp" | "email" | "chat";
  message: string;
  timestamp: string;
  status: "novo" | "em_andamento" | "resolvido";
  fromClient: boolean;
}

interface ClientHistoryProps {
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  history: HistoryItem[];
  ticketStatus: "novo" | "em_andamento" | "resolvido";
  ticketTopic?: string;
  onToggleStatus?: () => void;
  onTopicChange?: (topic: string) => void;
  statusLoading?: boolean;
  topicLoading?: boolean;
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

const originLabels = {
  client: "Cliente",
  agent: "Equipe",
};

const statusLabels = {
  novo: "Novo",
  em_andamento: "Em Andamento",
  resolvido: "Resolvido",
};

const topicOptions = [
  { value: "geral", label: "Geral" },
  { value: "suporte", label: "Suporte" },
  { value: "comercial", label: "Comercial" },
  { value: "financeiro", label: "Financeiro" },
];

export const ClientHistory = ({
  clientName,
  clientEmail,
  clientPhone,
  history,
  ticketStatus,
  ticketTopic,
  onToggleStatus,
  onTopicChange,
  statusLoading,
  topicLoading,
}: ClientHistoryProps) => {
  const topicValue = ticketTopic ?? "geral";
  const handleTopicChange = (value: string) => {
    if (onTopicChange) {
      onTopicChange(value);
    }
  };
  const availableTopicOptions = topicOptions.some(
    (option) => option.value === topicValue
  )
    ? topicOptions
    : [...topicOptions, { value: topicValue, label: topicValue }];
  const [showAllMessages, setShowAllMessages] = useState(false);
  const hasMoreMessages = history.length > 1;
  const visibleHistory = showAllMessages ? history : history.slice(0, 1);
  const handleHistoryToggle = () => {
    if (!hasMoreMessages) return;
    setShowAllMessages((prev) => !prev);
  };

  useEffect(() => {
    setShowAllMessages(false);
  }, [history]);

  return (
    <Card className="shadow-[var(--shadow-elevated)]">
      <CardHeader className="space-y-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">{clientName}</CardTitle>
              {(clientEmail || clientPhone) && (
                <div className="flex flex-col gap-1 mt-1">
                  {clientEmail && (
                    <p className="text-sm text-muted-foreground">
                      {clientEmail}
                    </p>
                  )}
                  {clientPhone && (
                    <p className="text-sm text-muted-foreground">
                      {clientPhone}
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge className={statusColors[ticketStatus]} variant="secondary">
                {statusLabels[ticketStatus]}
              </Badge>
              {onToggleStatus && (
                <Button
                  size="sm"
                  variant={ticketStatus === "resolvido" ? "outline" : "default"}
                  onClick={onToggleStatus}
                  disabled={statusLoading}
                >
                  {ticketStatus === "resolvido"
                    ? "Reabrir ticket"
                    : "Marcar como resolvido"}
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <span className="text-xs font-medium uppercase text-muted-foreground">
            Assunto
          </span>
          <Select
            value={topicValue}
            onValueChange={handleTopicChange}
            disabled={!onTopicChange || topicLoading}
          >
            <SelectTrigger className="w-full sm:w-60">
              <SelectValue placeholder="Selecione um assunto" />
            </SelectTrigger>
            <SelectContent>
              {availableTopicOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Histórico Unificado
            </h3>
            {history.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhuma interação registrada até o momento.
              </p>
            ) : (
              <div className="space-y-3">
                {hasMoreMessages && !showAllMessages && (
                  <p className="text-xs text-muted-foreground">
                    Mostrando a última mensagem. Clique para ver todo o
                    histórico.
                  </p>
                )}
                {hasMoreMessages && showAllMessages && (
                  <p className="text-xs text-muted-foreground">
                    Exibindo todas as mensagens deste atendimento. Clique para
                    ocultar novamente.
                  </p>
                )}
                {visibleHistory.map((item, index) => {
                  const ChannelIcon = channelIcons[item.channel];
                  return (
                    <div
                      key={item.id}
                      role={hasMoreMessages ? "button" : undefined}
                      tabIndex={hasMoreMessages ? 0 : undefined}
                      onClick={handleHistoryToggle}
                      onKeyDown={(event) => {
                        if (!hasMoreMessages) return;
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          handleHistoryToggle();
                        }
                      }}
                      className={hasMoreMessages ? "cursor-pointer" : undefined}
                    >
                      <div className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="rounded-full bg-primary/10 p-2">
                            <ChannelIcon className="h-4 w-4 text-primary" />
                          </div>
                          {index < visibleHistory.length - 1 && (
                            <div className="w-px h-full bg-border mt-2" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-muted-foreground">
                              {channelLabels[item.channel]}
                            </span>
                            <Badge
                              className={statusColors[item.status]}
                              variant="secondary"
                            >
                              {item.status === "novo" && "Novo"}
                              {item.status === "em_andamento" && "Em Andamento"}
                              {item.status === "resolvido" && "Resolvido"}
                            </Badge>
                            <Badge variant="outline">
                              {item.fromClient
                                ? originLabels.client
                                : originLabels.agent}
                            </Badge>
                          </div>
                          <p className="text-sm text-foreground mb-1">
                            {item.message}
                          </p>
                          <span className="text-xs text-muted-foreground">
                            {item.timestamp}
                          </span>
                        </div>
                      </div>
                      {index < visibleHistory.length - 1 && (
                        <Separator className="my-2" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
