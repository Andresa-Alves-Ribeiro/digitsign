import { render, screen, fireEvent } from '@testing-library/react'
import Input from './Input'

describe('Input', () => {
  const defaultProps = {
    label: 'Nome',
    name: 'name',
    value: '',
    onChange: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders input with default props', () => {
    render(<Input {...defaultProps} />)
    
    expect(screen.getByLabelText(defaultProps.label)).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveAttribute('name', defaultProps.name)
  })

  it('calls onChange when value changes', () => {
    render(<Input {...defaultProps} />)
    
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'John Doe' },
    })
    
    expect(defaultProps.onChange).toHaveBeenCalledTimes(1)
  })

  it('renders with placeholder', () => {
    const placeholder = 'Digite seu nome'
    render(<Input {...defaultProps} placeholder={placeholder} />)
    
    expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument()
  })

  it('renders with type', () => {
    render(<Input {...defaultProps} type="email" />)
    
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email')
  })

  it('renders with required', () => {
    render(<Input {...defaultProps} required />)
    
    expect(screen.getByRole('textbox')).toBeRequired()
  })

  it('renders with disabled', () => {
    render(<Input {...defaultProps} disabled />)
    
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('renders with readOnly', () => {
    render(<Input {...defaultProps} readOnly />)
    
    expect(screen.getByRole('textbox')).toHaveAttribute('readonly')
  })

  it('renders with autoFocus', () => {
    render(<Input {...defaultProps} autoFocus />)
    
    expect(screen.getByRole('textbox')).toHaveAttribute('autofocus')
  })

  it('renders with maxLength', () => {
    render(<Input {...defaultProps} maxLength={10} />)
    
    expect(screen.getByRole('textbox')).toHaveAttribute('maxlength', '10')
  })

  it('renders with minLength', () => {
    render(<Input {...defaultProps} minLength={3} />)
    
    expect(screen.getByRole('textbox')).toHaveAttribute('minlength', '3')
  })

  it('renders with pattern', () => {
    render(<Input {...defaultProps} pattern="[A-Za-z]+" />)
    
    expect(screen.getByRole('textbox')).toHaveAttribute('pattern', '[A-Za-z]+')
  })

  it('renders with step', () => {
    render(<Input {...defaultProps} type="number" step="0.1" />)
    
    expect(screen.getByRole('spinbutton')).toHaveAttribute('step', '0.1')
  })

  it('renders with min', () => {
    render(<Input {...defaultProps} type="number" min={0} />)
    
    expect(screen.getByRole('spinbutton')).toHaveAttribute('min', '0')
  })

  it('renders with max', () => {
    render(<Input {...defaultProps} type="number" max={100} />)
    
    expect(screen.getByRole('spinbutton')).toHaveAttribute('max', '100')
  })

  it('renders with multiple', () => {
    render(<Input {...defaultProps} type="file" multiple />)
    
    expect(screen.getByRole('button')).toHaveAttribute('multiple')
  })

  it('renders with accept', () => {
    render(<Input {...defaultProps} type="file" accept="image/*" />)
    
    expect(screen.getByRole('button')).toHaveAttribute('accept', 'image/*')
  })

  it('renders with capture', () => {
    render(<Input {...defaultProps} type="file" capture="user" />)
    
    expect(screen.getByRole('button')).toHaveAttribute('capture', 'user')
  })

  it('renders with list', () => {
    render(<Input {...defaultProps} list="suggestions" />)
    
    expect(screen.getByRole('textbox')).toHaveAttribute('list', 'suggestions')
  })

  it('renders with autoComplete', () => {
    render(<Input {...defaultProps} autoComplete="name" />)
    
    expect(screen.getByRole('textbox')).toHaveAttribute('autocomplete', 'name')
  })

  it('renders with autoCorrect', () => {
    render(<Input {...defaultProps} autoCorrect="on" />)
    
    expect(screen.getByRole('textbox')).toHaveAttribute('autocorrect', 'on')
  })

  it('renders with autoCapitalize', () => {
    render(<Input {...defaultProps} autoCapitalize="words" />)
    
    expect(screen.getByRole('textbox')).toHaveAttribute('autocapitalize', 'words')
  })

  it('renders with spellCheck', () => {
    render(<Input {...defaultProps} spellCheck />)
    
    expect(screen.getByRole('textbox')).toHaveAttribute('spellcheck', 'true')
  })

  it('renders with tabIndex', () => {
    render(<Input {...defaultProps} tabIndex={0} />)
    
    expect(screen.getByRole('textbox')).toHaveAttribute('tabindex', '0')
  })

  it('renders with id', () => {
    render(<Input {...defaultProps} id="name-input" />)
    
    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'name-input')
  })

  it('renders with name', () => {
    render(<Input {...defaultProps} name="full-name" />)
    
    expect(screen.getByRole('textbox')).toHaveAttribute('name', 'full-name')
  })

  it('renders with value', () => {
    render(<Input {...defaultProps} value="John Doe" />)
    
    expect(screen.getByRole('textbox')).toHaveValue('John Doe')
  })

  it('renders with defaultValue', () => {
    render(<Input {...defaultProps} defaultValue="John Doe" />)
    
    expect(screen.getByRole('textbox')).toHaveValue('John Doe')
  })

  it('renders with error message', () => {
    const error = 'Nome é obrigatório'
    render(<Input {...defaultProps} error={error} />)
    
    expect(screen.getByText(error)).toBeInTheDocument()
  })

  it('renders with helper text', () => {
    const helperText = 'Digite seu nome completo'
    render(<Input {...defaultProps} helperText={helperText} />)
    
    expect(screen.getByText(helperText)).toBeInTheDocument()
  })

  it('renders with icon', () => {
    const icon = '👤'
    render(<Input {...defaultProps} icon={icon} />)
    
    expect(screen.getByText(icon)).toBeInTheDocument()
  })

  it('renders with icon position', () => {
    render(<Input {...defaultProps} icon="👤" iconPosition="right" />)
    
    const icon = screen.getByText('👤')
    expect(icon.parentElement).toHaveClass('right-0')
  })

  it('renders with icon color', () => {
    render(<Input {...defaultProps} icon="👤" iconColor="red" />)
    
    const icon = screen.getByText('👤')
    expect(icon).toHaveClass('text-red-500')
  })

  it('renders with icon size', () => {
    render(<Input {...defaultProps} icon="👤" iconSize="lg" />)
    
    const icon = screen.getByText('👤')
    expect(icon).toHaveClass('w-6', 'h-6')
  })

  it('renders with label position', () => {
    render(<Input {...defaultProps} labelPosition="top" />)
    
    const label = screen.getByText(defaultProps.label)
    expect(label.parentElement).toHaveClass('flex-col')
  })

  it('renders with label color', () => {
    render(<Input {...defaultProps} labelColor="red" />)
    
    const label = screen.getByText(defaultProps.label)
    expect(label).toHaveClass('text-red-500')
  })

  it('renders with label size', () => {
    render(<Input {...defaultProps} labelSize="lg" />)
    
    const label = screen.getByText(defaultProps.label)
    expect(label).toHaveClass('text-lg')
  })

  it('renders with input color', () => {
    render(<Input {...defaultProps} inputColor="red" />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('text-red-500')
  })

  it('renders with input size', () => {
    render(<Input {...defaultProps} inputSize="lg" />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('text-lg')
  })

  it('renders with input background color', () => {
    render(<Input {...defaultProps} inputBackgroundColor="gray" />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('bg-gray-100')
  })

  it('renders with input border color', () => {
    render(<Input {...defaultProps} inputBorderColor="red" />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('border-red-500')
  })

  it('renders with input border width', () => {
    render(<Input {...defaultProps} inputBorderWidth="2" />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('border-2')
  })

  it('renders with input border radius', () => {
    render(<Input {...defaultProps} inputBorderRadius="lg" />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('rounded-lg')
  })

  it('renders with input padding', () => {
    render(<Input {...defaultProps} inputPadding="lg" />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('px-4', 'py-2')
  })

  it('renders with input margin', () => {
    render(<Input {...defaultProps} inputMargin="lg" />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('mt-2')
  })

  it('renders with input focus styles', () => {
    render(<Input {...defaultProps} inputFocusStyles={{ outline: '2px solid blue' }} />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('focus:outline-blue-500')
  })

  it('renders with input hover styles', () => {
    render(<Input {...defaultProps} inputHoverStyles={{ borderColor: 'red' }} />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('hover:border-red-500')
  })

  it('renders with input active styles', () => {
    render(<Input {...defaultProps} inputActiveStyles={{ transform: 'scale(1.02)' }} />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('active:scale-102')
  })

  it('renders with input disabled styles', () => {
    render(<Input {...defaultProps} inputDisabledStyles={{ opacity: 0.5 }} />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('disabled:opacity-50')
  })

  it('renders with custom className', () => {
    const customClass = 'custom-input'
    render(<Input {...defaultProps} className={customClass} />)
    
    const container = screen.getByTestId('input-container')
    expect(container).toHaveClass(customClass)
  })

  it('renders with custom input className', () => {
    const customClass = 'custom-input-field'
    render(<Input {...defaultProps} inputClassName={customClass} />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass(customClass)
  })

  it('renders with custom label className', () => {
    const customClass = 'custom-label'
    render(<Input {...defaultProps} labelClassName={customClass} />)
    
    const label = screen.getByText(defaultProps.label)
    expect(label).toHaveClass(customClass)
  })

  it('renders with custom error className', () => {
    const customClass = 'custom-error'
    render(<Input {...defaultProps} error="Error message" errorClassName={customClass} />)
    
    const error = screen.getByText('Error message')
    expect(error).toHaveClass(customClass)
  })

  it('renders with custom helper text className', () => {
    const customClass = 'custom-helper'
    render(<Input {...defaultProps} helperText="Helper text" helperTextClassName={customClass} />)
    
    const helperText = screen.getByText('Helper text')
    expect(helperText).toHaveClass(customClass)
  })

  it('renders with custom icon className', () => {
    const customClass = 'custom-icon'
    render(<Input {...defaultProps} icon="👤" iconClassName={customClass} />)
    
    const icon = screen.getByText('👤')
    expect(icon).toHaveClass(customClass)
  })
}) 