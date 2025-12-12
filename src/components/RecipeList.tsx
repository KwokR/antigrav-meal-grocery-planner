import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Clock, ExternalLink, Leaf, Plus, Users, Check, Trash2 } from 'lucide-react';
import { AddRecipeForm } from './AddRecipeForm';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Food emoji helper function
const getFoodEmoji = (title: string): string => {
    const lowerTitle = title.toLowerCase();

    // Asian cuisine emojis based on keywords
    if (lowerTitle.includes('beef') || lowerTitle.includes('steak')) return '🥩';
    if (lowerTitle.includes('chicken')) return '🍗';
    if (lowerTitle.includes('pork')) return '🥓';
    if (lowerTitle.includes('fish') || lowerTitle.includes('salmon')) return '🐟';
    if (lowerTitle.includes('shrimp') || lowerTitle.includes('prawn')) return '🦐';
    if (lowerTitle.includes('noodle') || lowerTitle.includes('ramen') || lowerTitle.includes('pasta')) return '🍜';
    if (lowerTitle.includes('rice') || lowerTitle.includes('fried rice')) return '🍚';
    if (lowerTitle.includes('dumpling') || lowerTitle.includes('gyoza') || lowerTitle.includes('wonton')) return '🥟';
    if (lowerTitle.includes('curry')) return '🍛';
    if (lowerTitle.includes('soup')) return '🍲';
    if (lowerTitle.includes('vegetable') || lowerTitle.includes('veggie') || lowerTitle.includes('broccoli')) return '🥬';
    if (lowerTitle.includes('tofu')) return '🧈';
    if (lowerTitle.includes('egg')) return '🥚';
    if (lowerTitle.includes('sushi') || lowerTitle.includes('roll')) return '🍣';

    // Default
    return '🍱';
};

const getDifficulty = (minutes: number): string => {
    if (minutes <= 30) return 'Easy';
    if (minutes <= 60) return 'Medium';
    return 'Hard';
};

export const RecipeList: React.FC = () => {
    const { recipes, highIronFocus, mealPlan, updateMealPlan, deleteRecipe } = useStore();
    const [isAdding, setIsAdding] = useState(false);
    const [filter, setFilter] = useState<'all' | 'under60' | 'highIron'>('all');
    const [quickAddedRecipe, setQuickAddedRecipe] = useState<string | null>(null);
    const [deletingRecipe, setDeletingRecipe] = useState<string | null>(null);

    // Find first day with no meals planned
    const getFirstEmptyDay = (): string | null => {
        for (const day of DAYS) {
            if (!mealPlan[day] || mealPlan[day].length === 0) {
                return day;
            }
        }
        return null;
    };

    const handleQuickAdd = (recipeId: string) => {
        const emptyDay = getFirstEmptyDay();
        if (emptyDay) {
            updateMealPlan(emptyDay, recipeId);
            setQuickAddedRecipe(recipeId);
            setTimeout(() => setQuickAddedRecipe(null), 1500);
        }
    };

    const handleDelete = (recipeId: string) => {
        if (deletingRecipe === recipeId) {
            // Second click - confirm deletion
            deleteRecipe(recipeId);
            setDeletingRecipe(null);
        } else {
            // First click - show confirmation
            setDeletingRecipe(recipeId);
            // Auto-reset after 3 seconds if not confirmed
            setTimeout(() => setDeletingRecipe(null), 3000);
        }
    };

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
                    <p className="text-base text-warm-600 mt-1">{recipes.length} recipes in your collection</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="bg-gradient-to-r from-jade-600 to-jade-700 text-white px-5 py-2.5 rounded-xl text-base font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-2"
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
                        className={`px-4 py-2 rounded-xl text-base font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${filter === key
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
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {sortedRecipes.length === 0 ? (
                    <div className="text-center py-16 bg-white/50 rounded-2xl border-2 border-dashed border-warm-300">
                        <div className="text-4xl mb-3">🍜</div>
                        <p className="text-warm-600 font-medium">No recipes found</p>
                        <p className="text-base text-warm-500 mt-1">Add some delicious recipes to get started!</p>
                    </div>
                ) : (
                    sortedRecipes.map((recipe, idx) => {
                        const difficulty = getDifficulty(recipe.prepTimeMinutes);
                        return (
                            <div
                                key={recipe.id}
                                className="group glass-card rounded-2xl overflow-hidden hover-lift flex flex-col h-full"
                                style={{ animationDelay: `${idx * 50}ms` }}
                            >
                                {/* Card Header with Emoji & Gradient */}
                                <div className={`h-32 relative overflow-hidden ${idx % 3 === 0 ? 'bg-gradient-to-br from-jade-100 via-warm-50 to-coral-50' :
                                    idx % 3 === 1 ? 'bg-gradient-to-br from-amber-50 via-warm-50 to-jade-50' :
                                        'bg-gradient-to-br from-coral-50 via-warm-50 to-amber-50'
                                    }`}>
                                    <div className="absolute inset-0 flex items-center justify-center text-6xl transform group-hover:scale-110 transition-transform duration-500 ease-out">
                                        {getFoodEmoji(recipe.title)}
                                    </div>

                                    {/* Quick Add & Delete Overlay */}
                                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3">
                                        {/* Delete Button */}
                                        <button
                                            onClick={() => handleDelete(recipe.id)}
                                            className={`p-2 rounded-full shadow-lg transform -translate-x-4 group-hover:translate-x-0 transition-all duration-300 ${deletingRecipe === recipe.id
                                                ? 'bg-coral-600 text-white scale-110'
                                                : 'bg-white text-coral-500 hover:bg-coral-50 hover:scale-110'
                                                }`}
                                            title={deletingRecipe === recipe.id ? 'Click again to confirm delete' : 'Delete recipe'}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                        {/* Quick Add Button */}
                                        <button
                                            onClick={() => handleQuickAdd(recipe.id)}
                                            disabled={!getFirstEmptyDay()}
                                            className={`p-2 rounded-full shadow-lg transform translate-x-4 group-hover:translate-x-0 transition-all duration-300 ${quickAddedRecipe === recipe.id
                                                ? 'bg-jade-600 text-white scale-110'
                                                : 'bg-white text-jade-600 hover:bg-jade-50 hover:scale-110'
                                                } ${!getFirstEmptyDay() ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            title={getFirstEmptyDay() ? `Quick Add to ${getFirstEmptyDay()}` : 'All days have meals'}
                                        >
                                            {quickAddedRecipe === recipe.id ? <Check size={20} /> : <Plus size={20} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="p-5 flex flex-col flex-grow">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="font-display font-bold text-lg text-warm-900 leading-tight group-hover:text-jade-700 transition-colors">
                                            {recipe.title}
                                        </h3>
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm ${difficulty === 'Easy' ? 'bg-jade-100 text-jade-700' :
                                            difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' :
                                                'bg-coral-100 text-coral-700'
                                            }`}>
                                            {difficulty}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-warm-500 font-medium mb-5">
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={14} className="text-jade-500" />
                                            <span>{recipe.prepTimeMinutes}m</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Users size={14} className="text-coral-500" />
                                            <span>{recipe.servings} ppl</span>
                                        </div>
                                    </div>

                                    {/* Nutrition Bars */}
                                    <div className="space-y-2.5 mt-auto">
                                        {[
                                            { label: 'Pro', value: recipe.nutrition?.protein || 0, color: 'jade', max: 40 },
                                            { label: 'Carbs', value: recipe.nutrition?.carbs || 0, color: 'amber', max: 60 },
                                            { label: 'Fat', value: recipe.nutrition?.fat || 0, color: 'coral', max: 30 }
                                        ].map((nutrient) => (
                                            <div key={nutrient.label} className="flex items-center gap-2 text-xs">
                                                <span className="w-10 font-semibold text-warm-600">{nutrient.label}</span>
                                                <div className="flex-1 h-1.5 bg-warm-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-1000 ease-out ${nutrient.color === 'jade' ? 'bg-jade-400' :
                                                            nutrient.color === 'amber' ? 'bg-amber-400' :
                                                                'bg-coral-400'
                                                            }`}
                                                        style={{ width: `${Math.min((nutrient.value / nutrient.max) * 100, 100)}%` }}
                                                    />
                                                </div>
                                                <span className="w-6 text-right text-warm-400 font-medium">{nutrient.value}g</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Footer */}
                                    <div className="flex justify-between items-center pt-3 mt-4 border-t border-warm-100">
                                        <div className="text-sm text-warm-500">
                                            {recipe.ingredients.length} ingredients
                                        </div>
                                        {recipe.sourceUrl && (
                                            <a
                                                href={recipe.sourceUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-jade-600 hover:text-jade-700 text-sm font-semibold flex items-center gap-1.5 hover:gap-2 transition-all"
                                            >
                                                View Recipe
                                                <ExternalLink size={14} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {isAdding && <AddRecipeForm onClose={() => setIsAdding(false)} />}
        </div>
    );
};
