import { render, screen } from '@testing-library/react'
import MainLayout from './MainLayout'
import { useSession } from 'next-auth/react'

// Mock do next-auth/react
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}))

describe('MainLayout', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders layout with children when user is authenticated', () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          name: 'Test User',
          email: 'test@example.com',
        },
      },
      status: 'authenticated',
    })

    render(
      <MainLayout>
        <div>Test Content</div>
      </MainLayout>
    )
    
    expect(screen.getByText(/documentos/i)).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('redirects to login when user is not authenticated', () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    })

    render(
      <MainLayout>
        <div>Test Content</div>
      </MainLayout>
    )
    
    expect(screen.getByText(/entrar/i)).toBeInTheDocument()
    expect(screen.queryByText('Test Content')).not.toBeInTheDocument()
  })

  it('shows loading state while checking authentication', () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'loading',
    })

    render(
      <MainLayout>
        <div>Test Content</div>
      </MainLayout>
    )
    
    expect(screen.getByText(/carregando/i)).toBeInTheDocument()
    expect(screen.queryByText('Test Content')).not.toBeInTheDocument()
  })

  it('renders navigation links correctly', () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          name: 'Test User',
          email: 'test@example.com',
        },
      },
      status: 'authenticated',
    })

    render(
      <MainLayout>
        <div>Test Content</div>
      </MainLayout>
    )
    
    expect(screen.getByText(/documentos/i)).toBeInTheDocument()
    expect(screen.getByText(/novo documento/i)).toBeInTheDocument()
    expect(screen.getByText(/perfil/i)).toBeInTheDocument()
    expect(screen.getByText(/sair/i)).toBeInTheDocument()
  })

  it('renders user information in header', () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          name: 'Test User',
          email: 'test@example.com',
        },
      },
      status: 'authenticated',
    })

    render(
      <MainLayout>
        <div>Test Content</div>
      </MainLayout>
    )
    
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
  })

  it('renders footer with copyright information', () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          name: 'Test User',
          email: 'test@example.com',
        },
      },
      status: 'authenticated',
    })

    render(
      <MainLayout>
        <div>Test Content</div>
      </MainLayout>
    )
    
    expect(screen.getByText(/© 2024 SuperSign/i)).toBeInTheDocument()
  })

  it('renders error boundary when children throw error', () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          name: 'Test User',
          email: 'test@example.com',
        },
      },
      status: 'authenticated',
    })

    const ErrorComponent = () => {
      throw new Error('Test error')
    }

    render(
      <MainLayout>
        <ErrorComponent />
      </MainLayout>
    )
    
    expect(screen.getByText(/algo deu errado/i)).toBeInTheDocument()
  })

  it('renders with custom theme', () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          name: 'Test User',
          email: 'test@example.com',
        },
      },
      status: 'authenticated',
    })

    render(
      <MainLayout>
        <div>Test Content</div>
      </MainLayout>
    )
    
    const container = screen.getByTestId('main-layout')
    expect(container).toHaveStyle({
      backgroundColor: '#f3f4f6',
      minHeight: '100vh',
    })
  })
}) 