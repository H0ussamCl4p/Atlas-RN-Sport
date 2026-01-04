"""
Real Video Processing Integration
Connects the YOLO + EGNN pipeline to the AI service
"""

import sys
from pathlib import Path
from typing import Dict, Optional, Callable
import numpy as np
import torch

# Add parent directory to path to import video_processor
root_path = Path(__file__).parent.parent.parent.parent.parent
sys.path.insert(0, str(root_path))

try:
    from video_processor import FootballVideoProcessor
    PROCESSOR_AVAILABLE = True
except ImportError as e:
    print(f"Warning: video_processor not available: {e}")
    PROCESSOR_AVAILABLE = False

try:
    import torch.nn as nn
    MODEL_AVAILABLE = True
except ImportError:
    MODEL_AVAILABLE = False


class TacticalGNN(nn.Module):
    """Tactical vulnerability GNN model (simplified version)"""
    def __init__(self):
        super().__init__()
        self.node_encoder = nn.Linear(8, 64)
        self.layer1 = nn.Linear(128, 64)
        self.layer2 = nn.Linear(128, 64)
        self.layer3 = nn.Linear(128, 64)
        self.formation_head = nn.Linear(64, 10)
        self.pressing_head = nn.Linear(64, 1)
        self.overload_head = nn.Linear(64, 1)
    
    def forward(self, x, edges):
        N = x.shape[0]
        x = torch.relu(self.node_encoder(x))
        
        for layer in [self.layer1, self.layer2, self.layer3]:
            msg = torch.zeros_like(x)
            cnt = torch.zeros(N, 1)
            for (i, j) in edges:
                msg[i] += x[j]
                cnt[i] += 1
            cnt = cnt.clamp(min=1)
            msg = msg / cnt
            x = torch.relu(layer(torch.cat([x, msg], dim=1)))
        
        graph = x.mean(dim=0, keepdim=True)
        
        return {
            'formation': self.formation_head(graph),
            'pressing': torch.sigmoid(self.pressing_head(graph)),
            'overload': torch.sigmoid(self.overload_head(x))
        }


FORMATIONS = ['4-4-2', '4-3-3', '4-2-3-1', '3-5-2', '4-5-1',
              '3-4-3', '5-3-2', '5-4-1', '4-1-4-1', '3-4-2-1']


class RealVideoAnalyzer:
    """
    Real video analysis using YOLO detection + EGNN tactical model
    """
    
    def __init__(self, roboflow_api_key: Optional[str] = None):
        self.roboflow_api_key = roboflow_api_key
        self.video_processor = None
        self.tactical_model = None
        
        # Initialize video processor if available
        if PROCESSOR_AVAILABLE and roboflow_api_key:
            try:
                self.video_processor = FootballVideoProcessor(
                    roboflow_api_key=roboflow_api_key,
                    device="cuda" if torch.cuda.is_available() else "cpu"
                )
                print("✓ Video processor initialized with YOLO models")
            except Exception as e:
                print(f"Warning: Could not initialize video processor: {e}")
        
        # Load tactical model if available
        if MODEL_AVAILABLE:
            try:
                self.tactical_model = TacticalGNN()
                model_path = root_path / "models" / "tactical_vulnerability_complete.pth"
                if model_path.exists():
                    state = torch.load(model_path, map_location="cpu")
                    self.tactical_model.load_state_dict(state)
                    self.tactical_model.eval()
                    print(f"✓ Tactical GNN model loaded from {model_path}")
                else:
                    print(f"Warning: Model not found at {model_path}")
            except Exception as e:
                print(f"Warning: Could not load tactical model: {e}")
    
    def analyze_video(
        self,
        video_path: str,
        progress_callback: Optional[Callable] = None
    ) -> Dict:
        """
        Analyze video and return tactical insights
        
        Args:
            video_path: Path to video file
            progress_callback: Callback(progress_percent, message)
        
        Returns:
            Dictionary with tactical analysis results
        """
        if not self.video_processor:
            raise RuntimeError(
                "Video processor not initialized. "
                "Please set ROBOFLOW_API_KEY environment variable."
            )
        
        # Step 1: Process video with YOLO detection
        if progress_callback:
            progress_callback(10, "Detecting players with YOLO...")
        
        tracking_data = self.video_processor.process_video(
            video_path=video_path,
            confidence=0.3,
            stride=2,  # Process every 2nd frame for speed
            max_frames=300,  # Limit to ~10 seconds at 30fps
            progress_callback=lambda p, m: progress_callback(10 + p * 0.6, m) if progress_callback else None
        )
        
        # Step 2: Extract player positions and formations
        if progress_callback:
            progress_callback(70, "Analyzing tactical patterns...")
        
        analysis_results = self._analyze_tracking_data(tracking_data)
        
        if progress_callback:
            progress_callback(100, "Analysis complete!")
        
        return analysis_results
    
    def _analyze_tracking_data(self, tracking_data: Dict) -> Dict:
        """Convert tracking data to tactical analysis"""
        
        frames = tracking_data.get('frames', [])
        if not frames:
            raise ValueError("No frames data in tracking results")
        
        # Use middle frame for static analysis
        mid_frame = frames[len(frames) // 2]
        
        # Extract player positions
        players = []
        team_positions = {'home': [], 'away': []}
        
        for player_id, player_data in mid_frame.get('players', {}).items():
            if 'pitch_position' not in player_data or player_data['pitch_position'] is None:
                continue
            
            pitch_pos = player_data['pitch_position']
            team = 'home' if player_data.get('team_id') == 0 else 'away'
            
            # Convert pitch coordinates to percentage (0-100)
            x = (pitch_pos[0] / 105.0) * 100  # Pitch length
            y = (pitch_pos[1] / 68.0) * 100   # Pitch width
            
            player_info = {
                'id': f"{team}_{player_id}",
                'x': x,
                'y': y,
                'team': team,
                'number': player_id,
                'tracker_id': int(player_id) if isinstance(player_id, (int, float)) else None
            }
            players.append(player_info)
            team_positions[team].append((x, y))
        
        # Detect formations using GNN model
        formations = self._detect_formations(players)
        
        # Calculate threat zones
        threat_zones = self._calculate_threat_zones(team_positions['home'])
        
        # Calculate weakness zones
        weakness_zones = self._calculate_weakness_zones(team_positions['away'])
        
        # Calculate vulnerability scores
        vulnerability_scores = self._calculate_vulnerabilities(team_positions)
        
        return {
            'players': players,
            'threat_zones': threat_zones,
            'weakness_zones': weakness_zones,
            'xg_by_zone': self._calculate_xg_zones(team_positions),
            'summary': {
                'total_players_detected': len(players),
                'avg_players_per_frame': len(players),
                'home_team_players': len(team_positions['home']),
                'away_team_players': len(team_positions['away']),
                'formations_detected': formations,
                'key_metrics': {
                    'possession_zones': len(threat_zones),
                    'high_pressure_areas': sum(1 for z in threat_zones if z['threat_score'] > 0.7),
                    'defensive_vulnerabilities': len(weakness_zones)
                }
            },
            'vulnerability_scores': vulnerability_scores
        }
    
    def _detect_formations(self, players: list) -> Dict[str, str]:
        """Detect team formations from player positions"""
        # Group by team
        home_players = [p for p in players if p['team'] == 'home']
        away_players = [p for p in players if p['team'] == 'away']
        
        # Simple formation detection based on x-coordinate clustering
        def detect_formation(team_players):
            if len(team_players) < 8:
                return "Unknown"
            
            x_coords = sorted([p['x'] for p in team_players])
            
            # Count players in defensive, midfield, attacking thirds
            defensive = sum(1 for x in x_coords if x < 33)
            midfield = sum(1 for x in x_coords if 33 <= x < 66)
            attacking = sum(1 for x in x_coords if x >= 66)
            
            # Map to common formations
            formation_key = f"{defensive}-{midfield}-{attacking}"
            formation_map = {
                '4-3-3': '4-3-3', '4-4-2': '4-4-2', '4-2-3': '4-2-3-1',
                '3-5-2': '3-5-2', '3-4-3': '3-4-3', '5-3-2': '5-3-2'
            }
            
            return formation_map.get(formation_key, f"{defensive}-{midfield}-{attacking}")
        
        return {
            'home': detect_formation(home_players),
            'away': detect_formation(away_players)
        }
    
    def _calculate_threat_zones(self, positions: list) -> list:
        """Calculate threat zones from attacking team positions"""
        if len(positions) < 3:
            return []
        
        # Cluster positions to find concentration areas
        try:
            from sklearn.cluster import DBSCAN
            import numpy as np
            
            positions_array = np.array(positions)
            clustering = DBSCAN(eps=15, min_samples=2).fit(positions_array)
            
            threat_zones = []
            for label in set(clustering.labels_):
                if label == -1:  # Skip noise
                    continue
                
                cluster_points = positions_array[clustering.labels_ == label]
                center_x = float(np.mean(cluster_points[:, 0]))
                center_y = float(np.mean(cluster_points[:, 1]))
                player_count = len(cluster_points)
                
                # Calculate threat score based on position and density
                threat_score = min(0.9, 0.5 + (player_count * 0.1))
                
                threat_zones.append({
                    'zone_id': f"T{label + 1}",
                    'x': center_x,
                    'y': center_y,
                    'radius': 10 + player_count * 2,
                    'threat_score': threat_score,
                    'player_count': player_count,
                    'label': f"Zone d'attaque ({player_count} joueurs)"
                })
            
            return threat_zones[:5]  # Top 5 threat zones
        except ImportError:
            # Fallback if sklearn not available
            print("Warning: sklearn not available for clustering")
            return []
    
    def _calculate_weakness_zones(self, positions: list) -> list:
        """Calculate defensive weakness zones"""
        if len(positions) < 5:
            return []
        
        # Find spaces with poor coverage
        weakness_zones = []
        
        # Sample grid points and find areas with low player density
        for x in range(20, 80, 20):
            for y in range(20, 80, 20):
                min_dist = min([((x - px)**2 + (y - py)**2)**0.5 for px, py in positions])
                
                if min_dist > 15:  # Poor coverage
                    weakness_score = min(0.9, min_dist / 20)
                    weakness_zones.append({
                        'zone_id': f"W{len(weakness_zones) + 1}",
                        'x': float(x),
                        'y': float(y),
                        'weakness_score': weakness_score,
                        'coverage': 1.0 - weakness_score,
                        'label': f"Zone faible (couverture: {(1-weakness_score)*100:.0f}%)"
                    })
        
        return sorted(weakness_zones, key=lambda z: z['weakness_score'], reverse=True)[:5]
    
    def _calculate_xg_zones(self, team_positions: dict) -> list:
        """Calculate expected goals zones"""
        xg_zones = []
        
        # Focus on attacking third
        home_attacking = [(x, y) for x, y in team_positions['home'] if x > 66]
        
        for i, (x, y) in enumerate(home_attacking[:5]):
            # xG based on distance to goal (closer = higher xG)
            distance_to_goal = ((100 - x)**2 + (50 - y)**2)**0.5
            xg_value = max(0.1, min(0.9, 1.0 - (distance_to_goal / 100)))
            
            xg_zones.append({
                'zone_id': f"X{i + 1}",
                'x': float(x),
                'y': float(y),
                'xg_value': xg_value,
                'shot_count': 1,
                'label': f"Zone xG {xg_value:.2f}"
            })
        
        return xg_zones
    
    def _calculate_vulnerabilities(self, team_positions: dict) -> dict:
        """Calculate tactical vulnerability scores"""
        
        def calculate_line_compactness(positions):
            if len(positions) < 3:
                return 0.5
            import numpy as np
            y_coords = [p[1] for p in positions]
            return 1.0 - min(1.0, np.std(y_coords) / 30)
        
        home_compact = calculate_line_compactness(team_positions['home'])
        away_compact = calculate_line_compactness(team_positions['away'])
        
        return {
            'defensive_line': 0.4 + (1 - away_compact) * 0.4,
            'midfield': 0.35 + (abs(len(team_positions['home']) - len(team_positions['away'])) * 0.05),
            'attacking_line': 0.3 + (1 - home_compact) * 0.3,
            'pressure_vulnerability': 0.45,
            'spacing_vulnerability': 0.40,
            'key_player_dependency': 0.50
        }


# Singleton instance
_analyzer_instance = None

def get_analyzer(roboflow_api_key: Optional[str] = None) -> RealVideoAnalyzer:
    """Get or create analyzer instance"""
    global _analyzer_instance
    if _analyzer_instance is None:
        _analyzer_instance = RealVideoAnalyzer(roboflow_api_key=roboflow_api_key)
    return _analyzer_instance
