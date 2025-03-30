import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import DocumentForm from './DocumentForm'

describe('DocumentForm', () => {
  const mockOnSubmit = jest.fn()
  const mockOnCancel = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders form correctly', () => {
    render(<DocumentForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
    
    expect(screen.getByLabelText(/título/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/conteúdo/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument()
  })

  it('renders form with initial values when editing', () => {
    const initialValues = {
      title: 'Test Document',
      content: 'Test Content',
    }

    render(
      <DocumentForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialValues={initialValues}
      />
    )
    
    expect(screen.getByLabelText(/título/i)).toHaveValue(initialValues.title)
    expect(screen.getByLabelText(/conteúdo/i)).toHaveValue(initialValues.content)
  })

  it('validates required fields', async () => {
    render(<DocumentForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
    
    const submitButton = screen.getByRole('button', { name: /salvar/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/título é obrigatório/i)).toBeInTheDocument()
      expect(screen.getByText(/conteúdo é obrigatório/i)).toBeInTheDocument()
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })
  })

  it('submits form with valid data', async () => {
    render(<DocumentForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
    
    const titleInput = screen.getByLabelText(/título/i)
    const contentInput = screen.getByLabelText(/conteúdo/i)
    const submitButton = screen.getByRole('button', { name: /salvar/i })

    fireEvent.change(titleInput, { target: { value: 'New Document' } })
    fireEvent.change(contentInput, { target: { value: 'New Content' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'New Document',
        content: 'New Content',
      })
    })
  })

  it('calls onCancel when cancel button is clicked', () => {
    render(<DocumentForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
    
    const cancelButton = screen.getByRole('button', { name: /cancelar/i })
    fireEvent.click(cancelButton)

    expect(mockOnCancel).toHaveBeenCalled()
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('shows loading state during submission', async () => {
    render(<DocumentForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
    
    const titleInput = screen.getByLabelText(/título/i)
    const contentInput = screen.getByLabelText(/conteúdo/i)
    const submitButton = screen.getByRole('button', { name: /salvar/i })

    fireEvent.change(titleInput, { target: { value: 'New Document' } })
    fireEvent.change(contentInput, { target: { value: 'New Content' } })
    fireEvent.click(submitButton)

    expect(submitButton).toBeDisabled()
    expect(screen.getByText(/salvando/i)).toBeInTheDocument()

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled()
    })
  })

  it('handles submission error', async () => {
    const errorMessage = 'Erro ao salvar documento'
    mockOnSubmit.mockRejectedValueOnce(new Error(errorMessage))

    render(<DocumentForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
    
    const titleInput = screen.getByLabelText(/título/i)
    const contentInput = screen.getByLabelText(/conteúdo/i)
    const submitButton = screen.getByRole('button', { name: /salvar/i })

    fireEvent.change(titleInput, { target: { value: 'New Document' } })
    fireEvent.change(contentInput, { target: { value: 'New Content' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
      expect(submitButton).not.toBeDisabled()
    })
  })

  it('validates title length', async () => {
    render(<DocumentForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
    
    const titleInput = screen.getByLabelText(/título/i)
    const contentInput = screen.getByLabelText(/conteúdo/i)
    const submitButton = screen.getByRole('button', { name: /salvar/i })

    fireEvent.change(titleInput, { target: { value: 'a'.repeat(101) } })
    fireEvent.change(contentInput, { target: { value: 'Test Content' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/título deve ter no máximo 100 caracteres/i)).toBeInTheDocument()
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })
  })
}) 