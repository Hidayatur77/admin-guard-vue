export interface MonitoringItem {
  id: string;
  area: string;
  subArea: string;
  indicator: string;
  status: "Hijau" | "Kuning" | "Merah";
  lastUpdate: string;
  pic: string;
  notes: string;
}

export interface AreaConfig {
  key: string;
  label: string;
  subs: string[];
}

export interface KPIStats {
  total: number;
  green: number;
  yellow: number;
  red: number;
  greenPercent: number;
  yellowPercent: number;
  redPercent: number;
}

export interface FilterState {
  status: string;
  search: string;
  dateFrom: string;
  dateTo: string;
}

export const AREAS: AreaConfig[] = [
  { 
    key: "Strategic Management", 
    label: "Strategic Management",
    subs: ["Visi-Misi & Roadmap", "KPI Tahunan", "Proyek Strategis"] 
  },
  { 
    key: "Organizational & HR", 
    label: "Organizational & HR",
    subs: ["Struktur Organisasi", "Data Karyawan", "Rekrutmen", "Pelatihan"] 
  },
  { 
    key: "Operations & Assets", 
    label: "Operations & Assets",
    subs: ["Aset Tetap", "Peralatan Produksi", "Perlengkapan Kantor", "Inventaris Habis Pakai", "Pemeliharaan Aset"] 
  },
  { 
    key: "Marketing & Sales", 
    label: "Marketing & Sales",
    subs: ["Campaign Aktif", "Leads Masuk", "Penjualan", "Retensi Pelanggan"] 
  },
  { 
    key: "Finance & Legal", 
    label: "Finance & Legal",
    subs: ["Cash Flow", "Laporan Keuangan", "Hutang & Piutang", "Pajak", "Legalitas Usaha & Kontrak"] 
  },
  { 
    key: "Customer Service", 
    label: "Customer Service",
    subs: ["Komplain", "Kepuasan Pelanggan", "Response Time"] 
  },
  { 
    key: "IT & Digital", 
    label: "IT & Digital",
    subs: ["Website/App", "Keamanan Data", "Sistem Internal"] 
  },
];

export const getStatusColor = (status: string): string => {
  switch (status) {
    case "Hijau":
      return "text-status-green";
    case "Kuning":
      return "text-status-yellow";
    case "Merah":
      return "text-status-red";
    default:
      return "text-muted-foreground";
  }
};

export const getStatusBgColor = (status: string): string => {
  switch (status) {
    case "Hijau":
      return "bg-status-green-bg border-status-green/20";
    case "Kuning":
      return "bg-status-yellow-bg border-status-yellow/20";
    case "Merah":
      return "bg-status-red-bg border-status-red/20";
    default:
      return "bg-muted";
  }
};