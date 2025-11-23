import React, { useMemo, useState } from 'react';
import { useStore } from '../store/useStore';
import { Ingredient } from '../types';
import { Square, Copy, Eye, EyeOff, Archive, ShoppingCart, CheckCircle2 } from 'lucide-react';

type GroceryItem = Ingredient & { checked: boolean };

export const GroceryList: React.FC = () => {
    const { mealPlan, recipes, staples, toggleStaple } = useStore();
    const [showStaples, setShowStaples] = useState(false);
    const [copied, setCopied] = useState(false);

    const groceryList = useMemo(() => {
        const list: Record<string, GroceryItem> = {};

        Object.entries(mealPlan).forEach(([date, recipeIds]) => {
            recipeIds.forEach((recipeId) => {
                const recipe = recipes.find((r) => r.id === recipeId);
                if (recipe) {
                    recipe.ingredients.forEach((ing) => {
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

    const handleCopyToClipboard = async () => {
        const textToCopy = groceryList.map(item => `- [ ] ${Math.round(item.quantity * 100) / 100} ${item.unit} ${item.name}`).join('\n');
        try {
            await navigator.clipboard.writeText(textToCopy);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
            alert('Failed to copy grocery list.');
        }
    };

    return (
        <div className="bg-white rounded-2xl border-2 border-warm-200 shadow-lg h-full flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-jade-50 to-jade-100/50 px-6 py-5 border-b-2 border-warm-200">
                <div className="flex items-center gap-3 mb-3">
                    <div className="bg-gradient-to-br from-jade-600 to-jade-700 p-2 rounded-xl text-white shadow-md">
                        <ShoppingCart size={20} />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-display font-bold text-warm-900">Grocery List</h2>
                        <p className="text-xs text-warm-600">{groceryList.length} items for this week</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowStaples(!showStaples)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold bg-white border border-warm-300 text-warm-700 hover:border-jade-400 hover:bg-jade-50 transition-all"
                    >
                        {showStaples ? <EyeOff size={14} /> : <Eye size={14} />}
                        {showStaples ? 'Hide' : 'Show'} Staples
                    </button>
                    <button
                        onClick={handleCopyToClipboard}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${copied
                                ? 'bg-jade-600 text-white'
                                : 'bg-gradient-to-r from-jade-600 to-jade-700 text-white hover:shadow-md hover:scale-105'
                            }`}
                    >
                        {copied ? (
                            <>
                                <CheckCircle2 size={14} />
                                Copied!
                            </>
                        ) : (
                            <>
                                <Copy size={14} />
                                Copy
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4">
                {groceryList.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-5xl mb-3 opacity-20">🛒</div>
                        <p className="text-warm-600 font-medium">No items needed</p>
                        <p className="text-sm text-warm-500 mt-1">Plan some meals to generate a list!</p>
                    </div>
                ) : (
                    <ul className="space-y-2">
                        {groceryList.map((item, index) => {
                            const isStaple = staples.includes(item.name);

                            return (
                                <li
                                    key={item.name}
                                    className={`group relative p-3 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${isStaple
                                            ? 'bg-amber-50/50 border-amber-200'
                                            : 'bg-warm-50 border-warm-200 hover:border-jade-300'
                                        }`}
                                    style={{ animationDelay: `${index * 20}ms` }}
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Checkbox */}
                                        <div className="mt-0.5 text-jade-600">
                                            <Square size={18} strokeWidth={2} />
                                        </div>

                                        {/* Item Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="font-semibold text-warm-900 text-sm leading-tight">
                                                {Math.round(item.quantity * 100) / 100} {item.unit}
                                            </div>
                                            <div className="text-warm-700 text-sm">{item.name}</div>
                                            {isStaple && (
                                                <div className="flex items-center gap-1 mt-1">
                                                    <Archive size={10} className="text-amber-600" />
                                                    <span className="text-[10px] text-amber-600 font-semibold uppercase tracking-wide">Staple</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Staple Toggle */}
                                        <button
                                            onClick={() => toggleStaple(item.name)}
                                            className={`opacity-0 group-hover:opacity-100 transition-all duration-200 p-1.5 rounded-lg hover:scale-110 ${isStaple
                                                    ? 'text-amber-600 hover:bg-amber-100'
                                                    : 'text-warm-400 hover:bg-warm-100 hover:text-jade-600'
                                                }`}
                                            aria-label={`Mark ${item.name} as staple`}
                                            title={isStaple ? "Remove from staples" : "Mark as staple"}
                                        >
                                            <Archive size={16} />
                                        </button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>

            {/* Footer Tip */}
            {groceryList.length > 0 && (
                <div className="px-4 py-3 border-t border-warm-200 bg-warm-50/50">
                    <p className="text-xs text-warm-600 text-center">
                        💡 Tip: Mark pantry staples to hide them from your list
                    </p>
                </div>
            )}
        </div>
    );
};
