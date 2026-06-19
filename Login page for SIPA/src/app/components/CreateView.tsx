import { useState } from "react";
import {
  FileText,
  BarChart3,
  Mail,
  ClipboardList,
  Presentation,
  AlertCircle,
  Sparkles,
  ChevronRight,
  Clock,
  CheckCircle2,
  Loader,
} from "lucide-react";

interface Template {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  fields: { label: string; placeholder: string; type: "text" | "textarea" | "select"; options?: string[] }[];
}

const TEMPLATES: Template[] = [
  {
    id: "report",
    title: "Teknik Rapor",
    description: "Profesyonel teknik raporlar ve analizler",
    icon: <FileText size={20} />,
    category: "Belge",
    fields: [
      { label: "Rapor Başlığı", placeholder: "Örn: Haziran 2024 Tüketim Analizi", type: "text" },
      { label: "Kapsam", placeholder: "Raporun içereceği konuları açıklayın...", type: "textarea" },
      { label: "Tür", placeholder: "", type: "select", options: ["Aylık Analiz", "Yıllık Değerlendirme", "Teknik İnceleme", "Acil Durum Raporu"] },
    ],
  },
  {
    id: "analysis",
    title: "Tüketim Analizi",
    description: "Enerji tüketim verileri analiz raporu",
    icon: <BarChart3 size={20} />,
    category: "Analiz",
    fields: [
      { label: "Dönem", placeholder: "Örn: Ocak - Haziran 2024", type: "text" },
      { label: "Tesis / Bölge", placeholder: "Hangi tesis veya bölgeyi analiz edeceksiniz?", type: "text" },
      { label: "Odak Alanı", placeholder: "", type: "select", options: ["Maliyetler", "Tasarruf Fırsatları", "Verimlilik", "Karşılaştırmalı Analiz"] },
    ],
  },
  {
    id: "email",
    title: "Kurumsal E-posta",
    description: "Profesyonel iş yazışmaları ve bildirimler",
    icon: <Mail size={20} />,
    category: "İletişim",
    fields: [
      { label: "Alıcı / Konu", placeholder: "Kime, hangi konu için?", type: "text" },
      { label: "E-posta İçeriği", placeholder: "İletmek istediğiniz mesajı kısaca belirtin...", type: "textarea" },
      { label: "Ton", placeholder: "", type: "select", options: ["Resmi", "Bilgilendirici", "Acil", "Teşekkür"] },
    ],
  },
  {
    id: "checklist",
    title: "Bakım Kontrol Listesi",
    description: "Periyodik bakım ve denetim listeleri",
    icon: <ClipboardList size={20} />,
    category: "Operasyon",
    fields: [
      { label: "Ekipman / Sistem", placeholder: "Örn: Trafo, Jeneratör, Kablo Hattı", type: "text" },
      { label: "Bakım Periyodu", placeholder: "", type: "select", options: ["Günlük", "Haftalık", "Aylık", "Yıllık"] },
      { label: "Özel Gereksinimler", placeholder: "Varsa özel notlar...", type: "textarea" },
    ],
  },
  {
    id: "presentation",
    title: "Sunum İçeriği",
    description: "Toplantı ve brifing sunumları için içerik",
    icon: <Presentation size={20} />,
    category: "Sunum",
    fields: [
      { label: "Sunum Başlığı", placeholder: "Örn: 2024 Yılı Stratejik Hedefler", type: "text" },
      { label: "Hedef Kitle", placeholder: "Kim için? Örn: Yönetim Kurulu, Teknik Ekip", type: "text" },
      { label: "Süre / Slayt Sayısı", placeholder: "Örn: 20 dakika, 15 slayt", type: "text" },
    ],
  },
  {
    id: "incident",
    title: "Olay Raporu",
    description: "Arıza ve olay bildirimi şablonları",
    icon: <AlertCircle size={20} />,
    category: "Güvenlik",
    fields: [
      { label: "Olay Türü", placeholder: "", type: "select", options: ["Elektrik Arızası", "Ekipman Hasarı", "Güvenlik İhlali", "Çevre Olayı", "Diğer"] },
      { label: "Tarih ve Saat", placeholder: "Örn: 18 Haziran 2024, 14:30", type: "text" },
      { label: "Olay Özeti", placeholder: "Ne olduğunu kısaca açıklayın...", type: "textarea" },
    ],
  },
];

interface GeneratedContent {
  templateId: string;
  content: string;
  generatedAt: Date;
}

const SAMPLE_OUTPUTS: Record<string, string> = {
  report: `# TEKNİK RAPOR
## Haziran 2024 Tüketim Analizi

**İstanbul Enerji A.Ş.**
Belge No: IE-TR-2024-06-001 | Tarih: 18 Haziran 2024

---

### YÖNETİCİ ÖZETİ

Bu rapor, Haziran 2024 dönemi için İstanbul Enerji sistemlerinin tüketim verilerini ve performans metriklerini kapsamlı biçimde değerlendirmektedir.

### TEMEL BULGULAR

• Toplam enerji tüketimi bir önceki aya göre %4.2 azalmıştır
• Verimlilik oranı %91.7 olarak kaydedilmiştir
• Tasarruf hedefinin %108'i gerçekleştirilmiştir

### ÖNERİLER

1. Trafo kapasitesinin optimize edilmesi
2. Pik saatlerde yük dengelemesi yapılması
3. Yenilenebilir enerji entegrasyonunun artırılması`,

  email: `Konu: Haziran 2024 Periyodik Bakım Bildirimi

Sayın İlgili,

İstanbul Enerji A.Ş. olarak, Haziran 2024 dönemi periyodik bakım çalışmaları hakkında bilginize sunmak istediğimiz bilgiler bulunmaktadır.

Planlanan bakım çalışmaları 20 Haziran 2024 tarihinde gerçekleştirilecektir. Söz konusu süreçte geçici bir kesinti yaşanabilir.

Anlayışınız için teşekkür ederiz.

Saygılarımızla,
İstanbul Enerji A.Ş.
Teknik Operasyon Birimi`,
};

export function CreateView() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState<GeneratedContent | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("Tümü");

  const categories = ["Tümü", ...Array.from(new Set(TEMPLATES.map((t) => t.category)))];

  const filteredTemplates =
    activeCategory === "Tümü"
      ? TEMPLATES
      : TEMPLATES.filter((t) => t.category === activeCategory);

  const handleGenerate = async () => {
    if (!selectedTemplate) return;
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 2000));
    setGenerating(false);
    setGenerated({
      templateId: selectedTemplate.id,
      content: SAMPLE_OUTPUTS[selectedTemplate.id] || `# ${selectedTemplate.title}\n\nYapay zeka tarafından oluşturulan içerik burada görünecektir. İstanbul Enerji'nin ihtiyaçlarına yönelik profesyonel içerik üretildi.\n\n${Object.entries(formValues).map(([k, v]) => `**${k}:** ${v}`).join("\n")}`,
      generatedAt: new Date(),
    });
  };

  return (
    <div className="flex h-full" style={{ background: "#F4F6FA" }}>
      {/* Template selector */}
      <div
        className="w-80 flex-shrink-0 flex flex-col h-full"
        style={{ background: "#ffffff", borderRight: "1px solid rgba(11,31,58,0.08)" }}
      >
        <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(11,31,58,0.08)" }}>
          <h2 className="text-sm mb-3" style={{ color: "#0B1F3A", fontWeight: 600 }}>
            İçerik Şablonları
          </h2>
          {/* Category filter */}
          <div className="flex gap-1.5 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-2.5 py-1 rounded-full text-xs transition-all"
                style={{
                  background: activeCategory === cat ? "#0B1F3A" : "#F4F6FA",
                  color: activeCategory === cat ? "#ffffff" : "#5A6880",
                  border: `1px solid ${activeCategory === cat ? "#0B1F3A" : "transparent"}`,
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2" style={{ scrollbarWidth: "none" }}>
          {filteredTemplates.map((tmpl) => {
            const isSelected = selectedTemplate?.id === tmpl.id;
            return (
              <button
                key={tmpl.id}
                onClick={() => {
                  setSelectedTemplate(tmpl);
                  setFormValues({});
                  setGenerated(null);
                }}
                className="w-full text-left px-4 py-3 rounded-xl transition-all"
                style={{
                  background: isSelected ? "#FFF8F2" : "transparent",
                  border: `1px solid ${isSelected ? "#E8841A" : "rgba(11,31,58,0.08)"}`,
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = "#F4F6FA";
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = "transparent";
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: isSelected ? "#E8841A" : "#EEF1F7" }}
                  >
                    <span style={{ color: isSelected ? "#ffffff" : "#5A7A9A" }}>{tmpl.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm" style={{ color: isSelected ? "#E8841A" : "#0B1F3A", fontWeight: 600 }}>
                        {tmpl.title}
                      </p>
                      <span
                        className="text-xs px-1.5 py-0.5 rounded-full"
                        style={{ background: "#EEF1F7", color: "#5A6880" }}
                      >
                        {tmpl.category}
                      </span>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: "#8AAAC8" }}>
                      {tmpl.description}
                    </p>
                  </div>
                  {isSelected && <ChevronRight size={14} style={{ color: "#E8841A", marginTop: 4 }} />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedTemplate ? (
          <>
            {/* Header */}
            <div
              className="flex items-center gap-3 px-6 py-4 flex-shrink-0"
              style={{ background: "#ffffff", borderBottom: "1px solid rgba(11,31,58,0.08)" }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #E8841A, #F5A93A)" }}
              >
                <span style={{ color: "#ffffff" }}>{selectedTemplate.icon}</span>
              </div>
              <div>
                <h2 className="text-sm" style={{ color: "#0B1F3A", fontWeight: 600 }}>
                  {selectedTemplate.title}
                </h2>
                <p className="text-xs" style={{ color: "#5A6880" }}>{selectedTemplate.description}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
              <div className="max-w-3xl mx-auto px-6 py-6">
                {/* Form */}
                {!generated && (
                  <div
                    className="rounded-2xl p-6 mb-6"
                    style={{ background: "#ffffff", border: "1px solid rgba(11,31,58,0.08)" }}
                  >
                    <h3 className="text-sm mb-5" style={{ color: "#0B1F3A", fontWeight: 600 }}>
                      Şablon Detayları
                    </h3>
                    <div className="space-y-4">
                      {selectedTemplate.fields.map((field) => (
                        <div key={field.label}>
                          <label className="block text-sm mb-1.5" style={{ color: "#0B1F3A", fontWeight: 500 }}>
                            {field.label}
                          </label>
                          {field.type === "textarea" ? (
                            <textarea
                              value={formValues[field.label] || ""}
                              onChange={(e) =>
                                setFormValues((prev) => ({ ...prev, [field.label]: e.target.value }))
                              }
                              placeholder={field.placeholder}
                              rows={3}
                              className="w-full px-4 py-2.5 rounded-xl outline-none text-sm resize-none transition-all"
                              style={{
                                background: "#F4F6FA",
                                border: "1px solid rgba(11,31,58,0.1)",
                                color: "#0B1F3A",
                              }}
                              onFocus={(e) => (e.target.style.borderColor = "#E8841A")}
                              onBlur={(e) => (e.target.style.borderColor = "rgba(11,31,58,0.1)")}
                            />
                          ) : field.type === "select" ? (
                            <select
                              value={formValues[field.label] || ""}
                              onChange={(e) =>
                                setFormValues((prev) => ({ ...prev, [field.label]: e.target.value }))
                              }
                              className="w-full px-4 py-2.5 rounded-xl outline-none text-sm transition-all appearance-none"
                              style={{
                                background: "#F4F6FA",
                                border: "1px solid rgba(11,31,58,0.1)",
                                color: formValues[field.label] ? "#0B1F3A" : "#8AAAC8",
                              }}
                            >
                              <option value="">Seçiniz...</option>
                              {field.options?.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type="text"
                              value={formValues[field.label] || ""}
                              onChange={(e) =>
                                setFormValues((prev) => ({ ...prev, [field.label]: e.target.value }))
                              }
                              placeholder={field.placeholder}
                              className="w-full px-4 py-2.5 rounded-xl outline-none text-sm transition-all"
                              style={{
                                background: "#F4F6FA",
                                border: "1px solid rgba(11,31,58,0.1)",
                                color: "#0B1F3A",
                              }}
                              onFocus={(e) => (e.target.style.borderColor = "#E8841A")}
                              onBlur={(e) => (e.target.style.borderColor = "rgba(11,31,58,0.1)")}
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={handleGenerate}
                      disabled={generating}
                      className="mt-6 w-full py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                      style={{
                        background: generating ? "#C26B14" : "#E8841A",
                        color: "#ffffff",
                        fontWeight: 600,
                        cursor: generating ? "not-allowed" : "pointer",
                      }}
                    >
                      {generating ? (
                        <>
                          <Loader size={16} className="animate-spin" />
                          Yapay Zeka İçerik Oluşturuyor...
                        </>
                      ) : (
                        <>
                          <Sparkles size={16} />
                          İçerik Oluştur
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Generated content */}
                {generated && (
                  <div className="space-y-4">
                    <div
                      className="flex items-center gap-3 px-4 py-3 rounded-xl"
                      style={{ background: "#F0FDF4", border: "1px solid #86EFAC" }}
                    >
                      <CheckCircle2 size={16} style={{ color: "#16a34a" }} />
                      <p className="text-sm" style={{ color: "#15803d" }}>
                        İçerik başarıyla oluşturuldu
                      </p>
                      <span className="ml-auto flex items-center gap-1 text-xs" style={{ color: "#16a34a" }}>
                        <Clock size={11} />
                        {generated.generatedAt.toLocaleTimeString("tr-TR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <div
                      className="rounded-2xl overflow-hidden"
                      style={{ border: "1px solid rgba(11,31,58,0.08)" }}
                    >
                      <div
                        className="flex items-center justify-between px-5 py-3"
                        style={{ background: "#0B1F3A" }}
                      >
                        <p className="text-sm text-white" style={{ fontWeight: 500 }}>
                          Oluşturulan İçerik
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => { setGenerated(null); }}
                            className="text-xs px-3 py-1 rounded-lg transition-colors"
                            style={{ background: "rgba(255,255,255,0.12)", color: "#C8D8EC" }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.2)")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
                          >
                            Yeniden Oluştur
                          </button>
                          <button
                            className="text-xs px-3 py-1 rounded-lg transition-colors"
                            style={{ background: "#E8841A", color: "#ffffff" }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = "#D47316")}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "#E8841A")}
                          >
                            PDF Olarak Kaydet
                          </button>
                        </div>
                      </div>
                      <div
                        className="p-6 text-sm leading-relaxed"
                        style={{ background: "#ffffff", color: "#0B1F3A", whiteSpace: "pre-wrap", fontFamily: "monospace", fontSize: "13px" }}
                      >
                        {generated.content}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center px-6">
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5"
              style={{ background: "linear-gradient(135deg, #E8841A20, #F5A93A20)" }}
            >
              <Sparkles size={32} style={{ color: "#E8841A" }} />
            </div>
            <h3 className="mb-2 text-center" style={{ color: "#0B1F3A", fontWeight: 600 }}>
              İçerik Oluşturun
            </h3>
            <p className="text-sm text-center max-w-sm" style={{ color: "#5A6880" }}>
              Sol panelden bir şablon seçin, formu doldurun ve yapay zeka ile profesyonel içerik oluşturun.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
