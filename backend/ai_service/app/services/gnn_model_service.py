"""
GNN model service wrapper
Integrates trained tactical vulnerability model with FastAPI service
"""
import os
import sys
from pathlib import Path
from typing import List, Dict, Any, Optional, Tuple
import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np

# Add parent path
sys.path.append(str(Path(__file__).parent.parent.parent.parent))

# PyTorch Geometric for GNN layers
try:
    from torch_geometric.nn import MessagePassing
    from torch_geometric.data import Data
    from torch_geometric.utils import add_self_loops
except ImportError:
    print("Warning: torch-geometric not installed")


class EGNNConv(MessagePassing):
    """Equivariant Graph Convolutional Layer"""
    
    def __init__(self, in_channels, hidden_channels, out_channels):
        super().__init__(aggr='add')
        self.mlp = nn.Sequential(
            nn.Linear(in_channels * 2 + 1, hidden_channels),
            nn.SiLU(),
            nn.Linear(hidden_channels, out_channels)
        )
        self.coord_mlp = nn.Sequential(
            nn.Linear(in_channels, hidden_channels),
            nn.SiLU(),
            nn.Linear(hidden_channels, 1)
        )
    
    def forward(self, x, edge_index, pos):
        edge_index, _ = add_self_loops(edge_index, num_nodes=x.size(0))
        return self.propagate(edge_index, x=x, pos=pos)
    
    def message(self, x_i, x_j, pos_i, pos_j):
        dist = torch.norm(pos_i - pos_j, dim=1, keepdim=True)
        msg_input = torch.cat([x_i, x_j, dist], dim=1)
        msg = self.mlp(msg_input)
        
        coord_diff = pos_i - pos_j
        coord_weight = self.coord_mlp(x_i)
        coord_msg = coord_diff * coord_weight
        
        return msg


class TacticalVulnerabilityGNN(nn.Module):
    """GNN model for tactical vulnerability detection"""
    
    def __init__(
        self,
        input_features: int = 7,
        hidden_dim: int = 64,
        num_layers: int = 3,
        num_outputs: int = 6
    ):
        super().__init__()
        
        self.input_features = input_features
        self.hidden_dim = hidden_dim
        self.num_layers = num_layers
        
        # Embedding layer
        self.embedding = nn.Linear(input_features, hidden_dim)
        
        # EGNN layers
        self.convs = nn.ModuleList([
            EGNNConv(hidden_dim, hidden_dim, hidden_dim)
            for _ in range(num_layers)
        ])
        
        # Output heads for multi-task learning
        self.line_vulnerability = nn.Linear(hidden_dim, 3)  # defensive, midfield, attacking
        self.pressure_vulnerability = nn.Linear(hidden_dim, 3)
        self.spacing_vulnerability = nn.Linear(hidden_dim, 3)
        self.key_player_dependency = nn.Linear(hidden_dim, 1)
        self.counter_attack_risk = nn.Linear(hidden_dim, 1)
        self.combined_vulnerability = nn.Linear(hidden_dim, 3)
    
    def forward(self, data):
        x = data.x  # Node features
        edge_index = data.edge_index
        pos = data.pos  # Node positions
        
        # Embed features
        x = F.relu(self.embedding(x))
        
        # Apply EGNN layers
        for conv in self.convs:
            x = conv(x, edge_index, pos)
            x = F.relu(x)
        
        # Global pooling
        x_global = torch.mean(x, dim=0, keepdim=True)
        
        # Multi-task predictions
        outputs = {
            'line_vulnerability': self.line_vulnerability(x_global),
            'pressure_vulnerability': self.pressure_vulnerability(x_global),
            'spacing_vulnerability': self.spacing_vulnerability(x_global),
            'key_player_dependency': torch.sigmoid(self.key_player_dependency(x_global)),
            'counter_attack_risk': torch.sigmoid(self.counter_attack_risk(x_global)),
            'combined_vulnerability': self.combined_vulnerability(x_global)
        }
        
        return outputs


class GNNModelService:
    """
    Service wrapper for GNN model predictions.
    Handles model loading, inference, and result formatting.
    """
    
    def __init__(self, model_path: Optional[str] = None):
        """
        Initialize GNN model service.
        
        Args:
            model_path: Path to trained model weights (.pth file)
        """
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        
        # Initialize model
        self.model = TacticalVulnerabilityGNN(
            input_features=7,
            hidden_dim=64,
            num_layers=3,
            num_outputs=6
        ).to(self.device)
        
        # Load weights if provided
        if model_path and os.path.exists(model_path):
            self.load_model(model_path)
        else:
            print(f"Warning: Model weights not found at {model_path}. Using untrained model.")
    
    def load_model(self, model_path: str):
        """Load trained model weights"""
        try:
            checkpoint = torch.load(model_path, map_location=self.device)
            self.model.load_state_dict(checkpoint)
            self.model.eval()
            print(f"Model loaded from {model_path}")
        except Exception as e:
            print(f"Error loading model: {e}")
            raise
    
    def prepare_graph_data(
        self,
        freeze_frame: Dict[str, Any]
    ) -> Data:
        """
        Convert freeze frame to PyTorch Geometric Data object.
        
        Args:
            freeze_frame: Dictionary with player positions and features
        
        Returns:
            PyTorch Geometric Data object
        """
        # Extract player data
        players = freeze_frame.get('players', [])
        
        if len(players) == 0:
            raise ValueError("No players found in freeze frame")
        
        # Node features: [x, y, speed, direction, team_id, role_id, pressure]
        node_features = []
        positions = []
        
        for player in players:
            features = [
                player.get('x', 0),
                player.get('y', 0),
                player.get('speed', 0),
                player.get('direction', 0),
                1 if player.get('team') == 'home' else 0,
                player.get('role_id', 0),
                player.get('pressure', 0)
            ]
            node_features.append(features)
            positions.append([player.get('x', 0), player.get('y', 0)])
        
        # Convert to tensors
        x = torch.tensor(node_features, dtype=torch.float32)
        pos = torch.tensor(positions, dtype=torch.float32)
        
        # Create edges (fully connected for now)
        num_nodes = len(players)
        edge_index = []
        for i in range(num_nodes):
            for j in range(num_nodes):
                if i != j:
                    edge_index.append([i, j])
        
        edge_index = torch.tensor(edge_index, dtype=torch.long).t().contiguous()
        
        # Create Data object
        data = Data(x=x, edge_index=edge_index, pos=pos)
        
        return data
    
    @torch.no_grad()
    def predict(
        self,
        freeze_frame: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Run inference on a freeze frame.
        
        Args:
            freeze_frame: Dictionary with player positions and features
        
        Returns:
            Dictionary with vulnerability predictions
        """
        self.model.eval()
        
        # Prepare input data
        data = self.prepare_graph_data(freeze_frame).to(self.device)
        
        # Run inference
        outputs = self.model(data)
        
        # Format results
        results = {
            'line_vulnerability': {
                'defensive': float(torch.softmax(outputs['line_vulnerability'], dim=1)[0, 0]),
                'midfield': float(torch.softmax(outputs['line_vulnerability'], dim=1)[0, 1]),
                'attacking': float(torch.softmax(outputs['line_vulnerability'], dim=1)[0, 2])
            },
            'pressure_vulnerability': {
                'low': float(torch.softmax(outputs['pressure_vulnerability'], dim=1)[0, 0]),
                'medium': float(torch.softmax(outputs['pressure_vulnerability'], dim=1)[0, 1]),
                'high': float(torch.softmax(outputs['pressure_vulnerability'], dim=1)[0, 2])
            },
            'spacing_vulnerability': {
                'compact': float(torch.softmax(outputs['spacing_vulnerability'], dim=1)[0, 0]),
                'normal': float(torch.softmax(outputs['spacing_vulnerability'], dim=1)[0, 1]),
                'stretched': float(torch.softmax(outputs['spacing_vulnerability'], dim=1)[0, 2])
            },
            'key_player_dependency': float(outputs['key_player_dependency'][0, 0]),
            'counter_attack_risk': float(outputs['counter_attack_risk'][0, 0]),
            'combined_vulnerability': {
                'defensive': float(torch.softmax(outputs['combined_vulnerability'], dim=1)[0, 0]),
                'midfield': float(torch.softmax(outputs['combined_vulnerability'], dim=1)[0, 1]),
                'attacking': float(torch.softmax(outputs['combined_vulnerability'], dim=1)[0, 2])
            }
        }
        
        return results
    
    def batch_predict(
        self,
        tracking_data: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Run inference on multiple frames.
        
        Args:
            tracking_data: List of freeze frames
        
        Returns:
            List of prediction dictionaries
        """
        results = []
        
        for frame in tracking_data:
            try:
                prediction = self.predict(frame)
                results.append(prediction)
            except Exception as e:
                print(f"Error predicting frame: {e}")
                results.append({'error': str(e)})
        
        return results
