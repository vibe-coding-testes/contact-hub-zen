import { useState } from "react";
import { MetricCard } from "@/components/MetricCard";
import { TicketList } from "@/components/TicketList";
import { ClientHistory } from "@/components/ClientHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, CheckCircle2, Users, TrendingUp } from "lucide-react";
import { Ticket } from "@/types/ticket";

const mockTickets: Ticket[] = [
  {
    id: "1",
    clientName: "Maria Silva",
    subject: "Dúvida sobre produto XYZ",
    channel: "whatsapp" as const,
    status: "novo" as const,
    priority: "alta" as const,
    lastUpdate: "Há 5 minutos",
  },
  {
    id: "2",
    clientName: "João Santos",
    subject: "Solicitação de reembolso",
    channel: "email" as const,
    status: "em_andamento" as const,
    priority: "media" as const,
    lastUpdate: "Há 1 hora",
  },
  {
    id: "3",
    clientName: "Ana Costa",
    subject: "Problema com entrega",
    channel: "chat" as const,
    status: "resolvido" as const,
    priority: "baixa" as const,
    lastUpdate: "Há 3 horas",
  },
  {
    id: "4",
    clientName: "Carlos Oliveira",
    subject: "Informações sobre garantia",
    channel: "whatsapp" as const,
    status: "novo" as const,
    priority: "media" as const,
    lastUpdate: "Há 30 minutos",
  },
];

const mockHistory = [
  {
    id: "1",
    channel: "whatsapp" as const,
    message: "Cliente solicitou informações sobre produto XYZ",
    timestamp: "Hoje, 14:30",
    status: "novo" as const,
  },
  {
    id: "2",
    channel: "email" as const,
    message: "Enviado catálogo de produtos solicitado",
    timestamp: "Ontem, 09:15",
    status: "resolvido" as const,
  },
  {
    id: "3",
    channel: "chat" as const,
    message: "Dúvida sobre formas de pagamento",
    timestamp: "15/10/2025, 16:45",
    status: "resolvido" as const,
  },
];

const Index = () => {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-[var(--shadow-card)]">
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-foreground">Sistema de Atendimento Multicanal</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestão unificada de tickets e clientes</p>
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
                <TicketList tickets={mockTickets} onTicketClick={setSelectedTicket} />
              </TabsContent>
              <TabsContent value="whatsapp">
                <TicketList 
                  tickets={mockTickets.filter(t => t.channel === "whatsapp")} 
                  onTicketClick={setSelectedTicket}
                />
              </TabsContent>
              <TabsContent value="email">
                <TicketList 
                  tickets={mockTickets.filter(t => t.channel === "email")} 
                  onTicketClick={setSelectedTicket}
                />
              </TabsContent>
              <TabsContent value="chat">
                <TicketList 
                  tickets={mockTickets.filter(t => t.channel === "chat")} 
                  onTicketClick={setSelectedTicket}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div>
            {selectedTicket ? (
              <ClientHistory
                clientName={selectedTicket.clientName}
                clientEmail={`${selectedTicket.clientName.toLowerCase().replace(" ", ".")}@email.com`}
                history={mockHistory}
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
