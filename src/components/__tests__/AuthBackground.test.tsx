import { render, screen } from '@testing-library/react';
import AuthBackground from '../AuthBackground';

describe('AuthBackground', () => {
  it('should render children', () => {
    render(
      <AuthBackground>
        <div data-testid="test-child">Test Content</div>
      </AuthBackground>
    );

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should render with default background image', () => {
    render(
      <AuthBackground>
        <div>Test Content</div>
      </AuthBackground>
    );

    const background = screen.getByTestId('auth-background');
    expect(background).toHaveStyle({
      backgroundImage: 'url(/images/auth-bg.jpg)'
    });
  });

  it('should render with custom background image', () => {
    const customBgImage = '/images/custom-bg.jpg';
    render(
      <AuthBackground backgroundImage={customBgImage}>
        <div>Test Content</div>
      </AuthBackground>
    );

    const background = screen.getByTestId('auth-background');
    expect(background).toHaveStyle({
      backgroundImage: `url(${customBgImage})`
    });
  });

  it('should render with custom className', () => {
    const customClassName = 'custom-auth-bg';
    render(
      <AuthBackground className={customClassName}>
        <div>Test Content</div>
      </AuthBackground>
    );

    const background = screen.getByTestId('auth-background');
    expect(background).toHaveClass(customClassName);
  });

  it('should render with overlay', () => {
    render(
      <AuthBackground>
        <div>Test Content</div>
      </AuthBackground>
    );

    const overlay = screen.getByTestId('auth-background-overlay');
    expect(overlay).toBeInTheDocument();
  });
}); 