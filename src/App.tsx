import { useState, useMemo } from 'react';
import { RecipeList } from './components/RecipeList';
import { WeeklyPlanner } from './components/WeeklyPlanner';
import { GroceryList } from './components/GroceryList';
import { useStore } from './store/useStore';
import { UtensilsCrossed, Sparkles, ShoppingCart, X } from 'lucide-react';

function App() {
    const { recipes, mealPlan } = useStore();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Calculate dynamic stats
    const plannedDays = Object.keys(mealPlan).filter(day =>
        mealPlan[day].length > 0
    ).length;

    // Calculate grocery item count for badge
    const groceryItemCount = useMemo(() => {
        const items = new Set<string>();
        Object.values(mealPlan).forEach(recipeIds => {
            recipeIds.forEach(recipeId => {
                const recipe = recipes.find(r => r.id === recipeId);
                if (recipe) {
                    recipe.ingredients.forEach(ing => items.add(ing.name.toLowerCase()));
                }
            });
        });
        return items.size;
    }, [mealPlan, recipes]);

    return (
        <div className="min-h-screen">
            {/* Decorative Background Elements */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-jade-200/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-coral-200/20 rounded-full blur-3xl"></div>
            </div>

            {/* Header with Glassmorphism */}
            <header className="glass border-b border-warm-200/50 sticky top-0 z-50 animate-slide-up">
                <div className="w-full px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="relative">
                            <div className="absolute inset-0 bg-jade-600 rounded-xl blur-md opacity-50 animate-pulse"></div>
                            <div className="relative bg-gradient-to-br from-jade-600 to-jade-700 p-2 sm:p-3 rounded-xl text-white shadow-lg">
                                <UtensilsCrossed size={24} strokeWidth={2.5} className="sm:w-7 sm:h-7" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-lg sm:text-2xl font-display font-bold gradient-text flex items-center gap-2">
                                Asian Meal Planner
                                <Sparkles size={16} className="text-amber-500 sm:w-5 sm:h-5" />
                            </h1>
                            <p className="text-xs sm:text-sm text-warm-600 font-medium hidden sm:block">Plan smarter, eat better</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6">
                        {/* Quick Stats */}
                        <div className="hidden md:flex items-center gap-6 text-sm">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-jade-600">{plannedDays}</div>
                                <div className="text-sm text-warm-600">Days Planned</div>
                            </div>
                            <div className="w-px h-8 bg-warm-300"></div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-coral-500">{recipes.length}</div>
                                <div className="text-sm text-warm-600">Recipes</div>
                            </div>
                        </div>

                        {/* Grocery List Toggle Button */}
                        <button
                            onClick={() => setIsDrawerOpen(true)}
                            className="relative bg-gradient-to-br from-jade-600 to-jade-700 p-2.5 sm:p-3 rounded-xl text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                            aria-label="Open grocery list"
                        >
                            <ShoppingCart size={22} strokeWidth={2} />
                            {groceryItemCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-coral-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-scale-in">
                                    {groceryItemCount > 9 ? '9+' : groceryItemCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content - Full Width */}
            <main className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 animate-fade-in">
                <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
                    <section className="animate-slide-up" style={{ animationDelay: '100ms' }}>
                        <WeeklyPlanner />
                    </section>

                    <section className="animate-slide-up" style={{ animationDelay: '200ms' }}>
                        <RecipeList />
                    </section>
                </div>
            </main>

            {/* Grocery List Slide-out Drawer */}
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsDrawerOpen(false)}
            />

            {/* Drawer Panel */}
            <div
                className={`fixed top-0 right-0 h-full w-full sm:w-[420px] lg:w-[480px] z-50 transform transition-transform duration-300 ease-out ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="h-full bg-warm-50 shadow-2xl flex flex-col">
                    {/* Drawer Header */}
                    <div className="flex items-center justify-between p-4 border-b border-warm-200 bg-gradient-to-r from-jade-50 to-jade-100/50">
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-br from-jade-600 to-jade-700 p-2 rounded-xl text-white shadow-md">
                                <ShoppingCart size={18} />
                            </div>
                            <div>
                                <h2 className="text-lg font-display font-bold text-warm-900">Grocery List</h2>
                                <p className="text-xs text-warm-500">{groceryItemCount} items</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsDrawerOpen(false)}
                            className="p-2 rounded-xl text-warm-500 hover:text-warm-700 hover:bg-warm-100 transition-all"
                            aria-label="Close grocery list"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Drawer Content */}
                    <div className="flex-1 overflow-hidden">
                        <GroceryList />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-16 py-8 border-t border-warm-200/50 glass">
                <div className="w-full px-4 sm:px-6 lg:px-8 text-center text-sm text-warm-600">
                    <p>Made with ❤️ for busy home cooks</p>
                </div>
            </footer>
        </div>
    );
}

export default App;
