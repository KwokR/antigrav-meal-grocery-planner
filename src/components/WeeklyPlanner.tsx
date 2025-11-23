import React from 'react';
import { useStore } from '../store/useStore';
import { X } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const WeeklyPlanner: React.FC = () => {
    const { mealPlan, recipes, removeFromMealPlan, updateMealPlan, highIronFocus, toggleHighIronFocus } = useStore();

    const getRecipe = (id: string) => recipes.find(r => r.id === id);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">Weekly Plan</h2>
                <button
                    onClick={toggleHighIronFocus}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${highIronFocus
                        ? 'bg-rose-100 text-rose-700 border border-rose-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                        }`}
                >
                    <span className={`w-2 h-2 rounded-full ${highIronFocus ? 'bg-rose-500' : 'bg-slate-400'}`} />
                    High Iron Focus
                </button>
            </div>

            <div className="grid gap-4">
                {DAYS.map((day) => (
                    <div key={day} className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                        <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                            <span className="font-medium text-slate-700">{day}</span>
                            <select
                                className="text-xs border rounded px-2 py-1 bg-white text-slate-600 outline-none focus:border-emerald-500"
                                onChange={(e) => {
                                    if (e.target.value) {
                                        updateMealPlan(day, e.target.value);
                                        e.target.value = ''; // reset
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

                        <div className="p-3 space-y-2 min-h-[60px]">
                            {(mealPlan[day] || []).length === 0 ? (
                                <div className="text-xs text-slate-400 italic text-center py-2">No meals planned</div>
                            ) : (
                                (mealPlan[day] || []).map((recipeId, idx) => {
                                    const recipe = getRecipe(recipeId);
                                    if (!recipe) return null;
                                    return (
                                        <div key={`${day}-${recipeId}-${idx}`} className="flex justify-between items-center bg-slate-50 p-2 rounded border border-slate-100">
                                            <span className="text-sm text-slate-700 truncate">{recipe.title}</span>
                                            <button
                                                onClick={() => removeFromMealPlan(day, recipeId)}
                                                className="text-slate-400 hover:text-red-500"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
