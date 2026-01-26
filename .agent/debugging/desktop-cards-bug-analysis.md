# Desktop Cards Display Bug - Analysis & Debugging Guide

## Problem Statement
Desktop cards in ProjectCardsOverlay don't display randomly - sometimes they appear, sometimes they don't.

## Root Cause Analysis

### 1. **AnimatePresence Configuration Mismatch** ⚠️ HIGH PRIORITY
**Location:** `ProjectCardsOverlay.jsx:191`

**Issue:**
```jsx
// Desktop (line 191) - Missing initial={false}
<AnimatePresence mode='wait'>

// Mobile (line 58) - Has initial={false}
<AnimatePresence mode='wait' initial={false} custom={direction}>
```

**Why This Causes Issues:**
- Without `initial={false}`, Framer Motion runs initial animations on first mount
- The `mode='wait'` delays rendering until exit animations complete
- On first render, there's no exit animation, but Motion might wait anyway
- This creates a race condition where cards may or may not appear

**Fix:**
```jsx
<AnimatePresence mode='wait' initial={false}>
```

---

### 2. **Missing Fragment Key** ⚠️ MEDIUM PRIORITY
**Location:** `ProjectCardsOverlay.jsx:193-218`

**Issue:**
```jsx
<AnimatePresence mode='wait'>
    {currentProject && (
        <>  {/* No key on this fragment! */}
            <ProjectCard key={`${currentProject.id}-screen-1`} ... />
            <ProjectCard key={`${currentProject.id}-screen-2`} ... />
        </>
    )}
</AnimatePresence>
```

**Why This Causes Issues:**
- React can't properly track the fragment during re-renders
- When `currentProject` changes, React might not properly unmount/remount
- AnimatePresence relies on keys to detect when children change

**Fix:**
```jsx
<AnimatePresence mode='wait' initial={false}>
    {currentProject && (
        <motion.div key={currentProject.id}>
            <ProjectCard key={`${currentProject.id}-screen-1`} ... />
            <ProjectCard key={`${currentProject.id}-screen-2`} ... />
        </motion.div>
    )}
</AnimatePresence>
```

---

### 3. **No Explicit Exit Animation** ⚠️ LOW PRIORITY
**Location:** `ProjectCard.jsx:190`

**Issue:**
The desktop cards have an exit animation defined:
```jsx
exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.3 } }}
```

But this might conflict with the parent AnimatePresence's `mode='wait'`.

**Potential Issue:**
- The exit animation takes 0.3s
- If the component unmounts before the animation completes, cards disappear
- The floating animations (y and x) might interfere with exit

---

### 4. **Async Image Loading** ⚠️ MEDIUM PRIORITY
**Location:** `ProjectCard.jsx:64-94` (DesktopCard component)

**Issue:**
Images are loaded asynchronously, but there's no loading state or placeholder.

**Why This Causes Issues:**
- If images fail to load, the card might appear empty
- Network delays can make cards appear "broken"
- No visual feedback during loading

**Evidence from Console Logs:**
```jsx
console.log('DesktopCard:', project.name, 'has thumbnail:', !!displayImage, displayImage);
onLoad={() => console.log('DesktopCard image loaded:', project.name)}
onError={(e) => console.error('DesktopCard image failed to load:', project.name, e)}
```

---

## Debugging Steps

### Step 1: Check Browser Console
Open DevTools and look for:
1. `DesktopCard:` logs - Are they appearing?
2. `DesktopCard image loaded:` - Are images loading?
3. `DesktopCard image failed to load:` - Are there errors?
4. Any React warnings about keys or AnimatePresence

### Step 2: Verify Data Integrity
Add this temporary logging in `ProjectCardsOverlay.jsx` around line 175:

```jsx
const projectImages = currentProject ? getProjectImages(currentProject) : [null, null];

// ADD THIS:
console.log('Desktop View - Current Project:', currentProject?.name);
console.log('Desktop View - Project Images:', projectImages);
console.log('Desktop View - Category:', category);
console.log('Desktop View - Filtered Projects:', filteredProjects.map(p => p.name));
```

### Step 3: Test AnimatePresence Behavior
Temporarily disable AnimatePresence to see if cards render:

```jsx
// BEFORE:
<AnimatePresence mode='wait'>
    {currentProject && (
        <>
            <ProjectCard ... />
            <ProjectCard ... />
        </>
    )}
</AnimatePresence>

// AFTER (temporary test):
{currentProject && (
    <>
        <ProjectCard ... />
        <ProjectCard ... />
    </>
)}
```

If cards appear consistently without AnimatePresence, the issue is confirmed.

### Step 4: Check Image Paths
Verify that desktop project images exist:
- `omgxPosDesktop1` - Should be at `assets/images/desktop_dev/projects/OMGx POS/1.png`
- `omgxPosDesktop2` - Should be at `assets/images/desktop_dev/projects/OMGx POS/2.png`

---

## Recommended Solution

Apply all fixes together:

```jsx
// In ProjectCardsOverlay.jsx, replace lines 191-220 with:

<AnimatePresence mode='wait' initial={false}>
    {currentProject && (
        <motion.div
            key={currentProject.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
        >
            {/* Screen 1 */}
            <ProjectCard
                key={`${currentProject.id}-screen-1`}
                project={currentProject}
                category={category}
                onClick={onProjectClick}
                containerRef={containerRef}
                top={positions[0].top}
                left={positions[0].left}
                rotate={positions[0].rotate}
                image={projectImages[0]}
            />
            {/* Screen 2 */}
            <ProjectCard
                key={`${currentProject.id}-screen-2`}
                project={currentProject}
                category={category}
                onClick={onProjectClick}
                containerRef={containerRef}
                top={positions[1].top}
                left={positions[1].left}
                rotate={positions[1].rotate}
                image={projectImages[1]}
            />
        </motion.div>
    )}
</AnimatePresence>
```

---

## Testing Checklist

After applying fixes:
- [ ] Cards appear consistently on first load
- [ ] Cards appear when switching to desktop avatar (avatar 2)
- [ ] Cards appear when paginating between desktop projects
- [ ] No console errors or warnings
- [ ] Images load properly
- [ ] Animations are smooth
- [ ] Cards don't flicker or disappear

---

## Additional Notes

### Desktop Projects in Data
Currently only **1 desktop project** exists:
- ID: 6 - "OMGx POS" (Desktop)
- Images: `omgxPosDesktop1`, `omgxPosDesktop2`

If pagination seems broken, it's because there's only one project to display.

### Related Files
- `ProjectCardsOverlay.jsx` - Main component
- `ProjectCard.jsx` - Card rendering
- `developerModels.js` - Project data
- `ProjectCard.css` - Styling
