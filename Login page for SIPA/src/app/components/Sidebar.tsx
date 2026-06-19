import { FileText, MessageSquare, Sparkles, LogOut, Zap, Plus, ChevronRight, User, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";

export type ActiveView = "chat" | "pdf" | "create" | "profile";

export interface ChatConversation {
  id: string;
  title: string;
  preview: string;
  time: string;
  active?: boolean;
}

interface SidebarProps {
  activeView: ActiveView;
  onViewChange: (view: ActiveView) => void;
  conversations: ChatConversation[];
  activeConversationId: string | null;
  onConversationSelect: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation?: (id: string) => void;
  onLogout: () => void;
  userEmail: string;
  userName: string;
  userAvatar: string | null;
  onProfileClick: () => void;
}

const navItems: { id: ActiveView; label: string; icon: React.ReactNode }[] = [
  { id: "chat", label: "Chat", icon: <MessageSquare size={18} /> },
  { id: "pdf", label: "PDF Düzenleme", icon: <FileText size={18} /> },
  { id: "create", label: "Oluştur", icon: <Sparkles size={18} /> },
];

export function Sidebar({
  activeView,
  onViewChange,
  conversations,
  activeConversationId,
  onConversationSelect,
  onNewConversation,
  onLogout,
  onDeleteConversation,
  userEmail,
  userName,
  userAvatar,
  onProfileClick,
}: SidebarProps) {
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  return (
    <aside
      className="flex flex-col h-full w-64 flex-shrink-0"
      style={{ background: "#0B1F3A", borderRight: "1px solid rgba(255,255,255,0.07)" }}
    >
      {/* Brand */}
      <div
        className="flex items-center gap-3 px-5 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "#E8841A" }}
        >
          <img src={`${import.meta.env.BASE_URL}SIPAlogo.png?v=2`} alt="SIPA" className="w-6 h-6 object-contain" />
        </div>
        <div>
          <div className="text-white text-xs tracking-widest" style={{ fontWeight: 700, letterSpacing: "0.16em", lineHeight: 1.2 }}>
            SIPA
          </div>
          <div className="text-xs" style={{ color: "#8AAAC8", letterSpacing: "0.04em", lineHeight: 1.2 }}>
            İstanbul Enerji
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="px-3 pt-4 pb-2">
        <p className="px-2 mb-2 text-xs uppercase tracking-widest" style={{ color: "#5A7A9A", letterSpacing: "0.12em" }}>
          Menü
        </p>
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left group"
                  style={{
                    background: isActive ? "rgba(232,132,26,0.18)" : "transparent",
                    color: isActive ? "#E8841A" : "#8AAAC8",
                    fontWeight: isActive ? 600 : 400,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  <span style={{ color: isActive ? "#E8841A" : "#5A7A9A" }}>{item.icon}</span>
                  <span className="text-sm flex-1">{item.label}</span>
                  {isActive && <ChevronRight size={14} style={{ color: "#E8841A", opacity: 0.7 }} />}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Chat conversations */}
      {activeView === "chat" && (
        <div className="flex-1 flex flex-col min-h-0 px-3 pb-2">
          <div
            className="flex items-center justify-between px-2 py-2 mt-2 mb-1"
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
          >
            <p className="text-xs uppercase tracking-widest" style={{ color: "#5A7A9A", letterSpacing: "0.12em" }}>
              Son Sohbetler
            </p>
            <button
              onClick={onNewConversation}
              className="w-6 h-6 rounded-md flex items-center justify-center transition-colors"
              style={{ color: "#8AAAC8" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)";
                (e.currentTarget as HTMLElement).style.color = "#E8841A";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
                (e.currentTarget as HTMLElement).style.color = "#8AAAC8";
              }}
              title="Yeni sohbet"
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-0.5" style={{ scrollbarWidth: "none" }}>
            {conversations.map((conv) => {
              const isActive = conv.id === activeConversationId;
              return (
                <div key={conv.id} className="relative group">
                  <button
                    onClick={() => onConversationSelect(conv.id)}
                    className="w-full text-left px-3 py-2.5 rounded-lg transition-all"
                    style={{
                      background: isActive ? "rgba(232,132,26,0.14)" : "transparent",
                      border: isActive ? "1px solid rgba(232,132,26,0.25)" : "1px solid transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent";
                    }}
                  >
                    <div className="flex items-start justify-between gap-2 pr-6">
                      <p
                        className="text-xs truncate flex-1"
                        style={{ color: isActive ? "#F5A93A" : "#C8D8EC", fontWeight: isActive ? 600 : 400 }}
                      >
                        {conv.title}
                      </p>
                      <span className="text-xs flex-shrink-0" style={{ color: "#5A7A9A" }}>
                        {conv.time}
                      </span>
                    </div>
                    <p className="text-xs mt-0.5 truncate" style={{ color: "#5A7A9A" }}>
                      {conv.preview}
                    </p>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpenId(menuOpenId === conv.id ? null : conv.id);
                    }}
                    className={`absolute right-2 top-2 w-6 h-6 rounded flex items-center justify-center transition-colors ${menuOpenId === conv.id ? "opacity-100 bg-white/10" : "opacity-0 group-hover:opacity-100 hover:bg-white/10"}`}
                    style={{ color: "#8AAAC8" }}
                  >
                    <MoreHorizontal size={14} />
                  </button>

                  {menuOpenId === conv.id && (
                    <div 
                      className="absolute right-2 top-9 w-24 rounded-lg py-1 z-50 shadow-lg"
                      style={{ background: "#1A4A7A", border: "1px solid rgba(255,255,255,0.1)" }}
                    >
                      <button
                        className="w-full text-left px-3 py-1.5 text-xs text-red-400 hover:bg-white/10 flex items-center gap-2 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpenId(null);
                          if (onDeleteConversation) onDeleteConversation(conv.id);
                        }}
                      >
                        <Trash2 size={12} />
                        Sil
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeView !== "chat" && <div className="flex-1" />}

      {/* User section */}
      <div
        className="px-3 py-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.04)" }}>
          <button
            onClick={onProfileClick}
            className="flex flex-1 items-center gap-2.5 min-w-0 text-left transition-opacity hover:opacity-80"
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
              style={{ background: "rgba(232,132,26,0.25)" }}
            >
              {userAvatar ? (
                <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
              ) : (
                <User size={14} style={{ color: "#E8841A" }} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs truncate" style={{ color: "#C8D8EC", fontWeight: 500 }}>
                {userName}
              </p>
              <p className="text-xs truncate" style={{ color: "#5A7A9A" }}>
                {userEmail}
              </p>
            </div>
          </button>
          <button
            onClick={onLogout}
            className="w-6 h-6 flex items-center justify-center rounded-md transition-colors flex-shrink-0"
            style={{ color: "#5A7A9A" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#E8841A";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "#5A7A9A";
            }}
            title="Çıkış Yap"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
