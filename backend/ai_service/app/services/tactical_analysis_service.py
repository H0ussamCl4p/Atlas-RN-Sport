"""
Tactical analysis service wrapper
Integrates tactical analysis functions with FastAPI service
"""
import os
import sys
from pathlib import Path
from typing import List, Dict, Any, Optional
import numpy as np
import torch

# Add parent path for imports
sys.path.append(str(Path(__file__).parent.parent.parent.parent))


class TacticalAnalysisService:
    """
    Service wrapper for tactical analysis functionality.
    Provides vulnerability detection and tactical insights.
    """
    
    def __init__(self, model_path: Optional[str] = None):
        """
        Initialize tactical analysis service.
        
        Args:
            model_path: Path to trained GNN model weights
        """
        from app.services.gnn_model_service import GNNModelService
        
        # Initialize GNN model service
        self.gnn_service = GNNModelService(model_path=model_path)
    
    def detect_threat_zones(
        self,
        tracking_data: List[Dict[str, Any]],
        team: str = 'home',
        pitch_length: float = 105.0,
        pitch_width: float = 68.0,
        grid_size: int = 10
    ) -> Dict[str, Any]:
        """
        Detect high-threat zones where the team is vulnerable.
        
        Args:
            tracking_data: Frame-by-frame player tracking data
            team: 'home' or 'away'
            pitch_length: Length of pitch in meters
            pitch_width: Width of pitch in meters
            grid_size: Number of grid cells per dimension
        
        Returns:
            Dictionary with threat heatmap and critical zones
        """
        # Create grid
        threat_grid = np.zeros((grid_size, grid_size))
        count_grid = np.zeros((grid_size, grid_size))
        
        for frame in tracking_data:
            players = frame.get('players', [])
            
            # Filter by team
            team_players = [p for p in players if p.get('team') == team]
            opponent_players = [p for p in players if p.get('team') != team and p.get('team') != 'referee']
            
            # Calculate threat for each grid cell
            for i in range(grid_size):
                for j in range(grid_size):
                    # Grid cell center
                    x = (i + 0.5) * (pitch_length / grid_size)
                    y = (j + 0.5) * (pitch_width / grid_size)
                    
                    # Count nearby opponents
                    opponents_nearby = sum(
                        1 for p in opponent_players
                        if np.sqrt((p['x'] - x)**2 + (p['y'] - y)**2) < 10.0
                    )
                    
                    # Count nearby teammates
                    teammates_nearby = sum(
                        1 for p in team_players
                        if np.sqrt((p['x'] - x)**2 + (p['y'] - y)**2) < 10.0
                    )
                    
                    # Threat = opponent density - teammate density
                    threat = opponents_nearby - teammates_nearby
                    threat_grid[i, j] += max(0, threat)
                    count_grid[i, j] += 1
        
        # Average threat over all frames
        threat_grid = np.divide(
            threat_grid, 
            count_grid, 
            where=count_grid > 0,
            out=np.zeros_like(threat_grid)
        )
        
        # Find top 5 threat zones
        flat_indices = np.argsort(threat_grid.flatten())[::-1][:5]
        critical_zones = []
        
        for idx in flat_indices:
            i, j = np.unravel_index(idx, threat_grid.shape)
            critical_zones.append({
                'grid_x': int(i),
                'grid_y': int(j),
                'x_meters': (i + 0.5) * (pitch_length / grid_size),
                'y_meters': (j + 0.5) * (pitch_width / grid_size),
                'threat_score': float(threat_grid[i, j])
            })
        
        return {
            'threat_heatmap': threat_grid.tolist(),
            'grid_size': grid_size,
            'pitch_dimensions': {'length': pitch_length, 'width': pitch_width},
            'critical_zones': critical_zones
        }
    
    def detect_weakness_zones(
        self,
        tracking_data: List[Dict[str, Any]],
        team: str = 'home',
        pitch_length: float = 105.0,
        pitch_width: float = 68.0,
        grid_size: int = 10
    ) -> Dict[str, Any]:
        """
        Detect zones with low defensive coverage (weaknesses).
        
        Args:
            tracking_data: Frame-by-frame player tracking data
            team: 'home' or 'away'
            pitch_length: Length of pitch in meters
            pitch_width: Width of pitch in meters
            grid_size: Number of grid cells per dimension
        
        Returns:
            Dictionary with coverage heatmap and weak zones
        """
        # Create coverage grid
        coverage_grid = np.zeros((grid_size, grid_size))
        count_grid = np.zeros((grid_size, grid_size))
        
        for frame in tracking_data:
            players = frame.get('players', [])
            
            # Filter by team (defenders only)
            team_players = [p for p in players if p.get('team') == team]
            
            # Calculate coverage for each grid cell
            for i in range(grid_size):
                for j in range(grid_size):
                    x = (i + 0.5) * (pitch_length / grid_size)
                    y = (j + 0.5) * (pitch_width / grid_size)
                    
                    # Count nearby defenders (within 15m)
                    defenders_nearby = sum(
                        1 for p in team_players
                        if np.sqrt((p['x'] - x)**2 + (p['y'] - y)**2) < 15.0
                    )
                    
                    coverage_grid[i, j] += defenders_nearby
                    count_grid[i, j] += 1
        
        # Average coverage
        coverage_grid = np.divide(
            coverage_grid,
            count_grid,
            where=count_grid > 0,
            out=np.zeros_like(coverage_grid)
        )
        
        # Weak zones have low coverage
        weakness_grid = 1.0 / (coverage_grid + 0.1)  # Inverse of coverage
        
        # Find top 5 weak zones
        flat_indices = np.argsort(weakness_grid.flatten())[::-1][:5]
        weak_zones = []
        
        for idx in flat_indices:
            i, j = np.unravel_index(idx, weakness_grid.shape)
            weak_zones.append({
                'grid_x': int(i),
                'grid_y': int(j),
                'x_meters': (i + 0.5) * (pitch_length / grid_size),
                'y_meters': (j + 0.5) * (pitch_width / grid_size),
                'coverage_score': float(coverage_grid[i, j]),
                'weakness_score': float(weakness_grid[i, j])
            })
        
        return {
            'coverage_heatmap': coverage_grid.tolist(),
            'weakness_heatmap': weakness_grid.tolist(),
            'grid_size': grid_size,
            'pitch_dimensions': {'length': pitch_length, 'width': pitch_width},
            'weak_zones': weak_zones
        }
    
    def calculate_xg_by_zone(
        self,
        tracking_data: List[Dict[str, Any]],
        pitch_length: float = 105.0,
        pitch_width: float = 68.0,
        grid_size: int = 5
    ) -> Dict[str, Any]:
        """
        Calculate expected goals (xG) by pitch zone.
        
        Args:
            tracking_data: Frame-by-frame player tracking data
            pitch_length: Length of pitch in meters
            pitch_width: Width of pitch in meters
            grid_size: Number of grid cells per dimension
        
        Returns:
            Dictionary with xG heatmap and high-value zones
        """
        # Simplified xG model based on position and pressure
        xg_grid = np.zeros((grid_size, grid_size))
        shot_count = np.zeros((grid_size, grid_size))
        
        for frame in tracking_data:
            ball = frame.get('ball')
            if not ball:
                continue
            
            ball_x = ball.get('x', 0)
            ball_y = ball.get('y', 0)
            
            # Determine grid cell
            grid_x = int((ball_x / pitch_length) * grid_size)
            grid_y = int((ball_y / pitch_width) * grid_size)
            
            # Clamp to grid bounds
            grid_x = max(0, min(grid_size - 1, grid_x))
            grid_y = max(0, min(grid_size - 1, grid_y))
            
            # Simple xG calculation: closer to goal = higher xG
            distance_to_goal = abs(pitch_length - ball_x)
            xg_value = max(0, 1.0 - (distance_to_goal / pitch_length))
            
            xg_grid[grid_x, grid_y] += xg_value
            shot_count[grid_x, grid_y] += 1
        
        # Average xG per zone
        xg_grid = np.divide(
            xg_grid,
            shot_count,
            where=shot_count > 0,
            out=np.zeros_like(xg_grid)
        )
        
        # Find high-xG zones
        flat_indices = np.argsort(xg_grid.flatten())[::-1][:5]
        high_value_zones = []
        
        for idx in flat_indices:
            i, j = np.unravel_index(idx, xg_grid.shape)
            high_value_zones.append({
                'grid_x': int(i),
                'grid_y': int(j),
                'x_meters': (i + 0.5) * (pitch_length / grid_size),
                'y_meters': (j + 0.5) * (pitch_width / grid_size),
                'xg_value': float(xg_grid[i, j]),
                'shot_count': int(shot_count[i, j])
            })
        
        return {
            'xg_heatmap': xg_grid.tolist(),
            'grid_size': grid_size,
            'pitch_dimensions': {'length': pitch_length, 'width': pitch_width},
            'high_value_zones': high_value_zones
        }
    
    def generate_full_report(
        self,
        tracking_data: List[Dict[str, Any]],
        team: str = 'home'
    ) -> Dict[str, Any]:
        """
        Generate comprehensive tactical analysis report.
        
        Args:
            tracking_data: Frame-by-frame player tracking data
            team: 'home' or 'away'
        
        Returns:
            Complete analysis report with all metrics
        """
        # Run all analysis functions
        threat_zones = self.detect_threat_zones(tracking_data, team=team)
        weakness_zones = self.detect_weakness_zones(tracking_data, team=team)
        xg_analysis = self.calculate_xg_by_zone(tracking_data)
        
        # Generate summary
        report = {
            'team': team,
            'total_frames_analyzed': len(tracking_data),
            'threat_analysis': threat_zones,
            'weakness_analysis': weakness_zones,
            'xg_analysis': xg_analysis,
            'summary': {
                'critical_threats': len(threat_zones['critical_zones']),
                'weak_zones': len(weakness_zones['weak_zones']),
                'high_xg_zones': len(xg_analysis['high_value_zones'])
            }
        }
        
        return report
