import { render, screen } from '@testing-library/react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import AuthGuard from '../AuthGuard'

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn()
}))

// Mock next-auth/react
jest.mock('next-auth/react', () => ({
  useSession: jest.fn()
}))

describe('AuthGuard Component', () => {
  const mockRouter = {
    push: jest.fn()
  }

  const mockChildren = <div data-testid="test-children">Protected Content</div>

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
  })

  it('shows loading state when status is loading', () => {
    ;(useSession as jest.Mock).mockReturnValue({ status: 'loading' })

    render(<AuthGuard>{mockChildren}</AuthGuard>)
    
    expect(screen.getByText('Carregando...')).toBeInTheDocument()
    expect(screen.queryByTestId('test-children')).not.toBeInTheDocument()
  })

  it('shows children when status is unauthenticated', () => {
    ;(useSession as jest.Mock).mockReturnValue({ status: 'unauthenticated' })

    render(<AuthGuard>{mockChildren}</AuthGuard>)
    
    expect(screen.getByTestId('test-children')).toBeInTheDocument()
    expect(screen.queryByText('Carregando...')).not.toBeInTheDocument()
  })

  it('redirects to home when status is authenticated', () => {
    ;(useSession as jest.Mock).mockReturnValue({ status: 'authenticated' })

    render(<AuthGuard>{mockChildren}</AuthGuard>)
    
    expect(mockRouter.push).toHaveBeenCalledWith('/')
    expect(screen.queryByTestId('test-children')).not.toBeInTheDocument()
  })

  it('returns null when status is not one of the expected states', () => {
    ;(useSession as jest.Mock).mockReturnValue({ status: 'unknown' })

    const { container } = render(<AuthGuard>{mockChildren}</AuthGuard>)
    
    expect(container).toBeEmptyDOMElement()
  })
}) 