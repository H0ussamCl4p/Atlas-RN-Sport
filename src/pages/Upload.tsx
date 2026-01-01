import { MainLayout } from "@/components/layout/MainLayout";
import { UploadZone } from "@/components/upload/UploadZone";
import { FileVideo, Zap, Clock, Shield } from "lucide-react";

export default function Upload() {
  return (
    <MainLayout>
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="font-heading font-bold text-3xl text-foreground mb-2">
          Nouvelle analyse
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Téléversez un clip de match pour obtenir une analyse tactique détaillée
        </p>
      </div>

      {/* Upload Zone */}
      <UploadZone />

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
        <div className="text-center p-6">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Zap className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-heading font-semibold text-foreground mb-2">
            Analyse IA rapide
          </h3>
          <p className="text-sm text-muted-foreground">
            Détection automatique des joueurs et formations en quelques secondes
          </p>
        </div>

        <div className="text-center p-6">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Clock className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-heading font-semibold text-foreground mb-2">
            Traitement optimisé
          </h3>
          <p className="text-sm text-muted-foreground">
            Clips de 30 secondes à 2 minutes pour des résultats précis
          </p>
        </div>

        <div className="text-center p-6">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-heading font-semibold text-foreground mb-2">
            Données sécurisées
          </h3>
          <p className="text-sm text-muted-foreground">
            Vos vidéos sont chiffrées et stockées de manière sécurisée
          </p>
        </div>
      </div>

      {/* Supported formats */}
      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground mb-4">Formats supportés</p>
        <div className="flex items-center justify-center gap-3">
          {["MP4", "MOV", "AVI", "MKV", "WEBM"].map((format) => (
            <span
              key={format}
              className="px-3 py-1.5 rounded-lg bg-secondary text-xs font-medium text-muted-foreground"
            >
              {format}
            </span>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
