# ATLAS — Football Tactical Intelligence, Reinvented

In modern football, tactical analysis is increasingly driven by data, yet extracting meaningful insights from match footage and tracking streams remains a time-consuming task without immediately actionable takeaways.

**ATLAS** is a web-based platform designed to automate football tactical analysis by processing match videos, tracking coordinates, and event data into structured coaching intelligence—from dynamic formations and pressing intensity to Expected Goals (xG) threat zones, numerical superiorities, and defensive vulnerabilities modeled via Equivariant Graph Neural Networks (EGNN).

---

## Hackathon History & Competition Roadmap

### 1. Founding Hackathon & Scientific Congress: RNSport 2026 (Agadir, Morocco)

ATLAS was originally built in a **48-hour sprint** during the **RNSport Hackathon**, held as part of the **International Congress on Digital Revolution in Sports (RNSport 2026)** in collaboration with **Code 212 – Université Ibn Zohr (Agadir)** and **ENSA Agadir**.

Selected among 60+ applicant teams down to 10 finalist teams developing AI solutions for major sporting events (from AFCON 2025 to the 2030 FIFA World Cup), our team represented **ENSAM Casablanca** and subsequently presented ATLAS at the **RNSport 2026 International Congress**.

- **Core Team**:
  - [Houssam Choubik](https://www.linkedin.com/in/houssam-choubik/)
  - [Lyna Benlakhbaizi](https://www.linkedin.com/in/lynabenlakhbaizi/)
  - [Salwa Khattami](https://www.linkedin.com/in/salwa-khattami/fr/)
- **Academic Mentors & Acknowledgments**:
  - Mentors & Professors: Dr. Noureddine Soussi, Dr. Brahim Erraha, Dr. Khalid Tatane, M. Lotfi Najdi, M. Aziz Boufrioua, Mme Najoua Ouallou, M. Mourad Ait Abdellah, Mme Laila Dahr, Mme Sanae Mohim, M. Adil Elhessnaoui, M. Mehdi Iddouch.
  - Partners & Organizers: Code 212 – Université Ibn Zohr (M. Adil Aoufi, M. Hamza Elkina, Mme Sara Jalloul, M. Mousaab Aboujaafar, M. Zakaria Essaim, Mme Imane Charif, M. Ayoub El Fahri), ENSA Agadir, and sponsor Moov'up.

---

### 2. Upcoming Competitions (2026–2027)

#### A. More Than a Hack 2027 — Barça Innovation Hub & Metrica Sports
Organized by **Mobile World Capital Barcelona (Talent Arena)**, **Barça Innovation Hub**, and **Metrica Sports**, challenging teams to turn official match footage, optical tracking data, and event data into new ideas that improve sporting performance.

| Phase | Timeline | Format |
| :--- | :--- | :--- |
| **Registration** | 1 October – 10 November 2026 | Online |
| **Initial Challenge** | 20 October – 17 November 2026 | Online |
| **Innovation Challenge** | 26 November 2026 – 14 January 2027 | Online (Top 20 teams advance) |
| **Final Pitch** | 2 March 2027 | Live at Talent Arena, Barcelona (Top 5 finalists) |

#### B. Inside the Game: Developer Hackathon — Microsoft Innovation Studio
ATLAS is registered as an official project (**Hackathon #34887 / Project #126519**) on **Microsoft Innovation Studio**, focusing on scalable AI tactical inference, interactive spatial telemetry, and developer-ready sports analytics workflows.

---

## Key Capabilities

- **Match Video & Tracking Ingestion**: Process broadcast match videos (YOLO detection + ByteTrack + SigLIP team clustering + pitch homography) alongside structured tracking and event datasets.
- **Equivariant Graph Neural Network (EGNN)**: Models players as graph nodes on a 105m x 68m pitch to evaluate defensive, midfield, and attacking line vulnerabilities, pressing susceptibility, spacing compactness, key-player dependency, and counter-attack risk.
- **Interactive Tactical Workbench**: Visualizes dynamic formations, numerical advantage zones, threat/weakness heatmaps, and zone-based xG metrics.

---

## Project Structure

```text
Atlas-RN-Sport/
├── docs/                      # GitHub Pages site (docs/index.html)
├── frontend/                  # React 18 + Vite + TypeScript web application (Port 5173)
├── backend/                   # Python FastAPI microservices
│   ├── auth_service/          # JWT authentication & user onboarding service (Port 8001)
│   ├── ai_service/            # Video upload & EGNN tactical analysis service (Port 8002)
│   └── shared/                # Shared SQLAlchemy 2.0 ORM models & database setup
├── notebooks/                 # Jupyter notebooks for CV + EGNN model verification
├── video_data/                # Sample football match clips for testing
├── start.ps1                  # Windows PowerShell launcher
└── start.sh                   # Linux/macOS launcher
```
