import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Play, 
  Clock, 
  Users,
  MoreVertical,
  Trash2,
  Download,
  Share2
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AnalysisItem {
  id: string;
  title: string;
  date: string;
  duration: string;
  formation: string;
  playersDetected: number;
  thumbnail?: string;
}

const mockAnalyses: AnalysisItem[] = [
  {
    id: "1",
    title: "Match vs FC Lyon - 2ème mi-temps",
    date: "Aujourd'hui",
    duration: "1:45",
    formation: "4-3-3",
    playersDetected: 22,
  },
  {
    id: "2",
    title: "Entrainement - Phase offensive",
    date: "Hier",
    duration: "2:12",
    formation: "4-4-2",
    playersDetected: 18,
  },
  {
    id: "3",
    title: "Match vs AS Monaco - Action but",
    date: "Il y a 3 jours",
    duration: "0:45",
    formation: "3-5-2",
    playersDetected: 20,
  },
  {
    id: "4",
    title: "Analyse défensive - Corner",
    date: "Il y a 5 jours",
    duration: "0:32",
    formation: "4-4-2",
    playersDetected: 22,
  },
  {
    id: "5",
    title: "Match vs OL - Contre-attaque",
    date: "Il y a 1 semaine",
    duration: "1:15",
    formation: "4-3-3",
    playersDetected: 21,
  },
  {
    id: "6",
    title: "Entrainement - Pressing haut",
    date: "Il y a 1 semaine",
    duration: "1:58",
    formation: "4-3-3",
    playersDetected: 14,
  },
];

export default function Analyses() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAnalyses = mockAnalyses.filter((analysis) =>
    analysis.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading font-bold text-3xl text-foreground mb-1">
            Mes analyses
          </h1>
          <p className="text-muted-foreground">
            {mockAnalyses.length} analyses au total
          </p>
        </div>
        <Link to="/upload">
          <Button variant="glow">Nouvelle analyse</Button>
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher une analyse..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtres
          </Button>
          
          <div className="flex items-center gap-1 p-1 rounded-lg bg-secondary">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2 rounded-md transition-all",
                viewMode === "grid"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2 rounded-md transition-all",
                viewMode === "list"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Analyses Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAnalyses.map((analysis, index) => (
            <Link
              key={analysis.id}
              to={`/analysis/${analysis.id}`}
              className="group glass-card overflow-hidden hover:border-primary/30 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-muted overflow-hidden">
                <div className="absolute inset-0 field-gradient opacity-50" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-background/80 backdrop-blur flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                    <Play className="w-6 h-6 ml-0.5 text-foreground group-hover:text-primary-foreground" />
                  </div>
                </div>
                <span className="absolute bottom-2 right-2 text-xs font-medium bg-background/80 px-2 py-1 rounded">
                  {analysis.duration}
                </span>
                <span className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-primary/90 text-primary-foreground text-xs font-semibold">
                  {analysis.formation}
                </span>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-medium text-foreground mb-2 truncate group-hover:text-primary transition-colors">
                  {analysis.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {analysis.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {analysis.playersDetected}
                    </span>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button 
                        className="p-1 hover:bg-secondary rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => e.preventDefault()}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Download className="w-4 h-4 mr-2" />
                        Exporter
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Share2 className="w-4 h-4 mr-2" />
                        Partager
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="glass-card divide-y divide-border">
          {filteredAnalyses.map((analysis, index) => (
            <Link
              key={analysis.id}
              to={`/analysis/${analysis.id}`}
              className="flex items-center gap-4 p-4 hover:bg-secondary/50 transition-all animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Thumbnail */}
              <div className="relative w-32 aspect-video rounded-lg bg-muted overflow-hidden shrink-0">
                <div className="absolute inset-0 field-gradient opacity-50" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="w-6 h-6 text-foreground" />
                </div>
                <span className="absolute bottom-1 right-1 text-[10px] font-medium bg-background/80 px-1.5 py-0.5 rounded">
                  {analysis.duration}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-foreground mb-1 truncate">
                  {analysis.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {analysis.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {analysis.playersDetected} joueurs
                  </span>
                </div>
              </div>

              {/* Formation */}
              <span className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-semibold shrink-0">
                {analysis.formation}
              </span>

              {/* Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button 
                    className="p-2 hover:bg-secondary rounded"
                    onClick={(e) => e.preventDefault()}
                  >
                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Download className="w-4 h-4 mr-2" />
                    Exporter
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share2 className="w-4 h-4 mr-2" />
                    Partager
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </Link>
          ))}
        </div>
      )}

      {filteredAnalyses.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">Aucune analyse trouvée</p>
        </div>
      )}
    </MainLayout>
  );
}
