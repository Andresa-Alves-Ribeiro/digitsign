import { render, screen } from '@testing-library/react'
import LoadingSpinner from './LoadingSpinner'

describe('LoadingSpinner', () => {
  it('renders loading spinner with default props', () => {
    render(<LoadingSpinner />)
    
    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByText(/carregando/i)).toBeInTheDocument()
  })

  it('renders with custom message', () => {
    const customMessage = 'Aguarde um momento...'
    render(<LoadingSpinner message={customMessage} />)
    
    expect(screen.getByText(customMessage)).toBeInTheDocument()
  })

  it('renders without message when showMessage is false', () => {
    render(<LoadingSpinner showMessage={false} />)
    
    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.queryByText(/carregando/i)).not.toBeInTheDocument()
  })

  it('renders with custom size', () => {
    render(<LoadingSpinner size="lg" />)
    
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('w-12', 'h-12')
  })

  it('renders with custom color', () => {
    render(<LoadingSpinner color="blue" />)
    
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveClass('text-blue-500')
  })

  it('renders with custom className', () => {
    const customClass = 'custom-spinner'
    render(<LoadingSpinner className={customClass} />)
    
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveClass(customClass)
  })

  it('renders with full screen overlay when fullScreen is true', () => {
    render(<LoadingSpinner fullScreen />)
    
    const overlay = screen.getByTestId('loading-overlay')
    expect(overlay).toHaveClass('fixed', 'inset-0', 'bg-black', 'bg-opacity-50')
  })

  it('renders without overlay when fullScreen is false', () => {
    render(<LoadingSpinner fullScreen={false} />)
    
    expect(screen.queryByTestId('loading-overlay')).not.toBeInTheDocument()
  })

  it('renders with custom overlay color', () => {
    render(<LoadingSpinner fullScreen overlayColor="bg-white" />)
    
    const overlay = screen.getByTestId('loading-overlay')
    expect(overlay).toHaveClass('bg-white')
  })

  it('renders with custom overlay opacity', () => {
    render(<LoadingSpinner fullScreen overlayOpacity={75} />)
    
    const overlay = screen.getByTestId('loading-overlay')
    expect(overlay).toHaveClass('bg-opacity-75')
  })

  it('renders with custom z-index', () => {
    render(<LoadingSpinner fullScreen zIndex={100} />)
    
    const overlay = screen.getByTestId('loading-overlay')
    expect(overlay).toHaveClass('z-100')
  })

  it('renders with custom animation duration', () => {
    render(<LoadingSpinner duration={2000} />)
    
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveStyle({
      animationDuration: '2000ms',
    })
  })

  it('renders with custom animation timing function', () => {
    render(<LoadingSpinner timingFunction="ease-in-out" />)
    
    const spinner = screen.getByRole('status')
    expect(spinner).toHaveStyle({
      animationTimingFunction: 'ease-in-out',
    })
  })
}) 