import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Form from './Form'

describe('Form', () => {
  const defaultProps = {
    onSubmit: jest.fn(),
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders form with default props', () => {
    render(<Form {...defaultProps} />)
    
    expect(screen.getByRole('form')).toBeInTheDocument()
    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /enviar/i })).toBeInTheDocument()
  })

  it('renders with initial values', () => {
    const initialValues = {
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    }
    
    render(<Form {...defaultProps} initialValues={initialValues} />)
    
    expect(screen.getByLabelText(/nome/i)).toHaveValue(initialValues.name)
    expect(screen.getByLabelText(/email/i)).toHaveValue(initialValues.email)
    expect(screen.getByLabelText(/senha/i)).toHaveValue(initialValues.password)
  })

  it('validates required fields', async () => {
    render(<Form {...defaultProps} />)
    
    fireEvent.click(screen.getByRole('button', { name: /enviar/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/nome é obrigatório/i)).toBeInTheDocument()
      expect(screen.getByText(/email é obrigatório/i)).toBeInTheDocument()
      expect(screen.getByText(/senha é obrigatória/i)).toBeInTheDocument()
    })
    
    expect(defaultProps.onSubmit).not.toHaveBeenCalled()
  })

  it('validates email format', async () => {
    render(<Form {...defaultProps} />)
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'invalid-email' },
    })
    
    fireEvent.click(screen.getByRole('button', { name: /enviar/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/email inválido/i)).toBeInTheDocument()
    })
    
    expect(defaultProps.onSubmit).not.toHaveBeenCalled()
  })

  it('validates password length', async () => {
    render(<Form {...defaultProps} />)
    
    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: '123' },
    })
    
    fireEvent.click(screen.getByRole('button', { name: /enviar/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/senha deve ter no mínimo 6 caracteres/i)).toBeInTheDocument()
    })
    
    expect(defaultProps.onSubmit).not.toHaveBeenCalled()
  })

  it('submits form with valid data', async () => {
    render(<Form {...defaultProps} />)
    
    fireEvent.change(screen.getByLabelText(/nome/i), {
      target: { value: 'John Doe' },
    })
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' },
    })
    
    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: '123456' },
    })
    
    fireEvent.click(screen.getByRole('button', { name: /enviar/i }))
    
    await waitFor(() => {
      expect(defaultProps.onSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
      })
    })
  })

  it('handles submission error', async () => {
    const error = new Error('Submission failed')
    defaultProps.onSubmit.mockRejectedValueOnce(error)
    
    render(<Form {...defaultProps} />)
    
    fireEvent.change(screen.getByLabelText(/nome/i), {
      target: { value: 'John Doe' },
    })
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' },
    })
    
    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: '123456' },
    })
    
    fireEvent.click(screen.getByRole('button', { name: /enviar/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/erro ao enviar formulário/i)).toBeInTheDocument()
    })
  })

  it('shows loading state during submission', async () => {
    defaultProps.onSubmit.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    )
    
    render(<Form {...defaultProps} />)
    
    fireEvent.change(screen.getByLabelText(/nome/i), {
      target: { value: 'John Doe' },
    })
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' },
    })
    
    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: '123456' },
    })
    
    fireEvent.click(screen.getByRole('button', { name: /enviar/i }))
    
    expect(screen.getByRole('button', { name: /enviando/i })).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /enviar/i })).toBeInTheDocument()
    })
  })

  it('renders with custom submit button text', () => {
    const submitText = 'Salvar'
    render(<Form {...defaultProps} submitText={submitText} />)
    
    expect(screen.getByRole('button', { name: submitText })).toBeInTheDocument()
  })

  it('renders with custom submit button color', () => {
    render(<Form {...defaultProps} submitColor="blue" />)
    
    const submitButton = screen.getByRole('button', { name: /enviar/i })
    expect(submitButton).toHaveClass('bg-blue-500', 'hover:bg-blue-600')
  })

  it('renders with custom submit button size', () => {
    render(<Form {...defaultProps} submitSize="lg" />)
    
    const submitButton = screen.getByRole('button', { name: /enviar/i })
    expect(submitButton).toHaveClass('px-6', 'py-3')
  })

  it('renders with custom field labels', () => {
    const labels = {
      name: 'Nome completo',
      email: 'Endereço de email',
      password: 'Senha de acesso',
    }
    
    render(<Form {...defaultProps} labels={labels} />)
    
    expect(screen.getByLabelText(labels.name)).toBeInTheDocument()
    expect(screen.getByLabelText(labels.email)).toBeInTheDocument()
    expect(screen.getByLabelText(labels.password)).toBeInTheDocument()
  })

  it('renders with custom field placeholders', () => {
    const placeholders = {
      name: 'Digite seu nome',
      email: 'Digite seu email',
      password: 'Digite sua senha',
    }
    
    render(<Form {...defaultProps} placeholders={placeholders} />)
    
    expect(screen.getByPlaceholderText(placeholders.name)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(placeholders.email)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(placeholders.password)).toBeInTheDocument()
  })

  it('renders with custom field types', () => {
    render(<Form {...defaultProps} fieldTypes={{ password: 'text' }} />)
    
    expect(screen.getByLabelText(/senha/i)).toHaveAttribute('type', 'text')
  })

  it('renders with custom field validation messages', () => {
    const validationMessages = {
      name: 'Por favor, informe seu nome',
      email: 'Por favor, informe um email válido',
      password: 'Por favor, informe uma senha válida',
    }
    
    render(<Form {...defaultProps} validationMessages={validationMessages} />)
    
    fireEvent.click(screen.getByRole('button', { name: /enviar/i }))
    
    expect(screen.getByText(validationMessages.name)).toBeInTheDocument()
    expect(screen.getByText(validationMessages.email)).toBeInTheDocument()
    expect(screen.getByText(validationMessages.password)).toBeInTheDocument()
  })

  it('renders with custom field styles', () => {
    const fieldStyles = {
      name: 'custom-name-input',
      email: 'custom-email-input',
      password: 'custom-password-input',
    }
    
    render(<Form {...defaultProps} fieldStyles={fieldStyles} />)
    
    expect(screen.getByLabelText(/nome/i)).toHaveClass(fieldStyles.name)
    expect(screen.getByLabelText(/email/i)).toHaveClass(fieldStyles.email)
    expect(screen.getByLabelText(/senha/i)).toHaveClass(fieldStyles.password)
  })

  it('renders with custom form styles', () => {
    const formStyles = 'custom-form'
    render(<Form {...defaultProps} className={formStyles} />)
    
    expect(screen.getByRole('form')).toHaveClass(formStyles)
  })
}) 