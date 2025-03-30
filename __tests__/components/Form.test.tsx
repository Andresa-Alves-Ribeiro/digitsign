import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Form from '@/components/form/Form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

describe('Form', () => {
  const schema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
  });

  type FormData = z.infer<typeof schema>;

  const TestForm = ({ onSubmit }: { onSubmit: (data: FormData) => void }) => {
    const methods = useForm<FormData>({
      resolver: zodResolver(schema),
    });

    return (
      <Form methods={methods} onSubmit={onSubmit}>
        <Form.Field
          name="name"
          label="Name"
          error={methods.formState.errors.name?.message}
        />
        <Form.Field
          name="email"
          label="Email"
          error={methods.formState.errors.email?.message}
        />
        <Form.Submit>Submit</Form.Submit>
      </Form>
    );
  };

  it('renders form fields correctly', () => {
    const onSubmit = jest.fn();
    render(<TestForm onSubmit={onSubmit} />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('handles form submission with valid data', async () => {
    const onSubmit = jest.fn();
    render(<TestForm onSubmit={onSubmit} />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
      });
    });
  });

  it('shows validation errors for required fields', async () => {
    const onSubmit = jest.fn();
    render(<TestForm onSubmit={onSubmit} />);

    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('shows validation error for invalid email format', async () => {
    const onSubmit = jest.fn();
    render(<TestForm onSubmit={onSubmit} />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('handles form reset', () => {
    const onSubmit = jest.fn();
    render(<TestForm onSubmit={onSubmit} />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });

    const resetButton = screen.getByRole('button', { name: /reset/i });
    fireEvent.click(resetButton);

    expect(nameInput).toHaveValue('');
    expect(emailInput).toHaveValue('');
  });

  it('disables form fields during submission', async () => {
    const onSubmit = jest.fn();
    render(<TestForm onSubmit={onSubmit} />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.click(submitButton);

    expect(nameInput).toBeDisabled();
    expect(emailInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });

  it('renders with custom className', () => {
    const onSubmit = jest.fn();
    render(<TestForm onSubmit={onSubmit} className="custom-class" />);

    expect(screen.getByRole('form')).toHaveClass('custom-class');
  });

  it('renders with custom submit button text', () => {
    const onSubmit = jest.fn();
    render(
      <Form methods={useForm()} onSubmit={onSubmit}>
        <Form.Submit>Custom Submit</Form.Submit>
      </Form>
    );

    expect(screen.getByRole('button', { name: /custom submit/i })).toBeInTheDocument();
  });

  it('renders with custom reset button text', () => {
    const onSubmit = jest.fn();
    render(
      <Form methods={useForm()} onSubmit={onSubmit}>
        <Form.Reset>Custom Reset</Form.Reset>
      </Form>
    );

    expect(screen.getByRole('button', { name: /custom reset/i })).toBeInTheDocument();
  });
}); 