import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Recipe, Ingredient } from '../types';
import { Plus, X } from 'lucide-react';

export const AddRecipeForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const addRecipe = useStore((state) => state.addRecipe);
    const [title, setTitle] = useState('');
    const [sourceUrl, setSourceUrl] = useState('');
    const [prepTime, setPrepTime] = useState(30);
    const [servings, setServings] = useState(4);
    const [isHighIron, setIsHighIron] = useState(false);
    const [nutrition, setNutrition] = useState({ protein: 0, carbs: 0, fat: 0 });
    const [ingredientsText, setIngredientsText] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Simple parsing of ingredients (one per line)
        // Format assumed: "2 lbs Beef" or just "Beef"
        // This is a naive parser for the prototype
        const ingredients: Ingredient[] = ingredientsText.split('\n').map(line => {
            const trimmed = line.trim();
            if (!trimmed) return null;
            // Very basic regex to try and split quantity/unit/name
            // e.g. "2 lbs Beef" -> 2, "lbs", "Beef"
            const match = trimmed.match(/^([\d./]+)\s*([a-zA-Z]+)?\s+(.*)$/);
            if (match) {
                return {
                    quantity: parseFloat(eval(match[1])), // eval to handle fractions like 1/2
                    unit: match[2] || '',
                    name: match[3]
                };
            }
            return {
                quantity: 1,
                unit: 'unit',
                name: trimmed
            };
        }).filter((i): i is Ingredient => i !== null);

        const newRecipe: Recipe = {
            id: crypto.randomUUID(),
            title,
            sourceUrl,
            prepTimeMinutes: prepTime,
            servings,
            ingredients,
            tags: isHighIron ? ['High Iron'] : [],
            nutrition,
        };

        addRecipe(newRecipe);
        onClose();
    };

    return (
        <div className="fixed inset-0 backdrop-blur-md bg-black/60 flex items-center justify-center p-0 sm:p-4 z-50 animate-fade-in">
            <div className="glass rounded-none sm:rounded-2xl border-0 sm:border-2 border-warm-200 shadow-xl w-full h-full sm:h-auto sm:max-w-lg lg:max-w-xl max-h-screen sm:max-h-[90vh] overflow-y-auto animate-scale-in">
                <div className="flex justify-between items-center p-5 sm:p-6 border-b border-warm-200 bg-gradient-to-r from-jade-50 to-jade-100/50 sticky top-0 z-10 backdrop-blur-sm">
                    <h2 className="text-xl font-display font-bold text-warm-900">Add New Recipe</h2>
                    <button
                        onClick={onClose}
                        className="text-warm-400 hover:text-warm-600 transition-colors p-1 hover:rotate-90 duration-200"
                        aria-label="Close"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-semibold text-warm-900 mb-1.5">Recipe Title</label>
                        <input
                            id="title"
                            required
                            type="text"
                            className="w-full px-4 py-2.5 border-2 border-warm-200 rounded-xl focus:ring-2 focus:ring-jade-500 focus:border-jade-500 outline-none bg-white text-warm-900 placeholder-warm-400 transition-all"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Beef and Broccoli"
                        />
                    </div>

                    <div>
                        <label htmlFor="sourceUrl" className="block text-sm font-semibold text-warm-900 mb-1.5">Source URL</label>
                        <input
                            id="sourceUrl"
                            type="url"
                            className="w-full px-4 py-2.5 border-2 border-warm-200 rounded-xl focus:ring-2 focus:ring-jade-500 focus:border-jade-500 outline-none bg-white text-warm-900 placeholder-warm-400 transition-all"
                            value={sourceUrl}
                            onChange={(e) => setSourceUrl(e.target.value)}
                            placeholder="https://madewithlau.com/..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <div>
                            <label htmlFor="prepTime" className="block text-sm font-semibold text-warm-900 mb-1.5">Prep Time (mins)</label>
                            <input
                                id="prepTime"
                                type="number"
                                className="w-full px-4 py-2.5 border-2 border-warm-200 rounded-xl focus:ring-2 focus:ring-jade-500 focus:border-jade-500 outline-none bg-white text-warm-900 transition-all"
                                value={prepTime}
                                onChange={(e) => setPrepTime(parseInt(e.target.value))}
                            />
                        </div>
                        <div>
                            <label htmlFor="servings" className="block text-sm font-semibold text-warm-900 mb-1.5">Servings</label>
                            <input
                                id="servings"
                                type="number"
                                className="w-full px-4 py-2.5 border-2 border-warm-200 rounded-xl focus:ring-2 focus:ring-jade-500 focus:border-jade-500 outline-none bg-white text-warm-900 transition-all"
                                value={servings}
                                onChange={(e) => setServings(parseInt(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                        <div>
                            <label htmlFor="protein" className="block text-xs sm:text-sm font-semibold text-warm-900 mb-1.5">Protein (g)</label>
                            <input
                                id="protein"
                                type="number"
                                className="w-full px-3 py-2.5 border-2 border-warm-200 rounded-xl focus:ring-2 focus:ring-jade-500 focus:border-jade-500 outline-none bg-white text-warm-900 transition-all"
                                value={nutrition.protein}
                                onChange={(e) => setNutrition({ ...nutrition, protein: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div>
                            <label htmlFor="carbs" className="block text-xs sm:text-sm font-semibold text-warm-900 mb-1.5">Carbs (g)</label>
                            <input
                                id="carbs"
                                type="number"
                                className="w-full px-3 py-2.5 border-2 border-warm-200 rounded-xl focus:ring-2 focus:ring-jade-500 focus:border-jade-500 outline-none bg-white text-warm-900 transition-all"
                                value={nutrition.carbs}
                                onChange={(e) => setNutrition({ ...nutrition, carbs: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div>
                            <label htmlFor="fat" className="block text-xs sm:text-sm font-semibold text-warm-900 mb-1.5">Fat (g)</label>
                            <input
                                id="fat"
                                type="number"
                                className="w-full px-3 py-2.5 border-2 border-warm-200 rounded-xl focus:ring-2 focus:ring-jade-500 focus:border-jade-500 outline-none bg-white text-warm-900 transition-all"
                                value={nutrition.fat}
                                onChange={(e) => setNutrition({ ...nutrition, fat: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-coral-50/50 border border-coral-200">
                        <input
                            type="checkbox"
                            id="highIron"
                            className="w-5 h-5 text-coral-600 rounded focus:ring-coral-500 border-coral-300 cursor-pointer"
                            checked={isHighIron}
                            onChange={(e) => setIsHighIron(e.target.checked)}
                        />
                        <label htmlFor="highIron" className="text-sm font-semibold text-warm-900 cursor-pointer flex-1">
                            High Iron Recipe?
                        </label>
                    </div>

                    <div>
                        <label htmlFor="ingredients" className="block text-sm font-semibold text-warm-900 mb-1.5">
                            Ingredients (One per line)
                            <span className="block text-xs text-warm-600 font-normal mt-0.5">Format: "2 lbs Beef" or "1 cup Rice"</span>
                        </label>
                        <textarea
                            id="ingredients"
                            required
                            className="w-full px-4 py-3 border-2 border-warm-200 rounded-xl focus:ring-2 focus:ring-jade-500 focus:border-jade-500 outline-none h-32 font-mono text-sm bg-white text-warm-900 placeholder-warm-400 transition-all resize-none"
                            value={ingredientsText}
                            onChange={(e) => setIngredientsText(e.target.value)}
                            placeholder="1 lb Flank Steak&#10;2 cups Broccoli&#10;1 tbsp Soy Sauce"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-jade-600 to-jade-700 text-white py-3 sm:py-2.5 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        <Plus size={20} />
                        Add Recipe
                    </button>
                </form>
            </div>
        </div>
    );
};
