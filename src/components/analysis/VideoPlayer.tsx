import { useState } from "react";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Maximize,
  Layers
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface VideoPlayerProps {
  className?: string;
}

export function VideoPlayer({ className }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(32);
  const [duration] = useState(105);
  const [showOverlay, setShowOverlay] = useState(true);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = (currentTime / duration) * 100;

  // Mock timeline markers for key events
  const markers = [
    { time: 15, type: "formation", label: "Changement formation" },
    { time: 45, type: "advantage", label: "Surnombre 3v2" },
    { time: 78, type: "danger", label: "Zone à risque" },
    { time: 92, type: "formation", label: "Repli défensif" },
  ];

  return (
    <div className={cn("glass-card overflow-hidden", className)}>
      {/* Video Container */}
      <div className="relative aspect-video bg-background/50">
        {/* Placeholder for video - shows field with overlay */}
        <div className="absolute inset-0 field-gradient opacity-30" />
        
        {/* Overlay toggle indicator */}
        {showOverlay && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-background/80 backdrop-blur flex items-center justify-center mb-4 mx-auto border border-primary/20">
                <Play className="w-10 h-10 text-primary ml-1" />
              </div>
              <p className="text-sm text-muted-foreground">
                Overlay IA actif
              </p>
            </div>
          </div>
        )}

        {/* Video overlay elements (player detection boxes would go here) */}
        {showOverlay && (
          <>
            {/* Example detection boxes */}
            <div className="absolute top-[30%] left-[25%] w-8 h-12 border-2 border-team-home rounded animate-pulse" />
            <div className="absolute top-[35%] left-[45%] w-8 h-12 border-2 border-team-home rounded animate-pulse" />
            <div className="absolute top-[40%] left-[65%] w-8 h-12 border-2 border-team-away rounded animate-pulse" />
            <div className="absolute top-[45%] left-[55%] w-8 h-12 border-2 border-team-away rounded animate-pulse" />
          </>
        )}

        {/* Overlay Toggle */}
        <Button
          variant="glass"
          size="sm"
          className="absolute top-4 right-4"
          onClick={() => setShowOverlay(!showOverlay)}
        >
          <Layers className="w-4 h-4 mr-2" />
          {showOverlay ? "Masquer" : "Afficher"} overlay
        </Button>
      </div>

      {/* Controls */}
      <div className="p-4 bg-secondary/30">
        {/* Timeline with markers */}
        <div className="relative mb-4">
          <Slider
            value={[progress]}
            max={100}
            step={0.1}
            className="cursor-pointer"
            onValueChange={([value]) => setCurrentTime((value / 100) * duration)}
          />
          
          {/* Event markers on timeline */}
          {markers.map((marker, index) => (
            <div
              key={index}
              className={cn(
                "absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full cursor-pointer transition-transform hover:scale-150",
                marker.type === "formation" && "bg-primary",
                marker.type === "advantage" && "bg-success",
                marker.type === "danger" && "bg-warning"
              )}
              style={{ left: `${(marker.time / duration) * 100}%` }}
              title={marker.label}
            />
          ))}
        </div>

        <div className="flex items-center justify-between">
          {/* Left controls */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <SkipBack className="w-4 h-4" />
            </Button>
            <Button
              variant="default"
              size="icon"
              className="w-10 h-10"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </Button>
            <Button variant="ghost" size="icon">
              <SkipForward className="w-4 h-4" />
            </Button>
            
            <span className="text-sm text-muted-foreground ml-2">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Volume2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Maximize className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Event markers legend */}
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
          <span className="text-xs text-muted-foreground">Événements:</span>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">Formation</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-success" />
            <span className="text-xs text-muted-foreground">Surnombre</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-warning" />
            <span className="text-xs text-muted-foreground">Zone à risque</span>
          </div>
        </div>
      </div>
    </div>
  );
}
