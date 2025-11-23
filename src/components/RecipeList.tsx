import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Clock, ExternalLink, Trash2, Leaf } from 'lucide-react';
import { AddRecipeForm } from './AddRecipeForm';

export const RecipeList: React.FC = () => {
    const { recipes, deleteRecipe, highIronFocus } = useStore();
    const [isAdding, setIsAdding] = useState(false);
    const [filter, setFilter] = useState<'all' | 'under60' | 'highIron'>('all');

    const filteredRecipes = recipes.filter(r => {
        if (filter === 'under60') return r.prepTimeMinutes < 60;
        if (filter === 'highIron') return r.tags.includes('High Iron');
        return true;
    });

    // Sort: High Iron first if focus is on
    const sortedRecipes = [...filteredRecipes].sort((a, b) => {
        if (highIronFocus) {
            const aIron = a.tags.includes('High Iron');
            const bIron = b.tags.includes('High Iron');
            if (aIron && !bIron) return -1;
            if (!aIron && bIron) return 1;
        }
        return 0;
    });

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">My Recipes</h2>
                <button
                    onClick={() => setIsAdding(true)}
                    className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
                >
                    + Add Recipe
                </button>
            </div>

            <div className="flex gap-2 pb-2 overflow-x-auto">
                {['all', 'under60', 'highIron'].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f as any)}
                        className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${filter === f
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                            }`}
                    >
                        {f === 'all' ? 'All Recipes' : f === 'under60' ? '< 60 Mins' : 'High Iron'}
                    </button>
                ))}
            </div>

            <div className="grid gap-3">
                {sortedRecipes.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-sm bg-slate-50 rounded-lg border border-dashed border-slate-200">
                        No recipes found. Add some to get started!
                    </div>
                ) : (
                    sortedRecipes.map((recipe) => (
                        <div
                            key={recipe.id}
                            className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow group relative"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-semibold text-slate-800 pr-8">{recipe.title}</h3>
                                <button
                                    onClick={() => deleteRecipe(recipe.id)}
                                    className="text-slate-300 hover:text-red-500 absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                                <span className="flex items-center gap-1">
                                    <Clock size={14} />
                                    {recipe.prepTimeMinutes}m
                                </span>
                                {recipe.tags.includes('High Iron') && (
                                    <span className="flex items-center gap-1 text-rose-600 font-medium bg-rose-50 px-2 py-0.5 rounded-full">
                                        <Leaf size={12} />
                                        High Iron
                                    </span>
                                )}
                            </div>

                            <div className="flex justify-between items-center mt-2">
                                {recipe.sourceUrl && (
                                    <a
                                        href={recipe.sourceUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-emerald-600 hover:text-emerald-700 text-xs flex items-center gap-1"
                                    >
                                        View Recipe <ExternalLink size={12} />
                                    </a>
                                )}
                                <div className="text-xs text-slate-400">
                                    {recipe.ingredients.length} ingredients
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {isAdding && <AddRecipeForm onClose={() => setIsAdding(false)} />}
        </div>
    );
};
