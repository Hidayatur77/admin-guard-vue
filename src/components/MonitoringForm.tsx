import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MonitoringItem, AREAS } from "@/types/monitoring";
import { Save, X } from "lucide-react";

interface MonitoringFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<MonitoringItem, "id">) => void;
  editItem?: MonitoringItem | null;
  defaultArea?: string;
}

export default function MonitoringForm({ 
  isOpen, 
  onClose, 
  onSave, 
  editItem, 
  defaultArea 
}: MonitoringFormProps) {
  const [formData, setFormData] = useState({
    area: "",
    subArea: "",
    indicator: "",
    status: "" as "Hijau" | "Kuning" | "Merah" | "",
    lastUpdate: "",
    pic: "",
    notes: ""
  });

  const [availableSubAreas, setAvailableSubAreas] = useState<string[]>([]);

  // Get today's date in YYYY-MM-DD format
  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      area: defaultArea || "",
      subArea: "",
      indicator: "",
      status: "",
      lastUpdate: getTodayString(),
      pic: "",
      notes: ""
    });
    updateSubAreas(defaultArea || "");
  };

  // Update sub areas when area changes
  const updateSubAreas = (selectedArea: string) => {
    const areaConfig = AREAS.find(area => area.key === selectedArea);
    setAvailableSubAreas(areaConfig?.subs || []);
  };

  // Initialize form when opening or editing
  useEffect(() => {
    if (isOpen) {
      if (editItem) {
        setFormData({
          area: editItem.area,
          subArea: editItem.subArea,
          indicator: editItem.indicator,
          status: editItem.status,
          lastUpdate: editItem.lastUpdate,
          pic: editItem.pic,
          notes: editItem.notes
        });
        updateSubAreas(editItem.area);
      } else {
        resetForm();
      }
    }
  }, [isOpen, editItem, defaultArea]);

  // Handle area change
  const handleAreaChange = (value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      area: value, 
      subArea: "" // Reset sub area when area changes
    }));
    updateSubAreas(value);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.area || !formData.subArea || !formData.status) {
      return;
    }

    onSave({
      area: formData.area,
      subArea: formData.subArea,
      indicator: formData.indicator,
      status: formData.status as "Hijau" | "Kuning" | "Merah",
      lastUpdate: formData.lastUpdate || getTodayString(),
      pic: formData.pic,
      notes: formData.notes
    });

    onClose();
  };

  const isFormValid = formData.area && formData.subArea && formData.status;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {editItem ? "Edit Data Monitoring" : "Tambah Data Monitoring"}
          </DialogTitle>
          <DialogDescription>
            {editItem 
              ? "Perbarui informasi monitoring yang sudah ada" 
              : "Tambahkan item monitoring baru ke sistem"
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Area */}
            <div className="space-y-2">
              <Label htmlFor="area" className="text-sm font-medium">
                Area Bisnis <span className="text-destructive">*</span>
              </Label>
              <Select value={formData.area} onValueChange={handleAreaChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih area bisnis" />
                </SelectTrigger>
                <SelectContent>
                  {AREAS.map(area => (
                    <SelectItem key={area.key} value={area.key}>
                      {area.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sub Area */}
            <div className="space-y-2">
              <Label htmlFor="subArea" className="text-sm font-medium">
                Sub Area <span className="text-destructive">*</span>
              </Label>
              <Select 
                value={formData.subArea} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, subArea: value }))}
                disabled={!formData.area}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih sub area" />
                </SelectTrigger>
                <SelectContent>
                  {availableSubAreas.map(subArea => (
                    <SelectItem key={subArea} value={subArea}>
                      {subArea}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Indikator */}
          <div className="space-y-2">
            <Label htmlFor="indicator" className="text-sm font-medium">
              Indikator Monitoring
            </Label>
            <Input
              id="indicator"
              value={formData.indicator}
              onChange={(e) => setFormData(prev => ({ ...prev, indicator: e.target.value }))}
              placeholder="Contoh: Daftar aset & nilai buku ter-update"
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">
                Status <span className="text-destructive">*</span>
              </Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hijau">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-status-green rounded-full" />
                      Hijau (Normal/Baik)
                    </div>
                  </SelectItem>
                  <SelectItem value="Kuning">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-status-yellow rounded-full" />
                      Kuning (Perlu Perhatian)
                    </div>
                  </SelectItem>
                  <SelectItem value="Merah">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-status-red rounded-full" />
                      Merah (Bermasalah)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Last Update */}
            <div className="space-y-2">
              <Label htmlFor="lastUpdate" className="text-sm font-medium">
                Tanggal Update Terakhir
              </Label>
              <Input
                id="lastUpdate"
                type="date"
                value={formData.lastUpdate}
                onChange={(e) => setFormData(prev => ({ ...prev, lastUpdate: e.target.value }))}
              />
            </div>
          </div>

          {/* PIC */}
          <div className="space-y-2">
            <Label htmlFor="pic" className="text-sm font-medium">
              Person In Charge (PIC)
            </Label>
            <Input
              id="pic"
              value={formData.pic}
              onChange={(e) => setFormData(prev => ({ ...prev, pic: e.target.value }))}
              placeholder="Nama penanggung jawab"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              Catatan / Tindakan
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Catatan singkat, tindakan yang diambil, atau keterangan tambahan..."
              className="min-h-[80px]"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Batal
            </Button>
            <Button type="submit" variant="hero" disabled={!isFormValid}>
              <Save className="w-4 h-4 mr-2" />
              {editItem ? "Perbarui" : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}