import { render, screen, fireEvent } from '@testing-library/react';
import Input from '@/components/input/Input';

describe('Input', () => {
  it('renders input with label', () => {
    render(<Input label="Test Label" />);

    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
  });

  it('renders input with placeholder', () => {
    render(<Input placeholder="Test Placeholder" />);

    expect(screen.getByPlaceholderText('Test Placeholder')).toBeInTheDocument();
  });

  it('handles value changes', () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test value' } });

    expect(handleChange).toHaveBeenCalled();
  });

  it('displays error message', () => {
    render(<Input error="Test error message" />);

    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('renders as disabled', () => {
    render(<Input disabled />);

    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('renders with custom className', () => {
    render(<Input className="custom-class" />);

    expect(screen.getByRole('textbox')).toHaveClass('custom-class');
  });

  it('renders with required attribute', () => {
    render(<Input required />);

    expect(screen.getByRole('textbox')).toBeRequired();
  });

  it('renders with type attribute', () => {
    render(<Input type="password" />);

    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'password');
  });

  it('renders with name attribute', () => {
    render(<Input name="test-input" />);

    expect(screen.getByRole('textbox')).toHaveAttribute('name', 'test-input');
  });

  it('renders with id attribute', () => {
    render(<Input id="test-input" />);

    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'test-input');
  });

  it('renders with aria-label when label is not provided', () => {
    render(<Input aria-label="Test Input" />);

    expect(screen.getByLabelText('Test Input')).toBeInTheDocument();
  });

  it('renders with helper text', () => {
    render(<Input helperText="Test helper text" />);

    expect(screen.getByText('Test helper text')).toBeInTheDocument();
  });

  it('renders with start icon', () => {
    render(<Input startIcon={<span>🔍</span>} />);

    expect(screen.getByText('🔍')).toBeInTheDocument();
  });

  it('renders with end icon', () => {
    render(<Input endIcon={<span>✓</span>} />);

    expect(screen.getByText('✓')).toBeInTheDocument();
  });

  it('handles focus and blur events', () => {
    const handleFocus = jest.fn();
    const handleBlur = jest.fn();
    render(<Input onFocus={handleFocus} onBlur={handleBlur} />);

    const input = screen.getByRole('textbox');
    fireEvent.focus(input);
    fireEvent.blur(input);

    expect(handleFocus).toHaveBeenCalled();
    expect(handleBlur).toHaveBeenCalled();
  });
}); 