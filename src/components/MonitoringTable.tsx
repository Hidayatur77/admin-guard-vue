import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MonitoringItem, FilterState, getStatusColor, getStatusBgColor } from "@/types/monitoring";
import { Plus, Filter, Download, FileText, Printer, RotateCcw, Edit, Trash2, Search } from "lucide-react";

interface MonitoringTableProps {
  area: string;
  items: MonitoringItem[];
  onAdd: () => void;
  onEdit: (item: MonitoringItem) => void;
  onDelete: (id: string) => void;
  onExportJSON: () => void;
  onExportCSV: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
}

export default function MonitoringTable({
  area,
  items,
  onAdd,
  onEdit,
  onDelete,
  onExportJSON,
  onExportCSV,
  onImport,
  onReset
}: MonitoringTableProps) {
  const [filter, setFilter] = useState<FilterState>({
    status: "",
    search: "",
    dateFrom: "",
    dateTo: ""
  });

  // Filter items
  const filteredItems = items.filter(item => {
    if (filter.status && filter.status !== "all" && item.status !== filter.status) return false;
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      if (
        !item.subArea.toLowerCase().includes(searchLower) &&
        !item.indicator.toLowerCase().includes(searchLower) &&
        !item.pic.toLowerCase().includes(searchLower)
      ) return false;
    }
    if (filter.dateFrom && item.lastUpdate < filter.dateFrom) return false;
    if (filter.dateTo && item.lastUpdate > filter.dateTo) return false;
    return true;
  });

  // Calculate KPI stats
  const stats = {
    total: filteredItems.length,
    green: filteredItems.filter(item => item.status === "Hijau").length,
    yellow: filteredItems.filter(item => item.status === "Kuning").length,
    red: filteredItems.filter(item => item.status === "Merah").length,
  };

  const getPercentage = (count: number) => 
    stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-subtle">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">{stats.total}</div>
            <p className="text-sm text-muted-foreground">Total Item</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-subtle">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-status-green">{getPercentage(stats.green)}%</div>
            <p className="text-sm text-muted-foreground">Status Hijau</p>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div 
                className="bg-status-green h-2 rounded-full transition-all" 
                style={{ width: `${getPercentage(stats.green)}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-subtle">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-status-yellow">{getPercentage(stats.yellow)}%</div>
            <p className="text-sm text-muted-foreground">Status Kuning</p>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div 
                className="bg-status-yellow h-2 rounded-full transition-all" 
                style={{ width: `${getPercentage(stats.yellow)}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-subtle">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-status-red">{getPercentage(stats.red)}%</div>
            <p className="text-sm text-muted-foreground">Status Merah</p>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div 
                className="bg-status-red h-2 rounded-full transition-all" 
                style={{ width: `${getPercentage(stats.red)}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Card */}
      <Card className="shadow-medium">
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl">Data Monitoring • {area}</CardTitle>
              <CardDescription>
                Kelola data monitoring untuk area {area}
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={onAdd} variant="hero" size="sm">
                <Plus className="w-4 h-4" />
                Tambah Data
              </Button>
              <Button onClick={onExportJSON} variant="outline" size="sm">
                <Download className="w-4 h-4" />
                JSON
              </Button>
              <Button onClick={onExportCSV} variant="outline" size="sm">
                <FileText className="w-4 h-4" />
                CSV
              </Button>
              <label className="cursor-pointer">
                <Button variant="outline" size="sm" asChild>
                  <span>
                    <Download className="w-4 h-4" />
                    Import
                  </span>
                </Button>
                <input 
                  type="file" 
                  accept="application/json" 
                  onChange={onImport}
                  className="hidden" 
                />
              </label>
              <Button onClick={() => window.print()} variant="ghost" size="sm">
                <Printer className="w-4 h-4" />
              </Button>
              <Button onClick={onReset} variant="destructive" size="sm">
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Cari: Sub Area, Indikator, atau PIC..."
                  value={filter.search}
                  onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filter.status} onValueChange={(value) => setFilter(prev => ({ ...prev, status: value }))}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="Hijau">Hijau</SelectItem>
                <SelectItem value="Kuning">Kuning</SelectItem>
                <SelectItem value="Merah">Merah</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={filter.dateFrom}
              onChange={(e) => setFilter(prev => ({ ...prev, dateFrom: e.target.value }))}
              className="w-full lg:w-[160px]"
              placeholder="Dari tanggal"
            />
            <Input
              type="date"
              value={filter.dateTo}
              onChange={(e) => setFilter(prev => ({ ...prev, dateTo: e.target.value }))}
              className="w-full lg:w-[160px]"
              placeholder="Sampai tanggal"
            />
            {(filter.search || filter.status || filter.dateFrom || filter.dateTo) && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setFilter({ status: "", search: "", dateFrom: "", dateTo: "" })}
              >
                Reset
              </Button>
            )}
          </div>

            {/* Active Filter Indicator */}
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                Area Aktif: {area}
              </Badge>
              {filteredItems.length !== items.length && (
                <Badge variant="outline">
                  Menampilkan {filteredItems.length} dari {items.length} item
                </Badge>
              )}
            </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Area</TableHead>
                    <TableHead>Sub Area</TableHead>
                    <TableHead>Indikator</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Update Terakhir</TableHead>
                    <TableHead>PIC</TableHead>
                    <TableHead>Catatan</TableHead>
                    <TableHead className="w-24">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item, index) => (
                      <TableRow 
                        key={item.id}
                        className={getStatusBgColor(item.status)}
                      >
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>{item.area}</TableCell>
                        <TableCell className="font-medium">{item.subArea}</TableCell>
                        <TableCell className="max-w-xs">
                          <p className="truncate" title={item.indicator}>
                            {item.indicator}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              item.status === "Hijau" ? "success-outline" :
                              item.status === "Kuning" ? "warning-outline" :
                              "danger-outline"
                            }
                          >
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.lastUpdate}</TableCell>
                        <TableCell className="font-medium">{item.pic}</TableCell>
                        <TableCell className="max-w-xs">
                          <p className="truncate text-sm text-muted-foreground" title={item.notes}>
                            {item.notes || "-"}
                          </p>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => onEdit(item)}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => onDelete(item.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        {items.length === 0 
                          ? "Belum ada data monitoring. Klik Tambah Data untuk memulai."
                          : "Tidak ada data yang sesuai dengan filter."
                        }
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}