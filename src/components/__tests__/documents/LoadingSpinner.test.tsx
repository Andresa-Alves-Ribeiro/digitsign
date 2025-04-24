import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../../documents/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders loading spinner', () => {
    render(<LoadingSpinner />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders with custom class', () => {
    render(<LoadingSpinner className="custom-class" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('custom-class');
  });

  it('renders with default class when no custom class provided', () => {
    render(<LoadingSpinner />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('animate-spin', 'h-5', 'w-5', 'text-gray-500');
  });

  it('renders with custom size', () => {
    render(<LoadingSpinner size={8} />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('h-8', 'w-8');
  });

  it('renders with default size when no custom size provided', () => {
    render(<LoadingSpinner />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('h-5', 'w-5');
  });

  it('renders with custom color', () => {
    render(<LoadingSpinner color="text-blue-500" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('text-blue-500');
  });

  it('renders with default color when no custom color provided', () => {
    render(<LoadingSpinner />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('text-gray-500');
  });

  it('renders with custom animation', () => {
    render(<LoadingSpinner animation="animate-pulse" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('animate-pulse');
  });

  it('renders with default animation when no custom animation provided', () => {
    render(<LoadingSpinner />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('animate-spin');
  });

  it('renders with custom role', () => {
    render(<LoadingSpinner role="status" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders with default role when no custom role provided', () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders with custom aria-label', () => {
    render(<LoadingSpinner ariaLabel="Custom loading" />);
    expect(screen.getByLabelText('Custom loading')).toBeInTheDocument();
  });

  it('renders with default aria-label when no custom aria-label provided', () => {
    render(<LoadingSpinner />);
    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  });

  it('renders with custom data-testid', () => {
    render(<LoadingSpinner dataTestId="custom-test-id" />);
    expect(screen.getByTestId('custom-test-id')).toBeInTheDocument();
  });

  it('renders with default data-testid when no custom data-testid provided', () => {
    render(<LoadingSpinner />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders with custom margin', () => {
    render(<LoadingSpinner margin="m-4" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('m-4');
  });

  it('renders with default margin when no custom margin provided', () => {
    render(<LoadingSpinner />);
    expect(screen.getByTestId('loading-spinner')).not.toHaveClass('m-4');
  });

  it('renders with custom padding', () => {
    render(<LoadingSpinner padding="p-4" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('p-4');
  });

  it('renders with default padding when no custom padding provided', () => {
    render(<LoadingSpinner />);
    expect(screen.getByTestId('loading-spinner')).not.toHaveClass('p-4');
  });

  it('renders with custom background', () => {
    render(<LoadingSpinner background="bg-gray-100" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('bg-gray-100');
  });

  it('renders with default background when no custom background provided', () => {
    render(<LoadingSpinner />);
    expect(screen.getByTestId('loading-spinner')).not.toHaveClass('bg-gray-100');
  });

  it('renders with custom border', () => {
    render(<LoadingSpinner border="border" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('border');
  });

  it('renders with default border when no custom border provided', () => {
    render(<LoadingSpinner />);
    expect(screen.getByTestId('loading-spinner')).not.toHaveClass('border');
  });

  it('renders with custom rounded', () => {
    render(<LoadingSpinner rounded="rounded-lg" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('rounded-lg');
  });

  it('renders with default rounded when no custom rounded provided', () => {
    render(<LoadingSpinner />);
    expect(screen.getByTestId('loading-spinner')).not.toHaveClass('rounded-lg');
  });

  it('renders with custom shadow', () => {
    render(<LoadingSpinner shadow="shadow-md" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('shadow-md');
  });

  it('renders with default shadow when no custom shadow provided', () => {
    render(<LoadingSpinner />);
    expect(screen.getByTestId('loading-spinner')).not.toHaveClass('shadow-md');
  });

  it('renders with custom opacity', () => {
    render(<LoadingSpinner opacity="opacity-75" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('opacity-75');
  });

  it('renders with default opacity when no custom opacity provided', () => {
    render(<LoadingSpinner />);
    expect(screen.getByTestId('loading-spinner')).not.toHaveClass('opacity-75');
  });

  it('renders with custom transition', () => {
    render(<LoadingSpinner transition="transition-all" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('transition-all');
  });

  it('renders with default transition when no custom transition provided', () => {
    render(<LoadingSpinner />);
    expect(screen.getByTestId('loading-spinner')).not.toHaveClass('transition-all');
  });

  it('renders with custom transform', () => {
    render(<LoadingSpinner transform="transform" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('transform');
  });

  it('renders with default transform when no custom transform provided', () => {
    render(<LoadingSpinner />);
    expect(screen.getByTestId('loading-spinner')).not.toHaveClass('transform');
  });

  it('renders with custom scale', () => {
    render(<LoadingSpinner scale="scale-110" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('scale-110');
  });

  it('renders with default scale when no custom scale provided', () => {
    render(<LoadingSpinner />);
    expect(screen.getByTestId('loading-spinner')).not.toHaveClass('scale-110');
  });

  it('renders with custom rotate', () => {
    render(<LoadingSpinner rotate="rotate-180" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('rotate-180');
  });

  it('renders with default rotate when no custom rotate provided', () => {
    render(<LoadingSpinner />);
    expect(screen.getByTestId('loading-spinner')).not.toHaveClass('rotate-180');
  });

  it('renders with custom translate', () => {
    render(<LoadingSpinner translate="translate-x-1" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('translate-x-1');
  });

  it('renders with default translate when no custom translate provided', () => {
    render(<LoadingSpinner />);
    expect(screen.getByTestId('loading-spinner')).not.toHaveClass('translate-x-1');
  });

  it('renders with custom skew', () => {
    render(<LoadingSpinner skew="skew-x-1" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('skew-x-1');
  });

  it('renders with default skew when no custom skew provided', () => {
    render(<LoadingSpinner />);
    expect(screen.getByTestId('loading-spinner')).not.toHaveClass('skew-x-1');
  });

  it('renders with custom perspective', () => {
    render(<LoadingSpinner perspective="perspective-1000" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('perspective-1000');
  });

  it('renders with default perspective when no custom perspective provided', () => {
    render(<LoadingSpinner />);
    expect(screen.getByTestId('loading-spinner')).not.toHaveClass('perspective-1000');
  });

  it('renders with custom origin', () => {
    render(<LoadingSpinner origin="origin-center" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('origin-center');
  });

  it('renders with default origin when no custom origin provided', () => {
    render(<LoadingSpinner />);
    expect(screen.getByTestId('loading-spinner')).not.toHaveClass('origin-center');
  });

  it('renders with custom backface visibility', () => {
    render(<LoadingSpinner backfaceVisibility="backface-visible" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('backface-visible');
  });

  it('renders with default backface visibility when no custom backface visibility provided', () => {
    render(<LoadingSpinner />);
    expect(screen.getByTestId('loading-spinner')).not.toHaveClass('backface-visible');
  });

  it('renders with custom transform style', () => {
    render(<LoadingSpinner transformStyle="preserve-3d" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('preserve-3d');
  });

  it('renders with default transform style when no custom transform style provided', () => {
    render(<LoadingSpinner />);
    expect(screen.getByTestId('loading-spinner')).not.toHaveClass('preserve-3d');
  });

  it('renders with custom transform box', () => {
    render(<LoadingSpinner transformBox="fill-box" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('fill-box');
  });

  it('renders with default transform box when no custom transform box provided', () => {
    render(<LoadingSpinner />);
    expect(screen.getByTestId('loading-spinner')).not.toHaveClass('fill-box');
  });

  it('renders with custom transform origin', () => {
    render(<LoadingSpinner transformOrigin="origin-center" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('origin-center');
  });

  it('renders with default transform origin when no custom transform origin provided', () => {
    render(<LoadingSpinner />);
    expect(screen.getByTestId('loading-spinner')).not.toHaveClass('origin-center');
  });

  it('renders with custom transform perspective', () => {
    render(<LoadingSpinner transformPerspective="perspective-1000" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('perspective-1000');
  });

  it('renders with default transform perspective when no custom transform perspective provided', () => {
    render(<LoadingSpinner />);
    expect(screen.getByTestId('loading-spinner')).not.toHaveClass('perspective-1000');
  });

  it('renders with custom transform scale', () => {
    render(<LoadingSpinner transformScale="scale-110" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('scale-110');
  });

  it('renders with default transform scale when no custom transform scale provided', () => {
    render(<LoadingSpinner />);
    expect(screen.getByTestId('loading-spinner')).not.toHaveClass('scale-110');
  });

  it('renders with custom transform translate', () => {
    render(<LoadingSpinner transformTranslate="translate-x-1" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('translate-x-1');
  });

  it('renders with default transform translate when no custom transform translate provided', () => {
    render(<LoadingSpinner />);
    expect(screen.getByTestId('loading-spinner')).not.toHaveClass('translate-x-1');
  });

  it('renders with custom transform rotate', () => {
    render(<LoadingSpinner transformRotate="rotate-180" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('rotate-180');
  });

  it('renders with default transform rotate when no custom transform rotate provided', () => {
    render(<LoadingSpinner />);
    expect(screen.getByTestId('loading-spinner')).not.toHaveClass('rotate-180');
  });

  it('renders with custom transform skew', () => {
    render(<LoadingSpinner transformSkew="skew-x-1" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('skew-x-1');
  });

  it('renders with default transform skew when no custom transform skew provided', () => {
    render(<LoadingSpinner />);
    expect(screen.getByTestId('loading-spinner')).not.toHaveClass('skew-x-1');
  });

  it('renders with custom transform matrix', () => {
    render(<LoadingSpinner transformMatrix="matrix-1" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('matrix-1');
  });

  it('renders with default transform matrix when no custom transform matrix provided', () => {
    render(<LoadingSpinner />);
    expect(screen.getByTestId('loading-spinner')).not.toHaveClass('matrix-1');
  });

  it('renders with custom transform translate3d', () => {
    render(<LoadingSpinner transformTranslate3d="translate3d-1" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('translate3d-1');
  });

  it('renders with default transform translate3d when no custom transform translate3d provided', () => {
    render(<LoadingSpinner />);
    expect(screen.getByTestId('loading-spinner')).not.toHaveClass('translate3d-1');
  });

  it('renders with custom transform scale3d', () => {
    render(<LoadingSpinner transformScale3d="scale3d-1" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('scale3d-1');
  });

  it('renders with default transform scale3d when no custom transform scale3d provided', () => {
    render(<LoadingSpinner />);
    expect(screen.getByTestId('loading-spinner')).not.toHaveClass('scale3d-1');
  });

  it('renders with custom transform rotate3d', () => {
    render(<LoadingSpinner transformRotate3d="rotate3d-1" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('rotate3d-1');
  });

  it('renders with default transform rotate3d when no custom transform rotate3d provided', () => {
    render(<LoadingSpinner />);
    expect(screen.getByTestId('loading-spinner')).not.toHaveClass('rotate3d-1');
  });

  it('renders with custom transform perspective3d', () => {
    render(<LoadingSpinner transformPerspective3d="perspective3d-1" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('perspective3d-1');
  });

  it('renders with default transform perspective3d when no custom transform perspective3d provided', () => {
    render(<LoadingSpinner />);
    expect(screen.getByTestId('loading-spinner')).not.toHaveClass('perspective3d-1');
  });

  it('renders with custom transform matrix3d', () => {
    render(<LoadingSpinner transformMatrix3d="matrix3d-1" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('matrix3d-1');
  });

  it('renders with default transform matrix3d when no custom transform matrix3d provided', () => {
    render(<LoadingSpinner />);
    expect(screen.getByTestId('loading-spinner')).not.toHaveClass('matrix3d-1');
  });
}); 