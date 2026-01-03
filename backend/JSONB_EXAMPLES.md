# Atlas Database - Example JSON Structures

This document provides example JSON structures for all JSONB fields in the Atlas database schema.

---

## User Domain

### UserProfile.preferences
```json
{
  "theme": "dark",
  "language": "en",
  "timezone": "Europe/Paris",
  "notifications": {
    "email": true,
    "push": false,
    "analysis_complete": true,
    "weekly_summary": true
  },
  "dashboard": {
    "default_view": "grid",
    "widgets": ["recent_analyses", "team_stats", "upcoming_matches"]
  }
}
```

### UserProfile.metadata
```json
{
  "social": {
    "linkedin": "https://linkedin.com/in/username",
    "twitter": "@username"
  },
  "certifications": [
    {
      "name": "UEFA Pro License",
      "issued_by": "UEFA",
      "date": "2023-06-15"
    }
  ],
  "expertise": ["tactical_analysis", "player_development", "set_pieces"],
  "experience_years": 15
}
```

---

## Core Domain

### Team.metadata
```json
{
  "stadium": {
    "name": "Camp Nou",
    "capacity": 99354,
    "location": "Barcelona, Spain"
  },
  "colors": {
    "primary": ["#004D98", "#A50044"],
    "secondary": ["#EDBB00"]
  },
  "founded": 1899,
  "website": "https://www.fcbarcelona.com",
  "social": {
    "twitter": "@FCBarcelona",
    "instagram": "@fcbarcelona"
  }
}
```

### Player.metadata
```json
{
  "preferred_foot": "right",
  "detailed_position": "CAM",
  "secondary_positions": ["RW", "ST"],
  "market_value_eur": 75000000,
  "contract_expires": "2027-06-30",
  "previous_clubs": [
    {"name": "Ajax", "years": "2019-2022"},
    {"name": "PSV", "years": "2017-2019"}
  ],
  "international": {
    "country": "Netherlands",
    "caps": 45,
    "goals": 12
  }
}
```

### Match.weather_conditions
```json
{
  "temperature_celsius": 22,
  "condition": "clear",
  "humidity": 65,
  "wind_speed_kmh": 12,
  "wind_direction": "NW",
  "precipitation": false
}
```

### PlayerMatchStats.detailed_stats
```json
{
  "passing": {
    "total": 68,
    "accurate": 59,
    "accuracy": 0.87,
    "key_passes": 4,
    "assists": 1,
    "long_balls": 8,
    "crosses": 3
  },
  "shooting": {
    "total": 5,
    "on_target": 3,
    "goals": 1,
    "xg": 0.68,
    "shots_from_outside_box": 2
  },
  "defensive": {
    "tackles": 2,
    "tackles_won": 1,
    "interceptions": 3,
    "clearances": 0,
    "blocks": 1,
    "duels_won": 7,
    "duels_total": 12
  },
  "physical": {
    "distance_km": 11.2,
    "sprints": 18,
    "top_speed_kmh": 33.4,
    "high_intensity_runs": 45
  },
  "possession": {
    "touches": 82,
    "dribbles_attempted": 6,
    "dribbles_successful": 4,
    "fouls_won": 2,
    "fouls_committed": 1
  }
}
```

---

## AI Analysis Domain

### Video.metadata
```json
{
  "camera_angle": "tactical",
  "quality": "1080p",
  "codec": "h264",
  "bitrate_mbps": 8.5,
  "source": "broadcast",
  "trimmed": false,
  "original_duration": 5580,
  "preprocessing": {
    "stabilized": true,
    "color_corrected": false
  }
}
```

### Analysis.model_config
```json
{
  "architecture": "YOLOv8-large",
  "weights": "yolov8l-football-players-v2.pt",
  "input_size": [640, 640],
  "confidence_threshold": 0.6,
  "iou_threshold": 0.45,
  "max_detections": 25,
  "classes": ["player", "referee", "ball"],
  "device": "cuda:0",
  "batch_size": 16,
  "preprocessing": {
    "normalize": true,
    "mean": [0.485, 0.456, 0.406],
    "std": [0.229, 0.224, 0.225]
  },
  "postprocessing": {
    "nms": true,
    "track_objects": true,
    "tracker": "ByteTrack",
    "tracker_config": {
      "track_thresh": 0.5,
      "match_thresh": 0.8
    }
  }
}
```

### Analysis.input_data (Player Detection)
```json
{
  "video_config": {
    "video_id": "a1b2c3d4-...",
    "start_frame": 0,
    "end_frame": 54000,
    "frame_rate": 30,
    "resolution": [1920, 1080],
    "sample_rate": 1
  },
  "roi": {
    "enabled": true,
    "pitch_boundaries": {
      "top_left": [120, 80],
      "top_right": [1800, 80],
      "bottom_left": [120, 1000],
      "bottom_right": [1800, 1000]
    },
    "exclude_zones": [
      {"type": "scoreboard", "bbox": [1700, 50, 1900, 150]}
    ]
  },
  "preprocessing": {
    "enhance_contrast": true,
    "denoise": false,
    "stabilization": true,
    "pitch_registration": true,
    "background_subtraction": false
  },
  "analysis_options": {
    "detect_jersey_numbers": true,
    "team_classification": true,
    "track_ball": true
  }
}
```

### Analysis.output_data (Player Detection)
```json
{
  "detections": [
    {
      "frame": 150,
      "timestamp": 5.0,
      "players": [
        {
          "track_id": 1,
          "player_id": "uuid-player-1",
          "team": "home",
          "jersey_number": 10,
          "bbox": [450, 320, 520, 480],
          "position_normalized": [0.35, 0.62],
          "confidence": 0.94,
          "pose_keypoints": [
            {"name": "head", "x": 485, "y": 330, "conf": 0.95},
            {"name": "left_shoulder", "x": 465, "y": 360, "conf": 0.92}
          ],
          "action": "running",
          "velocity_mps": 4.2,
          "direction_degrees": 45
        },
        {
          "track_id": 2,
          "player_id": "uuid-player-2",
          "team": "away",
          "jersey_number": 7,
          "bbox": [800, 400, 870, 560],
          "position_normalized": [0.55, 0.72],
          "confidence": 0.91,
          "pose_keypoints": [...],
          "action": "standing",
          "velocity_mps": 0.2,
          "direction_degrees": 180
        }
      ],
      "ball": {
        "detected": true,
        "bbox": [650, 450, 670, 470],
        "position_normalized": [0.45, 0.68],
        "confidence": 0.88,
        "in_possession": 1
      }
    }
  ],
  "summary": {
    "total_frames_processed": 54000,
    "frames_with_detections": 52341,
    "unique_players_detected": 22,
    "avg_players_per_frame": 18.4,
    "avg_confidence": 0.91,
    "ball_detection_rate": 0.87,
    "processing_time_seconds": 142.5,
    "fps_processed": 378.9
  },
  "team_classification": {
    "home_team_color": {"primary": [255, 0, 0], "secondary": [255, 255, 255]},
    "away_team_color": {"primary": [0, 0, 255], "secondary": [255, 255, 0]},
    "referee_color": [0, 0, 0]
  }
}
```

### Analysis.output_data (Formation Detection)
```json
{
  "formations": [
    {
      "team": "home",
      "formation": "4-3-3",
      "confidence": 0.89,
      "time_range": {"start_minute": 0, "end_minute": 45},
      "player_positions": [
        {"position": "GK", "player_id": "uuid-1", "avg_x": 0.1, "avg_y": 0.5},
        {"position": "LB", "player_id": "uuid-2", "avg_x": 0.25, "avg_y": 0.2},
        {"position": "CB", "player_id": "uuid-3", "avg_x": 0.25, "avg_y": 0.4},
        {"position": "CB", "player_id": "uuid-4", "avg_x": 0.25, "avg_y": 0.6},
        {"position": "RB", "player_id": "uuid-5", "avg_x": 0.25, "avg_y": 0.8},
        {"position": "CM", "player_id": "uuid-6", "avg_x": 0.45, "avg_y": 0.3},
        {"position": "CM", "player_id": "uuid-7", "avg_x": 0.45, "avg_y": 0.5},
        {"position": "CM", "player_id": "uuid-8", "avg_x": 0.45, "avg_y": 0.7},
        {"position": "LW", "player_id": "uuid-9", "avg_x": 0.7, "avg_y": 0.2},
        {"position": "ST", "player_id": "uuid-10", "avg_x": 0.75, "avg_y": 0.5},
        {"position": "RW", "player_id": "uuid-11", "avg_x": 0.7, "avg_y": 0.8}
      ],
      "characteristics": {
        "width": 0.6,
        "depth": 0.65,
        "compactness": 0.72,
        "defensive_line_height": 0.25,
        "pressing_intensity": "medium"
      }
    },
    {
      "team": "away",
      "formation": "4-4-2",
      "confidence": 0.92,
      "time_range": {"start_minute": 0, "end_minute": 45},
      "player_positions": [...]
    }
  ],
  "transitions": [
    {
      "minute": 23,
      "team": "home",
      "from_formation": "4-3-3",
      "to_formation": "4-2-3-1",
      "reason": "tactical_adjustment",
      "confidence": 0.78
    }
  ]
}
```

### Analysis.quality_metrics
```json
{
  "precision": 0.94,
  "recall": 0.89,
  "f1_score": 0.915,
  "map": 0.88,
  "tracking_accuracy": 0.92,
  "id_switches": 3,
  "false_positives": 127,
  "false_negatives": 89,
  "processing_metrics": {
    "avg_inference_time_ms": 45.2,
    "peak_memory_mb": 4096,
    "gpu_utilization": 0.87
  }
}
```

### Event.event_data (Pass Event)
```json
{
  "pass_type": "through_ball",
  "body_part": "right_foot",
  "technique": "driven",
  "distance_meters": 28.5,
  "speed_kmh": 72.3,
  "trajectory": {
    "type": "ground",
    "start": [0.35, 0.62],
    "end": [0.72, 0.48],
    "apex_height": 0.3,
    "curve": "straight"
  },
  "context": {
    "phase_of_play": "attack",
    "attacking_third": true,
    "counter_attack": false
  },
  "pressure": {
    "defenders_within_3m": 1,
    "defenders_within_5m": 3,
    "pressure_score": 0.65,
    "time_to_decision": 0.8
  },
  "outcome_details": {
    "received_by": "player-uuid-receiver",
    "controlled": true,
    "time_to_control": 0.6,
    "first_touch_quality": "good"
  },
  "xpass": 0.72
}
```

### Event.event_data (Shot Event)
```json
{
  "shot_type": "open_play",
  "body_part": "left_foot",
  "technique": "volley",
  "distance_from_goal_meters": 18.3,
  "angle_degrees": 25,
  "trajectory": {
    "type": "air",
    "speed_kmh": 98.5,
    "spin_rpm": 1200,
    "curve": "right"
  },
  "target": {
    "on_target": true,
    "goal_zone": "top_right",
    "saved": true,
    "save_difficulty": "hard"
  },
  "context": {
    "defenders_in_way": 2,
    "goalkeeper_position": [0.05, 0.52],
    "assist_type": "cross",
    "time_since_turnover": 4.5
  },
  "xg": 0.18,
  "post_shot_xg": 0.65
}
```

### Event.event_data (Tackle Event)
```json
{
  "tackle_type": "standing",
  "success": true,
  "won_possession": true,
  "location_zone": "defensive_third",
  "context": {
    "opponent_speed_kmh": 18.5,
    "ball_distance_meters": 1.2,
    "support_players_nearby": 2
  },
  "outcome": {
    "possession_retained": true,
    "clearance": false,
    "pass_after_tackle": true
  },
  "foul": false
}
```

### Formation.player_positions
```json
[
  {
    "player_id": "uuid-player-1",
    "jersey_number": 1,
    "position": "GK",
    "avg_x": 0.1,
    "avg_y": 0.5,
    "heatmap_coverage": 0.15,
    "mobility_score": 0.3
  },
  {
    "player_id": "uuid-player-10",
    "jersey_number": 10,
    "position": "CAM",
    "avg_x": 0.55,
    "avg_y": 0.5,
    "heatmap_coverage": 0.35,
    "mobility_score": 0.85,
    "freedom_index": 0.72
  }
]
```

### Formation.tactical_analysis
```json
{
  "formation": "4-3-3",
  "style": {
    "build_up": "short_passing",
    "defensive_line": "high",
    "pressing_intensity": "high",
    "width": "wide",
    "tempo": "fast"
  },
  "strengths": [
    "Strong central midfield control with numerical superiority",
    "Wide attacking options provide stretch",
    "High defensive line enables offside trap",
    "Quick transitions from defense to attack"
  ],
  "weaknesses": [
    "Vulnerable to counter-attacks in wide areas",
    "Exposed space behind fullbacks",
    "Midfield can be bypassed with direct long balls",
    "High defensive line risky against pacey forwards"
  ],
  "key_patterns": [
    {
      "pattern": "overload_right_flank",
      "frequency": 23,
      "success_rate": 0.67,
      "description": "Fullback overlaps with winger"
    },
    {
      "pattern": "central_pivot_rotation",
      "frequency": 18,
      "success_rate": 0.78,
      "description": "Central midfielders rotate positions"
    }
  ],
  "vs_opponent": {
    "opponent_formation": "4-4-2",
    "matchup_rating": 7.5,
    "tactical_advantages": [
      "Numerical superiority in midfield (3v2)",
      "Width advantage against flat midfield"
    ],
    "tactical_disadvantages": [
      "Vulnerable to direct play to two strikers"
    ],
    "recommendations": [
      "Exploit wide areas with quick switches",
      "Maintain high press to prevent direct balls"
    ]
  },
  "metrics": {
    "average_height": 0.42,
    "average_width": 0.68,
    "compactness": 0.71,
    "pressing_triggers": ["misplaced_pass", "heavy_touch"],
    "defensive_actions_per_minute": 2.8
  }
}
```

### Heatmap.heatmap_data (50x50 grid)
```json
[
  [0.1, 0.2, 0.3, 0.5, 0.4, ...],
  [0.2, 0.4, 0.6, 0.8, 0.7, ...],
  [0.1, 0.3, 0.5, 0.9, 0.8, ...],
  ...
]
```

### Heatmap.metadata
```json
{
  "normalization": "max",
  "smoothing": "gaussian",
  "kernel_size": 5,
  "color_map": "viridis",
  "overlay_pitch": true,
  "time_weighted": false,
  "excluded_zones": ["technical_area", "bench_area"]
}
```

---

## Usage Examples

### Querying JSONB Fields in PostgreSQL

```sql
-- Find analyses using YOLOv8
SELECT * FROM analyses 
WHERE model_config @> '{"architecture": "YOLOv8-large"}';

-- Find high-pressure passes
SELECT * FROM events 
WHERE event_type = 'pass' 
  AND event_data->'pressure'->>'pressure_score' > '0.7';

-- Find players with specific certifications
SELECT * FROM user_profiles 
WHERE preferences->'certifications' @> '[{"name": "UEFA Pro License"}]';

-- Get events with successful outcome and high xG
SELECT * FROM events 
WHERE event_type = 'shot'
  AND outcome = 'success'
  AND (event_data->>'xg')::float > 0.3;

-- Find formations with high pressing
SELECT * FROM formations 
WHERE tactical_analysis->'style'->>'pressing_intensity' = 'high';
```

---

This comprehensive JSON structure guide ensures consistency across the platform and serves as documentation for frontend developers and AI model engineers.
