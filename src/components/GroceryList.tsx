import React, { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { Ingredient } from '../types';
import { Square } from 'lucide-react';

export const GroceryList: React.FC = () => {
    const { mealPlan, recipes } = useStore();

    const groceryList = useMemo(() => {
        const list: Record<string, Ingredient & { count: number }> = {};

        Object.values(mealPlan).flat().forEach(recipeId => {
            const recipe = recipes.find(r => r.id === recipeId);
            if (!recipe) return;

            // Scaling logic:
            // Recipe has `servings` (e.g. 4).
            // We want 4 portions total (Dinner + Lunch).
            // If recipe.servings is 4, multiplier is 1.
            // If recipe.servings is 2, multiplier is 2.
            const targetPortions = 4;
            const multiplier = targetPortions / recipe.servings;

            recipe.ingredients.forEach(ing => {
                const key = `${ing.name.toLowerCase()}-${ing.unit.toLowerCase()}`;
                if (!list[key]) {
                    list[key] = { ...ing, quantity: 0, count: 0 };
                }
                list[key].quantity += (ing.quantity * multiplier);
                list[key].count += 1;
            });
        });

        return Object.values(list).sort((a, b) => a.name.localeCompare(b.name));
    }, [mealPlan, recipes]);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-full flex flex-col">
            <div className="p-6 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-800">Grocery List</h2>
                <p className="text-sm text-slate-500 mt-1">
                    Based on {Object.values(mealPlan).flat().length} meals (scaled to 4 portions each)
                </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {groceryList.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                        Plan some meals to see your grocery list here.
                    </div>
                ) : (
                    <ul className="space-y-3">
                        {groceryList.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3 group cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors">
                                <div className="mt-0.5 text-slate-300 group-hover:text-emerald-500">
                                    <Square size={20} />
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium text-slate-800">
                                        {item.name}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                        {Math.round(item.quantity * 100) / 100} {item.unit}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};
