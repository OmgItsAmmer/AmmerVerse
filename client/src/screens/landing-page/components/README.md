# Landing Page Components

This folder contains all the modular components used in the Landing Page. Each component is organized in its own folder with the following structure:

```
ComponentName/
├── ComponentName.jsx    # Main component file
├── ComponentName.css    # Component-specific styles
└── index.js            # Barrel export for clean imports
```

## Component Overview

### 📱 **AvatarImage**
Individual avatar image component with hover effects and selection states.
- Handles hover animations
- Manages selected/unselected states
- Displays avatar labels

### 👥 **AvatarRow**
Container for all avatar images. Manages the layout and positioning of avatars.
- Renders multiple AvatarImage components
- Handles avatar selection state
- Manages projects mode positioning

### 🎨 **InfoCard**
Draggable information cards that appear when an avatar is selected.
- Draggable with framer-motion
- Z-index management for layering
- Gradient title styling

### 📋 **InfoCardsOverlay**
Container that renders multiple InfoCard components.
- Displays when an avatar is selected
- Loads developer-specific info cards from data
- Manages card positioning

### 🖼️ **ProjectCard**
Individual project card component with multiple card types (Phone, Browser, Desktop, Default).
- Different visual styles based on project category
- Hover animations and tooltips
- Click handling for project popup

### 📦 **ProjectCardsOverlay**
Container for project cards with pagination.
- Displays when in projects view mode
- Handles pagination between projects
- Positions cards based on category

### 🎠 **MobileCardsCarousel**
*(Currently commented out)*
Alternative carousel view for mobile project cards.

### 🔍 **ProjectPopup**
Modal popup that displays detailed project information.
- Shows project images, description, tech stack
- Client reviews and metadata
- Call-to-action button

### 💬 **MessagePopup**
Modal popup for leaving messages/contacting.
- Message input form
- Social media links (expandable)
- Form validation ready

### 🎯 **NavigationButtons**
Bottom-left navigation buttons for view mode transitions.
- Dynamic button text based on current view
- Prev/Next navigation
- Animated arrows on hover

### ⭐ **Starfield**
Animated starfield background component.
- 100 randomly positioned stars
- Twinkling animation
- Performance optimized

## Shared Files

### `constants.js`
Contains shared constants, avatar images, and re-exports developer data models.
- AVATAR_IMAGES object
- Re-exports from developerModels (DEVELOPERS, PROJECTS, etc.)

## Usage Example

```jsx
import AvatarRow from './components/AvatarRow';
import ProjectPopup from './components/ProjectPopup';
import Starfield from './components/Starfield';

function LandingPage() {
  return (
    <div>
      <Starfield />
      <AvatarRow {...props} />
      <ProjectPopup {...props} />
    </div>
  );
}
```

## Styling

Each component has its own CSS file that contains only the styles relevant to that component. This makes it easy to:
- Find and modify component-specific styles
- Avoid style conflicts
- Maintain and debug styles
- Understand component dependencies

## Best Practices

1. **Keep components focused**: Each component should have a single responsibility
2. **Use index.js**: Import from the folder, not the file directly
3. **Document props**: Add PropTypes or TypeScript for better documentation
4. **Maintain consistency**: Follow the established folder structure for new components
5. **Update this README**: When adding new components, document them here

## Dependencies

- React (useState, useRef)
- Framer Motion (for animations)
- CSS Modules pattern (component-scoped styles)

---

*Last updated: January 2026*

