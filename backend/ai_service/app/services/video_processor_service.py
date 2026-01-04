"""
Video processing service wrapper
Integrates video_processor.py functionality with FastAPI service
"""
import os
import sys
from pathlib import Path
from typing import List, Dict, Any, Optional
import json

# Ensure video_processor.py can be imported
football_analysis_path = str(Path(__file__).parent.parent.parent.parent.parent)
if football_analysis_path not in sys.path:
    sys.path.append(football_analysis_path)

# Ensure video_processor.py can be imported
football_analysis_path = str(Path(__file__).parent.parent.parent.parent.parent)
if football_analysis_path not in sys.path:
    sys.path.append(football_analysis_path)

# Import the original video processor
from video_processor import FootballVideoProcessor


class VideoProcessorService:
    """
    Service wrapper for video processing functionality.
    Converts the standalone processor into a service-compatible interface.
    """
    
    def __init__(self):
        """Initialize the video processor with API key from environment"""
        self.api_key = os.getenv('ROBOFLOW_API_KEY')
        if not self.api_key:
            raise ValueError("ROBOFLOW_API_KEY not set in environment")
        
        self.processor = FootballVideoProcessor(api_key=self.api_key)
    
    def process_video(
        self,
        video_path: str,
        output_dir: Optional[str] = None,
        save_csv: bool = False
    ) -> List[Dict[str, Any]]:
        """
        Process a football match video and extract tracking data.
        
        Args:
            video_path: Path to the input video file
            output_dir: Optional directory to save outputs
            save_csv: Whether to save tracking data as CSV
        
        Returns:
            List of frame-by-frame tracking data dictionaries
            
        Raises:
            Exception: If processing fails
        """
        try:
            # Process the video
            tracking_data = self.processor.process_video(
                video_path=video_path,
                output_dir=output_dir
            )
            
            # Optionally save CSV
            if save_csv and output_dir:
                csv_path = Path(output_dir) / 'tracking_data.csv'
                self.processor.save_tracking_data_to_csv(
                    tracking_data=tracking_data,
                    output_path=str(csv_path)
                )
            
            return tracking_data
            
        except Exception as e:
            raise Exception(f"Video processing failed: {str(e)}")
    
    def extract_frame_sample(
        self,
        video_path: str,
        num_frames: int = 10
    ) -> List[Dict[str, Any]]:
        """
        Extract a sample of frames from video for quick preview.
        
        Args:
            video_path: Path to the input video
            num_frames: Number of frames to extract
        
        Returns:
            List of sample frame data
        """
        try:
            import cv2
            
            cap = cv2.VideoCapture(video_path)
            if not cap.isOpened():
                raise ValueError(f"Cannot open video: {video_path}")
            
            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            stride = max(1, total_frames // num_frames)
            
            sample_data = []
            frame_idx = 0
            
            while len(sample_data) < num_frames and frame_idx < total_frames:
                cap.set(cv2.CAP_PROP_POS_FRAMES, frame_idx)
                ret, frame = cap.read()
                
                if not ret:
                    break
                
                # Process single frame
                frame_data = self.processor._extract_frame_data(
                    frame=frame,
                    frame_number=frame_idx,
                    player_detections=[],  # Simplified for preview
                    tracked_objects=[],
                    homography_matrix=None
                )
                sample_data.append(frame_data)
                
                frame_idx += stride
            
            cap.release()
            return sample_data
            
        except Exception as e:
            raise Exception(f"Frame extraction failed: {str(e)}")
    
    def get_video_metadata(self, video_path: str) -> Dict[str, Any]:
        """
        Extract video metadata without full processing.
        
        Args:
            video_path: Path to the input video
        
        Returns:
            Dictionary with video metadata
        """
        try:
            import cv2
            
            cap = cv2.VideoCapture(video_path)
            if not cap.isOpened():
                raise ValueError(f"Cannot open video: {video_path}")
            
            metadata = {
                'fps': int(cap.get(cv2.CAP_PROP_FPS)),
                'frame_count': int(cap.get(cv2.CAP_PROP_FRAME_COUNT)),
                'width': int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)),
                'height': int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT)),
                'duration_seconds': None,
                'resolution': None
            }
            
            if metadata['fps'] > 0:
                metadata['duration_seconds'] = int(metadata['frame_count'] / metadata['fps'])
            
            metadata['resolution'] = f"{metadata['width']}x{metadata['height']}"
            
            cap.release()
            return metadata
            
        except Exception as e:
            raise Exception(f"Metadata extraction failed: {str(e)}")
    
    def convert_to_freeze_frame(
        self,
        tracking_data: List[Dict[str, Any]],
        frame_index: int
    ) -> Dict[str, Any]:
        """
        Convert tracking data for a specific frame to freeze frame format for GNN model.
        
        Args:
            tracking_data: Full tracking data from processing
            frame_index: Index of the frame to convert
        
        Returns:
            Freeze frame dictionary suitable for GNN input
        """
        try:
            if frame_index >= len(tracking_data):
                raise ValueError(f"Frame index {frame_index} out of range")
            
            freeze_frame = self.processor.convert_tracking_to_freeze_frame(
                tracking_data=tracking_data,
                frame_index=frame_index
            )
            
            return freeze_frame
            
        except Exception as e:
            raise Exception(f"Freeze frame conversion failed: {str(e)}")
