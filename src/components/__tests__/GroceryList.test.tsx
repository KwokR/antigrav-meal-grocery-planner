import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GroceryList } from '../GroceryList';
import { useStore } from '../../store/useStore';

describe('GroceryList', () => {
    beforeEach(() => {
        useStore.setState({
            recipes: [
                {
                    id: '1',
                    title: 'Beef Stir Fry',
                    sourceUrl: '',
                    prepTimeMinutes: 30,
                    servings: 4,
                    ingredients: [{ name: 'Beef', quantity: 1, unit: 'lb' }],
                    tags: [],
                },
            ],
            mealPlan: {
                '2023-11-20': ['1'], // Monday
            },
            staples: [],
        });
    });

    it('should display ingredients scaled to 4 portions', () => {
        // Recipe is 4 servings, we want 4 portions.
        // Logic in GroceryList currently scales based on leftovers?
        // Requirement: "Ingredients automatically calculated for 4 portions (dinner + leftovers)."
        // If recipe is 4 servings, and we plan it once, we get 4 servings.
        // Let's assume the requirement means "Ensure we have enough for 4 people".
        // If recipe is 2 servings, we need 2x.

        render(<GroceryList />);
        expect(screen.getByText(/1 lb Beef/i)).toBeDefined();
    });

    it('should allow marking items as staples', () => {
        render(<GroceryList />);

        // Find the "Mark as Staple" button (we need to add this)
        // Assuming we'll add a button or checkbox
        const stapleBtn = screen.getByLabelText(/Mark Beef as staple/i);
        fireEvent.click(stapleBtn);

        // Should disappear from list
        expect(screen.queryByText(/1 lb Beef/i)).toBeNull();

        // Verify it's in store
        expect(useStore.getState().staples).toContain('Beef');
    });

    it('should copy to clipboard', async () => {
        const writeTextMock = vi.fn();
        Object.defineProperty(navigator, 'clipboard', {
            value: {
                writeText: writeTextMock,
            },
            writable: true,
        });

        render(<GroceryList />);

        fireEvent.click(screen.getByText(/Copy/i));

        expect(writeTextMock).toHaveBeenCalledWith(expect.stringContaining('1 lb Beef'));
    });
});
