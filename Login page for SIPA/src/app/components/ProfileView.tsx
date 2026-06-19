import React, { useState, useRef } from "react";
import { User, Camera, Save, Shield } from "lucide-react";

interface ProfileViewProps {
  userEmail: string;
  userName: string;
  userAvatar: string | null;
  onSave: (name: string, avatar: string | null) => void;
}

export function ProfileView({ userEmail, userName, userAvatar, onSave }: ProfileViewProps) {
  const [nameInput, setNameInput] = useState(userName);
  const [avatarInput, setAvatarInput] = useState<string | null>(userAvatar);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarInput(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate a brief save delay for better UX
    await new Promise((r) => setTimeout(r, 600));
    onSave(nameInput, avatarInput);
    setIsSaving(false);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ background: "#F4F6FA" }}>
      {/* Header */}
      <div
        className="flex items-center gap-3 px-6 py-4 flex-shrink-0"
        style={{ background: "#ffffff", borderBottom: "1px solid rgba(11,31,58,0.08)" }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #0B1F3A, #1A4A7A)" }}
        >
          <User size={16} color="white" />
        </div>
        <div>
          <h2 className="text-sm" style={{ color: "#0B1F3A", fontWeight: 600 }}>
            Profil Ayarları
          </h2>
          <div className="text-xs" style={{ color: "#5A6880" }}>
            Hesap bilgilerinizi düzenleyin
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 max-w-2xl w-full mx-auto">
        <div
          className="rounded-2xl p-8"
          style={{ background: "#ffffff", border: "1px solid rgba(11,31,58,0.08)", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}
        >
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative mb-4 group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div
                className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center"
                style={{ background: "rgba(232,132,26,0.15)", border: "4px solid #ffffff", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}
              >
                {avatarInput ? (
                  <img src={avatarInput} alt="Profil" className="w-full h-full object-cover" />
                ) : (
                  <User size={40} style={{ color: "#E8841A" }} />
                )}
              </div>
              <div
                className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera size={24} color="white" />
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
            <p className="text-sm font-medium" style={{ color: "#0B1F3A" }}>Profil Fotoğrafını Değiştir</p>
            <p className="text-xs mt-1" style={{ color: "#8AAAC8" }}>Tıklayarak yeni bir resim yükleyin</p>
          </div>

          <div className="space-y-6">
            {/* Name Input */}
            <div>
              <label className="block text-sm mb-1.5" style={{ color: "#0B1F3A", fontWeight: 500 }}>
                Ad Soyad
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
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

            {/* Email Input (Disabled) */}
            <div>
              <label className="block text-sm mb-1.5" style={{ color: "#0B1F3A", fontWeight: 500 }}>
                Kurumsal E-posta <span className="text-xs ml-2 px-2 py-0.5 rounded-full" style={{ background: "#F3F4F6", color: "#6B7280" }}>Değiştirilemez</span>
              </label>
              <input
                type="email"
                value={userEmail}
                disabled
                className="w-full px-4 py-2.5 rounded-lg border outline-none cursor-not-allowed"
                style={{
                  background: "#F9FAFB",
                  borderColor: "rgba(11,31,58,0.1)",
                  color: "#9CA3AF",
                  fontSize: "15px",
                }}
              />
            </div>

            {/* Password Input (Disabled) */}
            <div>
              <label className="block text-sm mb-1.5 flex items-center gap-2" style={{ color: "#0B1F3A", fontWeight: 500 }}>
                Şifre <Shield size={14} style={{ color: "#E8841A" }} />
              </label>
              <input
                type="password"
                value="********"
                disabled
                className="w-full px-4 py-2.5 rounded-lg border outline-none cursor-not-allowed"
                style={{
                  background: "#F9FAFB",
                  borderColor: "rgba(11,31,58,0.1)",
                  color: "#9CA3AF",
                  fontSize: "15px",
                  letterSpacing: "0.2em"
                }}
              />
              <p className="text-xs mt-2" style={{ color: "#8AAAC8" }}>
                Şifrenizi değiştirmek için bilgi işlem departmanı ile iletişime geçin.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2.5 rounded-lg transition-all flex items-center gap-2"
              style={{
                background: isSaving ? "#C26B14" : "#E8841A",
                color: "#ffffff",
                fontWeight: 600,
                fontSize: "14px",
                cursor: isSaving ? "not-allowed" : "pointer",
              }}
              onMouseEnter={(e) => !isSaving && ((e.target as HTMLElement).style.background = "#D47316")}
              onMouseLeave={(e) => !isSaving && ((e.target as HTMLElement).style.background = "#E8841A")}
            >
              {isSaving ? (
                <span className="inline-block w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <Save size={16} />
              )}
              Değişiklikleri Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
