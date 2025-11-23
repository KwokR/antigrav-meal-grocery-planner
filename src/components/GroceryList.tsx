import React, { useMemo, useState } from 'react';
import { useStore } from '../store/useStore';
import { Ingredient } from '../types';
import { Square, CheckSquare, Copy, Eye, EyeOff, Archive } from 'lucide-react';

type GroceryItem = Ingredient & { checked: boolean };

export const GroceryList: React.FC = () => {
    const { mealPlan, recipes, staples, toggleStaple } = useStore();
    const [showStaples, setShowStaples] = useState(false);

    const groceryList = useMemo(() => {
        const list: Record<string, GroceryItem> = {};

        Object.entries(mealPlan).forEach(([date, recipeIds]) => {
            recipeIds.forEach((recipeId) => {
                const recipe = recipes.find((r) => r.id === recipeId);
                if (recipe) {
                    recipe.ingredients.forEach((ing) => {
                        // Scale logic: Recipe serves X. We want 4 portions.
                        const scaleFactor = 4 / recipe.servings;

                        const key = ing.name.toLowerCase();
                        if (list[key]) {
                            list[key].quantity += ing.quantity * scaleFactor;
                        } else {
                            list[key] = {
                                ...ing,
                                quantity: ing.quantity * scaleFactor,
                                checked: false,
                            };
                        }
                    });
                }
            });
        });

        return Object.values(list)
            .filter(item => showStaples || !staples.includes(item.name))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [mealPlan, recipes, staples, showStaples]);

    // Function to handle copying the list to clipboard
    const handleCopyToClipboard = async () => {
        const textToCopy = groceryList.map(item => `- [ ] ${item.quantity} ${item.unit} ${item.name}`).join('\n');
        try {
            await navigator.clipboard.writeText(textToCopy);
            alert('Grocery list copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy: ', err);
            alert('Failed to copy grocery list.');
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-full flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">Grocery List</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowStaples(!showStaples)}
                        className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 transition-colors"
                        title={showStaples ? "Hide Staples" : "Show Staples"}
                    >
                        {showStaples ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button
                        onClick={handleCopyToClipboard}
                        className="bg-slate-900 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors flex items-center gap-2"
                    >
                        <Copy size={16} />
                        Copy
                    </button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
                {groceryList.length === 0 ? (
                    <div className="text-center text-slate-400 py-8">
                        <p>No items needed.</p>
                        <p className="text-sm">Plan some meals to generate a list!</p>
                    </div>
                ) : (
                    <ul className="space-y-3">
                        {groceryList.map((item) => (
                            <li key={item.name} className="flex items-start gap-3 group">
                                <div className="mt-1 text-emerald-600">
                                    <Square size={16} />
                                </div>
                                <div className="flex-1">
                                    <span className="text-slate-700 font-medium">
                                        {Math.round(item.quantity * 100) / 100} {item.unit} {item.name}
                                    </span>
                                </div>
                                <button
                                    onClick={() => toggleStaple(item.name)}
                                    className={`opacity-0 group-hover:opacity-100 text-xs transition-opacity flex items-center gap-1 ${staples.includes(item.name) ? 'text-emerald-600' : 'text-slate-400 hover:text-rose-500'}`}
                                    aria-label={`Mark ${item.name} as staple`}
                                    title={staples.includes(item.name) ? "Un-mark as staple" : "Mark as staple"}
                                >
                                    <Archive size={14} />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};
