import { RecipeList } from './components/RecipeList';
import { WeeklyPlanner } from './components/WeeklyPlanner';
import { GroceryList } from './components/GroceryList';
import { useStore } from './store/useStore';
import { UtensilsCrossed, Sparkles } from 'lucide-react';

function App() {
    const { recipes, mealPlan } = useStore();

    // Calculate dynamic stats
    const plannedDays = Object.keys(mealPlan).filter(day =>
        mealPlan[day].length > 0
    ).length;

    return (
        <div className="min-h-screen">
            {/* Decorative Background Elements */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-jade-200/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-coral-200/20 rounded-full blur-3xl"></div>
            </div>

            {/* Header with Glassmorphism */}
            <header className="glass border-b border-warm-200/50 sticky top-0 z-50 animate-slide-up">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
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
                            <p className="text-[10px] sm:text-xs text-warm-600 font-medium hidden sm:block">Plan smarter, eat better</p>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="hidden md:flex items-center gap-6 text-sm">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-jade-600">{plannedDays}</div>
                            <div className="text-xs text-warm-600">Days Planned</div>
                        </div>
                        <div className="w-px h-8 bg-warm-300"></div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-coral-500">{recipes.length}</div>
                            <div className="text-xs text-warm-600">Recipes</div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 animate-fade-in">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

                    {/* Left Column: Planner & Recipes (2/3) */}
                    <div className="lg:col-span-2 space-y-6">
                        <section className="animate-slide-up" style={{ animationDelay: '100ms' }}>
                            <WeeklyPlanner />
                        </section>

                        <section className="animate-slide-up" style={{ animationDelay: '200ms' }}>
                            <RecipeList />
                        </section>
                    </div>

                    {/* Right Column: Grocery List (1/3) */}
                    <div className="lg:col-span-1">
                        <div className="lg:sticky lg:top-24 animate-slide-up" style={{ animationDelay: '300ms' }}>
                            <GroceryList />
                        </div>
                    </div>

                </div>
            </main>

            {/* Footer */}
            <footer className="mt-16 py-8 border-t border-warm-200/50 glass">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-warm-600">
                    <p>Made with ❤️ for busy home cooks</p>
                </div>
            </footer>
        </div>
    );
}

export default App;
