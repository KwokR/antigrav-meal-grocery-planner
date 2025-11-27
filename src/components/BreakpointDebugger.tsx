import React from 'react';

export const BreakpointDebugger: React.FC = () => {
    if (process.env.NODE_ENV === 'production') return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 p-2 bg-black/80 text-white text-xs font-mono rounded-lg shadow-lg pointer-events-none">
            <span className="block sm:hidden">xs (mobile)</span>
            <span className="hidden sm:block md:hidden">sm (tablet)</span>
            <span className="hidden md:block lg:hidden">md (small laptop)</span>
            <span className="hidden lg:block xl:hidden">lg (desktop)</span>
            <span className="hidden xl:block 2xl:hidden">xl (large desktop)</span>
            <span className="hidden 2xl:block">2xl (extra large)</span>
        </div>
    );
};
