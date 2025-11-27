import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Clock, ExternalLink, Trash2, Leaf, Plus, Flame } from 'lucide-react';
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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-display font-bold text-warm-900">My Recipes</h2>
                    <p className="text-sm text-warm-600 mt-1">{recipes.length} recipes in your collection</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="bg-gradient-to-r from-jade-600 to-jade-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-2"
                >
                    <Plus size={18} strokeWidth={2.5} />
                    Add Recipe
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-2 pb-2 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                {[
                    { key: 'all', label: 'All Recipes', icon: null },
                    { key: 'under60', label: '< 60 Mins', icon: Clock },
                    { key: 'highIron', label: 'High Iron', icon: Leaf }
                ].map(({ key, label, icon: Icon }) => (
                    <button
                        key={key}
                        onClick={() => setFilter(key as any)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${filter === key
                            ? 'bg-gradient-to-r from-jade-600 to-jade-700 text-white shadow-md scale-105'
                            : 'bg-white text-warm-700 border border-warm-200 hover:border-jade-300 hover:shadow-sm'
                            }`}
                    >
                        {Icon && <Icon size={14} />}
                        {label}
                    </button>
                ))}
            </div>

            {/* Recipe Grid */}
            <div className="grid gap-4">
                {sortedRecipes.length === 0 ? (
                    <div className="text-center py-16 bg-white/50 rounded-2xl border-2 border-dashed border-warm-300">
                        <div className="text-4xl mb-3">🍜</div>
                        <p className="text-warm-600 font-medium">No recipes found</p>
                        <p className="text-sm text-warm-500 mt-1">Add some delicious recipes to get started!</p>
                    </div>
                ) : (
                    sortedRecipes.map((recipe, index) => (
                        <div
                            key={recipe.id}
                            className="bg-white p-5 rounded-2xl border border-warm-200 shadow-sm hover-lift group relative overflow-hidden"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            {/* Decorative gradient on hover */}
                            <div className="absolute inset-0 bg-gradient-to-br from-jade-50/0 to-coral-50/0 group-hover:from-jade-50/50 group-hover:to-coral-50/30 transition-all duration-300 pointer-events-none"></div>

                            <div className="relative">
                                {/* Header */}
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-display font-bold text-lg text-warm-900 pr-8 leading-tight">
                                        {recipe.title}
                                    </h3>
                                    <button
                                        onClick={() => deleteRecipe(recipe.id)}
                                        className="text-warm-300 hover:text-coral-500 absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                                        aria-label="Delete recipe"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                {/* Tags & Meta */}
                                <div className="flex items-center gap-2 flex-wrap mb-4">
                                    <span className="flex items-center gap-1.5 text-xs text-warm-600 bg-warm-100 px-3 py-1.5 rounded-lg font-medium">
                                        <Clock size={14} />
                                        {recipe.prepTimeMinutes} min
                                    </span>
                                    {recipe.tags.includes('High Iron') && (
                                        <span className="flex items-center gap-1.5 text-xs text-coral-700 font-semibold bg-gradient-to-r from-coral-100 to-coral-50 px-3 py-1.5 rounded-lg border border-coral-200">
                                            <Leaf size={14} />
                                            High Iron
                                        </span>
                                    )}
                                    {recipe.prepTimeMinutes < 60 && (
                                        <span className="flex items-center gap-1.5 text-xs text-jade-700 font-medium bg-jade-50 px-3 py-1.5 rounded-lg">
                                            <Flame size={14} />
                                            Quick
                                        </span>
                                    )}
                                </div>

                                {/* Nutrition */}
                                {recipe.nutrition && (
                                    <div className="flex gap-3 mb-4">
                                        {[
                                            { label: 'Protein', value: recipe.nutrition.protein, color: 'jade' },
                                            { label: 'Carbs', value: recipe.nutrition.carbs, color: 'amber' },
                                            { label: 'Fat', value: recipe.nutrition.fat, color: 'coral' }
                                        ].map(({ label, value, color }) => (
                                            <div key={label} className="flex-1 text-center">
                                                <div className={`text-lg font-bold ${color === 'jade' ? 'text-jade-600' :
                                                    color === 'amber' ? 'text-amber-600' :
                                                        'text-coral-600'
                                                    }`}>
                                                    {value}g
                                                </div>
                                                <div className="text-xs text-warm-500">{label}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Footer */}
                                <div className="flex justify-between items-center pt-3 border-t border-warm-100">
                                    <div className="text-xs text-warm-500">
                                        {recipe.ingredients.length} ingredients
                                    </div>
                                    {recipe.sourceUrl && (
                                        <a
                                            href={recipe.sourceUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-jade-600 hover:text-jade-700 text-xs font-semibold flex items-center gap-1.5 hover:gap-2 transition-all"
                                        >
                                            View Recipe
                                            <ExternalLink size={14} />
                                        </a>
                                    )}
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
