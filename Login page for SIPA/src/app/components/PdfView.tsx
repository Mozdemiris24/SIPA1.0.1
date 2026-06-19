import { useState } from "react";
import {
  Upload,
  FileText,
  Search,
  Download,
  Trash2,
  Eye,
  Edit3,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Highlighter,
  MessageSquarePlus,
  ChevronLeft,
  ChevronRight,
  Merge,
  Scissors,
  FileUp,
} from "lucide-react";

interface PdfFile {
  id: string;
  name: string;
  pages: number;
  size: string;
  date: string;
  status: "ready" | "processing";
}

const DEMO_FILES: PdfFile[] = [
  { id: "1", name: "Elektrik_Tüketim_Raporu_2024.pdf", pages: 24, size: "2.4 MB", date: "18 Haz 2024", status: "ready" },
  { id: "2", name: "Bakım_Planı_Q2_2024.pdf", pages: 8, size: "890 KB", date: "15 Haz 2024", status: "ready" },
  { id: "3", name: "Sözleşme_Taslak_v3.pdf", pages: 42, size: "5.1 MB", date: "12 Haz 2024", status: "ready" },
  { id: "4", name: "İş_Güvenliği_Protokolü.pdf", pages: 16, size: "1.7 MB", date: "10 Haz 2024", status: "ready" },
  { id: "5", name: "Fatura_Mayıs_2024.pdf", pages: 3, size: "340 KB", date: "01 Haz 2024", status: "ready" },
];

const TOOLS = [
  { icon: <Edit3 size={15} />, label: "Düzenle" },
  { icon: <Highlighter size={15} />, label: "Vurgula" },
  { icon: <MessageSquarePlus size={15} />, label: "Yorum" },
  { icon: <Merge size={15} />, label: "Birleştir" },
  { icon: <Scissors size={15} />, label: "Böl" },
  { icon: <FileUp size={15} />, label: "Dışa Aktar" },
];

export function PdfView() {
  const [files] = useState<PdfFile[]>(DEMO_FILES);
  const [selectedFile, setSelectedFile] = useState<PdfFile | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full" style={{ background: "#F4F6FA" }}>
      {/* File list panel */}
      <div
        className="w-72 flex-shrink-0 flex flex-col h-full"
        style={{ background: "#ffffff", borderRight: "1px solid rgba(11,31,58,0.08)" }}
      >
        {/* Header */}
        <div className="px-5 py-4" style={{ borderBottom: "1px solid rgba(11,31,58,0.08)" }}>
          <h2 className="text-sm mb-3" style={{ color: "#0B1F3A", fontWeight: 600 }}>
            PDF Belgelerim
          </h2>
          {/* Search */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg"
            style={{ background: "#F4F6FA", border: "1px solid rgba(11,31,58,0.1)" }}
          >
            <Search size={14} style={{ color: "#8AAAC8" }} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Belge ara..."
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: "#0B1F3A" }}
            />
          </div>
        </div>

        {/* Upload zone */}
        <div
          className="mx-4 my-3 rounded-xl flex flex-col items-center justify-center py-5 cursor-pointer transition-all"
          style={{
            border: `2px dashed ${isDragging ? "#E8841A" : "rgba(11,31,58,0.15)"}`,
            background: isDragging ? "#FFF8F2" : "#F9FAFB",
          }}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); }}
          onClick={() => {}}
        >
          <Upload size={20} style={{ color: isDragging ? "#E8841A" : "#8AAAC8", marginBottom: 6 }} />
          <p className="text-xs text-center" style={{ color: isDragging ? "#E8841A" : "#8AAAC8" }}>
            PDF yüklemek için tıklayın
            <br />
            veya sürükleyin
          </p>
        </div>

        {/* File list */}
        <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1" style={{ scrollbarWidth: "none" }}>
          {filteredFiles.map((file) => {
            const isSelected = selectedFile?.id === file.id;
            return (
              <button
                key={file.id}
                onClick={() => { setSelectedFile(file); setCurrentPage(1); setZoom(100); }}
                className="w-full text-left px-3 py-3 rounded-xl transition-all group"
                style={{
                  background: isSelected ? "#FFF8F2" : "transparent",
                  border: `1px solid ${isSelected ? "#E8841A" : "transparent"}`,
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = "#F4F6FA";
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = "transparent";
                }}
              >
                <div className="flex items-start gap-2.5">
                  <div
                    className="w-8 h-10 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: isSelected ? "#E8841A" : "#EEF1F7" }}
                  >
                    <FileText size={15} style={{ color: isSelected ? "#ffffff" : "#5A7A9A" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-xs truncate"
                      style={{ color: isSelected ? "#E8841A" : "#0B1F3A", fontWeight: isSelected ? 600 : 500 }}
                    >
                      {file.name}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "#8AAAC8" }}>
                      {file.pages} sayfa · {file.size}
                    </p>
                    <p className="text-xs" style={{ color: "#8AAAC8" }}>{file.date}</p>
                  </div>
                  <div
                    className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="p-1 rounded transition-colors"
                      style={{ color: "#8AAAC8" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#E8841A")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#8AAAC8")}
                      title="Görüntüle"
                    >
                      <Eye size={12} />
                    </button>
                    <button
                      className="p-1 rounded transition-colors"
                      style={{ color: "#8AAAC8" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#0B1F3A")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#8AAAC8")}
                      title="İndir"
                    >
                      <Download size={12} />
                    </button>
                    <button
                      className="p-1 rounded transition-colors"
                      style={{ color: "#8AAAC8" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#d4183d")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#8AAAC8")}
                      title="Sil"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main viewer */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedFile ? (
          <>
            {/* Toolbar */}
            <div
              className="flex items-center gap-2 px-5 py-3 flex-shrink-0"
              style={{ background: "#ffffff", borderBottom: "1px solid rgba(11,31,58,0.08)" }}
            >
              {/* File name */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <FileText size={15} style={{ color: "#E8841A", flexShrink: 0 }} />
                <span className="text-sm truncate" style={{ color: "#0B1F3A", fontWeight: 500 }}>
                  {selectedFile.name}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#EEF1F7", color: "#5A6880" }}>
                  {selectedFile.pages} sayfa
                </span>
              </div>

              {/* Tools */}
              <div className="flex items-center gap-0.5">
                {TOOLS.map((tool) => (
                  <button
                    key={tool.label}
                    onClick={() => setActiveTool(activeTool === tool.label ? null : tool.label)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all"
                    style={{
                      background: activeTool === tool.label ? "#FFF8F2" : "transparent",
                      color: activeTool === tool.label ? "#E8841A" : "#5A6880",
                      border: `1px solid ${activeTool === tool.label ? "#E8841A" : "transparent"}`,
                    }}
                    onMouseEnter={(e) => {
                      if (activeTool !== tool.label) e.currentTarget.style.background = "#F4F6FA";
                    }}
                    onMouseLeave={(e) => {
                      if (activeTool !== tool.label) e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {tool.icon}
                    <span className="hidden xl:inline">{tool.label}</span>
                  </button>
                ))}
              </div>

              {/* Zoom & page */}
              <div
                className="flex items-center gap-1 px-2 py-1 rounded-lg"
                style={{ background: "#F4F6FA", border: "1px solid rgba(11,31,58,0.1)" }}
              >
                <button
                  onClick={() => setZoom((z) => Math.max(50, z - 10))}
                  className="w-6 h-6 flex items-center justify-center rounded transition-colors"
                  style={{ color: "#5A6880" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#E8841A")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#5A6880")}
                >
                  <ZoomOut size={13} />
                </button>
                <span className="text-xs w-10 text-center" style={{ color: "#0B1F3A", fontWeight: 500 }}>
                  {zoom}%
                </span>
                <button
                  onClick={() => setZoom((z) => Math.min(200, z + 10))}
                  className="w-6 h-6 flex items-center justify-center rounded transition-colors"
                  style={{ color: "#5A6880" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#E8841A")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#5A6880")}
                >
                  <ZoomIn size={13} />
                </button>
                <button
                  className="w-6 h-6 flex items-center justify-center rounded transition-colors ml-1"
                  style={{ color: "#5A6880" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#E8841A")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#5A6880")}
                >
                  <RotateCw size={13} />
                </button>
              </div>

              <button
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors"
                style={{ background: "#E8841A", color: "#ffffff" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#D47316")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#E8841A")}
              >
                <Download size={13} />
                İndir
              </button>
            </div>

            {/* PDF canvas area */}
            <div
              className="flex-1 overflow-auto flex flex-col items-center py-8 gap-4"
              style={{ background: "#E8EDF5", scrollbarWidth: "thin" }}
            >
              {Array.from({ length: Math.min(selectedFile.pages, 5) }, (_, i) => i + 1).map((pageNum) => (
                <div
                  key={pageNum}
                  className="relative rounded-lg overflow-hidden transition-all"
                  style={{
                    width: `${Math.min(680 * (zoom / 100), 900)}px`,
                    minHeight: `${Math.min(880 * (zoom / 100), 1100)}px`,
                    background: "#ffffff",
                    boxShadow: "0 4px 20px rgba(11,31,58,0.15)",
                    border: currentPage === pageNum ? "2px solid #E8841A" : "2px solid transparent",
                  }}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {/* Simulated page content */}
                  <div className="p-10">
                    <div
                      className="flex items-center gap-3 mb-8 pb-5"
                      style={{ borderBottom: "2px solid #0B1F3A" }}
                    >
                      <div
                        className="w-8 h-8 rounded flex items-center justify-center"
                        style={{ background: "#E8841A" }}
                      >
                        <FileText size={14} color="white" />
                      </div>
                      <div>
                        <p className="text-xs tracking-widest" style={{ color: "#0B1F3A", fontWeight: 700 }}>
                          İSTANBUL ENERJİ
                        </p>
                        <p className="text-xs" style={{ color: "#8AAAC8" }}>Belge No: IE-{2024}-{String(pageNum).padStart(3, "0")}</p>
                      </div>
                      <div className="ml-auto text-xs" style={{ color: "#8AAAC8" }}>
                        Sayfa {pageNum} / {selectedFile.pages}
                      </div>
                    </div>

                    {pageNum === 1 && (
                      <>
                        <div
                          className="h-4 rounded mb-3"
                          style={{ background: "#EEF1F7", width: "60%" }}
                        />
                        <div className="h-3 rounded mb-2" style={{ background: "#F4F6FA", width: "90%" }} />
                        <div className="h-3 rounded mb-2" style={{ background: "#F4F6FA", width: "85%" }} />
                        <div className="h-3 rounded mb-6" style={{ background: "#F4F6FA", width: "75%" }} />
                        <div className="grid grid-cols-3 gap-4 mb-6">
                          {["Toplam Tüketim", "Ortalama Güç", "Tasarruf"].map((label) => (
                            <div key={label} className="rounded-lg p-4" style={{ background: "#F4F6FA" }}>
                              <p className="text-xs mb-1" style={{ color: "#8AAAC8" }}>{label}</p>
                              <div className="h-5 rounded" style={{ background: "#EEF1F7", width: "70%" }} />
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="h-2.5 rounded mb-2.5"
                        style={{ background: "#F4F6FA", width: `${75 + Math.sin(i * 1.7) * 20}%` }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Page navigation */}
            <div
              className="flex items-center justify-center gap-3 py-3 flex-shrink-0"
              style={{ background: "#ffffff", borderTop: "1px solid rgba(11,31,58,0.08)" }}
            >
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
                style={{
                  background: currentPage === 1 ? "transparent" : "#F4F6FA",
                  color: currentPage === 1 ? "#C8D8EC" : "#0B1F3A",
                }}
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm" style={{ color: "#5A6880" }}>
                <span style={{ color: "#0B1F3A", fontWeight: 600 }}>{currentPage}</span> / {selectedFile.pages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(selectedFile.pages, p + 1))}
                disabled={currentPage === selectedFile.pages}
                className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
                style={{
                  background: currentPage === selectedFile.pages ? "transparent" : "#F4F6FA",
                  color: currentPage === selectedFile.pages ? "#C8D8EC" : "#0B1F3A",
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </>
        ) : (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center">
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5"
              style={{ background: "linear-gradient(135deg, #EEF1F7, #E8EDF5)" }}
            >
              <FileText size={32} style={{ color: "#8AAAC8" }} />
            </div>
            <h3 className="mb-2" style={{ color: "#0B1F3A", fontWeight: 600 }}>
              Belge Seçin
            </h3>
            <p className="text-sm text-center max-w-xs" style={{ color: "#5A6880" }}>
              Sol panelden bir PDF belgesi seçin veya yeni bir belge yükleyin.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
