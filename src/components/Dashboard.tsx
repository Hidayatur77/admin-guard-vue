import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MonitoringItem, KPIStats } from "@/types/monitoring";
import { TrendingUp, TrendingDown, Activity, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface DashboardProps {
  allData: Record<string, MonitoringItem[]>;
}

export default function Dashboard({ allData }: DashboardProps) {
  // Calculate overall stats
  const calculateOverallStats = (): KPIStats & { totalAreas: number } => {
    const allItems = Object.values(allData).flat();
    const total = allItems.length;
    const green = allItems.filter(item => item.status === "Hijau").length;
    const yellow = allItems.filter(item => item.status === "Kuning").length;
    const red = allItems.filter(item => item.status === "Merah").length;
    
    return {
      total,
      green,
      yellow,
      red,
      greenPercent: total > 0 ? Math.round((green / total) * 100) : 0,
      yellowPercent: total > 0 ? Math.round((yellow / total) * 100) : 0,
      redPercent: total > 0 ? Math.round((red / total) * 100) : 0,
      totalAreas: Object.keys(allData).length
    };
  };

  const stats = calculateOverallStats();

  // Prepare chart data
  const areaChartData = Object.keys(allData).map(area => {
    const items = allData[area];
    const total = items.length;
    const green = items.filter(item => item.status === "Hijau").length;
    const yellow = items.filter(item => item.status === "Kuning").length;
    const red = items.filter(item => item.status === "Merah").length;
    
    return {
      area: area.split(" ").slice(0, 2).join(" "), // Shortened names for chart
      green,
      yellow,
      red,
      total,
      greenPercent: total > 0 ? Math.round((green / total) * 100) : 0,
    };
  });

  const pieData = [
    { name: "Hijau", value: stats.green, color: "hsl(var(--status-green))" },
    { name: "Kuning", value: stats.yellow, color: "hsl(var(--status-yellow))" },
    { name: "Merah", value: stats.red, color: "hsl(var(--status-red))" },
  ];

  // Get recent updates (last 5 items with dates)
  const getRecentUpdates = () => {
    const allItems = Object.values(allData).flat();
    return allItems
      .filter(item => item.lastUpdate)
      .sort((a, b) => new Date(b.lastUpdate).getTime() - new Date(a.lastUpdate).getTime())
      .slice(0, 5);
  };

  const recentUpdates = getRecentUpdates();

  return (
    <div className="space-y-6">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-medium border-0 bg-gradient-to-br from-card to-card/80">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-sm font-medium">Total Item Monitoring</CardDescription>
              <Activity className="w-5 h-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Dari {stats.totalAreas} area bisnis
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-medium border-0 bg-gradient-to-br from-card to-card/80">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-sm font-medium">Status Hijau</CardDescription>
              <CheckCircle className="w-5 h-5 text-status-green" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-status-green">{stats.greenPercent}%</div>
            <div className="flex items-center gap-1 mt-1">
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-status-green h-2 rounded-full transition-all" 
                  style={{ width: `${stats.greenPercent}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{stats.green}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-medium border-0 bg-gradient-to-br from-card to-card/80">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-sm font-medium">Status Kuning</CardDescription>
              <AlertTriangle className="w-5 h-5 text-status-yellow" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-status-yellow">{stats.yellowPercent}%</div>
            <div className="flex items-center gap-1 mt-1">
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-status-yellow h-2 rounded-full transition-all" 
                  style={{ width: `${stats.yellowPercent}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{stats.yellow}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-medium border-0 bg-gradient-to-br from-card to-card/80">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-sm font-medium">Status Merah</CardDescription>
              <XCircle className="w-5 h-5 text-status-red" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-status-red">{stats.redPercent}%</div>
            <div className="flex items-center gap-1 mt-1">
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-status-red h-2 rounded-full transition-all" 
                  style={{ width: `${stats.redPercent}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">{stats.red}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart - Status by Area */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="text-lg">Status Monitoring per Area</CardTitle>
            <CardDescription>Distribusi status monitoring di setiap area bisnis</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={areaChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="area" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="green" stackId="status" fill="hsl(var(--status-green))" name="Hijau" />
                <Bar dataKey="yellow" stackId="status" fill="hsl(var(--status-yellow))" name="Kuning" />
                <Bar dataKey="red" stackId="status" fill="hsl(var(--status-red))" name="Merah" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart - Overall Status Distribution */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="text-lg">Distribusi Status Keseluruhan</CardTitle>
            <CardDescription>Proporsi status monitoring secara keseluruhan</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Updates and Area Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Updates */}
        <Card className="lg:col-span-2 shadow-medium">
          <CardHeader>
            <CardTitle className="text-lg">Update Terbaru</CardTitle>
            <CardDescription>5 item monitoring yang baru diperbarui</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUpdates.length > 0 ? (
                recentUpdates.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                    <Badge 
                      variant={
                        item.status === "Hijau" ? "success-outline" :
                        item.status === "Kuning" ? "warning-outline" :
                        "danger-outline"
                      }
                    >
                      {item.status}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.indicator}</p>
                      <p className="text-xs text-muted-foreground">{item.area} • {item.subArea}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium">{item.pic}</p>
                      <p className="text-xs text-muted-foreground">{item.lastUpdate}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-8">Belum ada data monitoring</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Area Summary */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="text-lg">Ringkasan Area</CardTitle>
            <CardDescription>Performance setiap area</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {areaChartData.map((area) => (
                <div key={area.area} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate">{area.area}</span>
                    <span className="text-xs text-muted-foreground">{area.total} item</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div 
                        className="bg-status-green h-2 rounded-full transition-all" 
                        style={{ width: `${area.greenPercent}%` }}
                      />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {area.greenPercent}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}