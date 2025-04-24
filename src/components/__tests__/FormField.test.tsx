import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useForm, UseFormRegister } from 'react-hook-form';
import FormField from '../ui/FormField';

interface TestFormData extends Record<string, unknown> {
  testField: string;
}

// Wrapper component to provide form context
const FormWrapper = ({ children }: { children: React.ReactNode }): JSX.Element => {
  useForm<TestFormData>();
  return (
    <form>{children}</form>
  );
};

describe('FormField Component', () => {
  const mockRegister = jest.fn().mockReturnValue({
    name: 'testField',
    onChange: jest.fn(),
    onBlur: jest.fn(),
    ref: jest.fn()
  }) as UseFormRegister<TestFormData>;

  const defaultProps = {
    label: 'Test Label',
    name: 'testField',
    placeholder: 'Test Placeholder',
    register: mockRegister
  };

  it('renders with required props', () => {
    render(
      <FormWrapper>
        <FormField<TestFormData> {...defaultProps} />
      </FormWrapper>
    );

    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Test Placeholder')).toBeInTheDocument();
  });

  it('renders with error message', () => {
    const errorMessage = 'This field is required';
    render(
      <FormWrapper>
        <FormField<TestFormData> {...defaultProps} error={errorMessage} />
      </FormWrapper>
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('renders with custom icon', () => {
    const customIcon: React.ReactNode = <span data-testid="custom-icon">🔍</span>;
    render(
      <FormWrapper>
        <FormField<TestFormData> {...defaultProps} icon={customIcon} />
      </FormWrapper>
    );

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('renders with different input types', () => {
    render(
      <FormWrapper>
        <FormField<TestFormData> {...defaultProps} type="password" />
      </FormWrapper>
    );

    const input = screen.getByLabelText('Test Label');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('renders with default icon for text type', () => {
    render(
      <FormWrapper>
        <FormField<TestFormData> {...defaultProps} />
      </FormWrapper>
    );

    expect(screen.getByTestId('default-icon')).toBeInTheDocument();
  });

  it('renders with default icon for password type', () => {
    render(
      <FormWrapper>
        <FormField<TestFormData> {...defaultProps} type="password" />
      </FormWrapper>
    );

    const icon = screen.getByTestId('password-icon');
    expect(icon).toBeInTheDocument();
  });
}); 