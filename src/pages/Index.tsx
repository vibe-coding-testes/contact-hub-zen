import { useState, useEffect, useMemo, useCallback } from "react";
import { MetricCard } from "@/components/MetricCard";
import { TicketList } from "@/components/TicketList";
import { ClientHistory } from "@/components/ClientHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, CheckCircle2, Users, TrendingUp } from "lucide-react";
import { Ticket } from "@/types/ticket";
import { getTickets, updateTicketStatus, updateTicket } from "@/services/api";

const Index = () => {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [topicLoading, setTopicLoading] = useState(false);

  const fetchTickets = useCallback(async (withSpinner = false) => {
    if (withSpinner) {
      setLoading(true);
    }
    try {
      const response = await getTickets();
      setTickets(response.data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      if (withSpinner) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const wrappedFetch = async (withSpinner = false) => {
      if (!isMounted) return;
      await fetchTickets(withSpinner);
    };

    wrappedFetch(true);
    const intervalId = setInterval(() => wrappedFetch(false), 5000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [fetchTickets]);

  const selectedTicket = useMemo(() => {
    if (!selectedTicketId) return null;
    return tickets.find((ticket) => ticket.id === selectedTicketId) ?? null;
  }, [tickets, selectedTicketId]);

  const formatTimestamp = (value?: string) => {
    if (!value) return "--";
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? value
      : date.toLocaleString("pt-BR", {
          dateStyle: "short",
          timeStyle: "short",
        });
  };

  const ticketHistory = useMemo(() => {
    if (!selectedTicket?.messages?.length) return [];

    return [...selectedTicket.messages]
      .map((msg, index) => ({
        id: `${selectedTicket.id}-${index}`,
        channel: selectedTicket.channel,
        message: msg.message,
        timestamp: formatTimestamp(msg.timestamp),
        status: selectedTicket.status,
        fromClient: msg.fromClient ?? true,
        sortKey: new Date(
          msg.timestamp ?? selectedTicket.updatedAt ?? 0
        ).getTime(),
      }))
      .sort((a, b) => b.sortKey - a.sortKey)
      .map(({ sortKey, ...rest }) => rest);
  }, [selectedTicket]);

  useEffect(() => {
    if (selectedTicketId || tickets.length === 0) return;
    setSelectedTicketId(tickets[0].id);
  }, [tickets, selectedTicketId]);

  useEffect(() => {
    setStatusLoading(false);
    setTopicLoading(false);
  }, [selectedTicketId]);

  const handleToggleStatus = useCallback(async () => {
    if (!selectedTicket) return;
    setStatusLoading(true);
    try {
      const nextStatus =
        selectedTicket.status === "resolvido" ? "em_andamento" : "resolvido";
      await updateTicketStatus(selectedTicket.id, nextStatus);
      await fetchTickets();
    } catch (error) {
      console.error("Error updating ticket status:", error);
    } finally {
      setStatusLoading(false);
    }
  }, [selectedTicket, fetchTickets]);

  const handleTopicChange = useCallback(
    async (topic: string) => {
      if (!selectedTicket) return;
      if (selectedTicket.topic === topic) return;
      setTopicLoading(true);
      try {
        await updateTicket(selectedTicket.id, { topic });
        await fetchTickets();
      } catch (error) {
        console.error("Error updating ticket topic:", error);
      } finally {
        setTopicLoading(false);
      }
    },
    [selectedTicket, fetchTickets]
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-[var(--shadow-card)]">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-foreground">
            Sistema de Atendimento Multicanal
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestão unificada de tickets e clientes
          </p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <MetricCard
            title="Tickets Ativos"
            value="24"
            icon={Users}
            trend={{ value: 12, isPositive: false }}
          />
          <MetricCard
            title="Tempo Médio de Resposta"
            value="8 min"
            icon={Clock}
            trend={{ value: 15, isPositive: true }}
          />
          <MetricCard
            title="Resolução 1º Contato"
            value="78%"
            icon={CheckCircle2}
            trend={{ value: 5, isPositive: true }}
          />
          <MetricCard
            title="Satisfação"
            value="4.8"
            icon={TrendingUp}
            trend={{ value: 3, isPositive: true }}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Tabs defaultValue="todos" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="todos">Todos</TabsTrigger>
                <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
                <TabsTrigger value="email">E-mail</TabsTrigger>
                <TabsTrigger value="chat">Chat Web</TabsTrigger>
              </TabsList>
              <TabsContent value="todos">
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <TicketList
                    tickets={tickets}
                    onTicketClick={(ticket) => setSelectedTicketId(ticket.id)}
                  />
                )}
              </TabsContent>
              <TabsContent value="whatsapp">
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <TicketList
                    tickets={tickets.filter((t) => t.channel === "whatsapp")}
                    onTicketClick={(ticket) => setSelectedTicketId(ticket.id)}
                  />
                )}
              </TabsContent>
              <TabsContent value="email">
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <TicketList
                    tickets={tickets.filter((t) => t.channel === "email")}
                    onTicketClick={(ticket) => setSelectedTicketId(ticket.id)}
                  />
                )}
              </TabsContent>
              <TabsContent value="chat">
                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <TicketList
                    tickets={tickets.filter((t) => t.channel === "chat")}
                    onTicketClick={(ticket) => setSelectedTicketId(ticket.id)}
                  />
                )}
              </TabsContent>
            </Tabs>
          </div>

          <div>
            {selectedTicket ? (
              <ClientHistory
                clientName={
                  selectedTicket.client?.name ||
                  selectedTicket.clientName ||
                  selectedTicket.client?.whatsapp ||
                  "Cliente"
                }
                clientEmail={selectedTicket.client?.email}
                clientPhone={
                  selectedTicket.client?.whatsapp ||
                  selectedTicket.client?.phones?.[0]
                }
                history={ticketHistory}
                ticketStatus={selectedTicket.status}
                ticketTopic={selectedTicket.topic}
                onToggleStatus={handleToggleStatus}
                onTopicChange={handleTopicChange}
                statusLoading={statusLoading}
                topicLoading={topicLoading}
              />
            ) : (
              <div className="rounded-lg border bg-card p-8 text-center shadow-[var(--shadow-card)]">
                <p className="text-muted-foreground">
                  Selecione um ticket para ver o histórico do cliente
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
