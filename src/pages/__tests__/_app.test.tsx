import { render, screen } from '@testing-library/react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import App from '../_app';

// Mock dos hooks
jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));

jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn()
}));

// Mock do componente de página
const MockPageComponent = () => <div>Mock Page Content</div>;

describe('App Component', () => {
  const mockRouter = {
    pathname: '/',
    events: {
      on: jest.fn(),
      off: jest.fn()
    }
  };

  const mockUseAuth = {
    isAuthenticated: true,
    user: {
      id: '1',
      name: 'Test User',
      email: 'test@example.com'
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useAuth as jest.Mock).mockReturnValue(mockUseAuth);
  });

  it('should render page content', () => {
    render(
      <App
        Component={MockPageComponent}
        pageProps={{}}
      />
    );

    expect(screen.getByText('Mock Page Content')).toBeInTheDocument();
  });

  it('should render with custom page props', () => {
    const customProps = {
      title: 'Custom Title',
      description: 'Custom Description'
    };

    render(
      <App
        Component={MockPageComponent}
        pageProps={customProps}
      />
    );

    expect(screen.getByText('Mock Page Content')).toBeInTheDocument();
  });

  it('should handle authentication state', () => {
    (useAuth as jest.Mock).mockReturnValue({
      ...mockUseAuth,
      isAuthenticated: false
    });

    render(
      <App
        Component={MockPageComponent}
        pageProps={{}}
      />
    );

    // Verificar se o componente de autenticação é renderizado
    expect(screen.getByTestId('auth-container')).toBeInTheDocument();
  });

  it('should handle loading state', () => {
    (useAuth as jest.Mock).mockReturnValue({
      ...mockUseAuth,
      isLoading: true
    });

    render(
      <App
        Component={MockPageComponent}
        pageProps={{}}
      />
    );

    expect(screen.getByTestId('loading-animation')).toBeInTheDocument();
  });

  it('should handle error state', () => {
    const error = new Error('Test error');
    (useAuth as jest.Mock).mockReturnValue({
      ...mockUseAuth,
      error
    });

    render(
      <App
        Component={MockPageComponent}
        pageProps={{}}
      />
    );

    expect(screen.getByText(/erro/i)).toBeInTheDocument();
  });

  it('should handle different routes', () => {
    const routes = ['/', '/login', '/register', '/documents'];

    routes.forEach(route => {
      (useRouter as jest.Mock).mockReturnValue({
        ...mockRouter,
        pathname: route
      });

      const { unmount } = render(
        <App
          Component={MockPageComponent}
          pageProps={{}}
        />
      );

      expect(screen.getByText('Mock Page Content')).toBeInTheDocument();
      unmount();
    });
  });

  it('should handle layout changes', () => {
    const CustomLayout = ({ children }: { children: React.ReactNode }) => (
      <div data-testid="custom-layout">{children}</div>
    );

    render(
      <App
        Component={MockPageComponent}
        pageProps={{}}
        layout={CustomLayout}
      />
    );

    expect(screen.getByTestId('custom-layout')).toBeInTheDocument();
    expect(screen.getByText('Mock Page Content')).toBeInTheDocument();
  });

  it('should handle error boundary', () => {
    const ErrorComponent = () => {
      throw new Error('Test error');
    };

    render(
      <App
        Component={ErrorComponent}
        pageProps={{}}
      />
    );

    expect(screen.getByText(/algo deu errado/i)).toBeInTheDocument();
  });

  it('should handle route change events', () => {
    render(
      <App
        Component={MockPageComponent}
        pageProps={{}}
      />
    );

    expect(mockRouter.events.on).toHaveBeenCalledWith('routeChangeStart', expect.any(Function));
    expect(mockRouter.events.on).toHaveBeenCalledWith('routeChangeComplete', expect.any(Function));
    expect(mockRouter.events.on).toHaveBeenCalledWith('routeChangeError', expect.any(Function));
  });
}); 