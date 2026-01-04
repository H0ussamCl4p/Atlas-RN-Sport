import { useState, useCallback } from "react";
import { Upload, Film, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  uploadVideo,
  createAnalysis,
  pollAnalysisStatus,
  type AnalysisResponse,
} from "@/services/aiService";

type UploadState = "idle" | "uploading" | "processing" | "complete" | "error";

const processingSteps = [
  { id: 1, label: "Téléversement de la vidéo...", status: "upload" },
  { id: 2, label: "Création de l'analyse...", status: "create" },
  { id: 3, label: "Détection des joueurs...", status: "processing" },
  { id: 4, label: "Classification des équipes...", status: "processing" },
  { id: 5, label: "Analyse tactique...", status: "processing" },
  { id: 6, label: "Finalisation...", status: "processing" },
];

export function UploadZone() {
  const navigate = useNavigate();
  const [state, setState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [analysisId, setAnalysisId] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const processVideo = useCallback(async (file: File) => {
    try {
      // Step 1: Upload video
      setState("uploading");
      setProgress(0);
      setCurrentStep(0);
      setErrorMessage("");

      const videoResponse = await uploadVideo(file, (uploadProgress) => {
        setProgress(uploadProgress * 0.3); // Upload is 30% of total
      });

      // Step 2: Create analysis
      setCurrentStep(1);
      setProgress(30);

      const analysisResponse = await createAnalysis(videoResponse.id);
      console.log("Analysis created with ID:", analysisResponse.id);
      setAnalysisId(analysisResponse.id);

      // Step 3: Poll for analysis completion
      setState("processing");
      setCurrentStep(2);
      setProgress(40);

      await pollAnalysisStatus(
        analysisResponse.id,
        (analysis: AnalysisResponse) => {
          // Update progress based on status
          if (analysis.status === "processing") {
            const stepIndex = Math.min(
              currentStep + 1,
              processingSteps.length - 1
            );
            setCurrentStep(stepIndex);
            setProgress(40 + (stepIndex - 1) * 10);
          }
        },
        120, // 120 attempts
        5000 // 5 seconds interval
      );

      // Analysis complete!
      setState("complete");
      setProgress(100);
      setCurrentStep(processingSteps.length - 1);
    } catch (error) {
      console.error("Video processing error:", error);
      setState("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Une erreur s'est produite lors du traitement"
      );
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const files = e.dataTransfer.files;
      if (files && files[0]) {
        const file = files[0];

        // Validate file type
        const validTypes = [
          "video/mp4",
          "video/avi",
          "video/mov",
          "video/mkv",
          "video/x-matroska",
        ];
        if (
          !validTypes.includes(file.type) &&
          !file.name.match(/\.(mp4|avi|mov|mkv)$/i)
        ) {
          setState("error");
          setErrorMessage(
            "Format de fichier non supporté. Utilisez MP4, AVI, MOV ou MKV."
          );
          return;
        }

        // Validate file size (max 500MB)
        if (file.size > 500 * 1024 * 1024) {
          setState("error");
          setErrorMessage("Fichier trop volumineux. Maximum 500 MB.");
          return;
        }

        setFileName(file.name);
        processVideo(file);
      }
    },
    [processVideo]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files[0]) {
        const file = files[0];

        // Validate file type
        const validTypes = [
          "video/mp4",
          "video/avi",
          "video/mov",
          "video/mkv",
          "video/x-matroska",
        ];
        if (
          !validTypes.includes(file.type) &&
          !file.name.match(/\.(mp4|avi|mov|mkv)$/i)
        ) {
          setState("error");
          setErrorMessage(
            "Format de fichier non supporté. Utilisez MP4, AVI, MOV ou MKV."
          );
          return;
        }

        // Validate file size (max 500MB)
        if (file.size > 500 * 1024 * 1024) {
          setState("error");
          setErrorMessage("Fichier trop volumineux. Maximum 500 MB.");
          return;
        }

        setFileName(file.name);
        processVideo(file);
      }
    },
    [processVideo]
  );

  const resetUpload = () => {
    setState("idle");
    setProgress(0);
    setCurrentStep(0);
    setFileName("");
    setErrorMessage("");
    setAnalysisId(null);
  };

  const viewResults = () => {
    console.log("viewResults called with analysisId:", analysisId);
    if (analysisId) {
      navigate(`/analysis/${analysisId}`);
    } else {
      console.error("No analysisId available for navigation");
      setErrorMessage("ID d'analyse manquant. Veuillez réessayer.");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      {state === "idle" && (
        <div
          className={cn(
            "relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all duration-300 cursor-pointer group",
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

          <div
            className={cn(
              "w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-2xl bg-primary/10 flex items-center justify-center transition-all duration-300",
              dragActive && "bg-primary/20 scale-110"
            )}
          >
            <Upload
              className={cn(
                "w-8 h-8 sm:w-10 sm:h-10 text-primary transition-transform duration-300",
                dragActive && "scale-110"
              )}
            />
          </div>

          <h3 className="font-heading font-semibold text-lg sm:text-xl text-foreground mb-2">
            Glissez votre vidéo ici
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
            ou cliquez pour sélectionner un fichier
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Film className="w-4 h-4" />
              MP4, MOV, AVI
            </span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <span>30s - 2min</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground hidden sm:block" />
            <span className="hidden sm:inline">Max 500MB</span>
          </div>
        </div>
      )}

      {(state === "uploading" || state === "processing") && (
        <div className="glass-card p-6 sm:p-8 animate-scale-in">
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary animate-spin" />
            </div>
            <div className="min-w-0">
              <h3 className="font-heading font-semibold text-base sm:text-lg text-foreground truncate">
                Analyse en cours
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                {fileName}
              </p>
            </div>
          </div>

          <Progress value={progress} className="h-2 mb-4 sm:mb-6" />

          <div className="space-y-2 sm:space-y-3">
            {processingSteps.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  "flex items-center gap-2 sm:gap-3 text-xs sm:text-sm transition-all duration-300",
                  index < currentStep
                    ? "text-success"
                    : index === currentStep
                    ? "text-foreground"
                    : "text-muted-foreground/50"
                )}
              >
                {index < currentStep ? (
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                ) : index === currentStep ? (
                  <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-current flex-shrink-0" />
                )}
                <span>{step.label}</span>
              </div>
            ))}
          </div>

          <p className="mt-4 sm:mt-6 text-xs text-muted-foreground text-center">
            Temps estimé: ~{Math.ceil((100 - progress) / 10)}s
          </p>
        </div>
      )}

      {state === "complete" && (
        <div className="glass-card p-6 sm:p-8 text-center animate-scale-in">
          <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-full bg-success/10 flex items-center justify-center glow-effect">
            <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 text-success" />
          </div>

          <h3 className="font-heading font-semibold text-lg sm:text-xl text-foreground mb-2">
            Analyse terminée!
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground mb-6">
            Votre vidéo a été analysée avec succès
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Button
              variant="outline"
              onClick={resetUpload}
              className="w-full sm:w-auto min-h-[44px]"
            >
              Nouvelle analyse
            </Button>
            <Button
              variant="glow"
              onClick={viewResults}
              disabled={!analysisId}
              className="w-full sm:w-auto min-h-[44px]"
            >
              Voir les résultats
            </Button>
          </div>
        </div>
      )}

      {state === "error" && (
        <div className="glass-card p-6 sm:p-8 text-center animate-scale-in border-destructive/50">
          <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="w-7 h-7 sm:w-8 sm:h-8 text-destructive" />
          </div>

          <h3 className="font-heading font-semibold text-lg sm:text-xl text-foreground mb-2">
            Erreur lors de l'analyse
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground mb-6">
            {errorMessage || "Une erreur s'est produite. Veuillez réessayer."}
          </p>

          <Button
            variant="outline"
            onClick={resetUpload}
            className="w-full sm:w-auto min-h-[44px]"
          >
            Réessayer
          </Button>
        </div>
      )}
    </div>
  );
}
