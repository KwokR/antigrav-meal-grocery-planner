# Asian Meal Planner - Requirements

## 1. Goal
Build a web application to help working professionals plan weekly dinners using Asian recipes, specifically from "Made with Lau" and "The Woks of Life", with a focus on quick preparation (< 60 mins).

## 2. User Profile
- **Demographics**: Working couple, no kids.
- **Schedule**: 9-5 work schedule.
- **Constraints**: Max 45-60 minutes for dinner preparation.
- **Preferences**: Asian cuisine (Cantonese/Chinese focus).

## 3. Core Features
- **Recipe Management**:
    - Support for recipes from:
        - [Made with Lau](https://www.madewithlau.com/recipes)
        - [The Woks of Life](https://thewoksoflife.com/category/recipes/)
    - **Filter/Tag**: 
        - "Under 60 mins" (Critical).
        - **"High Iron"** (New): Highlight or suggest recipes rich in iron (beef, spinach, tofu, etc.) for specific weeks.
    - *Implementation Note*: We will likely need a way to parse these URLs or allow manual entry with a "link" field if scraping is blocked.
- **Meal Planning**:
    - **Scope**: Dinner only (Mon-Sun).
    - **Workflow**: Select 5-7 recipes for the week.
    - **Dietary Context**: Option to toggle "High Iron Focus" for the week (to support partner's cycle).
- **Grocery List**:
    - **Portion Scaling**: Automatically calculate ingredient quantities for **4 portions** (Dinner + Leftovers for Lunch).
    - Auto-generate shopping list from selected meals.
    - Basic categorization (Produce, Meat, Pantry).

## 4. Technical Stack (Prototype Phase)
- **Goal**: Initial prototype to validate the workflow. No complex backend yet.
- **Frontend**: React + Vite + Tailwind CSS.
- **Data Persistence**: Local Storage (Browser) only. No user authentication or server-side database for this phase.
- **Deployment**: Local machine.

## 5. Questions to Resolve
- [ ] Confirm "Dinner only" planning is correct.
- [ ] Confirm Local Storage is acceptable (data stays on this computer).
