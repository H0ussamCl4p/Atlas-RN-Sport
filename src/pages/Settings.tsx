import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  User, 
  Bell, 
  Palette, 
  Shield, 
  HelpCircle,
  ChevronRight,
  Save
} from "lucide-react";
import { cn } from "@/lib/utils";

const settingsSections = [
  {
    id: "profile",
    title: "Profil",
    icon: User,
    items: [
      { label: "Nom d'équipe", value: "FC Example", type: "text" },
      { label: "Email", value: "coach@example.com", type: "text" },
      { label: "Langue", value: "Français", type: "select" },
    ],
  },
  {
    id: "notifications",
    title: "Notifications",
    icon: Bell,
    items: [
      { label: "Notifications par email", value: true, type: "toggle" },
      { label: "Alertes d'analyse terminée", value: true, type: "toggle" },
      { label: "Résumé hebdomadaire", value: false, type: "toggle" },
    ],
  },
  {
    id: "appearance",
    title: "Apparence",
    icon: Palette,
    items: [
      { label: "Thème sombre", value: true, type: "toggle" },
      { label: "Animations", value: true, type: "toggle" },
      { label: "Mode compact", value: false, type: "toggle" },
    ],
  },
  {
    id: "privacy",
    title: "Confidentialité",
    icon: Shield,
    items: [
      { label: "Partage de données analytiques", value: false, type: "toggle" },
      { label: "Vidéos privées par défaut", value: true, type: "toggle" },
    ],
  },
];

export default function Settings() {
  return (
    <MainLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading font-bold text-3xl text-foreground mb-1">
            Paramètres
          </h1>
          <p className="text-muted-foreground">
            Gérez vos préférences et votre compte
          </p>
        </div>
        <Button variant="glow">
          <Save className="w-4 h-4 mr-2" />
          Sauvegarder
        </Button>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {settingsSections.map((section) => (
            <div key={section.id} className="glass-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <section.icon className="w-5 h-5 text-primary" />
                </div>
                <h2 className="font-heading font-semibold text-lg text-foreground">
                  {section.title}
                </h2>
              </div>

              <div className="space-y-4">
                {section.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 border-b border-border last:border-0"
                  >
                    <span className="text-sm text-foreground">{item.label}</span>
                    
                    {item.type === "toggle" && (
                      <Switch defaultChecked={item.value as boolean} />
                    )}
                    
                    {item.type === "text" && (
                      <span className="text-sm text-muted-foreground">
                        {item.value as string}
                      </span>
                    )}
                    
                    {item.type === "select" && (
                      <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {item.value as string}
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Info */}
          <div className="glass-card p-6">
            <h3 className="font-heading font-semibold text-foreground mb-4">
              Mon compte
            </h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">Coach Principal</p>
                <p className="text-sm text-muted-foreground">Plan Pro</p>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Modifier le profil
            </Button>
          </div>

          {/* Storage */}
          <div className="glass-card p-6">
            <h3 className="font-heading font-semibold text-foreground mb-4">
              Stockage
            </h3>
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Utilisé</span>
                <span className="text-foreground font-medium">2.4 GB / 10 GB</span>
              </div>
              <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: "24%" }}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              24 analyses stockées
            </p>
          </div>

          {/* Help */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-heading font-semibold text-foreground">
                Besoin d'aide?
              </h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Consultez notre documentation ou contactez le support.
            </p>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Documentation
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Contacter le support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
