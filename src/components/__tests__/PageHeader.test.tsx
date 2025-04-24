import { render, screen } from '@testing-library/react';
import PageHeader from '../PageHeader';

describe('PageHeader', () => {
  const defaultProps = {
    title: 'Test Title',
    description: 'Test Description'
  };

  it('should render title and description', () => {
    render(<PageHeader {...defaultProps} />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('should render with custom className', () => {
    const customClassName = 'custom-header-class';
    render(<PageHeader {...defaultProps} className={customClassName} />);

    const header = screen.getByRole('heading', { name: 'Test Title' }).parentElement;
    expect(header).toHaveClass(customClassName);
  });

  it('should render with children', () => {
    render(
      <PageHeader {...defaultProps}>
        <div data-testid="custom-child">Custom Content</div>
      </PageHeader>
    );

    expect(screen.getByTestId('custom-child')).toBeInTheDocument();
    expect(screen.getByText('Custom Content')).toBeInTheDocument();
  });

  it('should render without description', () => {
    const { description, ...propsWithoutDescription } = defaultProps;
    render(<PageHeader {...propsWithoutDescription} />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
  });

  it('should render with custom title element', () => {
    render(
      <PageHeader
        {...defaultProps}
        titleElement={<h2 data-testid="custom-title">Custom Title</h2>}
      />
    );

    expect(screen.getByTestId('custom-title')).toBeInTheDocument();
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });
}); 