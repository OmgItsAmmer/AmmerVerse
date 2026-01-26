# 🌌 AmmerVerse

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)
![Three.js](https://img.shields.io/badge/Three.js-0.181.2-black?logo=three.js)
![Vite](https://img.shields.io/badge/Vite-7.2.2-646CFF?logo=vite)
![License](https://img.shields.io/badge/license-Private-red.svg)

**An immersive 3D portfolio experience showcasing full-stack development expertise**

[Live Demo](#) • [Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started)

</div>

---

## 📖 Overview

**AmmerVerse** is a cutting-edge, interactive portfolio website that transcends traditional portfolio designs. Built with React, Three.js, and Framer Motion, it offers an immersive 3D experience where visitors can explore different developer personas (Mobile, Web, and Desktop Development) through stunning visual storytelling.

The project features:
- 🎨 **Interactive 3D Earth Model** with zoom capabilities
- 👤 **Three Developer Avatars** representing different specializations
- 🎴 **Dynamic Info Cards** with smooth animations and transitions
- 📱 **Fully Responsive Design** with mobile-first approach
- 🎯 **Project Showcases** with device-specific styling (mobile, web, desktop)
- ✨ **Premium UI/UX** with glassmorphism and micro-animations
- 🌟 **Starfield Background** for an immersive space theme

---

## ✨ Features

### 🎭 Multi-Persona Portfolio
Explore three distinct developer personas, each with their own:
- **Tech Stack**: Specialized technologies and frameworks
- **Project Portfolio**: Real-world applications and systems
- **Engineering Approach**: Development philosophy and best practices
- **Proof of Work**: Live demos, GitHub repositories, and deployed applications

### 🌍 Interactive 3D Earth Model
- Built with **React Three Fiber** and **Three.js**
- Clickable Earth model with smooth zoom animations
- Realistic textures and lighting
- Responsive to user interactions

### 📱 Mobile-First Responsive Design
- **Swipe Gestures**: Navigate through avatars, cards, and projects
- **Touch-Optimized**: Large tap targets and smooth touch interactions
- **Adaptive Layouts**: Different layouts for mobile, tablet, and desktop
- **Performance Optimized**: 60 FPS animations on all devices

### 🎨 Premium Visual Design
- **Glassmorphism Effects**: Modern frosted glass UI elements
- **Smooth Animations**: Powered by Framer Motion with spring physics
- **3D Card Transitions**: Depth and perspective in card animations
- **Dynamic Starfield**: Animated background with twinkling stars
- **Gradient Overlays**: Rich color palettes and smooth gradients

### 🚀 Project Showcases
Six featured projects across three categories:

#### 📱 Mobile Development
- **KKs Online**: E-commerce platform with Flutter & Rust
- **OMGx POS**: Installment-based POS system

#### 🌐 Web Development
- **Sportivex**: Sports management system for NUST University
- **Video Streaming Platform**: Microservices on Google Kubernetes Engine
- **Fashion Oracle**: Search engine with 50,000+ indexed images
- **EpiGraph**: Disease spread simulation with network models

#### 🖥️ Desktop Development
- **OMGx POS**: Cross-platform desktop POS software

---

## 🛠️ Tech Stack

### Frontend
- **React 19.2.0** - UI framework with latest features
- **Vite 7.2.2** - Lightning-fast build tool and dev server
- **Three.js 0.181.2** - 3D graphics and WebGL rendering
- **@react-three/fiber 9.5.0** - React renderer for Three.js
- **@react-three/drei 10.7.7** - Useful helpers for React Three Fiber
- **Framer Motion 12.23.24** - Production-ready animation library
- **GSAP 3.13.0** - Professional-grade animation platform

### Development Tools
- **ESLint** - Code quality and consistency
- **Vite Plugin React** - Fast Refresh and JSX support
- **Nodemon** - Auto-restart development server

### Architecture
- **Component-Based**: Modular, reusable React components
- **Context API**: Global state management for theme
- **Custom Hooks**: Reusable logic (useMediaQuery, useIsMobile)
- **CSS Modules**: Scoped styling with vanilla CSS
- **Asset Optimization**: Lazy loading and code splitting

---

## 📁 Project Structure

```
AmmerVerse/
├── client/                          # Frontend application
│   ├── src/
│   │   ├── screens/
│   │   │   └── landing-page/        # Main landing page
│   │   │       ├── components/      # 43 modular components
│   │   │       │   ├── AvatarRow.jsx
│   │   │       │   ├── InfoCardsOverlay.jsx
│   │   │       │   ├── ProjectCardsOverlay.jsx
│   │   │       │   ├── EarthModel.jsx
│   │   │       │   ├── Starfield.jsx
│   │   │       │   └── ...
│   │   │       ├── data/
│   │   │       │   └── developerModels.js  # Project & developer data
│   │   │       ├── LandingPage.jsx
│   │   │       └── LandingPage.css
│   │   ├── components/              # Shared components
│   │   │   ├── Navbar.jsx
│   │   │   └── Button.jsx
│   │   ├── context/
│   │   │   └── ThemeContext.jsx     # Theme management
│   │   ├── hooks/
│   │   │   └── useMediaQuery.js     # Responsive hooks
│   │   ├── scenes/
│   │   │   ├── AvatarScene.jsx      # 3D avatar scene
│   │   │   └── CloudScene.jsx       # 3D cloud scene
│   │   ├── assets/                  # Images and media
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                          # Backend (placeholder)
├── .agent/                          # AI agent workflows
│   └── debugging/
├── package.json                     # Root package scripts
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/OmgItsAmmer/AmmerVerse.git
   cd AmmerVerse
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install client dependencies
   cd client
   npm install
   cd ..
   ```

3. **Start the development server**
   ```bash
   # From root directory
   npm run dev
   ```

   Or run client directly:
   ```bash
   cd client
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

From the **root directory**:
```bash
npm run dev      # Start client development server
npm run client   # Start client (alias for dev)
npm run server   # Start backend server (when implemented)
npm start        # Start production server
```

From the **client directory**:
```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## 📱 Mobile Features

AmmerVerse includes comprehensive mobile support with industry-standard interactions:

### Navigation Flow
1. **Avatar Selection** → Swipe/tap to explore developer personas
2. **Info Cards** → Swipe through 4 cards per developer
3. **Projects View** → Browse projects with device-specific styling
4. **Project Details** → Full-screen popup with images and tech stack

### Touch Interactions
- ✅ **Swipe Gestures**: Velocity-based swipe detection
- ✅ **Drag Constraints**: Elastic dragging with smooth animations
- ✅ **Touch Feedback**: Visual feedback on all interactive elements
- ✅ **Responsive Breakpoints**: Mobile (≤768px), Tablet (769-1024px), Desktop (≥1025px)

### Performance
- 🚀 **60 FPS** animations on most devices
- ⚡ **Hardware Acceleration** for transforms
- 📦 **Code Splitting** for optimized bundle size
- 🖼️ **Lazy Loading** for images and components

For detailed mobile features documentation, see [`client/MOBILE_FEATURES.md`](client/MOBILE_FEATURES.md).

---

## 🎯 Key Components

### 🌍 EarthModel
Interactive 3D Earth built with React Three Fiber:
- Realistic Earth textures
- Smooth zoom animations
- Click-to-zoom functionality
- Responsive camera positioning

### 👤 AvatarRow
Dynamic avatar carousel with:
- Desktop: 3 avatars in a row
- Mobile: Single avatar with navigation
- Hover effects and smooth transitions
- State-based styling

### 🎴 InfoCardsOverlay
Information cards with:
- 4 cards per developer persona
- Swipe navigation on mobile
- 3D rotation effects
- Positioned layout on desktop

### 📱 ProjectCardsOverlay
Project showcase with:
- Device-specific styling (mobile/web/desktop)
- Full-screen immersive view
- Image galleries
- Tech stack details
- Client reviews

### ⭐ Starfield
Animated starfield background:
- Randomly positioned stars
- Twinkling animations
- Depth perception with varying sizes
- Performance-optimized rendering

---

## 🎨 Design Philosophy

### Visual Excellence
- **Premium Aesthetics**: Curated color palettes, modern typography (Google Fonts)
- **Glassmorphism**: Frosted glass effects with backdrop blur
- **Smooth Gradients**: HSL-based color transitions
- **Micro-Animations**: Subtle hover effects and transitions

### User Experience
- **Intuitive Navigation**: Clear visual hierarchy and flow
- **Responsive Design**: Seamless experience across all devices
- **Performance First**: Optimized animations and lazy loading
- **Accessibility**: Semantic HTML and keyboard navigation

### Code Quality
- **Component Modularity**: 43+ reusable components
- **Clean Architecture**: Separation of concerns
- **Type Safety**: Consistent data models (ProjectModel class)
- **Best Practices**: ESLint rules and code standards

---

## 📊 Featured Projects

### 🏆 Sportivex
**Sports Management System for NUST University**
- Tech: React, Express, Supabase, Stripe
- Features: QR attendance, membership management, payment processing
- Duration: September – December 2024

### 🎥 Video Streaming Platform
**Cloud-Native Microservices Architecture**
- Tech: React, Flask, MongoDB, Google Kubernetes Engine
- Features: 6 microservices, Docker containerization, auto-scaling
- Duration: November – December 2024
- [GitHub](https://github.com/OmgItsAmmer/video_streaming_webapp)

### 🛍️ KKs Online
**E-Commerce Platform with Admin Dashboard**
- Tech: Flutter, Rust, Supabase, Google OAuth
- Features: Order tracking, FCM notifications, stock management
- Duration: July 2024 – June 2025

### 🔍 Fashion Oracle
**Search Engine with Advanced Indexing**
- Tech: HTML, CSS, Flask
- Features: 50,000+ indexed images, inverted indexing, barrel splitting
- Duration: October – December 2023

### 📈 EpiGraph
**Disease Spread Simulation**
- Tech: React, JavaScript
- Features: Network generation (Barabási–Albert, Watts–Strogatz, Erdős–Rényi)
- Duration: March – April 2024
- [Live Demo](https://v0-epi-graph-disease-spread-simulator.vercel.app/)

### 💳 OMGx POS
**Installment-Based POS Software**
- Tech: Flutter Desktop/Mobile, Supabase
- Features: Customer management, reporting, installment tracking
- Duration: March – August 2024

---

## 🔧 Configuration

### Vite Configuration
```javascript
// vite.config.js
export default {
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  }
}
```

### ESLint Configuration
The project uses modern ESLint with React-specific rules for code quality.

---

## 🌐 Browser Compatibility

- ✅ **Chrome/Edge** (Chromium-based)
- ✅ **Safari** (iOS and macOS)
- ✅ **Firefox**
- ✅ **Samsung Internet**

---

## 🚧 Roadmap

### Planned Features
- [ ] **Backend Integration**: Node.js/Express server
- [ ] **Contact Form**: Email integration for messages
- [ ] **Blog Section**: Technical articles and tutorials
- [ ] **Admin Dashboard**: Content management system
- [ ] **Analytics**: Visitor tracking and insights
- [ ] **PWA Support**: Offline functionality and app installation
- [ ] **Dark/Light Mode**: Theme toggle with persistence
- [ ] **Internationalization**: Multi-language support

### Future Enhancements
- [ ] **More Projects**: Additional portfolio items
- [ ] **Testimonials**: Client reviews and recommendations
- [ ] **Skills Section**: Interactive skills visualization
- [ ] **Timeline**: Career journey and milestones
- [ ] **Certifications**: Professional credentials display

---

## 📄 License

This project is **private** and proprietary. All rights reserved.

---

## 👨‍💻 Developer

**Ammer** - Full-Stack Developer

Specializing in:
- 📱 Mobile Development (Flutter, Rust)
- 🌐 Web Development (MERN Stack, Next.js)
- 🖥️ Desktop Development (C#, Flutter Desktop)

---

## 🙏 Acknowledgments

- **Three.js Community** - For amazing 3D graphics library
- **Framer Motion** - For smooth animation capabilities
- **React Three Fiber** - For React integration with Three.js
- **Vite Team** - For lightning-fast development experience

---

## 📞 Contact

For inquiries, collaborations, or project discussions:

- **GitHub**: [@OmgItsAmmer](https://github.com/OmgItsAmmer)
- **Portfolio**: [AmmerVerse](#)
- **Email**: [Contact through website](#)

---

<div align="center">

**Built with ❤️ using React, Three.js, and Framer Motion**

⭐ Star this repository if you find it interesting!

</div>
