# FireWatch AI Orbit

## Overview

FireWatch AI Orbit is a wildfire monitoring and prediction application focused on Kazakhstan's forest regions. The system provides real-time fire detection visualization, spread prediction, and damage estimation through an interactive map interface. The application combines satellite-based fire detection simulation with AI-powered spread prediction to help monitor and respond to wildfires.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with Vite as the build tool
- **Styling**: Tailwind CSS for utility-first styling with PostCSS and Autoprefixer
- **Mapping**: Leaflet with React-Leaflet for interactive map visualization
- **Icons**: Lucide React for UI icons
- **Entry Point**: `client/src/main.jsx` renders into `client/index.html`

The frontend is a single-page application that displays fire locations on an interactive map, shows spread predictions as polygon overlays, and presents damage estimates in the UI.

### Backend Architecture
- **Framework**: Flask (Python) REST API
- **CORS**: Flask-CORS enabled for cross-origin requests from the frontend
- **Port**: Runs on port 5001

The backend provides three main API endpoints:
- `/fires` - Returns active fire data with coordinates, intensity, and detection source
- `/prediction` - Returns fire spread predictions with direction, zone coordinates, and timeframe
- `/damage` - Calculates estimated damage in USD based on affected area

### Development Server Configuration
- Frontend dev server runs on port 5000
- API requests to `/api/*` are proxied to the backend on port 5001
- The proxy rewrites `/api` prefix before forwarding to Flask

### Data Model
Currently uses hardcoded/simulated data for MVP:
- Fire locations centered on Kazakhstan (Burabay region coordinates)
- Spread predictions modeled as coordinate arrays
- Damage calculations use a simple formula: area × $15,000/km²

### Language Localization
The application uses Kazakh language for status labels and UI text (e.g., "Жоғары" for High, "Белсенді" for Active).

## External Dependencies

### Frontend Dependencies
- **React/React-DOM**: Core UI framework
- **Vite**: Development server and build tool
- **@vitejs/plugin-react**: React plugin for Vite
- **Leaflet/React-Leaflet**: Interactive mapping library
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **PostCSS/Autoprefixer**: CSS processing

### Backend Dependencies
- **Flask**: Python web framework
- **Flask-CORS**: Cross-origin resource sharing support

### External Services
- **Leaflet tile servers**: Map tiles loaded from CDN (unpkg.com for CSS)
- No database currently configured - data is simulated in-memory
- No external APIs integrated yet (satellite data is mocked)