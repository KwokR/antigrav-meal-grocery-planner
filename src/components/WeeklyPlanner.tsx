import React from 'react';
import { useStore } from '../store/useStore';
import { X, Calendar, Leaf } from 'lucide-react';

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
                        <p className="text-base text-warm-600">Plan your dinners for the week</p>
                    </div>
                </div>
                <button
                    onClick={toggleHighIronFocus}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-base font-semibold transition-all duration-200 ${highIronFocus
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
            <div className="w-full overflow-x-auto lg:overflow-visible -mx-4 px-4 lg:mx-0 lg:px-0 scrollbar-hide">
                <div className="flex lg:grid gap-3 lg:grid-cols-7 min-w-full lg:min-w-0 snap-x lg:snap-none pb-4 lg:pb-0">
                    {DAYS.map((day, dayIndex) => {
                        const dayMeals = mealPlan[day] || [];
                        const hasHighIron = dayMeals.some(id => {
                            const recipe = getRecipe(id);
                            return recipe?.tags.includes('High Iron');
                        });

                        return (
                            <div
                                key={day}
                                className={`w-[280px] lg:w-auto snap-start glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${highIronFocus && hasHighIron
                                    ? 'ring-2 ring-coral-300 shadow-coral-200/50'
                                    : 'hover:ring-1 hover:ring-jade-300/50'
                                    }`}
                                style={{ animationDelay: `${dayIndex * 30}ms` }}
                            >
                                {/* Day Header */}
                                <div className={`px-4 py-3 lg:py-2.5 border-b border-warm-100 ${highIronFocus && hasHighIron
                                    ? 'bg-gradient-to-r from-coral-50 to-coral-100/50'
                                    : 'bg-gradient-to-r from-jade-50/50 to-jade-100/20'
                                    }`}>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <div className="font-display font-bold text-warm-900 text-lg lg:text-xl tracking-tight">{DAY_ABBREV[day]}</div>
                                            <div className="text-sm text-warm-500 font-medium md:hidden">{day}</div>
                                        </div>
                                        {hasHighIron && highIronFocus && (
                                            <Leaf size={16} className="text-coral-500 lg:w-4 lg:h-4" />
                                        )}
                                    </div>
                                </div>

                                {/* Meals */}
                                <div className="p-3 lg:p-2.5 space-y-2 lg:space-y-2 min-h-[120px] lg:min-h-[110px]">
                                    {dayMeals.length === 0 ? (
                                        <div className="text-center py-6 lg:py-5">
                                            <div className="text-3xl lg:text-2xl mb-2 lg:mb-1 opacity-20 grayscale">🍽️</div>
                                            <p className="text-sm text-warm-400 font-medium">No meals planned</p>
                                        </div>
                                    ) : (
                                        dayMeals.map((recipeId, idx) => {
                                            const recipe = getRecipe(recipeId);
                                            if (!recipe) return null;
                                            const isHighIron = recipe.tags.includes('High Iron');

                                            return (
                                                <div
                                                    key={`${day}-${recipeId}-${idx}`}
                                                    className={`group relative p-2.5 lg:p-2 rounded-xl border border-transparent transition-all duration-200 hover:shadow-md ${isHighIron
                                                        ? 'bg-gradient-to-br from-coral-50 to-white shadow-sm ring-1 ring-coral-100'
                                                        : 'bg-white/80 hover:bg-white shadow-sm hover:ring-1 hover:ring-jade-200'
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-start gap-2">
                                                        <span className="text-sm font-semibold text-warm-800 leading-tight flex-1 line-clamp-2">
                                                            {recipe.title}
                                                        </span>
                                                        <button
                                                            onClick={() => removeFromMealPlan(day, recipeId)}
                                                            className="text-warm-300 hover:text-coral-500 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 min-w-[20px] min-h-[20px] flex items-center justify-center"
                                                            aria-label="Remove meal"
                                                        >
                                                            <X size={14} className="lg:w-3 lg:h-3" />
                                                        </button>
                                                    </div>
                                                    {isHighIron && (
                                                        <div className="flex items-center gap-1 mt-1.5">
                                                            <Leaf size={10} className="text-coral-500 lg:w-2.5 lg:h-2.5" />
                                                            <span className="text-[10px] lg:text-[9px] text-coral-600 font-bold tracking-wide uppercase">High Iron</span>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })
                                    )}
                                </div>

                                {/* Add Meal Button */}
                                <div className="px-3 lg:px-2.5 pb-3 lg:pb-2.5">
                                    <select
                                        className="w-full text-sm border border-dashed border-warm-300 rounded-lg px-3 py-2.5 bg-white/50 text-warm-500 outline-none focus:border-jade-500 focus:text-jade-700 hover:border-jade-400 hover:bg-white transition-all cursor-pointer font-medium appearance-none text-center"
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
