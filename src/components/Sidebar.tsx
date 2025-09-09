import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/hooks/useTheme";
import { 
  LayoutDashboard,
  Building2,
  Users,
  Package,
  TrendingUp,
  DollarSign,
  Headphones,
  Monitor,
  Sun,
  Moon,
  Menu,
  X,
  LogOut
} from "lucide-react";

interface SidebarProps {
  activeArea: string;
  setActiveArea: (area: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onLogout: () => void;
  username: string;
}

const AREAS = [
  { 
    key: "Dashboard", 
    label: "Dashboard", 
    icon: LayoutDashboard,
    description: "Ringkasan monitoring"
  },
  { 
    key: "Strategic Management", 
    label: "Strategic Management", 
    icon: Building2,
    description: "Visi-Misi & KPI"
  },
  { 
    key: "Organizational & HR", 
    label: "Organizational & HR", 
    icon: Users,
    description: "SDM & Organisasi"
  },
  { 
    key: "Operations & Assets", 
    label: "Operations & Assets", 
    icon: Package,
    description: "Operasional & Aset"
  },
  { 
    key: "Marketing & Sales", 
    label: "Marketing & Sales", 
    icon: TrendingUp,
    description: "Pemasaran & Penjualan"
  },
  { 
    key: "Finance & Legal", 
    label: "Finance & Legal", 
    icon: DollarSign,
    description: "Keuangan & Legal"
  },
  { 
    key: "Customer Service", 
    label: "Customer Service", 
    icon: Headphones,
    description: "Layanan Pelanggan"
  },
  { 
    key: "IT & Digital", 
    label: "IT & Digital", 
    icon: Monitor,
    description: "Teknologi & Digital"
  },
];

export default function Sidebar({ 
  activeArea, 
  setActiveArea, 
  isOpen, 
  setIsOpen, 
  onLogout, 
  username 
}: SidebarProps) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-80 bg-card border-r border-border z-50 transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 lg:z-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-lg">SIM</h1>
                  <p className="text-xs text-muted-foreground">Monitoring Perusahaan</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="lg:hidden"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* User Info */}
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-sm">{username}</p>
                  <p className="text-xs text-muted-foreground">Administrator</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 p-4 overflow-y-auto">
            <nav className="space-y-2">
              {AREAS.map((area) => {
                const Icon = area.icon;
                const isActive = activeArea === area.key;
                
                return (
                  <Button
                    key={area.key}
                    variant={isActive ? "secondary" : "ghost"}
                    className={`w-full justify-start h-auto p-3 ${
                      isActive 
                        ? "bg-primary/10 border border-primary/20 text-primary hover:bg-primary/15" 
                        : "hover:bg-muted/70"
                    }`}
                    onClick={() => {
                      setActiveArea(area.key);
                      setIsOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <Icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                      <div className="flex-1 text-left">
                        <div className="font-medium text-sm">{area.label}</div>
                        <div className="text-xs text-muted-foreground">{area.description}</div>
                      </div>
                      {isActive && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                          Aktif
                        </Badge>
                      )}
                    </div>
                  </Button>
                );
              })}
            </nav>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-border space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={toggleTheme}
            >
              {theme === "light" ? (
                <Moon className="w-4 h-4 mr-3" />
              ) : (
                <Sun className="w-4 h-4 mr-3" />
              )}
              {theme === "light" ? "Mode Gelap" : "Mode Terang"}
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={onLogout}
            >
              <LogOut className="w-4 h-4 mr-3" />
              Keluar
            </Button>

            <div className="pt-2">
              <p className="text-xs text-muted-foreground text-center">
                © 2025 Sistem Monitoring Perusahaan
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}