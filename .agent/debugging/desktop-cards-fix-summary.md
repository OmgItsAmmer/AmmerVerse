# Desktop Cards Bug Fix - Summary

## Issue
Desktop cards in `ProjectCardsOverlay.jsx` were not displaying consistently - sometimes appearing, sometimes not.

## Root Causes Identified

### 1. Missing `initial={false}` on AnimatePresence
**Problem:** The desktop view's `AnimatePresence` was missing the `initial={false}` prop, which the mobile view had.

```jsx
// BEFORE (Line 191)
<AnimatePresence mode='wait'>

// AFTER
<AnimatePresence mode='wait' initial={false}>
```

**Why this matters:**
- Without `initial={false}`, Framer Motion attempts to run initial animations on first mount
- Combined with `mode='wait'`, this creates a race condition
- Cards may not render on first load due to animation timing issues

### 2. Missing Key on Fragment Wrapper
**Problem:** The two `ProjectCard` components were wrapped in a React Fragment `<></>` without a proper key for AnimatePresence to track.

```jsx
// BEFORE
<AnimatePresence mode='wait'>
    {currentProject && (
        <>  {/* No key! */}
            <ProjectCard key={...} />
            <ProjectCard key={...} />
        </>
    )}
</AnimatePresence>

// AFTER
<AnimatePresence mode='wait' initial={false}>
    {currentProject && (
        <motion.div key={currentProject.id} {...animations}>
            <ProjectCard key={...} />
            <ProjectCard key={...} />
        </motion.div>
    )}
</AnimatePresence>
```

**Why this matters:**
- AnimatePresence relies on keys to detect when children are added/removed
- Without a key on the wrapper, React can't properly track component lifecycle
- This causes inconsistent mounting/unmounting behavior

## Changes Made

### File: `ProjectCardsOverlay.jsx`

#### Change 1: Fixed AnimatePresence Configuration (Lines 191-227)
- Added `initial={false}` to `AnimatePresence`
- Replaced Fragment `<></>` with `<motion.div>`
- Added proper key: `key={currentProject.id}`
- Added fade animations: `initial`, `animate`, `exit`
- Set proper positioning: `position: 'absolute', inset: 0, pointerEvents: 'none'`

#### Change 2: Added Debug Logging (Lines 177-189)
Added console logging to help verify the fix:
```jsx
console.log('[Desktop Cards Debug]', {
    projectName: currentProject.name,
    projectId: currentProject.id,
    category,
    images: projectImages,
    totalProjects: filteredProjects.length,
    currentPage
});
```

## Testing Instructions

1. **Open the application** in your browser
2. **Open DevTools Console** (F12)
3. **Select the Desktop Developer avatar** (avatar index 2)
4. **Look for console logs** showing:
   ```
   [Desktop Cards Debug] {
     projectName: "OMGx POS",
     projectId: 6,
     category: "desktop",
     images: [...],
     totalProjects: 1,
     currentPage: 0
   }
   ```
5. **Verify cards appear** consistently every time
6. **Refresh the page** multiple times to ensure consistency
7. **Switch between avatars** and back to desktop to test re-rendering

## Expected Behavior After Fix

✅ Desktop cards appear consistently on first load  
✅ Desktop cards appear when switching to desktop avatar  
✅ Desktop cards animate smoothly (fade in/out)  
✅ No console errors or React warnings  
✅ Images load properly in both card positions  
✅ Cards maintain proper positioning and rotation  

## Additional Notes

- The desktop category currently has only **1 project** (OMGx POS, ID: 6)
- This project has 2 images that display in the two card positions
- The fix aligns desktop behavior with the working mobile implementation
- Debug logs can be removed once the fix is verified

## Related Files
- ✏️ Modified: `client/src/screens/landing-page/components/ProjectCardsOverlay/ProjectCardsOverlay.jsx`
- 📄 Reference: `client/src/screens/landing-page/components/ProjectCard/ProjectCard.jsx`
- 📄 Reference: `client/src/screens/landing-page/data/developerModels.js`

## Debugging Resources
See `.agent/debugging/desktop-cards-bug-analysis.md` for detailed analysis and additional debugging steps.
