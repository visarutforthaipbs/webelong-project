# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

WeBelong is a Thai migrant worker platform with separate frontend and backend applications:

### Frontend (React/TypeScript)
- **Location**: `frontend/` directory
- **Framework**: React 19 with TypeScript, Vite build tool
- **UI Library**: Chakra UI with custom theme
- **Key Features**:
  - Multi-language support (Thai, English, Myanmar, Khmer, Lao, Vietnamese) via i18next
  - Wage calculator for migrant workers
  - Report submission system
  - Interactive data visualizations (choropleth maps, pie charts)
  - Mobile-responsive design

### Backend (Node.js/Express)
- **Location**: `backend/` directory
- **Framework**: Express.js with MongoDB (Mongoose)
- **Key Routes**:
  - `/api/calculate-wage` - Wage calculation logic
  - `/api/report` - Report submission and retrieval
  - `/api/feedback` - User feedback system
  - `/api/info` - Information endpoints
  - `/api/notion-content` - Notion CMS integration

## Development Commands

### Frontend Development
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production (includes TypeScript compilation)
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

### Backend Development
```bash
cd backend
npm run dev          # Start with nodemon (auto-restart)
npm start           # Start production server
```

### Root Level
```bash
npm start           # Start backend server (production)
npm run dev         # Start backend with nodemon
```

## Architecture Notes

### API Configuration
- Development: Frontend connects to `http://localhost:4000`
- Production: Frontend connects to Railway deployment at `https://web-production-5c9d.up.railway.app`
- API configuration is in `frontend/src/config/api.ts`

### Theme System
- Custom Chakra UI theme in `frontend/src/theme/index.ts`
- Brand colors: belongingBlue (#4A90E2), hopeGreen (#50E3C2), warmSand (#F5E3C3), deepNavy (#22313F)
- Custom fonts: DB Helvethaica X with Noto Sans Thai fallback

### Data Management
- Backend uses MongoDB with Mongoose ODM
- Static data files in `backend/data/` (JSON format)
- Frontend public data in `frontend/public/data/` (GeoJSON, province data)

### Internationalization
- i18next configuration in `frontend/src/i18n/`
- Translation files in `frontend/src/i18n/locales/`
- Support for 6 languages with full RTL considerations

### Key Components
- `ChoroplethMap.tsx` - Interactive province-level data visualization
- `PopulationSidebar.tsx` - Data display sidebar
- `Calculator.tsx` - Wage calculation interface
- `NotionContentSidebar.tsx` - CMS content integration

## Deployment

- **Platform**: Railway
- **Config**: `railway.toml` in root
- **Build**: Uses Nixpacks builder
- **Start Command**: `npm start` (runs backend server)
- **Environment**: NODE_ENV=production

## Database Connection

MongoDB connection string is configured via environment variable `MONGODB_URI` with fallback to hardcoded connection string in `backend/server.js:8-9`.

## Mobile & Tablet Optimizations

The application has been optimized for mobile and tablet devices with the following improvements:

### Navigation Enhancements
- Sticky navigation with better mobile touch targets
- Improved language selector button with larger touch area
- Always-visible "Join Project" button on all devices
- Hover effects and smooth transitions

### Responsive Layout System
- **Mobile (base)**: Vertical stack layout with 60/40 split (map/sidebar)
- **Tablet (md)**: Dedicated iPad-optimized layout with flexible sidebar
- **Desktop (lg+)**: Traditional side-by-side layout

### Component Mobile Improvements
- **ChoroplethMap**: Compact controls and legend, better touch interaction
- **PopulationSidebar**: Improved tab navigation, better scrolling
- **NotionContentSidebar**: Full-screen mobile overlay, simplified header
- **Forms**: Larger touch targets, improved input styling, better spacing

### Touch Optimization
- Enhanced touch targets for all interactive elements
- Touch-action manipulation for better scrolling
- Improved hover states for touch devices
- Custom scrollbar styling for webkit browsers

## Testing

Currently no test framework is configured. Tests show "Error: no test specified" in all package.json files.