import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Body from '../../src/MovieCard'


describe('MovieCard Component', () => {
    const mockMovieDetails = {
        title: 'Inception',
        rating: 8.8,
        image: 'https://example.com/inception.jpg'
    };
    const mockOnSelect = vi.fn();
    it('renders movie details correctly', () => {
        render(<Body movie_details={mockMovieDetails} onSelect={mockOnSelect} isSelected={false} index={0} />);
        expect(screen.getByText('Inception')).toBeInTheDocument();
        expect(screen.getByText('8.8/10')).toBeInTheDocument();
        expect(screen.getByAltText('Poster')).toHaveAttribute('src', 'https://example.com/inception.jpg');
    });
    it('applies selected class when isSelected is true', () => {
        const { container } = render(<Body movie_details={mockMovieDetails} onSelect={mockOnSelect} isSelected={true} index={0} />);
        expect(container.firstChild).toHaveClass('selected')

    });
    it('calls onSelect when card is clicked', () => {
    const { container } = render(<Body movie_details={mockMovieDetails} onSelect={mockOnSelect} isSelected={false} index={0} />);
    container.firstChild.click();
    expect(mockOnSelect).toHaveBeenCalledWith(mockMovieDetails);
    });
    it('renders poster correctly',()=>{
        render(<Body movie_details={mockMovieDetails} onSelect={mockOnSelect} isSelected={false} index={0} />);
        const poster = screen.getByAltText('Poster');
        expect(poster).toBeInTheDocument();
        expect(poster).toHaveAttribute('src', 'https://example.com/inception.jpg');
    })
});