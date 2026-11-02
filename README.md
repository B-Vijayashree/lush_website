# LUSH – Smart Landscape Garden Planner 🌿🏡

**LUSH** is an interactive, commercial-grade landscape and garden planning web application designed to allow users to design, customize, and visualize their gardens in real-world scale before planting.

---

## 🌟 Key Features

- **Full-Screen 2D & 3D Planning Field**: Expansive, uncluttered design workspace with floating slide-over plant library and property panels.
- **Touch-to-Place & Click-to-Place Engine**: Select any plant or hardscape element and tap anywhere on the canvas or 3D lawn to place it instantly.
- **Realistic Real-Time 3D (Three.js & WebGL)**:
  - 360° free orbit, pan, and zoom.
  - Camera presets: 360° Orbit, Top View, Front View, Side View, and Bird's Eye view.
  - Dynamic time-of-day lighting: Daytime sun, Golden Hour Sunset, and Moonlight with solar path lighting.
- **Predictive Growth & Spacing Collision Engine**:
  - Calculates mature canopy width and root zones.
  - 3-tier visual warning indicators: Safe (Green), Close Spacing (Yellow), Collision Risk (Red).
  - Detailed botanical spacing audits and recommendations.
- **60+ Botanical Plant Encyclopedia**:
  - Trees, Flowering Plants, Shrubs, Vegetables, Fruit Trees, Herbs, Palms, Grass, and Water Plants.
  - Complete specifications: current vs. mature dimensions, root spread, water and sun requirements, soil types, care guides.
- **Hardscaping & Elements**: Decks, slate stepping stones, brick pathways, fountains, ponds with lilies, pergolas, benches, and fences.
- **Export & Bill of Materials**: Export high-resolution 2D plan diagrams and printable nursery shopping schedules.

---

## 🚀 Tech Stack

- **Framework**: React 18 with TypeScript
- **Bundler**: Vite 5
- **3D Graphics**: Three.js, `@react-three/fiber`, `@react-three/drei`
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: Zustand / Custom React Store

---

## 💻 Quick Start (Run Locally)

1. **Clone the repository**:
   ```bash
   git clone https://github.com/B-Vijayashree/lush_website.git
   cd lush_website
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start local development server**:
   ```bash
   npm run dev
   ```
   Open your browser to `http://localhost:3000/`.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📄 License
MIT License. Built with passion for sustainable, beautiful landscape design.
