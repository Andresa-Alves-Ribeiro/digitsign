import { render, screen, fireEvent, act } from '@testing-library/react'
import Notification from './Notification'

describe('Notification', () => {
  const defaultProps = {
    message: 'Operação realizada com sucesso!',
    type: 'success' as const,
    onClose: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders notification with default props', () => {
    render(<Notification {...defaultProps} />)
    
    expect(screen.getByText(defaultProps.message)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /fechar/i })).toBeInTheDocument()
  })

  it('renders with success type', () => {
    render(<Notification {...defaultProps} type="success" />)
    
    const notification = screen.getByRole('alert')
    expect(notification).toHaveClass('bg-green-500')
  })

  it('renders with error type', () => {
    render(<Notification {...defaultProps} type="error" message="Erro ao realizar operação" />)
    
    const notification = screen.getByRole('alert')
    expect(notification).toHaveClass('bg-red-500')
  })

  it('renders with warning type', () => {
    render(<Notification {...defaultProps} type="warning" message="Atenção!" />)
    
    const notification = screen.getByRole('alert')
    expect(notification).toHaveClass('bg-yellow-500')
  })

  it('renders with info type', () => {
    render(<Notification {...defaultProps} type="info" message="Informação importante" />)
    
    const notification = screen.getByRole('alert')
    expect(notification).toHaveClass('bg-blue-500')
  })

  it('calls onClose when close button is clicked', () => {
    render(<Notification {...defaultProps} />)
    
    fireEvent.click(screen.getByRole('button', { name: /fechar/i }))
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
  })

  it('auto-closes after specified duration', () => {
    render(<Notification {...defaultProps} duration={3000} />)
    
    act(() => {
      jest.advanceTimersByTime(3000)
    })
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
  })

  it('does not auto-close when duration is 0', () => {
    render(<Notification {...defaultProps} duration={0} />)
    
    act(() => {
      jest.advanceTimersByTime(5000)
    })
    
    expect(defaultProps.onClose).not.toHaveBeenCalled()
  })

  it('renders with custom position', () => {
    render(<Notification {...defaultProps} position="top-right" />)
    
    const container = screen.getByTestId('notification-container')
    expect(container).toHaveClass('top-4', 'right-4')
  })

  it('renders with custom animation duration', () => {
    render(<Notification {...defaultProps} animationDuration={2000} />)
    
    const notification = screen.getByRole('alert')
    expect(notification).toHaveStyle({
      animationDuration: '2000ms',
    })
  })

  it('renders with custom animation timing function', () => {
    render(<Notification {...defaultProps} timingFunction="ease-in-out" />)
    
    const notification = screen.getByRole('alert')
    expect(notification).toHaveStyle({
      animationTimingFunction: 'ease-in-out',
    })
  })

  it('renders with custom icon', () => {
    const customIcon = '✅'
    render(<Notification {...defaultProps} icon={customIcon} />)
    
    expect(screen.getByText(customIcon)).toBeInTheDocument()
  })

  it('renders with custom icon color', () => {
    render(<Notification {...defaultProps} iconColor="white" />)
    
    const icon = screen.getByTestId('notification-icon')
    expect(icon).toHaveClass('text-white')
  })

  it('renders with custom icon size', () => {
    render(<Notification {...defaultProps} iconSize="lg" />)
    
    const icon = screen.getByTestId('notification-icon')
    expect(icon).toHaveClass('w-6', 'h-6')
  })

  it('renders with custom close button text', () => {
    const closeText = 'X'
    render(<Notification {...defaultProps} closeText={closeText} />)
    
    expect(screen.getByRole('button', { name: closeText })).toBeInTheDocument()
  })

  it('renders with custom close button color', () => {
    render(<Notification {...defaultProps} closeColor="white" />)
    
    const closeButton = screen.getByRole('button', { name: /fechar/i })
    expect(closeButton).toHaveClass('text-white')
  })

  it('renders with custom close button size', () => {
    render(<Notification {...defaultProps} closeSize="lg" />)
    
    const closeButton = screen.getByRole('button', { name: /fechar/i })
    expect(closeButton).toHaveClass('w-6', 'h-6')
  })

  it('renders with custom className', () => {
    const customClass = 'custom-notification'
    render(<Notification {...defaultProps} className={customClass} />)
    
    const notification = screen.getByRole('alert')
    expect(notification).toHaveClass(customClass)
  })

  it('renders with custom z-index', () => {
    render(<Notification {...defaultProps} zIndex={100} />)
    
    const container = screen.getByTestId('notification-container')
    expect(container).toHaveClass('z-100')
  })
}) 