import React from 'react';
import { useStore } from '../store/useStore';
import { X, Calendar, Leaf, Plus } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DAY_ABBREV: Record<string, string> = {
    'Monday': 'Mon',
    'Tuesday': 'Tue',
    'Wednesday': 'Wed',
    'Thursday': 'Thu',
    'Friday': 'Fri',
    'Saturday': 'Sat',
    'Sunday': 'Sun'
};

export const WeeklyPlanner: React.FC = () => {
    const { mealPlan, recipes, removeFromMealPlan, updateMealPlan, highIronFocus, toggleHighIronFocus } = useStore();

    const getRecipe = (id: string) => recipes.find(r => r.id === id);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-jade-600 to-jade-700 p-2.5 rounded-xl text-white shadow-md">
                        <Calendar size={20} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-display font-bold text-warm-900">Weekly Plan</h2>
                        <p className="text-sm text-warm-600">Plan your dinners for the week</p>
                    </div>
                </div>
                <button
                    onClick={toggleHighIronFocus}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${highIronFocus
                        ? 'bg-gradient-to-r from-coral-500 to-coral-600 text-white shadow-md scale-105'
                        : 'bg-white text-warm-700 border border-warm-200 hover:border-coral-300 hover:shadow-sm'
                        }`}
                >
                    <Leaf size={16} />
                    High Iron Focus
                    {highIronFocus && <span className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                </button>
            </div>

            {/* Calendar Grid */}
            <div className="overflow-x-auto md:overflow-visible -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
                <div className="inline-flex md:grid gap-3 md:grid-cols-2 lg:grid-cols-7 min-w-max md:min-w-0 snap-x md:snap-none">
                    {DAYS.map((day, dayIndex) => {
                        const dayMeals = mealPlan[day] || [];
                        const hasHighIron = dayMeals.some(id => {
                            const recipe = getRecipe(id);
                            return recipe?.tags.includes('High Iron');
                        });

                        return (
                            <div
                                key={day}
                                className={`w-[280px] md:w-auto snap-start bg-white rounded-2xl border-2 overflow-hidden transition-all duration-200 hover:shadow-lg ${highIronFocus && hasHighIron
                                    ? 'border-coral-300 shadow-coral-200/50 shadow-md'
                                    : 'border-warm-200 hover:border-jade-300'
                                    }`}
                                style={{ animationDelay: `${dayIndex * 30}ms` }}
                            >
                                {/* Day Header */}
                                <div className={`px-4 py-3 border-b-2 ${highIronFocus && hasHighIron
                                    ? 'bg-gradient-to-r from-coral-50 to-coral-100/50 border-coral-200'
                                    : 'bg-gradient-to-r from-jade-50 to-jade-100/30 border-warm-200'
                                    }`}>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="font-display font-bold text-warm-900">{DAY_ABBREV[day]}</div>
                                            <div className="text-xs text-warm-600 md:hidden">{day}</div>
                                        </div>
                                        {hasHighIron && highIronFocus && (
                                            <Leaf size={16} className="text-coral-600" />
                                        )}
                                    </div>
                                </div>

                                {/* Meals */}
                                <div className="p-3 space-y-2 min-h-[120px]">
                                    {dayMeals.length === 0 ? (
                                        <div className="text-center py-6">
                                            <div className="text-3xl mb-2 opacity-30">🍽️</div>
                                            <p className="text-xs text-warm-400">No meals</p>
                                        </div>
                                    ) : (
                                        dayMeals.map((recipeId, idx) => {
                                            const recipe = getRecipe(recipeId);
                                            if (!recipe) return null;
                                            const isHighIron = recipe.tags.includes('High Iron');

                                            return (
                                                <div
                                                    key={`${day}-${recipeId}-${idx}`}
                                                    className={`group relative p-2.5 rounded-lg border transition-all duration-200 hover:shadow-md ${isHighIron
                                                        ? 'bg-gradient-to-br from-coral-50 to-white border-coral-200'
                                                        : 'bg-warm-50 border-warm-200 hover:border-jade-300'
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-start gap-2">
                                                        <span className="text-xs font-medium text-warm-900 leading-tight flex-1">
                                                            {recipe.title}
                                                        </span>
                                                        <button
                                                            onClick={() => removeFromMealPlan(day, recipeId)}
                                                            className="text-warm-300 hover:text-coral-500 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 min-w-[24px] min-h-[24px] flex items-center justify-center"
                                                            aria-label="Remove meal"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                    {isHighIron && (
                                                        <div className="flex items-center gap-1 mt-1">
                                                            <Leaf size={10} className="text-coral-600" />
                                                            <span className="text-[10px] text-coral-600 font-semibold">High Iron</span>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })
                                    )}
                                </div>

                                {/* Add Meal Button */}
                                <div className="px-3 pb-3">
                                    <select
                                        className="w-full text-xs border-2 border-dashed border-warm-300 rounded-lg px-3 py-2.5 md:py-2 bg-white text-warm-600 outline-none focus:border-jade-500 hover:border-jade-400 transition-colors cursor-pointer font-medium"
                                        onChange={(e) => {
                                            if (e.target.value) {
                                                updateMealPlan(day, e.target.value);
                                                e.target.value = '';
                                            }
                                        }}
                                        value=""
                                    >
                                        <option value="">+ Add Meal</option>
                                        {recipes.map(r => (
                                            <option key={r.id} value={r.id}>{r.title}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
