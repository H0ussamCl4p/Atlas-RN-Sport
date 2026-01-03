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
      </div>
    </MainLayout>
  );
}
