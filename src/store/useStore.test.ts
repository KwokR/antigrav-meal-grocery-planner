import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useStore } from './useStore';
import { Recipe } from '../types';

describe('useStore', () => {
    beforeEach(() => {
        localStorage.clear();
        useStore.setState({
            recipes: [],
            mealPlan: {},
            highIronFocus: false,
            staples: [],
        });
    });

    it('should add a recipe with nutritional info', () => {
        const { result } = renderHook(() => useStore());
        const newRecipe: Recipe = {
            id: '1',
            title: 'Test Recipe',
            sourceUrl: 'http://test.com',
            prepTimeMinutes: 30,
            servings: 4,
            ingredients: [{ name: 'Beef', quantity: 1, unit: 'lb' }],
            tags: ['High Iron'],
            nutrition: { protein: 30, carbs: 10, fat: 15 },
        };

        act(() => {
            result.current.addRecipe(newRecipe);
        });

        expect(result.current.recipes).toHaveLength(1);
        expect(result.current.recipes[0].nutrition).toEqual({ protein: 30, carbs: 10, fat: 15 });
    });

    it('should toggle staples', () => {
        const { result } = renderHook(() => useStore());

        act(() => {
            result.current.toggleStaple('Soy Sauce');
        });

        expect(result.current.staples).toContain('Soy Sauce');

        act(() => {
            result.current.toggleStaple('Soy Sauce');
        });

        expect(result.current.staples).not.toContain('Soy Sauce');
    });
});
