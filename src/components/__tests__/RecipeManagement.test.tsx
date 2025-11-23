import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AddRecipeForm } from '../AddRecipeForm';
import { RecipeList } from '../RecipeList';
import { useStore } from '../../store/useStore';

describe('RecipeManagement', () => {
    beforeEach(() => {
        useStore.setState({ recipes: [], highIronFocus: false });
    });

    it('should add a recipe with nutrition info', () => {
        render(<AddRecipeForm onClose={() => { }} />);

        fireEvent.change(screen.getByLabelText(/Recipe Title/i), { target: { value: 'Tofu Stir Fry' } });
        fireEvent.change(screen.getByLabelText(/Ingredients/i), { target: { value: '1 block Tofu' } });

        // New fields to test
        fireEvent.change(screen.getByLabelText(/Protein/i), { target: { value: '20' } });
        fireEvent.change(screen.getByLabelText(/Carbs/i), { target: { value: '10' } });
        fireEvent.change(screen.getByLabelText(/Fat/i), { target: { value: '15' } });

        fireEvent.click(screen.getByText(/Add Recipe/i));

        const recipes = useStore.getState().recipes;
        expect(recipes).toHaveLength(1);
        expect(recipes[0].nutrition).toEqual({
            protein: 20,
            carbs: 10,
            fat: 15
        });
    });

    it('should display nutrition badges', () => {
        useStore.setState({
            recipes: [{
                id: '1',
                title: 'Healthy Meal',
                sourceUrl: '',
                prepTimeMinutes: 20,
                servings: 2,
                ingredients: [],
                tags: [],
                nutrition: { protein: 30, carbs: 40, fat: 10 }
            }]
        });

        render(<RecipeList />);

        expect(screen.getByText('30g P')).toBeDefined();
        expect(screen.getByText('40g C')).toBeDefined();
        expect(screen.getByText('10g F')).toBeDefined();
    });
});
