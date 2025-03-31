import { render, screen } from '@testing-library/react'
import { useForm, FormProvider } from 'react-hook-form'
import FormField from '../FormField'

// Wrapper component to provide form context
const FormWrapper = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm()
  return (
    <FormProvider {...methods}>
      <form>{children}</form>
    </FormProvider>
  )
}

describe('FormField Component', () => {
  const defaultProps = {
    label: 'Test Label',
    name: 'testField',
    placeholder: 'Test Placeholder',
    register: () => ({}) // Mock register function
  }

  it('renders with required props', () => {
    render(
      <FormWrapper>
        <FormField {...defaultProps} />
      </FormWrapper>
    )

    expect(screen.getByLabelText('Test Label')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Test Placeholder')).toBeInTheDocument()
  })

  it('renders with error message', () => {
    const errorMessage = 'This field is required'
    render(
      <FormWrapper>
        <FormField {...defaultProps} error={errorMessage} />
      </FormWrapper>
    )

    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  it('renders with custom icon', () => {
    const customIcon = <span data-testid="custom-icon">🔍</span>
    render(
      <FormWrapper>
        <FormField {...defaultProps} icon={customIcon} />
      </FormWrapper>
    )

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
  })

  it('renders with different input types', () => {
    render(
      <FormWrapper>
        <FormField {...defaultProps} type="password" />
      </FormWrapper>
    )

    const input = screen.getByLabelText('Test Label')
    expect(input).toHaveAttribute('type', 'password')
  })

  it('renders with default icon for text type', () => {
    render(
      <FormWrapper>
        <FormField {...defaultProps} />
      </FormWrapper>
    )

    const icon = screen.getByTestId('default-icon')
    expect(icon).toBeInTheDocument()
  })

  it('renders with default icon for password type', () => {
    render(
      <FormWrapper>
        <FormField {...defaultProps} type="password" />
      </FormWrapper>
    )

    const icon = screen.getByTestId('password-icon')
    expect(icon).toBeInTheDocument()
  })
}) 