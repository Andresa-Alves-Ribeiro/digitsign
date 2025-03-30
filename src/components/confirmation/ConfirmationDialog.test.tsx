import { render, screen, fireEvent } from '@testing-library/react'
import ConfirmationDialog from './ConfirmationDialog'

describe('ConfirmationDialog', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
    title: 'Confirmar ação',
    message: 'Tem certeza que deseja realizar esta ação?',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders dialog when isOpen is true', () => {
    render(<ConfirmationDialog {...defaultProps} />)
    
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument()
    expect(screen.getByText(defaultProps.message)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /confirmar/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument()
  })

  it('does not render when isOpen is false', () => {
    render(<ConfirmationDialog {...defaultProps} isOpen={false} />)
    
    expect(screen.queryByText(defaultProps.title)).not.toBeInTheDocument()
    expect(screen.queryByText(defaultProps.message)).not.toBeInTheDocument()
  })

  it('calls onConfirm when confirm button is clicked', () => {
    render(<ConfirmationDialog {...defaultProps} />)
    
    fireEvent.click(screen.getByRole('button', { name: /confirmar/i }))
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when cancel button is clicked', () => {
    render(<ConfirmationDialog {...defaultProps} />)
    
    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }))
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when clicking outside the dialog', () => {
    render(<ConfirmationDialog {...defaultProps} />)
    
    const overlay = screen.getByTestId('confirmation-overlay')
    fireEvent.click(overlay)
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
  })

  it('renders with custom confirm button text', () => {
    const confirmText = 'Excluir'
    render(<ConfirmationDialog {...defaultProps} confirmText={confirmText} />)
    
    expect(screen.getByRole('button', { name: confirmText })).toBeInTheDocument()
  })

  it('renders with custom cancel button text', () => {
    const cancelText = 'Voltar'
    render(<ConfirmationDialog {...defaultProps} cancelText={cancelText} />)
    
    expect(screen.getByRole('button', { name: cancelText })).toBeInTheDocument()
  })

  it('renders with custom button colors', () => {
    render(
      <ConfirmationDialog
        {...defaultProps}
        confirmColor="red"
        cancelColor="gray"
      />
    )
    
    const confirmButton = screen.getByRole('button', { name: /confirmar/i })
    const cancelButton = screen.getByRole('button', { name: /cancelar/i })
    
    expect(confirmButton).toHaveClass('bg-red-500', 'hover:bg-red-600')
    expect(cancelButton).toHaveClass('bg-gray-500', 'hover:bg-gray-600')
  })

  it('renders with custom dialog size', () => {
    render(<ConfirmationDialog {...defaultProps} size="lg" />)
    
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveClass('max-w-lg')
  })

  it('renders with custom overlay color', () => {
    render(<ConfirmationDialog {...defaultProps} overlayColor="bg-white" />)
    
    const overlay = screen.getByTestId('confirmation-overlay')
    expect(overlay).toHaveClass('bg-white')
  })

  it('renders with custom overlay opacity', () => {
    render(<ConfirmationDialog {...defaultProps} overlayOpacity={75} />)
    
    const overlay = screen.getByTestId('confirmation-overlay')
    expect(overlay).toHaveClass('bg-opacity-75')
  })

  it('renders with custom z-index', () => {
    render(<ConfirmationDialog {...defaultProps} zIndex={100} />)
    
    const overlay = screen.getByTestId('confirmation-overlay')
    expect(overlay).toHaveClass('z-100')
  })

  it('renders with custom animation duration', () => {
    render(<ConfirmationDialog {...defaultProps} duration={2000} />)
    
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveStyle({
      animationDuration: '2000ms',
    })
  })

  it('renders with custom animation timing function', () => {
    render(<ConfirmationDialog {...defaultProps} timingFunction="ease-in-out" />)
    
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveStyle({
      animationTimingFunction: 'ease-in-out',
    })
  })

  it('renders with custom icon', () => {
    const customIcon = '⚠️'
    render(<ConfirmationDialog {...defaultProps} icon={customIcon} />)
    
    expect(screen.getByText(customIcon)).toBeInTheDocument()
  })

  it('renders with custom icon color', () => {
    render(<ConfirmationDialog {...defaultProps} iconColor="red" />)
    
    const icon = screen.getByTestId('confirmation-icon')
    expect(icon).toHaveClass('text-red-500')
  })

  it('renders with custom icon size', () => {
    render(<ConfirmationDialog {...defaultProps} iconSize="lg" />)
    
    const icon = screen.getByTestId('confirmation-icon')
    expect(icon).toHaveClass('w-12', 'h-12')
  })
}) 