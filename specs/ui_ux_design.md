# UI/UX Design Principles - Asian Meal Planner

## Core Philosophy: "Efficiency for the Busy Professional"
Given the user profile (working couple, 9-5, limited time), the interface must be **fast**, **glanceable**, and **frictionless**.

## Key Considerations

### 1. Visual Hierarchy & Scanning
-   **Problem**: Users don't want to read long recipes when planning.
-   **Solution**:
    -   **Card Layout**: Recipes displayed as compact cards.
    -   **Badges**: "Under 60m" (Green) and "High Iron" (Rose/Red) should be the most prominent visual elements after the title.
    -   **Nutrition**: Keep it subtle (secondary text) unless it's a primary concern.

### 2. Frictionless Planning (The "One-Handed" Test)
-   **Problem**: Drag-and-drop can be finicky on trackpads/phones.
-   **Solution**:
    -   **Quick Add**: Hovering over a recipe card reveals a "+" button that instantly adds it to the *next empty slot* in the week.
    -   **Drag & Drop**: Keep it for re-arranging, but offer the click alternative.

### 3. The "Shopping Mode" (Grocery List)
-   **Problem**: The grocery list is often used on a mobile device or copied to one.
-   **Solution**:
    -   **Mobile Responsive**: The Grocery List view must stack perfectly on mobile screens.
    -   **Clipboard Action**: The "Copy to Clipboard" button should be sticky or floating at the bottom/top so it's always accessible.
    -   **Staples Management**: Don't clutter the view. "Staples" should be a toggle ("Show/Hide Staples") rather than a permanent list, keeping the main view focused on *what to buy*.

### 4. Feedback & Delight
-   **Micro-interactions**:
    -   When adding a "High Iron" meal during a "High Iron Focus" week, show a subtle celebration (check animation or glow).
    -   When copying to clipboard, show a clear "Copied!" toast notification.

## Proposed Layouts

### Desktop View
-   **Left Sidebar (25%)**: Recipe Library (Scrollable).
-   **Center (50%)**: Weekly Calendar (Grid).
-   **Right Sidebar (25%)**: Grocery List (Auto-updating).

### Mobile View
-   **Tabs**: [Recipes] | [Plan] | [Shop]
-   **Shop Tab**: Full-screen grocery list with large checkboxes.

## Accessibility
-   **Color Blindness**: Don't rely solely on color (Red/Green) for tags. Use icons (Clock for time, Leaf/Drop for Iron) alongside colors.
