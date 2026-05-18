import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import SkeletonBody from '../../src/SkeletonCard'

describe('SkeletonBody', () => {
    it('renders without crashing', () => {
        const { container } = render(<SkeletonBody />)
        expect(container.firstChild).toBeInTheDocument()
    })

    it('has card-container class', () => {
        const { container } = render(<SkeletonBody />)
        expect(container.firstChild).toHaveClass('card-container')
    })

    it('renders the skeleton poster', () => {
        const { container } = render(<SkeletonBody />)
        expect(container.querySelector('.skeleton-poster')).toBeInTheDocument()
    })

    it('renders skeleton title element', () => {
        const { container } = render(<SkeletonBody />)
        expect(container.querySelector('.skeleton-title')).toBeInTheDocument()
    })

    it('renders skeleton rating element', () => {
        const { container } = render(<SkeletonBody />)
        expect(container.querySelector('.skeleton-rating')).toBeInTheDocument()
    })
})