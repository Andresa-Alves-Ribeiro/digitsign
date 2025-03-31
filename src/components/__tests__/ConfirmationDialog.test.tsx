import { render, screen, fireEvent } from '@testing-library/react'
import ConfirmationDialog from '../ConfirmationDialog'

describe('ConfirmationDialog Component', () => {
  const mockOnClose = jest.fn()
  const mockOnConfirm = jest.fn()
  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onConfirm: mockOnConfirm,
    title: 'Test Title',
    message: 'Test Message'
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders when isOpen is true', () => {
    render(<ConfirmationDialog {...defaultProps} />)
    
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test Message')).toBeInTheDocument()
    expect(screen.getByText('Confirmar')).toBeInTheDocument()
    expect(screen.getByText('Cancelar')).toBeInTheDocument()
  })

  it('does not render when isOpen is false', () => {
    render(<ConfirmationDialog {...defaultProps} isOpen={false} />)
    
    expect(screen.queryByText('Test Title')).not.toBeInTheDocument()
    expect(screen.queryByText('Test Message')).not.toBeInTheDocument()
  })

  it('calls onClose when cancel button is clicked', () => {
    render(<ConfirmationDialog {...defaultProps} />)
    
    fireEvent.click(screen.getByText('Cancelar'))
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('calls onConfirm when confirm button is clicked', () => {
    render(<ConfirmationDialog {...defaultProps} />)
    
    fireEvent.click(screen.getByText('Confirmar'))
    expect(mockOnConfirm).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when close button is clicked', () => {
    render(<ConfirmationDialog {...defaultProps} />)
    
    const closeButton = screen.getByRole('button', { name: /close/i })
    fireEvent.click(closeButton)
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('renders with custom button text', () => {
    render(
      <ConfirmationDialog
        {...defaultProps}
        confirmText="Delete"
        cancelText="No, thanks"
      />
    )
    
    expect(screen.getByText('Delete')).toBeInTheDocument()
    expect(screen.getByText('No, thanks')).toBeInTheDocument()
  })
}) 