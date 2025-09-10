import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import MonitoringTable from "./MonitoringTable";
import MonitoringForm from "./MonitoringForm";
import { MonitoringItem, AREAS } from "@/types/monitoring";
import { Menu } from "lucide-react";

interface MonitoringAppProps {
  onLogout: () => void;
  username: string;
}

const STORAGE_KEY = "monitoring_system_data";

export default function MonitoringApp({ onLogout, username }: MonitoringAppProps) {
  const [activeArea, setActiveArea] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [allData, setAllData] = useState<Record<string, MonitoringItem[]>>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<MonitoringItem | null>(null);
  const { toast } = useToast();

  // Generate unique ID
  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  // Get today's date
  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Load data from localStorage
  const loadData = (): Record<string, MonitoringItem[]> => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      return generateSeedData();
    } catch (error) {
      console.warn("Error loading data, using seed data:", error);
      return generateSeedData();
    }
  };

  // Generate seed data
  const generateSeedData = (): Record<string, MonitoringItem[]> => {
    const data: Record<string, MonitoringItem[]> = {};
    
    // Initialize empty arrays for all areas
    AREAS.forEach(area => {
      data[area.key] = [];
    });

    // Add some sample data
    data["Operations & Assets"].push({
      id: generateId(),
      area: "Operations & Assets",
      subArea: "Aset Tetap",
      indicator: "Daftar aset & nilai buku ter-update",
      status: "Kuning",
      lastUpdate: getTodayString(),
      pic: "Asset Admin",
      notes: "Perlu stock opname Q3"
    });

    data["Finance & Legal"].push({
      id: generateId(),
      area: "Finance & Legal",
      subArea: "Cash Flow",
      indicator: "Arus kas positif 3 bulan",
      status: "Hijau",
      lastUpdate: getTodayString(),
      pic: "Finance Lead",
      notes: "Cash flow stabil"
    });

    data["Marketing & Sales"].push({
      id: generateId(),
      area: "Marketing & Sales",
      subArea: "Leads Masuk",
      indicator: "Leads mingguan per channel",
      status: "Merah",
      lastUpdate: getTodayString(),
      pic: "Growth Manager",
      notes: "IG Ads pause, perbaiki funnel"
    });

    data["IT & Digital"].push({
      id: generateId(),
      area: "IT & Digital",
      subArea: "Keamanan Data",
      indicator: "Backup harian & uji restore",
      status: "Hijau",
      lastUpdate: getTodayString(),
      pic: "IT Ops",
      notes: "Backup otomatis jam 02.00"
    });

    data["Strategic Management"].push({
      id: generateId(),
      area: "Strategic Management",
      subArea: "KPI Tahunan",
      indicator: "Progress KPI Q1 2025",
      status: "Kuning",
      lastUpdate: getTodayString(),
      pic: "Strategic Lead",
      notes: "75% dari target, perlu akselerasi"
    });

    return data;
  };

  // Save data to localStorage
  const saveData = (data: Record<string, MonitoringItem[]>) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Error saving data:", error);
      toast({
        title: "Error",
        description: "Gagal menyimpan data",
        variant: "destructive"
      });
    }
  };

  // Initialize data on mount
  useEffect(() => {
    const data = loadData();
    setAllData(data);
  }, []);

  // Handle add item
  const handleAdd = () => {
    const currentArea = activeArea === "Dashboard" ? AREAS[0].key : activeArea;
    setEditItem(null);
    setIsFormOpen(true);
  };

  // Handle edit item
  const handleEdit = (item: MonitoringItem) => {
    setEditItem(item);
    setIsFormOpen(true);
  };

  // Handle delete item
  const handleDelete = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus item ini?")) {
      const currentArea = activeArea === "Dashboard" ? AREAS[0].key : activeArea;
      const newData = { ...allData };
      newData[currentArea] = newData[currentArea].filter(item => item.id !== id);
      setAllData(newData);
      saveData(newData);
      
      toast({
        title: "Berhasil",
        description: "Item berhasil dihapus"
      });
    }
  };

  // Handle save item
  const handleSave = (itemData: Omit<MonitoringItem, "id">) => {
    const newData = { ...allData };
    
    if (editItem) {
      // Update existing item
      const targetArea = itemData.area;
      
      // Remove from old area if area changed
      if (editItem.area !== targetArea) {
        newData[editItem.area] = newData[editItem.area].filter(item => item.id !== editItem.id);
      }
      
      // Add/update in target area
      if (!newData[targetArea]) {
        newData[targetArea] = [];
      }
      
      const existingIndex = newData[targetArea].findIndex(item => item.id === editItem.id);
      if (existingIndex >= 0) {
        newData[targetArea][existingIndex] = { ...itemData, id: editItem.id };
      } else {
        newData[targetArea].push({ ...itemData, id: editItem.id });
      }
    } else {
      // Add new item
      const targetArea = itemData.area;
      if (!newData[targetArea]) {
        newData[targetArea] = [];
      }
      newData[targetArea].push({ ...itemData, id: generateId() });
    }

    setAllData(newData);
    saveData(newData);

    toast({
      title: "Berhasil",
      description: editItem ? "Item berhasil diperbarui" : "Item berhasil ditambahkan"
    });
  };

  // Handle export JSON
  const handleExportJSON = () => {
    const currentArea = activeArea === "Dashboard" ? AREAS[0].key : activeArea;
    const data = allData[currentArea] || [];
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentArea.replace(/\s+/g, '_')}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Berhasil",
      description: "Data berhasil diekspor ke JSON"
    });
  };

  // Handle export CSV
  const handleExportCSV = () => {
    const currentArea = activeArea === "Dashboard" ? AREAS[0].key : activeArea;
    const data = allData[currentArea] || [];
    
    if (data.length === 0) {
      toast({
        title: "Info",
        description: "Tidak ada data untuk diekspor",
        variant: "destructive"
      });
      return;
    }

    const headers = ["Area", "Sub Area", "Indikator", "Status", "Update Terakhir", "PIC", "Catatan"];
    const csvContent = [
      headers.join(","),
      ...data.map(item => [
        `"${item.area}"`,
        `"${item.subArea}"`,
        `"${item.indicator}"`,
        `"${item.status}"`,
        `"${item.lastUpdate}"`,
        `"${item.pic}"`,
        `"${item.notes.replace(/"/g, '""')}"`
      ].join(","))
    ].join("\n");

    const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentArea.replace(/\s+/g, '_')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Berhasil",
      description: "Data berhasil diekspor ke CSV"
    });
  };

  // Handle import
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target?.result as string);
        
        if (!Array.isArray(importData)) {
          throw new Error("Format JSON tidak valid (harus berupa array)");
        }

        // Validate data structure
        const isValid = importData.every(item => 
          typeof item === 'object' && 
          item.area && 
          item.subArea && 
          item.status
        );

        if (!isValid) {
          throw new Error("Data tidak valid (harus memiliki field area, subArea, dan status)");
        }

        const currentArea = activeArea === "Dashboard" ? AREAS[0].key : activeArea;
        const newData = { ...allData };
        
        // Add IDs to imported items and set area
        const processedData = importData.map(item => ({
          ...item,
          id: generateId(),
          area: currentArea,
          lastUpdate: item.lastUpdate || getTodayString()
        }));

        newData[currentArea] = processedData;
        setAllData(newData);
        saveData(newData);

        toast({
          title: "Berhasil",
          description: `${importData.length} item berhasil diimpor`
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: `Gagal mengimpor data: ${error.message}`,
          variant: "destructive"
        });
      }
    };

    reader.readAsText(file);
    event.target.value = '';
  };

  // Handle reset area
  const handleReset = () => {
    const currentArea = activeArea === "Dashboard" ? AREAS[0].key : activeArea;
    
    if (window.confirm(`Apakah Anda yakin ingin menghapus semua data di area ${currentArea}?`)) {
      const newData = { ...allData };
      newData[currentArea] = [];
      setAllData(newData);
      saveData(newData);
      
      toast({
        title: "Berhasil",
        description: `Semua data di area ${currentArea} berhasil dihapus`
      });
    }
  };

  const currentAreaItems = activeArea === "Dashboard" ? [] : (allData[activeArea] || []);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        activeArea={activeArea}
        setActiveArea={setActiveArea}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        onLogout={onLogout}
        username={username}
      />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0 min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-3 sm:p-4 border-b border-border bg-card/95 backdrop-blur-sm sticky top-0 z-30">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="shrink-0"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="font-semibold text-base sm:text-lg truncate mx-2">
            {activeArea === "Dashboard" ? "Dashboard" : activeArea}
          </h1>
          <div className="w-10 shrink-0" />
        </div>

        {/* Content Area */}
        <main className="p-3 sm:p-4 lg:p-8">
          {activeArea === "Dashboard" ? (
            <Dashboard allData={allData} />
          ) : (
            <MonitoringTable
              area={activeArea}
              items={currentAreaItems}
              onAdd={handleAdd}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onExportJSON={handleExportJSON}
              onExportCSV={handleExportCSV}
              onImport={handleImport}
              onReset={handleReset}
            />
          )}
        </main>
      </div>

      {/* Form Modal */}
      <MonitoringForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditItem(null);
        }}
        onSave={handleSave}
        editItem={editItem}
        defaultArea={activeArea === "Dashboard" ? AREAS[0].key : activeArea}
      />
    </div>
  );
}