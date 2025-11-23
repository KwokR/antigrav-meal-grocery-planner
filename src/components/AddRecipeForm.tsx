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
        };

        addRecipe(newRecipe);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-bold text-slate-800">Add New Recipe</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Recipe Title</label>
                        <input
                            required
                            type="text"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Beef and Broccoli"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Source URL</label>
                        <input
                            type="url"
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                            value={sourceUrl}
                            onChange={(e) => setSourceUrl(e.target.value)}
                            placeholder="https://madewithlau.com/..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Prep Time (mins)</label>
                            <input
                                type="number"
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                value={prepTime}
                                onChange={(e) => setPrepTime(parseInt(e.target.value))}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Servings</label>
                            <input
                                type="number"
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                value={servings}
                                onChange={(e) => setServings(parseInt(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="highIron"
                            className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                            checked={isHighIron}
                            onChange={(e) => setIsHighIron(e.target.checked)}
                        />
                        <label htmlFor="highIron" className="text-sm font-medium text-slate-700">
                            High Iron Recipe?
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Ingredients (One per line)
                            <span className="block text-xs text-slate-500 font-normal">Format: "2 lbs Beef" or "1 cup Rice"</span>
                        </label>
                        <textarea
                            required
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none h-32 font-mono text-sm"
                            value={ingredientsText}
                            onChange={(e) => setIngredientsText(e.target.value)}
                            placeholder="1 lb Flank Steak&#10;2 cups Broccoli&#10;1 tbsp Soy Sauce"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <Plus size={20} />
                        Add Recipe
                    </button>
                </form>
            </div>
        </div>
    );
};
