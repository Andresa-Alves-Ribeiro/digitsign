import { render, screen } from '@testing-library/react';
import MainLayout from '@/components/layout/MainLayout';

describe('MainLayout', () => {
  it('renders main layout with children', () => {
    render(
      <MainLayout>
        <div>Test Content</div>
      </MainLayout>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByRole('banner')).toBeInTheDocument(); // Navbar
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    render(
      <MainLayout title="Custom Title">
        <div>Test Content</div>
      </MainLayout>
    );

    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });

  it('renders with default title when not provided', () => {
    render(
      <MainLayout>
        <div>Test Content</div>
      </MainLayout>
    );

    expect(screen.getByText('SuperSign')).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    render(
      <MainLayout className="custom-class">
        <div>Test Content</div>
      </MainLayout>
    );

    const mainElement = screen.getByRole('main');
    expect(mainElement).toHaveClass('custom-class');
  });

  it('renders with default className when not provided', () => {
    render(
      <MainLayout>
        <div>Test Content</div>
      </MainLayout>
    );

    const mainElement = screen.getByRole('main');
    expect(mainElement).toHaveClass('container', 'mx-auto', 'px-4', 'py-8');
  });
}); 