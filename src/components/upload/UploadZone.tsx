import { useState, useCallback } from "react";
import { Upload, Film, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

type UploadState = "idle" | "uploading" | "processing" | "complete" | "error";

const processingSteps = [
  { id: 1, label: "Téléversement de la vidéo...", duration: 2000 },
  { id: 2, label: "Détection des joueurs...", duration: 3000 },
  { id: 3, label: "Classification des équipes...", duration: 2000 },
  { id: 4, label: "Analyse de la formation...", duration: 2500 },
  { id: 5, label: "Calcul des zones à risque...", duration: 2000 },
  { id: 6, label: "Génération des heatmaps...", duration: 1500 },
];

export function UploadZone() {
  const [state, setState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const simulateProcessing = useCallback(() => {
    setState("uploading");
    setProgress(0);
    setCurrentStep(0);

    let totalProgress = 0;
    const totalDuration = processingSteps.reduce((acc, step) => acc + step.duration, 0);

    processingSteps.forEach((step, index) => {
      const stepProgress = (step.duration / totalDuration) * 100;
      
      setTimeout(() => {
        setCurrentStep(index);
        if (index > 0) setState("processing");
        
        const startProgress = totalProgress;
        const endProgress = totalProgress + stepProgress;
        const startTime = Date.now();
        
        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / step.duration, 1);
          setProgress(startProgress + (endProgress - startProgress) * progress);
          
          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        
        requestAnimationFrame(animate);
        totalProgress = endProgress;
      }, processingSteps.slice(0, index).reduce((acc, s) => acc + s.duration, 0));
    });

    setTimeout(() => {
      setState("complete");
      setProgress(100);
    }, totalDuration);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setFileName(files[0].name);
      simulateProcessing();
    }
  }, [simulateProcessing]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setFileName(files[0].name);
      simulateProcessing();
    }
  }, [simulateProcessing]);

  const resetUpload = () => {
    setState("idle");
    setProgress(0);
    setCurrentStep(0);
    setFileName("");
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {state === "idle" && (
        <div
          className={cn(
            "relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer group",
            dragActive
              ? "border-primary bg-primary/5 scale-[1.02]"
              : "border-border hover:border-primary/50 hover:bg-secondary/30"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className={cn(
            "w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center transition-all duration-300",
            dragActive && "bg-primary/20 scale-110"
          )}>
            <Upload className={cn(
              "w-10 h-10 text-primary transition-transform duration-300",
              dragActive && "scale-110"
            )} />
          </div>
          
          <h3 className="font-heading font-semibold text-xl text-foreground mb-2">
            Glissez votre vidéo ici
          </h3>
          <p className="text-muted-foreground mb-6">
            ou cliquez pour sélectionner un fichier
          </p>
          
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Film className="w-4 h-4" />
              MP4, MOV, AVI
            </span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <span>30s - 2min</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <span>Max 500MB</span>
          </div>
        </div>
      )}

      {(state === "uploading" || state === "processing") && (
        <div className="glass-card p-8 animate-scale-in">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-lg text-foreground">
                Analyse en cours
              </h3>
              <p className="text-sm text-muted-foreground">{fileName}</p>
            </div>
          </div>

          <Progress value={progress} className="h-2 mb-6" />

          <div className="space-y-3">
            {processingSteps.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  "flex items-center gap-3 text-sm transition-all duration-300",
                  index < currentStep
                    ? "text-success"
                    : index === currentStep
                    ? "text-foreground"
                    : "text-muted-foreground/50"
                )}
              >
                {index < currentStep ? (
                  <CheckCircle className="w-4 h-4" />
                ) : index === currentStep ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-current" />
                )}
                <span>{step.label}</span>
              </div>
            ))}
          </div>

          <p className="mt-6 text-xs text-muted-foreground text-center">
            Temps estimé: ~{Math.ceil((100 - progress) / 10)}s
          </p>
        </div>
      )}

      {state === "complete" && (
        <div className="glass-card p-8 text-center animate-scale-in">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-success/10 flex items-center justify-center glow-effect">
            <CheckCircle className="w-8 h-8 text-success" />
          </div>
          
          <h3 className="font-heading font-semibold text-xl text-foreground mb-2">
            Analyse terminée!
          </h3>
          <p className="text-muted-foreground mb-6">
            Votre vidéo a été analysée avec succès
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <Button variant="outline" onClick={resetUpload}>
              Nouvelle analyse
            </Button>
            <Button variant="glow">
              Voir les résultats
            </Button>
          </div>
        </div>
      )}

      {state === "error" && (
        <div className="glass-card p-8 text-center animate-scale-in border-destructive/50">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          
          <h3 className="font-heading font-semibold text-xl text-foreground mb-2">
            Erreur lors de l'analyse
          </h3>
          <p className="text-muted-foreground mb-6">
            Une erreur s'est produite. Veuillez réessayer.
          </p>
          
          <Button variant="outline" onClick={resetUpload}>
            Réessayer
          </Button>
        </div>
      )}
    </div>
  );
}
