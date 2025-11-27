import React, { useMemo, useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Ingredient } from '../types';
import { Square, Copy, Eye, EyeOff, Archive, ShoppingCart, CheckCircle2, CheckSquare } from 'lucide-react';

type GroceryItem = Ingredient & { checked: boolean };

export const GroceryList: React.FC = () => {
    const { mealPlan, recipes, staples, toggleStaple } = useStore();
    const [showStaples, setShowStaples] = useState(false);
    const [copied, setCopied] = useState(false);
    const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

    // Load checked items from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('groceryChecked');
        if (saved) {
            try {
                setCheckedItems(new Set(JSON.parse(saved)));
            } catch (e) {
                console.error('Failed to load checked items:', e);
            }
        }
    }, []);

    // Save checked items to localStorage
    useEffect(() => {
        localStorage.setItem('groceryChecked', JSON.stringify([...checkedItems]));
    }, [checkedItems]);

    const groceryList = useMemo(() => {
        const list: Record<string, GroceryItem> = {};

        Object.entries(mealPlan).forEach(([_, recipeIds]) => {
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
                                checked: checkedItems.has(key),
                            };
                        }
                    });
                }
            });
        });

        return Object.values(list)
            .filter(item => showStaples || !staples.includes(item.name))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [mealPlan, recipes, staples, showStaples, checkedItems]);

    const toggleChecked = (itemName: string) => {
        const key = itemName.toLowerCase();
        setCheckedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(key)) {
                newSet.delete(key);
            } else {
                newSet.add(key);
            }
            return newSet;
        });
    };

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

        <div className="glass rounded-2xl shadow-xl h-full flex flex-col overflow-hidden border-0">
            {/* Header */}
            <div className="bg-gradient-to-r from-jade-50/80 to-jade-100/30 px-6 py-5 border-b border-white/50 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-3">
                    <div className="bg-gradient-to-br from-jade-600 to-jade-700 p-2.5 rounded-xl text-white shadow-lg shadow-jade-200">
                        <ShoppingCart size={20} />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-display font-bold text-warm-900">Grocery List</h2>
                        <p className="text-sm text-warm-500 font-medium">{groceryList.length} items for this week</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2">
                    <button
                        onClick={() => setShowStaples(!showStaples)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 sm:py-2 rounded-xl text-sm font-semibold bg-white/60 border border-white/60 text-warm-600 hover:bg-white hover:text-jade-700 hover:shadow-sm transition-all"
                    >
                        {showStaples ? <EyeOff size={14} /> : <Eye size={14} />}
                        <span className="hidden sm:inline">{showStaples ? 'Hide' : 'Show'} Staples</span>
                        <span className="sm:hidden">{showStaples ? 'Hide' : 'Show'}</span>
                    </button>
                    <button
                        onClick={handleCopyToClipboard}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 sm:py-2 rounded-xl text-sm font-semibold transition-all shadow-sm ${copied
                            ? 'bg-jade-600 text-white'
                            : 'bg-gradient-to-r from-jade-600 to-jade-700 text-white hover:shadow-lg hover:scale-105'
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
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                {groceryList.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-5xl mb-4 opacity-20 grayscale">🛒</div>
                        <p className="text-warm-600 font-medium">No items needed</p>
                        <p className="text-base text-warm-400 mt-1">Plan some meals to generate a list!</p>
                    </div>
                ) : (
                    <ul className="space-y-2">
                        {groceryList.map((item, index) => {
                            const isStaple = staples.includes(item.name);

                            return (
                                <li
                                    key={item.name}
                                    className={`group relative p-3 rounded-xl transition-all duration-200 ${isStaple
                                        ? 'bg-amber-50/40 border border-amber-100/50'
                                        : item.checked
                                            ? 'bg-warm-50/30 border border-transparent'
                                            : 'bg-white/60 border border-white/60 hover:bg-white hover:shadow-md hover:-translate-y-0.5'
                                        }`}
                                    style={{ animationDelay: `${index * 20}ms` }}
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Checkbox */}
                                        <button
                                            onClick={() => toggleChecked(item.name)}
                                            className={`mt-0.5 transition-all cursor-pointer min-w-[20px] min-h-[20px] flex items-center justify-center rounded-md ${item.checked ? 'text-jade-400' : 'text-jade-600 hover:scale-110'}`}
                                            aria-label={item.checked ? 'Uncheck item' : 'Check item'}
                                        >
                                            {item.checked ? <CheckSquare size={20} strokeWidth={2.5} /> : <Square size={20} strokeWidth={2} />}
                                        </button>

                                        {/* Item Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className={`font-semibold text-warm-900 text-base leading-tight transition-all ${item.checked ? 'line-through-animated opacity-40' : ''}`}>
                                                {Math.round(item.quantity * 100) / 100} {item.unit}
                                            </div>
                                            <div className={`text-warm-600 text-base transition-all ${item.checked ? 'line-through-animated opacity-40' : ''}`}>{item.name}</div>
                                            {isStaple && (
                                                <div className="flex items-center gap-1 mt-1">
                                                    <Archive size={10} className="text-amber-500" />
                                                    <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wide opacity-70">Staple</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Staple Toggle */}
                                        <button
                                            onClick={() => toggleStaple(item.name)}
                                            className={`opacity-0 group-hover:opacity-100 transition-all duration-200 p-1.5 rounded-lg hover:scale-110 ${isStaple
                                                ? 'text-amber-500 hover:bg-amber-50'
                                                : 'text-warm-300 hover:bg-warm-50 hover:text-jade-600'
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
                <div className="px-4 py-3 border-t border-white/50 bg-white/30 backdrop-blur-sm">
                    <p className="text-[10px] text-warm-500 text-center font-medium">
                        💡 Tip: Mark pantry staples to hide them
                    </p>
                </div>
            )}
        </div>
    );
};
