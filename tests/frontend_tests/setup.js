import '@testing-library/jest-dom'
import { beforeEach, vi } from 'vitest'

window.HTMLElement.prototype.scrollIntoView = vi.fn()

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    json: () => Promise.resolve({ genres: [], results: [] })
  }))
})