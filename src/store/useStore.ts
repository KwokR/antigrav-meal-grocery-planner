import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Recipe, MealPlan } from '../types';

interface AppState {
    recipes: Recipe[];
    mealPlan: MealPlan;
    highIronFocus: boolean;
    staples: string[];
    addRecipe: (recipe: Recipe) => void;
    deleteRecipe: (id: string) => void;
    updateMealPlan: (date: string, recipeId: string) => void;
    removeFromMealPlan: (date: string, recipeId: string) => void;
    toggleHighIronFocus: () => void;
    toggleStaple: (item: string) => void;
}

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            recipes: [],
            mealPlan: {},
            highIronFocus: false,
            staples: [],
            addRecipe: (recipe) =>
                set((state) => ({ recipes: [...state.recipes, recipe] })),
            deleteRecipe: (id) =>
                set((state) => ({
                    recipes: state.recipes.filter((r) => r.id !== id),
                })),
            updateMealPlan: (date, recipeId) =>
                set((state) => {
                    const currentDayPlan = state.mealPlan[date] || [];
                    // Simple logic: if it's already there, don't add again (unless we want duplicates?)
                    // For now, let's allow duplicates if they really want to eat it twice in one dinner? 
                    // Or maybe just append.
                    return {
                        mealPlan: {
                            ...state.mealPlan,
                            [date]: [...currentDayPlan, recipeId],
                        },
                    };
                }),
            removeFromMealPlan: (date, recipeId) =>
                set((state) => {
                    const currentDayPlan = state.mealPlan[date] || [];
                    const index = currentDayPlan.indexOf(recipeId);
                    if (index > -1) {
                        const newDayPlan = [...currentDayPlan];
                        newDayPlan.splice(index, 1);
                        return {
                            mealPlan: {
                                ...state.mealPlan,
                                [date]: newDayPlan,
                            },
                        };
                    }
                    return state;
                }),
            toggleHighIronFocus: () =>
                set((state) => ({ highIronFocus: !state.highIronFocus })),
            toggleStaple: (item) =>
                set((state) => {
                    const isStaple = state.staples.includes(item);
                    return {
                        staples: isStaple
                            ? state.staples.filter((i) => i !== item)
                            : [...state.staples, item],
                    };
                }),
        }),
        {
            name: 'asian-meal-planner-storage',
        }
    )
);
