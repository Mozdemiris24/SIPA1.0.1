import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FloatingLogos } from "./FloatingLogos";

interface LoginPageProps {
  onLogin: (email: string, password: string) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("E-posta ve şifre alanları zorunludur.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    // Demo ortamında herhangi bir girişle kabul et
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen flex" style={{ background: "linear-gradient(135deg, #0B1F3A 0%, #1A4A7A 100%)" }}>
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden bg-[#0B1F3A]">
        {/* 3D Background Animation */}
        <FloatingLogos />

        {/* Foreground Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
          <div className="w-12 h-12 flex items-center justify-center">
            <img src={`${import.meta.env.BASE_URL}SIPAlogo.png?v=2`} alt="SIPA Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="text-white tracking-widest text-sm" style={{ fontWeight: 700, letterSpacing: "0.18em" }}>
              İSTANBUL ENERJİ
            </div>
            <div className="text-xs tracking-wider" style={{ color: "#E8841A", letterSpacing: "0.12em" }}>
              SIPA — Sistem İyileştirme ve Prosedür Asistanı
            </div>
          </div>
        </div>

        {/* Center quote */}
        <div className="relative">
          <p className="text-white text-xl leading-relaxed" style={{ fontWeight: 300 }}>
            Belgelerini düzenle, derin araştırma yap ve süreçlerini iyileştirecek uygulamalar oluştur.
          </p>
          <p className="mt-4 text-sm" style={{ color: "#8AAAC8" }}>
            İstanbul Enerji — Dijital Dönüşüm
          </p>
        </div>

        {/* Bottom features */}
        <div className="relative grid grid-cols-3 gap-4">
          {[
            { label: "PDF Düzenleme", desc: "Akıllı belge yönetimi" },
            { label: "AI Asistan", desc: "Anlık destek ve analiz" },
            { label: "İçerik Üretimi", desc: "Otomatik raporlama" },
          ].map((f) => (
            <div key={f.label} className="border rounded-lg p-3" style={{ borderColor: "rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)" }}>
              <div className="text-white text-sm" style={{ fontWeight: 600 }}>{f.label}</div>
              <div className="text-xs mt-0.5" style={{ color: "#8AAAC8" }}>{f.desc}</div>
            </div>
          ))}
        </div>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-8" style={{ background: "#F4F6FA" }}>
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 flex items-center justify-center">
              <img src={`${import.meta.env.BASE_URL}SIPAlogo.png?v=2`} alt="SIPA Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="text-sm tracking-widest" style={{ color: "#0B1F3A", fontWeight: 700 }}>İSTANBUL ENERJİ</div>
              <div className="text-xs" style={{ color: "#E8841A" }}>SIPA</div>
            </div>
          </div>

          <h1 className="mb-1" style={{ color: "#0B1F3A", fontWeight: 700 }}>Giriş Yapın</h1>
          <p className="text-sm mb-8" style={{ color: "#5A6880" }}>
            Kurumsal hesabınızla sisteme erişin.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm mb-1.5" style={{ color: "#0B1F3A", fontWeight: 500 }}>
                Kurumsal E-posta
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="asoyad@enerji.istanbul"
                className="w-full px-4 py-2.5 rounded-lg border outline-none transition-all"
                style={{
                  background: "#ffffff",
                  borderColor: "rgba(11,31,58,0.15)",
                  color: "#0B1F3A",
                  fontSize: "15px",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#E8841A")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(11,31,58,0.15)")}
              />
            </div>

            <div>
              <label className="block text-sm mb-1.5" style={{ color: "#0B1F3A", fontWeight: 500 }}>
                Şifre
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 pr-11 rounded-lg border outline-none transition-all"
                  style={{
                    background: "#ffffff",
                    borderColor: "rgba(11,31,58,0.15)",
                    color: "#0B1F3A",
                    fontSize: "15px",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#E8841A")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(11,31,58,0.15)")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
                  style={{ color: "#5A6880" }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div
                className="px-4 py-3 rounded-lg text-sm"
                style={{ background: "#FEF2F2", color: "#B91C1C", border: "1px solid #FECACA" }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg transition-all flex items-center justify-center gap-2"
              style={{
                background: loading ? "#C26B14" : "#E8841A",
                color: "#ffffff",
                fontWeight: 600,
                fontSize: "15px",
                cursor: loading ? "not-allowed" : "pointer",
              }}
              onMouseEnter={(e) => !loading && ((e.target as HTMLElement).style.background = "#D47316")}
              onMouseLeave={(e) => !loading && ((e.target as HTMLElement).style.background = "#E8841A")}
            >
              {loading ? (
                <>
                  <span
                    className="inline-block w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"
                  />
                  Giriş yapılıyor...
                </>
              ) : (
                "Giriş Yap"
              )}
            </button>
          </form>

          <p className="mt-8 text-xs text-center" style={{ color: "#8AAAC8" }}>
            © 2026 İstanbul Enerji A.Ş. — SIPA v1.0
          </p>
        </div>
      </div>
    </div>
  );
}
