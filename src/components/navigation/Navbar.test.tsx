import { render, screen, fireEvent } from '@testing-library/react'
import Navbar from './Navbar'
import { useSession } from 'next-auth/react'

// Mock do next-auth/react
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
}))

describe('Navbar', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders navigation links when user is authenticated', () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          name: 'Test User',
          email: 'test@example.com',
        },
      },
      status: 'authenticated',
    })

    render(<Navbar />)
    
    expect(screen.getByText(/documentos/i)).toBeInTheDocument()
    expect(screen.getByText(/novo documento/i)).toBeInTheDocument()
    expect(screen.getByText(/perfil/i)).toBeInTheDocument()
    expect(screen.getByText(/sair/i)).toBeInTheDocument()
  })

  it('renders login button when user is not authenticated', () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    })

    render(<Navbar />)
    
    expect(screen.getByText(/entrar/i)).toBeInTheDocument()
    expect(screen.queryByText(/documentos/i)).not.toBeInTheDocument()
  })

  it('renders loading state', () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'loading',
    })

    render(<Navbar />)
    
    expect(screen.getByText(/carregando/i)).toBeInTheDocument()
  })

  it('handles login button click', () => {
    const mockSignIn = jest.fn()
    ;(useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    })
    ;(require('next-auth/react') as any).signIn = mockSignIn

    render(<Navbar />)
    
    const loginButton = screen.getByText(/entrar/i)
    fireEvent.click(loginButton)

    expect(mockSignIn).toHaveBeenCalled()
  })

  it('handles logout button click', () => {
    const mockSignOut = jest.fn()
    ;(useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          name: 'Test User',
          email: 'test@example.com',
        },
      },
      status: 'authenticated',
    })
    ;(require('next-auth/react') as any).signOut = mockSignOut

    render(<Navbar />)
    
    const logoutButton = screen.getByText(/sair/i)
    fireEvent.click(logoutButton)

    expect(mockSignOut).toHaveBeenCalled()
  })

  it('shows user menu when profile button is clicked', () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          name: 'Test User',
          email: 'test@example.com',
        },
      },
      status: 'authenticated',
    })

    render(<Navbar />)
    
    const profileButton = screen.getByText(/perfil/i)
    fireEvent.click(profileButton)

    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
  })

  it('closes user menu when clicking outside', () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          name: 'Test User',
          email: 'test@example.com',
        },
      },
      status: 'authenticated',
    })

    render(<Navbar />)
    
    const profileButton = screen.getByText(/perfil/i)
    fireEvent.click(profileButton)

    expect(screen.getByText('Test User')).toBeInTheDocument()

    fireEvent.click(document.body)

    expect(screen.queryByText('Test User')).not.toBeInTheDocument()
  })

  it('handles mobile menu toggle', () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          name: 'Test User',
          email: 'test@example.com',
        },
      },
      status: 'authenticated',
    })

    render(<Navbar />)
    
    const menuButton = screen.getByRole('button', { name: /menu/i })
    fireEvent.click(menuButton)

    expect(screen.getByText(/documentos/i)).toBeInTheDocument()
    expect(screen.getByText(/novo documento/i)).toBeInTheDocument()
    expect(screen.getByText(/perfil/i)).toBeInTheDocument()
    expect(screen.getByText(/sair/i)).toBeInTheDocument()
  })

  it('closes mobile menu when clicking outside', () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          name: 'Test User',
          email: 'test@example.com',
        },
      },
      status: 'authenticated',
    })

    render(<Navbar />)
    
    const menuButton = screen.getByRole('button', { name: /menu/i })
    fireEvent.click(menuButton)

    expect(screen.getByText(/documentos/i)).toBeInTheDocument()

    fireEvent.click(document.body)

    expect(screen.queryByText(/documentos/i)).not.toBeInTheDocument()
  })
}) 