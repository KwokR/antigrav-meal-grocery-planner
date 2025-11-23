# Asian Meal Planner

A web application designed for working professionals to plan weekly dinners using Asian recipes (specifically from "Made with Lau" and "The Woks of Life"). It focuses on quick preparation (< 60 mins), supports dietary needs like high-iron intake, and automatically generates a grocery list scaled for 4 portions.

## Features

-   **Recipe Management**:
    -   Manually add recipes with nutritional info (Protein, Carbs, Fat).
    -   Filter by tags: "Under 60 mins", "High Iron".
-   **Weekly Planner**:
    -   Plan dinners for Monday-Sunday.
    -   "High Iron Focus" toggle to highlight iron-rich meals.
-   **Grocery List**:
    -   Auto-aggregates ingredients from the weekly plan.
    -   **Portion Scaling**: Automatically scales to 4 portions (Dinner + Lunch leftovers).
    -   **Pantry Staples**: Mark items as staples (e.g., Soy Sauce) to exclude them from the list.
    -   **Export**: Copy to Clipboard formatted for Apple Reminders.

## Tech Stack

-   **Frontend**: React, Vite, TypeScript
-   **Styling**: Tailwind CSS
-   **State Management**: Zustand (with Local Storage persistence)
-   **Testing**: Vitest, React Testing Library

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Development Server**:
    ```bash
    npm run dev
    ```

3.  **Run Tests**:
    ```bash
    npm test
    ```

## Project Structure

-   `src/components`: UI Components (RecipeList, WeeklyPlanner, GroceryList).
-   `src/store`: Zustand store for state management.
-   `specs/`: Requirements and Implementation Plan.
