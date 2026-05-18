import { render, screen, fireEvent,waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import App from '../../src/App'

describe('App Component', () => {
    it('renders the header', () => {
        render(<App />)
        expect(screen.getByText('Movie Recommender')).toBeInTheDocument()
    })

    it('renders the tagline', () => {
        render(<App />)
        expect(screen.getByText('Discover your next favorite film')).toBeInTheDocument()
    })

    it('renders the AI Recommendations section', () => {
        render(<App />)
        expect(screen.getByText('AI Recommendations')).toBeInTheDocument()
    })

    it('renders the search bar', () => {
        render(<App />)
        expect(screen.getByPlaceholderText('Search for a movie')).toBeInTheDocument()
    })
    it('toggles theme when button is clicked', () => {
    const { container } = render(<App />)
    const toggleBtn = screen.getByText('☀️')
    expect(container.firstChild).toHaveClass('dark')
    fireEvent.click(toggleBtn)
    expect(container.firstChild).toHaveClass('light')
    })
    it('shows search results after search', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        json: () => Promise.resolve({
            results: [{
                title: 'Inception',
                poster_path: '/path.jpg',
                overview: 'A thief who steals corporate secrets.',
                vote_average: 8.8,
                genre_ids: [28, 878]
            }],
            genres: []
        })
    }))
    render(<App />)
    const input = screen.getByPlaceholderText('Search for a movie')
    fireEvent.change(input, { target: { value: 'Inception' } })
    fireEvent.click(screen.getByText('Search'))
    await waitFor(() => {
        expect(screen.getByText('Inception')).toBeInTheDocument()
    })
    })
    it('shows detail panel when movie is clicked', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        json: () => Promise.resolve({
            results: [{
                id: 1,
                title: 'Inception',
                poster_path: '/path.jpg',
                overview: 'A thief who steals corporate secrets.',
                vote_average: 8.8,
                genre_ids: [28, 878]
            }],
            genres: []
        })
    }))
    render(<App />)
    const input = screen.getByPlaceholderText('Search for a movie')
    fireEvent.change(input, { target: { value: 'Inception' } })
    fireEvent.click(screen.getByText('Search'))
    await waitFor(() => {
        expect(screen.getByText('Inception')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByText('Inception'))
    await waitFor(() => {
        expect(screen.getByText('A thief who steals corporate secrets.')).toBeInTheDocument()
    })
    })
    it('closes detail panel when close button is clicked', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        json: () => Promise.resolve({
            results: [{
                id: 1,
                title: 'Inception',
                poster_path: '/path.jpg',
                overview: 'A thief who steals corporate secrets.',
                vote_average: 8.8,
                genre_ids: [28, 878]
            }],
            genres: []
        })
    }))
    render(<App />)
    const input = screen.getByPlaceholderText('Search for a movie')
    fireEvent.change(input, { target: { value: 'Inception' } })
    fireEvent.click(screen.getByText('Search'))
    await waitFor(() => {
        expect(screen.getByText('Inception')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByText('Inception'))
    await waitFor(() => {
        expect(screen.getByText('A thief who steals corporate secrets.')).toBeInTheDocument()
    })
    fireEvent.click(screen.getByText('✕'))
    await waitFor(() => {
        expect(screen.queryByText('A thief who steals corporate secrets.')).not.toBeInTheDocument()
    })  
    })
    it('shows error message when search fails', async () => {  
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('API Error')))
    render(<App />)
    const input = screen.getByPlaceholderText('Search for a movie')
    fireEvent.change(input, { target: { value: 'Inception' } })
    fireEvent.click(screen.getByText('Search'))
    await waitFor(() => {
        expect(screen.getByText('Something went wrong. Please try again.')).toBeInTheDocument()
    })  
    })
    it('shows no results message when search returns empty', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        json: () => Promise.resolve({
            results: [],
            genres: []
        })
    }))
    render(<App />)
    const input = screen.getByPlaceholderText('Search for a movie')
    fireEvent.change(input, { target: { value: 'Unknown Movie' } })
    fireEvent.click(screen.getByText('Search'))
    await waitFor(() => {
        expect(screen.getByText('No results found for Unknown Movie')).toBeInTheDocument()
    })  
    })
    it('shows loading when AI recommendations are being fetched', async () => {
    render(<App />)
    const input = screen.getByPlaceholderText('Enter your prompt here.')
    fireEvent.change(input, { target: { value: 'dark thrillers' } })
    fireEvent.click(screen.getByText('Recommend'))
    await waitFor(() => {
        expect(screen.getByText('Getting recommendations...')).toBeInTheDocument()
    })
    })
    it('shows top rated movies when Ai recommendations are fetched', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
        json: () => Promise.resolve({
            results: [{
                id: 1,
                title: 'Inception',
                poster_path: '/path.jpg',
                overview: 'A thief who steals corporate secrets.',
                vote_average: 8.8,
                genre_ids: [28, 878]
            }],
            genres: []
        })
    }))
    render(<App />)
    await waitFor(() => {
        expect(screen.getByText('Inception')).toBeInTheDocument()
    })

    })

})