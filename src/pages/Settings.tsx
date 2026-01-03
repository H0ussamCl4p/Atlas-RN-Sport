import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
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

export default function Settings() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-heading font-bold text-4xl text-foreground mb-2">
            Paramètres
          </h1>
          <p className="text-muted-foreground text-lg">
            Gérez vos préférences et informations de compte
          </p>
        </div>

        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Informations du profil
            </CardTitle>
            <CardDescription>
              Vos informations personnelles et votre rôle
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <div className="space-y-2">
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  value={user.first_name || ""}
                  disabled
                  className="bg-muted"
                />
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  value={user.last_name || ""}
                  disabled
                  className="bg-muted"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user.email}
                  disabled
                  className="bg-muted"
                />
              </div>

              {/* Role */}
              <div className="space-y-2">
                <Label htmlFor="role">Rôle</Label>
                <Input
                  id="role"
                  value={user.roles && user.roles.length > 0 ? user.roles[0].charAt(0).toUpperCase() + user.roles[0].slice(1) : "Non défini"}
                  disabled
                  className="bg-muted"
                />
              </div>

              {/* Organization */}
              <div className="space-y-2">
                <Label htmlFor="organization">Club / Organisation</Label>
                <Input
                  id="organization"
                  value={user.organization || ""}
                  disabled
                  className="bg-muted"
                />
              </div>

              {/* Level */}
              <div className="space-y-2">
                <Label htmlFor="level">Niveau</Label>
                <Input
                  id="level"
                  value={
                    user.level === "amateur" ? "Amateur" :
                    user.level === "semi-pro" ? "Semi-professionnel" :
                    user.level === "pro" ? "Professionnel" :
                    ""
                  }
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Gérez vos préférences de notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Notifications par email</p>
                <p className="text-sm text-muted-foreground">Recevez des emails sur l'activité</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Alertes d'analyse terminée</p>
                <p className="text-sm text-muted-foreground">Notification quand une analyse est prête</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Résumé hebdomadaire</p>
                <p className="text-sm text-muted-foreground">Recevez un résumé chaque semaine</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Appearance Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Apparence
            </CardTitle>
            <CardDescription>
              Personnalisez l'interface
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Thème sombre</p>
                <p className="text-sm text-muted-foreground">Utilisez un thème sombre</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Animations</p>
                <p className="text-sm text-muted-foreground">Activer les animations d'interface</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Mode compact</p>
                <p className="text-sm text-muted-foreground">Interface plus compacte</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Privacy Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Confidentialité
            </CardTitle>
            <CardDescription>
              Gérez vos paramètres de confidentialité
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Partage de données analytiques</p>
                <p className="text-sm text-muted-foreground">Aidez-nous à améliorer le produit</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
