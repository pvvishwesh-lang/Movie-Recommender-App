import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import SearchComponent from '../../src/SearchBar'

describe('SearchBar Component', () => {
    const mockOnSearch = vi.fn();
    it('renders search input and button', () => {
        render(<SearchComponent onSearch={mockOnSearch} />);
        expect(screen.getByPlaceholderText('Search for a movie')).toBeInTheDocument();
        expect(screen.getByText('Search')).toBeInTheDocument();
    });
    it('calls onSearch with query when Search button is clicked', () => {
        render(<SearchComponent onSearch={mockOnSearch} />);
        const input = screen.getByPlaceholderText('Search for a movie');
        fireEvent.change(input, { target: { value: 'Inception' } });
        fireEvent.click(screen.getByText('Search'));
        expect(mockOnSearch).toHaveBeenCalledWith('Inception');
    });
    it('calls onSearch with query when Enter key is pressed', () => {
        render(<SearchComponent onSearch={mockOnSearch} />);
        const input = screen.getByPlaceholderText('Search for a movie');
        fireEvent.change(input, { target: { value: 'Inception' } });
        fireEvent.keyDown(input, { key: 'Enter' });
        expect(mockOnSearch).toHaveBeenCalledWith('Inception');
    });
});