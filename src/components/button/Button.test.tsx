import { render, screen, fireEvent } from '@testing-library/react'
import Button from './Button'

describe('Button', () => {
  const defaultProps = {
    children: 'Click me',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders button with text', () => {
    render(<Button {...defaultProps} />)
    expect(screen.getByTestId('button')).toHaveTextContent('Click me')
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button {...defaultProps} onClick={handleClick} />)
    
    fireEvent.click(screen.getByTestId('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('renders with primary variant', () => {
    render(<Button {...defaultProps} variant="primary" />)
    expect(screen.getByTestId('button')).toHaveClass('bg-primary-600', 'hover:bg-primary-700')
  })

  it('renders with secondary variant', () => {
    render(<Button {...defaultProps} variant="secondary" />)
    expect(screen.getByTestId('button')).toHaveClass('bg-gray-600', 'hover:bg-gray-700')
  })

  it('renders with outline variant', () => {
    render(<Button {...defaultProps} variant="outline" />)
    expect(screen.getByTestId('button')).toHaveClass('border-2', 'border-primary-600')
  })

  it('renders with ghost variant', () => {
    render(<Button {...defaultProps} variant="ghost" />)
    expect(screen.getByTestId('button')).toHaveClass('hover:bg-primary-100', 'text-primary-600')
  })

  it('renders with link variant', () => {
    render(<Button {...defaultProps} variant="link" />)
    expect(screen.getByTestId('button')).toHaveClass('text-primary-600', 'hover:underline')
  })

  it('renders with small size', () => {
    render(<Button {...defaultProps} size="sm" />)
    expect(screen.getByTestId('button')).toHaveClass('px-3', 'py-1.5', 'text-sm')
  })

  it('renders with medium size', () => {
    render(<Button {...defaultProps} size="md" />)
    expect(screen.getByTestId('button')).toHaveClass('px-4', 'py-2', 'text-base')
  })

  it('renders with large size', () => {
    render(<Button {...defaultProps} size="lg" />)
    expect(screen.getByTestId('button')).toHaveClass('px-6', 'py-3', 'text-lg')
  })

  it('renders in disabled state', () => {
    render(<Button {...defaultProps} disabled />)
    expect(screen.getByTestId('button')).toBeDisabled()
    expect(screen.getByTestId('button')).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed')
  })

  it('renders in loading state', () => {
    render(<Button {...defaultProps} isLoading />)
    expect(screen.getByTestId('button')).toBeDisabled()
    expect(screen.getByText('Carregando...')).toBeInTheDocument()
  })

  it('renders with custom className', () => {
    render(<Button {...defaultProps} className="custom-class" />)
    expect(screen.getByTestId('button')).toHaveClass('custom-class')
  })

  it('renders with full width', () => {
    render(<Button {...defaultProps} fullWidth />)
    expect(screen.getByTestId('button')).toHaveClass('w-full')
  })

  it('applies variant styles correctly', () => {
    const { rerender } = render(<Button {...defaultProps} variant="primary" />)
    expect(screen.getByTestId('button')).toHaveClass('bg-primary-600')

    rerender(<Button {...defaultProps} variant="secondary" />)
    expect(screen.getByTestId('button')).toHaveClass('bg-gray-600')

    rerender(<Button {...defaultProps} variant="outline" />)
    expect(screen.getByTestId('button')).toHaveClass('border-gray-300')

    rerender(<Button {...defaultProps} variant="ghost" />)
    expect(screen.getByTestId('button')).toHaveClass('text-gray-700')

    rerender(<Button {...defaultProps} variant="link" />)
    expect(screen.getByTestId('button')).toHaveClass('text-primary-600')
  })

  it('applies size styles correctly', () => {
    const { rerender } = render(<Button {...defaultProps} size="sm" />)
    expect(screen.getByTestId('button')).toHaveClass('px-3 py-1.5 text-sm')

    rerender(<Button {...defaultProps} size="md" />)
    expect(screen.getByTestId('button')).toHaveClass('px-4 py-2 text-base')

    rerender(<Button {...defaultProps} size="lg" />)
    expect(screen.getByTestId('button')).toHaveClass('px-6 py-3 text-lg')
  })

  it('renders with success variant', () => {
    render(<Button {...defaultProps} variant="success" />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-green-500', 'hover:bg-green-600', 'text-white')
  })

  it('renders with danger variant', () => {
    render(<Button {...defaultProps} variant="danger" />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-red-500', 'hover:bg-red-600', 'text-white')
  })

  it('renders with warning variant', () => {
    render(<Button {...defaultProps} variant="warning" />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-yellow-500', 'hover:bg-yellow-600', 'text-white')
  })

  it('renders with info variant', () => {
    render(<Button {...defaultProps} variant="info" />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-blue-500', 'hover:bg-blue-600', 'text-white')
  })

  it('renders with custom width', () => {
    render(<Button {...defaultProps} width="200px" />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveStyle({ width: '200px' })
  })

  it('renders with custom height', () => {
    render(<Button {...defaultProps} height="50px" />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveStyle({ height: '50px' })
  })

  it('renders with custom padding', () => {
    render(<Button {...defaultProps} padding="1rem 2rem" />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveStyle({ padding: '1rem 2rem' })
  })

  it('renders with custom margin', () => {
    render(<Button {...defaultProps} margin="1rem" />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveStyle({ margin: '1rem' })
  })

  it('renders with custom border radius', () => {
    render(<Button {...defaultProps} borderRadius="1rem" />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveStyle({ borderRadius: '1rem' })
  })

  it('renders with custom font weight', () => {
    render(<Button {...defaultProps} fontWeight="bold" />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveStyle({ fontWeight: 'bold' })
  })

  it('renders with custom font size', () => {
    render(<Button {...defaultProps} fontSize="1.5rem" />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveStyle({ fontSize: '1.5rem' })
  })

  it('renders with custom text color', () => {
    render(<Button {...defaultProps} textColor="red" />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveStyle({ color: 'red' })
  })

  it('renders with custom background color', () => {
    render(<Button {...defaultProps} backgroundColor="purple" />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveStyle({ backgroundColor: 'purple' })
  })

  it('renders with custom border color', () => {
    render(<Button {...defaultProps} borderColor="orange" />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveStyle({ borderColor: 'orange' })
  })

  it('renders with custom border width', () => {
    render(<Button {...defaultProps} borderWidth="2px" />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveStyle({ borderWidth: '2px' })
  })

  it('renders with custom border style', () => {
    render(<Button {...defaultProps} borderStyle="dashed" />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveStyle({ borderStyle: 'dashed' })
  })

  it('renders with custom box shadow', () => {
    render(<Button {...defaultProps} boxShadow="0 2px 4px rgba(0,0,0,0.2)" />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveStyle({ boxShadow: '0 2px 4px rgba(0,0,0,0.2)' })
  })

  it('renders with custom transition duration', () => {
    render(<Button {...defaultProps} transitionDuration="0.5s" />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveStyle({ transitionDuration: '0.5s' })
  })

  it('renders with custom transition timing function', () => {
    render(<Button {...defaultProps} transitionTimingFunction="ease-in-out" />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveStyle({ transitionTimingFunction: 'ease-in-out' })
  })

  it('renders with custom hover styles', () => {
    render(<Button {...defaultProps} hoverStyles={{ backgroundColor: 'red' }} />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('hover:bg-red-500')
  })

  it('renders with custom focus styles', () => {
    render(<Button {...defaultProps} focusStyles={{ outline: '2px solid blue' }} />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('focus:outline-blue-500')
  })

  it('renders with custom active styles', () => {
    render(<Button {...defaultProps} activeStyles={{ transform: 'scale(0.95)' }} />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('active:scale-95')
  })

  it('renders with custom disabled styles', () => {
    render(<Button {...defaultProps} disabledStyles={{ opacity: 0.5 }} />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('disabled:opacity-50')
  })

  it('renders with custom type', () => {
    render(<Button {...defaultProps} type="submit" />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('type', 'submit')
  })

  it('renders with custom name', () => {
    render(<Button {...defaultProps} name="submit-button" />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('name', 'submit-button')
  })

  it('renders with custom value', () => {
    render(<Button {...defaultProps} value="submit" />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('value', 'submit')
  })

  it('renders with custom form', () => {
    render(<Button {...defaultProps} form="my-form" />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('form', 'my-form')
  })

  it('renders with custom autoFocus', () => {
    render(<Button {...defaultProps} autoFocus />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('autofocus')
  })

  it('renders with custom required', () => {
    render(<Button {...defaultProps} required />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('required')
  })

  it('renders with custom readOnly', () => {
    render(<Button {...defaultProps} readOnly />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('readonly')
  })

  it('renders with custom tabIndex', () => {
    render(<Button {...defaultProps} tabIndex={0} />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('tabindex', '0')
  })

  it('renders with custom aria-label', () => {
    render(<Button {...defaultProps} ariaLabel="Submit form" />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Submit form')
  })

  it('renders with custom aria-labelledby', () => {
    render(<Button {...defaultProps} ariaLabelledBy="label-id" />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-labelledby', 'label-id')
  })

  it('renders with custom aria-describedby', () => {
    render(<Button {...defaultProps} ariaDescribedBy="description-id" />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-describedby', 'description-id')
  })

  it('renders with custom aria-pressed', () => {
    render(<Button {...defaultProps} ariaPressed="true" />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-pressed', 'true')
  })

  it('renders with custom aria-expanded', () => {
    render(<Button {...defaultProps} ariaExpanded="true" />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-expanded', 'true')
  })

  it('renders with custom aria-haspopup', () => {
    render(<Button {...defaultProps} ariaHasPopup="true" />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-haspopup', 'true')
  })

  it('renders with custom aria-controls', () => {
    render(<Button {...defaultProps} ariaControls="menu-id" />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-controls', 'menu-id')
  })

  it('renders with custom data-testid', () => {
    render(<Button {...defaultProps} dataTestId="submit-button" />)
    
    const button = screen.getByTestId('submit-button')
    expect(button).toBeInTheDocument()
  })

  it('applies aria attributes correctly', () => {
    render(
      <Button
        {...defaultProps}
        aria-label="Submit form"
        aria-describedby="description-id"
        aria-pressed="true"
        aria-expanded="true"
        aria-haspopup="true"
        aria-controls="menu-id"
      />
    );
    const button = screen.getByTestId('button');
    expect(button).toHaveAttribute('aria-label', 'Submit form');
    expect(button).toHaveAttribute('aria-describedby', 'description-id');
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(button).toHaveAttribute('aria-haspopup', 'true');
    expect(button).toHaveAttribute('aria-controls', 'menu-id');
  });

  it('applies data-testid attribute correctly', () => {
    render(<Button {...defaultProps} data-testid="submit-button" />);
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });
}) 