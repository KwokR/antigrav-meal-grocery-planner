import { RecipeList } from './components/RecipeList';
import { WeeklyPlanner } from './components/WeeklyPlanner';
import { GroceryList } from './components/GroceryList';
import { UtensilsCrossed } from 'lucide-react';

function App() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-3">
                    <div className="bg-emerald-600 p-2 rounded-lg text-white">
                        <UtensilsCrossed size={24} />
                    </div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
                        Asian Meal Planner
                    </h1>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column: Recipes & Planner (8 cols) */}
                    <div className="lg:col-span-8 space-y-8">
                        <section>
                            <WeeklyPlanner />
                        </section>

                        <section className="pt-8 border-t border-slate-200">
                            <RecipeList />
                        </section>
                    </div>

                    {/* Right Column: Grocery List (4 cols) */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-24">
                            <GroceryList />
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}

export default App;
