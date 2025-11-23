# Implementation Plan - Asian Meal Planner (Prototype)

## Goal Description
Build a web-based meal planner focused on Asian cuisine (specifically "Made with Lau" and "The Woks of Life"). The app will help a working couple plan weekly dinners, ensuring recipes are quick (< 60 mins), support high-iron dietary needs, and automatically generate a grocery list scaled for 4 portions (dinner + leftovers).

## User Review Required
> [!IMPORTANT]
> **Recipe Import**: Since we cannot easily scrape external sites without a dedicated backend/proxy due to CORS and structure variability, the "Import" feature will initially be **Manual Entry** with a helper to paste a link. We will explore a "Smart Paste" feature later if time permits.

> [!NOTE]
> **Data Storage**: All data will be stored in your browser's Local Storage. Clearing your cache will delete your recipes and plans.

## Proposed Changes

### Project Setup
#### [NEW] [package.json](file:///Users/raymondkwok/.gemini/antigravity/scratch/asian_meal_planner/package.json)
- Initialize React + Vite project.
- Dependencies: `react`, `react-dom`, `lucide-react` (icons), `clsx`, `tailwind-merge`.
- Dev Dependencies: `tailwindcss`, `postcss`, `autoprefixer`.
- **[NEW]** Testing Dependencies: `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/user-event`.

### Testing Strategy (TDD)
- **Workflow**: For each feature, we will:
    1.  Write a failing test case (Red).
    2.  Implement the minimal code to pass the test (Green).
    3.  Refactor if necessary (Refactor).
- **Scope**:
    - **Unit Tests**: `src/store/useStore.test.ts` (Business logic: scaling, staples, plan management).
    - **Component Tests**: `src/components/__tests__/*.test.tsx` (UI interactions: clicking buttons, form submission).

### Core Logic & Data Model
#### [NEW] [src/types.ts](file:///Users/raymondkwok/.gemini/antigravity/scratch/asian_meal_planner/src/types.ts)
- Define interfaces: `Recipe`, `Ingredient`, `MealPlan`, `GroceryItem`.
- `Recipe` will include: `id`, `title`, `sourceUrl`, `prepTime`, `tags` (e.g., "High Iron"), `ingredients` (list with quantity/unit).

#### [NEW] [src/store/useStore.ts](file:///Users/raymondkwok/.gemini/antigravity/scratch/asian_meal_planner/src/store/useStore.ts)
- Simple custom hook or Context to manage state (Recipes, Current Plan) and sync with `localStorage`.

### Feature: Recipe Management
#### [NEW] [src/components/RecipeList.tsx](file:///Users/raymondkwok/.gemini/antigravity/scratch/asian_meal_planner/src/components/RecipeList.tsx)
- Display list of added recipes.
- Filters: "Under 60 mins", "High Iron".

#### [NEW] [src/components/AddRecipeForm.tsx](file:///Users/raymondkwok/.gemini/antigravity/scratch/asian_meal_planner/src/components/AddRecipeForm.tsx)
- Form to input recipe details manually.
- Fields: Title, URL, Prep Time, Servings (default 4), Ingredients.

### Feature: Meal Planning
#### [NEW] [src/components/WeeklyPlanner.tsx](file:///Users/raymondkwok/.gemini/antigravity/scratch/asian_meal_planner/src/components/WeeklyPlanner.tsx)
- Grid view for Monday-Sunday.
- Drag-and-drop or simple "Add to Day" selector for recipes.
- Toggle: "High Iron Focus" (Visual indicator).

### Feature: Grocery List
#### [NEW] [src/components/GroceryList.tsx](file:///Users/raymondkwok/.gemini/antigravity/scratch/asian_meal_planner/src/components/GroceryList.tsx)
- Logic to aggregate ingredients from the weekly plan.
- **Scaling**: Multiply ingredient quantities to ensure 4 portions total per meal.
- Checkbox UI to mark items as "Got it".

## Verification Plan

### Automated Tests
- Run `npm run dev` to verify build.
- No unit tests for this prototype phase.

### Manual Verification
1.  **Add Recipe**: Manually add a "Beef and Broccoli" recipe (High Iron, 30 mins).
2.  **Plan**: Add it to Monday and Tuesday.
3.  **Verify List**: Check Grocery List. If recipe calls for 1lb beef for 4 servings, and we plan it twice, list should show 2lbs.
4.  **Filter**: Toggle "High Iron" and ensure the recipe is highlighted.
