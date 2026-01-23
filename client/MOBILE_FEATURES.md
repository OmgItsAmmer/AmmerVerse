# Mobile Features Documentation

## Overview
The AmmerVerse landing page now features a fully responsive mobile experience with industry-standard interactions including swipe gestures, smooth animations, and an intuitive navigation flow.

## Mobile Navigation Flow

### 1. Default View (Avatar Selection)
- **Initial State**: Starts with Avatar #2 (Web Dev) displayed by default
- **Navigation**: Left/right arrows to switch between avatars
- **Animation**: Smooth carousel transition with spring physics
- **Action**: Tap avatar to select and view info cards

### 2. Selected View (Info Cards)
- **Display**: One info card at a time in the center of the screen
- **Navigation**: 
  - Left/right arrows to navigate between cards
  - Swipe gesture support (swipe left/right to change cards)
  - Dot indicators at the bottom showing card position
- **Cards**: 4 cards per developer with smooth 3D transitions
- **Bottom Navigation**:
  - "Go Home" button (returns to avatar selection)
  - "Show Projects" button (moves to projects view)

### 3. Projects View
- **Display**: Full-screen project card with device-specific styling:
  - Mobile projects: Phone-style card with notch and home bar
  - Web projects: Browser-style card with address bar
  - Desktop projects: Desktop app-style card with title bar
- **Navigation**:
  - Left/right arrows to navigate between projects
  - Swipe gesture support
  - Project indicators showing position
- **Bottom Navigation**:
  - "Go Back" button (returns to info cards)
  - "Leave Message" button (opens message popup)
- **Action**: Tap project card to view full details in popup

## Key Features

### Responsive Breakpoints
- Mobile: `max-width: 768px`
- Tablet: `769px - 1024px`
- Desktop: `min-width: 1025px`

### Touch Interactions
- **Swipe Detection**: Velocity-based swipe recognition
- **Drag Constraints**: Smooth elastic dragging with constraints
- **Touch Feedback**: Visual feedback on touch/hover

### Animations
- **Framer Motion**: All animations use framer-motion for smooth 60fps performance
- **Spring Physics**: Natural feeling transitions between states
- **3D Transforms**: Subtle 3D effects on card transitions

### Mobile-Specific Optimizations
1. **Avatar Display**:
   - Single avatar view instead of row
   - Larger tap targets (50x50px minimum)
   - Centered layout with prominent navigation

2. **Card Layout**:
   - Centered single-card view
   - Optimized card sizes (320px max width)
   - Increased padding for better readability

3. **Navigation**:
   - Bottom-centered navigation buttons
   - Clear visual hierarchy
   - Reduced font sizes for mobile screens

4. **Project Cards**:
   - Full-screen immersive view
   - Device-appropriate styling
   - Touch-optimized interaction zones

## Technical Implementation

### New Components
1. **useMediaQuery Hook** (`hooks/useMediaQuery.js`)
   - Detects screen size changes
   - Provides `useIsMobile()`, `useIsTablet()`, `useIsDesktop()` hooks
   - Reactive updates on window resize

2. **Mobile Avatar Carousel**
   - AnimatePresence for enter/exit animations
   - Direction-based animation variants
   - State management for current avatar index

3. **Mobile Card Swiper**
   - Drag gesture detection
   - Velocity-based swipe thresholds
   - Card indicators for position feedback

### Updated Components
1. **AvatarRow**: Mobile-specific rendering with carousel
2. **InfoCardsOverlay**: Single card view with swipe
3. **ProjectCardsOverlay**: Full-screen project display
4. **NavigationButtons**: Mobile-centered layout

### CSS Enhancements
- Mobile-first responsive design
- Touch-friendly button sizes
- Optimized spacing and typography
- Smooth transitions and animations

## Testing Guide

### Desktop Testing (Browser DevTools)
1. Open Chrome DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select a mobile device (iPhone 12, Pixel 5, etc.)
4. Test the following flow:
   - Navigate between avatars using arrows
   - Select an avatar
   - Swipe through info cards
   - Navigate to projects
   - Swipe through projects
   - Open project details
   - Use navigation buttons at each stage

### Mobile Testing (Physical Device)
1. Connect to local network
2. Find your computer's IP address
3. Access `http://[YOUR_IP]:5173` from mobile device
4. Test all gestures:
   - Tap interactions
   - Swipe gestures
   - Navigation flow
   - Popup interactions

## Browser Compatibility
- ✅ Chrome/Edge (Chromium-based)
- ✅ Safari iOS
- ✅ Firefox
- ✅ Samsung Internet

## Performance
- **60 FPS** animations on most devices
- **Hardware acceleration** for transforms
- **Optimized bundle size** with code splitting
- **Lazy loading** for images and components

## Future Enhancements
- [ ] Pinch-to-zoom on project images
- [ ] More sophisticated gesture recognition
- [ ] Landscape mode optimizations
- [ ] Progressive Web App (PWA) features
- [ ] Offline support
- [ ] Pull-to-refresh functionality
