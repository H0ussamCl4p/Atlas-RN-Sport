# ATLAS - Football Tactical Intelligence, Reinvented

In modern football, tactical analysis is increasingly driven by data, yet extracting meaningful insights from match footage remains a time-consuming task, without true actionable insights.

Meet **ATLAS**, a web-based platform designed to automate tactical analysis by processing football match videos and transforming them into structured, actionable insights, from pressing and key players to xG threats and vulnerable spaces. ATLAS aims to **bridge the gap between raw match footage and actionable tactical intelligence**, enabling teams to prepare smarter, analyze faster, and gain a competitive advantage.

This project was developed during the **RNSport Hackathon**, held as part of the **RNSport International Congress**, an event dedicated to innovation and research in sports science and performance analysis.

## Key Features

- **Match Video Analysis**  
  Upload a match video and let ATLAS process the entire game automatically.

- **Tactical Information Extraction**  
  Identify player positioning, team structure, and movement patterns.

- **Advanced Tactical Insights**
  - Dynamic formations
  - Pressing intensity and zones, as well as vulnerable zones
  - Player heatmaps and key positions
  - Expected Goals (xG)
  - Overload and threat analysis
  - Tactical phases and transitions

- **Visual Analytics**  
  Clear visualizations that help analysts and coaches quickly understand the game.

- **Web-Based Platform**  
  Accessible through a modern web interface.

## Project Structure

```text
Atlas-RN-Sport/
├── frontend/                  # React + Vite + TypeScript web application (Port 5173)
├── backend/                   # FastAPI services
│   ├── auth_service/          # Authentication and user service (Port 8001)
│   ├── ai_service/            # Video upload and tactical analysis service (Port 8002)
│   └── shared/                # Shared SQLAlchemy models and database setup
├── notebooks/                 # Jupyter notebooks for model and video inference
├── video_data/                # Sample football match videos
├── start.ps1                  # Windows startup script
└── start.sh                   # Linux/macOS startup script
```
