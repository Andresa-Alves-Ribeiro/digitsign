import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/router';
import NewDocumentButton from '../NewDocumentButton';

// Mock do next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));

describe('NewDocumentButton', () => {
  const mockRouter = {
    push: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('should render button with correct text', () => {
    render(<NewDocumentButton />);
    expect(screen.getByRole('button', { name: /novo documento/i })).toBeInTheDocument();
  });

  it('should navigate to upload page when clicked', () => {
    render(<NewDocumentButton />);
    
    const button = screen.getByRole('button', { name: /novo documento/i });
    fireEvent.click(button);

    expect(mockRouter.push).toHaveBeenCalledWith('/documents/upload');
  });

  it('should render with custom className', () => {
    const customClassName = 'custom-button-class';
    render(<NewDocumentButton className={customClassName} />);

    const button = screen.getByRole('button', { name: /novo documento/i });
    expect(button).toHaveClass(customClassName);
  });

  it('should render with icon', () => {
    render(<NewDocumentButton />);
    expect(screen.getByTestId('plus-icon')).toBeInTheDocument();
  });

  it('should be disabled when loading', () => {
    render(<NewDocumentButton isLoading />);
    
    const button = screen.getByRole('button', { name: /novo documento/i });
    expect(button).toBeDisabled();
  });

  it('should show loading state when isLoading is true', () => {
    render(<NewDocumentButton isLoading />);
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    expect(screen.queryByTestId('plus-icon')).not.toBeInTheDocument();
  });
}); 