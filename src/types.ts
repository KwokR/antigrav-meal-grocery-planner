export interface Ingredient {
    name: string;
    quantity: number;
    unit: string;
}

export interface Nutrition {
    protein: number;
    carbs: number;
    fat: number;
}

export interface Recipe {
    id: string;
    title: string;
    sourceUrl: string;
    prepTimeMinutes: number;
    servings: number;
    ingredients: Ingredient[];
    tags: string[]; // e.g., "High Iron", "Under 60 mins"
    nutrition?: Nutrition;
    imageUrl?: string;
}

export interface MealPlan {
    [date: string]: string[]; // date (YYYY-MM-DD) -> array of recipe IDs
}

export interface GroceryItem extends Ingredient {
    checked: boolean;
    originalString?: string;
}
