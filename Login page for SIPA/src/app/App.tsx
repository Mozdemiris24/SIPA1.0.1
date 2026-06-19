import { useState, useCallback } from "react";
import { LoginPage } from "./components/LoginPage";
import { Sidebar, ActiveView, ChatConversation } from "./components/Sidebar";
import { ChatView, Conversation, Message } from "./components/ChatView";
import { PdfView } from "./components/PdfView";
import { CreateView } from "./components/CreateView";

/* MARKER-MAKE-KIT-INVOKED */

// Demo AI responses for the chat
const AI_RESPONSES: Record<string, string> = {
  default: `Anlıyorum. İstanbul Enerji sistemleri hakkında size yardımcı olmaktan memnuniyet duyarım.\n\nBu konuda şunları yapabilirim:\n\n• Belgeleri analiz edip özetleyebilirim\n• Teknik raporlar hazırlayabilirim\n• Veri yorumlama ve öneri sunabilirim\n\nDaha spesifik bir soru sormak ister misiniz?`,
  rapor: `Haziran 2024 tüketim raporu incelendi.\n\n**Özet Bulgular:**\n• Toplam tüketim: 4.2 GWh (önceki aya göre %3.8 azalış)\n• Ortalama günlük tüketim: 140 MWh\n• Pik güç: 285 MW (18:30-19:30 arası)\n\n**Öneriler:**\n1. Pik saatlerde talep yönetimi uygulanması\n2. Güç faktörü kompanzasyonu optimizasyonu\n3. Yenilenebilir enerji entegrasyonunun artırılması`,
  fatura: `Fatura verileri analiz edildi.\n\n**Tasarruf Fırsatları:**\n\n1. **Reaktif güç cezaları** — Kompanzasyon sistemi güncellenerek yıllık ₺280.000 tasarruf\n2. **Pik saati yönetimi** — Yük kaydırma ile ₺150.000 kazanım\n3. **LED aydınlatma dönüşümü** — %40 aydınlatma gideri azalması\n\nToplam potansiyel tasarruf: **₺430.000/yıl**`,
};

function generateResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  if (lower.includes("rapor") || lower.includes("tüketim") || lower.includes("analiz")) {
    return AI_RESPONSES.rapor;
  }
  if (lower.includes("fatura") || lower.includes("tasarruf") || lower.includes("maliyet")) {
    return AI_RESPONSES.fatura;
  }
  return AI_RESPONSES.default;
}

const INITIAL_CONVERSATIONS: ChatConversation[] = [
  { id: "c1", title: "Tüketim raporu özeti", preview: "Haziran 2024 raporu analiz edildi", time: "14:32" },
  { id: "c2", title: "Fatura analizi", preview: "Tasarruf önerileri hazırlandı", time: "11:15" },
  { id: "c3", title: "Bakım takvimi", preview: "Q3 bakım planı oluşturuldu", time: "Dün" },
  { id: "c4", title: "Teknik rapor şablonu", preview: "Arıza bildirim formu hazırlandı", time: "Dün" },
  { id: "c5", title: "Sözleşme incelemesi", preview: "Tedarikçi sözleşmesi özeti", time: "Pzt" },
];

const INITIAL_CONV_DATA: Record<string, Conversation> = {
  c1: {
    id: "c1",
    title: "Tüketim raporu özeti",
    messages: [
      {
        id: "m1",
        role: "user",
        content: "Bu ay elektrik tüketim raporunu özetle",
        timestamp: new Date(Date.now() - 3600000),
      },
      {
        id: "m2",
        role: "assistant",
        content: AI_RESPONSES.rapor,
        timestamp: new Date(Date.now() - 3540000),
      },
    ],
  },
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [activeView, setActiveView] = useState<ActiveView>("chat");
  const [conversations, setConversations] = useState<ChatConversation[]>(INITIAL_CONVERSATIONS);
  const [convData, setConvData] = useState<Record<string, Conversation>>(INITIAL_CONV_DATA);
  const [activeConvId, setActiveConvId] = useState<string | null>("c1");
  const [isChatLoading, setIsChatLoading] = useState(false);

  const handleLogin = useCallback((email: string) => {
    setUserEmail(email);
    setIsLoggedIn(true);
  }, []);

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setUserEmail("");
  }, []);

  const handleNewConversation = useCallback(() => {
    const id = `c${Date.now()}`;
    const newConv: ChatConversation = {
      id,
      title: "Yeni Sohbet",
      preview: "Henüz mesaj yok",
      time: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }),
    };
    setConversations((prev) => [newConv, ...prev]);
    setConvData((prev) => ({ ...prev, [id]: { id, title: "Yeni Sohbet", messages: [] } }));
    setActiveConvId(id);
  }, []);

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!activeConvId) return;

      const userMsg: Message = {
        id: `msg-${Date.now()}`,
        role: "user",
        content,
        timestamp: new Date(),
      };

      setConvData((prev) => {
        const conv = prev[activeConvId] || { id: activeConvId, title: content.slice(0, 40), messages: [] };
        return {
          ...prev,
          [activeConvId]: { ...conv, messages: [...conv.messages, userMsg] },
        };
      });

      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConvId
            ? { ...c, title: content.slice(0, 35) + (content.length > 35 ? "..." : ""), preview: content.slice(0, 50), time: new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }) }
            : c
        )
      );

      setIsChatLoading(true);
      await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));

      const aiMsg: Message = {
        id: `msg-${Date.now()}-ai`,
        role: "assistant",
        content: generateResponse(content),
        timestamp: new Date(),
      };

      setConvData((prev) => {
        const conv = prev[activeConvId];
        return { ...prev, [activeConvId]: { ...conv, messages: [...conv.messages, aiMsg] } };
      });

      setIsChatLoading(false);
    },
    [activeConvId]
  );

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const activeConversation = activeConvId ? convData[activeConvId] ?? null : null;

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        conversations={conversations}
        activeConversationId={activeConvId}
        onConversationSelect={setActiveConvId}
        onNewConversation={handleNewConversation}
        onLogout={handleLogout}
        userEmail={userEmail}
      />
      <main className="flex-1 min-w-0 overflow-hidden">
        {activeView === "chat" && (
          <ChatView
            conversation={activeConversation}
            onSendMessage={handleSendMessage}
            isLoading={isChatLoading}
          />
        )}
        {activeView === "pdf" && <PdfView />}
        {activeView === "create" && <CreateView />}
      </main>
    </div>
  );
}
