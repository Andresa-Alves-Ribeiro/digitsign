import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/router';
import NotFoundPage from '../NotFoundPage';

// Mock do next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));

describe('NotFoundPage', () => {
  const mockRouter = {
    push: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('should render 404 message', () => {
    render(<NotFoundPage />);
    
    expect(screen.getByText(/página não encontrada/i)).toBeInTheDocument();
    expect(screen.getByText(/404/i)).toBeInTheDocument();
  });

  it('should render description text', () => {
    render(<NotFoundPage />);
    
    expect(screen.getByText(/não conseguimos encontrar a página que você está procurando/i)).toBeInTheDocument();
  });

  it('should render home button', () => {
    render(<NotFoundPage />);
    
    expect(screen.getByRole('button', { name: /voltar para a página inicial/i })).toBeInTheDocument();
  });

  it('should navigate to home page when home button is clicked', () => {
    render(<NotFoundPage />);
    
    const homeButton = screen.getByRole('button', { name: /voltar para a página inicial/i });
    fireEvent.click(homeButton);

    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });

  it('should render with custom className', () => {
    const customClassName = 'custom-not-found-class';
    render(<NotFoundPage className={customClassName} />);

    const container = screen.getByTestId('not-found-container');
    expect(container).toHaveClass(customClassName);
  });

  it('should render with custom message', () => {
    const customMessage = 'Custom 404 Message';
    render(<NotFoundPage message={customMessage} />);

    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });
}); 