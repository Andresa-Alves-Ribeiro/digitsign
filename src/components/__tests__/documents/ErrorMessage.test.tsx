import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorMessage from '../../documents/ErrorMessage';

describe('ErrorMessage', () => {
  it('renders error message', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('renders with custom class', () => {
    render(<ErrorMessage message="Test error message" className="custom-class" />);
    expect(screen.getByTestId('error-message')).toHaveClass('custom-class');
  });

  it('renders with default class when no custom class provided', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByTestId('error-message')).toHaveClass('text-red-600', 'text-sm', 'mt-2');
  });

  it('renders with custom icon class', () => {
    render(<ErrorMessage message="Test error message" iconClassName="custom-icon-class" />);
    expect(screen.getByTestId('error-icon')).toHaveClass('custom-icon-class');
  });

  it('renders with default icon class when no custom icon class provided', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByTestId('error-icon')).toHaveClass('h-5', 'w-5', 'text-red-500');
  });

  it('renders with custom container class', () => {
    render(<ErrorMessage message="Test error message" containerClassName="custom-container-class" />);
    expect(screen.getByTestId('error-container')).toHaveClass('custom-container-class');
  });

  it('renders with default container class when no custom container class provided', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByTestId('error-container')).toHaveClass('flex', 'items-center', 'space-x-2');
  });

  it('renders with custom message class', () => {
    render(<ErrorMessage message="Test error message" messageClassName="custom-message-class" />);
    expect(screen.getByTestId('error-text')).toHaveClass('custom-message-class');
  });

  it('renders with default message class when no custom message class provided', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByTestId('error-text')).toHaveClass('text-red-600', 'text-sm');
  });

  it('renders with custom role', () => {
    render(<ErrorMessage message="Test error message" role="alert" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders with default role when no custom role provided', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders with custom aria-label', () => {
    render(<ErrorMessage message="Test error message" ariaLabel="Custom error" />);
    expect(screen.getByLabelText('Custom error')).toBeInTheDocument();
  });

  it('renders with default aria-label when no custom aria-label provided', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByLabelText('Error message')).toBeInTheDocument();
  });

  it('renders with custom data-testid', () => {
    render(<ErrorMessage message="Test error message" dataTestId="custom-test-id" />);
    expect(screen.getByTestId('custom-test-id')).toBeInTheDocument();
  });

  it('renders with default data-testid when no custom data-testid provided', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByTestId('error-message')).toBeInTheDocument();
  });

  it('renders with custom icon', () => {
    render(
      <ErrorMessage
        message="Test error message"
        icon={<span data-testid="custom-icon">!</span>}
      />
    );
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('renders with default icon when no custom icon provided', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByTestId('error-icon')).toBeInTheDocument();
  });

  it('renders with custom icon size', () => {
    render(<ErrorMessage message="Test error message" iconSize={8} />);
    expect(screen.getByTestId('error-icon')).toHaveClass('h-8', 'w-8');
  });

  it('renders with default icon size when no custom icon size provided', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByTestId('error-icon')).toHaveClass('h-5', 'w-5');
  });

  it('renders with custom icon color', () => {
    render(<ErrorMessage message="Test error message" iconColor="text-blue-500" />);
    expect(screen.getByTestId('error-icon')).toHaveClass('text-blue-500');
  });

  it('renders with default icon color when no custom icon color provided', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByTestId('error-icon')).toHaveClass('text-red-500');
  });

  it('renders with custom message color', () => {
    render(<ErrorMessage message="Test error message" messageColor="text-blue-600" />);
    expect(screen.getByTestId('error-text')).toHaveClass('text-blue-600');
  });

  it('renders with default message color when no custom message color provided', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByTestId('error-text')).toHaveClass('text-red-600');
  });

  it('renders with custom message size', () => {
    render(<ErrorMessage message="Test error message" messageSize="text-lg" />);
    expect(screen.getByTestId('error-text')).toHaveClass('text-lg');
  });

  it('renders with default message size when no custom message size provided', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByTestId('error-text')).toHaveClass('text-sm');
  });

  it('renders with custom spacing', () => {
    render(<ErrorMessage message="Test error message" spacing="mt-4" />);
    expect(screen.getByTestId('error-message')).toHaveClass('mt-4');
  });

  it('renders with default spacing when no custom spacing provided', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByTestId('error-message')).toHaveClass('mt-2');
  });

  it('renders with custom icon spacing', () => {
    render(<ErrorMessage message="Test error message" iconSpacing="mr-4" />);
    expect(screen.getByTestId('error-icon')).toHaveClass('mr-4');
  });

  it('renders with default icon spacing when no custom icon spacing provided', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByTestId('error-icon')).not.toHaveClass('mr-4');
  });

  it('renders with custom message spacing', () => {
    render(<ErrorMessage message="Test error message" messageSpacing="ml-4" />);
    expect(screen.getByTestId('error-text')).toHaveClass('ml-4');
  });

  it('renders with default message spacing when no custom message spacing provided', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByTestId('error-text')).not.toHaveClass('ml-4');
  });

  it('renders with custom container spacing', () => {
    render(<ErrorMessage message="Test error message" containerSpacing="space-x-4" />);
    expect(screen.getByTestId('error-container')).toHaveClass('space-x-4');
  });

  it('renders with default container spacing when no custom container spacing provided', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByTestId('error-container')).toHaveClass('space-x-2');
  });

  it('renders with custom container alignment', () => {
    render(<ErrorMessage message="Test error message" containerAlignment="items-start" />);
    expect(screen.getByTestId('error-container')).toHaveClass('items-start');
  });

  it('renders with default container alignment when no custom container alignment provided', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByTestId('error-container')).toHaveClass('items-center');
  });

  it('renders with custom container direction', () => {
    render(<ErrorMessage message="Test error message" containerDirection="flex-col" />);
    expect(screen.getByTestId('error-container')).toHaveClass('flex-col');
  });

  it('renders with default container direction when no custom container direction provided', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByTestId('error-container')).toHaveClass('flex');
  });

  it('renders with custom container wrap', () => {
    render(<ErrorMessage message="Test error message" containerWrap="flex-wrap" />);
    expect(screen.getByTestId('error-container')).toHaveClass('flex-wrap');
  });

  it('renders with default container wrap when no custom container wrap provided', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByTestId('error-container')).not.toHaveClass('flex-wrap');
  });

  it('renders with custom container justify', () => {
    render(<ErrorMessage message="Test error message" containerJustify="justify-start" />);
    expect(screen.getByTestId('error-container')).toHaveClass('justify-start');
  });

  it('renders with default container justify when no custom container justify provided', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByTestId('error-container')).not.toHaveClass('justify-start');
  });

  it('renders with custom container padding', () => {
    render(<ErrorMessage message="Test error message" containerPadding="p-4" />);
    expect(screen.getByTestId('error-container')).toHaveClass('p-4');
  });

  it('renders with default container padding when no custom container padding provided', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByTestId('error-container')).not.toHaveClass('p-4');
  });

  it('renders with custom container margin', () => {
    render(<ErrorMessage message="Test error message" containerMargin="m-4" />);
    expect(screen.getByTestId('error-container')).toHaveClass('m-4');
  });

  it('renders with default container margin when no custom container margin provided', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByTestId('error-container')).not.toHaveClass('m-4');
  });

  it('renders with custom container background', () => {
    render(<ErrorMessage message="Test error message" containerBackground="bg-gray-100" />);
    expect(screen.getByTestId('error-container')).toHaveClass('bg-gray-100');
  });

  it('renders with default container background when no custom container background provided', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByTestId('error-container')).not.toHaveClass('bg-gray-100');
  });

  it('renders with custom container border', () => {
    render(<ErrorMessage message="Test error message" containerBorder="border" />);
    expect(screen.getByTestId('error-container')).toHaveClass('border');
  });

  it('renders with default container border when no custom container border provided', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByTestId('error-container')).not.toHaveClass('border');
  });

  it('renders with custom container rounded', () => {
    render(<ErrorMessage message="Test error message" containerRounded="rounded-lg" />);
    expect(screen.getByTestId('error-container')).toHaveClass('rounded-lg');
  });

  it('renders with default container rounded when no custom container rounded provided', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByTestId('error-container')).not.toHaveClass('rounded-lg');
  });

  it('renders with custom container shadow', () => {
    render(<ErrorMessage message="Test error message" containerShadow="shadow-md" />);
    expect(screen.getByTestId('error-container')).toHaveClass('shadow-md');
  });

  it('renders with default container shadow when no custom container shadow provided', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByTestId('error-container')).not.toHaveClass('shadow-md');
  });

  it('renders with custom container opacity', () => {
    render(<ErrorMessage message="Test error message" containerOpacity="opacity-75" />);
    expect(screen.getByTestId('error-container')).toHaveClass('opacity-75');
  });

  it('renders with default container opacity when no custom container opacity provided', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByTestId('error-container')).not.toHaveClass('opacity-75');
  });

  it('renders with custom container transition', () => {
    render(<ErrorMessage message="Test error message" containerTransition="transition-all" />);
    expect(screen.getByTestId('error-container')).toHaveClass('transition-all');
  });

  it('renders with default container transition when no custom container transition provided', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByTestId('error-container')).not.toHaveClass('transition-all');
  });

  it('renders with custom container transform', () => {
    render(<ErrorMessage message="Test error message" containerTransform="transform" />);
    expect(screen.getByTestId('error-container')).toHaveClass('transform');
  });

  it('renders with default container transform when no custom container transform provided', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByTestId('error-container')).not.toHaveClass('transform');
  });

  it('renders with custom container scale', () => {
    render(<ErrorMessage message="Test error message" containerScale="scale-110" />);
    expect(screen.getByTestId('error-container')).toHaveClass('scale-110');
  });

  it('renders with default container scale when no custom container scale provided', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByTestId('error-container')).not.toHaveClass('scale-110');
  });

  it('renders with custom container rotate', () => {
    render(<ErrorMessage message="Test error message" containerRotate="rotate-180" />);
    expect(screen.getByTestId('error-container')).toHaveClass('rotate-180');
  });

  it('renders with default container rotate when no custom container rotate provided', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByTestId('error-container')).not.toHaveClass('rotate-180');
  });

  it('renders with custom container translate', () => {
    render(<ErrorMessage message="Test error message" containerTranslate="translate-x-1" />);
    expect(screen.getByTestId('error-container')).toHaveClass('translate-x-1');
  });

  it('renders with default container translate when no custom container translate provided', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByTestId('error-container')).not.toHaveClass('translate-x-1');
  });

  it('renders with custom container skew', () => {
    render(<ErrorMessage message="Test error message" containerSkew="skew-x-1" />);
    expect(screen.getByTestId('error-container')).toHaveClass('skew-x-1');
  });

  it('renders with default container skew when no custom container skew provided', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByTestId('error-container')).not.toHaveClass('skew-x-1');
  });

  it('renders with custom container perspective', () => {
    render(<ErrorMessage message="Test error message" containerPerspective="perspective-1000" />);
    expect(screen.getByTestId('error-container')).toHaveClass('perspective-1000');
  });

  it('renders with default container perspective when no custom container perspective provided', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByTestId('error-container')).not.toHaveClass('perspective-1000');
  });

  it('renders with custom container origin', () => {
    render(<ErrorMessage message="Test error message" containerOrigin="origin-center" />);
    expect(screen.getByTestId('error-container')).toHaveClass('origin-center');
  });

  it('renders with default container origin when no custom container origin provided', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByTestId('error-container')).not.toHaveClass('origin-center');
  });

  it('renders with custom container backface visibility', () => {
    render(<ErrorMessage message="Test error message" containerBackfaceVisibility="backface-visible" />);
    expect(screen.getByTestId('error-container')).toHaveClass('backface-visible');
  });

  it('renders with default container backface visibility when no custom container backface visibility provided', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByTestId('error-container')).not.toHaveClass('backface-visible');
  });

  it('renders with custom container transform style', () => {
    render(<ErrorMessage message="Test error message" containerTransformStyle="preserve-3d" />);
    expect(screen.getByTestId('error-container')).toHaveClass('preserve-3d');
  });

  it('renders with default container transform style when no custom container transform style provided', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByTestId('error-container')).not.toHaveClass('preserve-3d');
  });

  it('renders with custom container transform box', () => {
    render(<ErrorMessage message="Test error message" containerTransformBox="fill-box" />);
    expect(screen.getByTestId('error-container')).toHaveClass('fill-box');
  });

  it('renders with default container transform box when no custom container transform box provided', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByTestId('error-container')).not.toHaveClass('fill-box');
  });

  it('renders with custom container transform origin', () => {
    render(<ErrorMessage message="Test error message" containerTransformOrigin="origin-center" />);
    expect(screen.getByTestId('error-container')).toHaveClass('origin-center');
  });

  it('renders with default container transform origin when no custom container transform origin provided', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByTestId('error-container')).not.toHaveClass('origin-center');
  });

  it('renders with custom container transform perspective', () => {
    render(<ErrorMessage message="Test error message" containerTransformPerspective="perspective-1000" />);
    expect(screen.getByTestId('error-container')).toHaveClass('perspective-1000');
  });

  it('renders with default container transform perspective when no custom container transform perspective provided', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByTestId('error-container')).not.toHaveClass('perspective-1000');
  });

  it('renders with custom container transform scale', () => {
    render(<ErrorMessage message="Test error message" containerTransformScale="scale-110" />);
    expect(screen.getByTestId('error-container')).toHaveClass('scale-110');
  });

  it('renders with default container transform scale when no custom container transform scale provided', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByTestId('error-container')).not.toHaveClass('scale-110');
  });

  it('renders with custom container transform translate', () => {
    render(<ErrorMessage message="Test error message" containerTransformTranslate="translate-x-1" />);
    expect(screen.getByTestId('error-container')).toHaveClass('translate-x-1');
  });

  it('renders with default container transform translate when no custom container transform translate provided', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByTestId('error-container')).not.toHaveClass('translate-x-1');
  });

  it('renders with custom container transform rotate', () => {
    render(<ErrorMessage message="Test error message" containerTransformRotate="rotate-180" />);
    expect(screen.getByTestId('error-container')).toHaveClass('rotate-180');
  });

  it('renders with default container transform rotate when no custom container transform rotate provided', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByTestId('error-container')).not.toHaveClass('rotate-180');
  });

  it('renders with custom container transform skew', () => {
    render(<ErrorMessage message="Test error message" containerTransformSkew="skew-x-1" />);
    expect(screen.getByTestId('error-container')).toHaveClass('skew-x-1');
  });

  it('renders with default container transform skew when no custom container transform skew provided', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByTestId('error-container')).not.toHaveClass('skew-x-1');
  });

  it('renders with custom container transform matrix', () => {
    render(<ErrorMessage message="Test error message" containerTransformMatrix="matrix-1" />);
    expect(screen.getByTestId('error-container')).toHaveClass('matrix-1');
  });

  it('renders with default container transform matrix when no custom container transform matrix provided', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByTestId('error-container')).not.toHaveClass('matrix-1');
  });

  it('renders with custom container transform translate3d', () => {
    render(<ErrorMessage message="Test error message" containerTransformTranslate3d="translate3d-1" />);
    expect(screen.getByTestId('error-container')).toHaveClass('translate3d-1');
  });

  it('renders with default container transform translate3d when no custom container transform translate3d provided', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByTestId('error-container')).not.toHaveClass('translate3d-1');
  });

  it('renders with custom container transform scale3d', () => {
    render(<ErrorMessage message="Test error message" containerTransformScale3d="scale3d-1" />);
    expect(screen.getByTestId('error-container')).toHaveClass('scale3d-1');
  });

  it('renders with default container transform scale3d when no custom container transform scale3d provided', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByTestId('error-container')).not.toHaveClass('scale3d-1');
  });

  it('renders with custom container transform rotate3d', () => {
    render(<ErrorMessage message="Test error message" containerTransformRotate3d="rotate3d-1" />);
    expect(screen.getByTestId('error-container')).toHaveClass('rotate3d-1');
  });

  it('renders with default container transform rotate3d when no custom container transform rotate3d provided', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByTestId('error-container')).not.toHaveClass('rotate3d-1');
  });

  it('renders with custom container transform perspective3d', () => {
    render(<ErrorMessage message="Test error message" containerTransformPerspective3d="perspective3d-1" />);
    expect(screen.getByTestId('error-container')).toHaveClass('perspective3d-1');
  });

  it('renders with default container transform perspective3d when no custom container transform perspective3d provided', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByTestId('error-container')).not.toHaveClass('perspective3d-1');
  });

  it('renders with custom container transform matrix3d', () => {
    render(<ErrorMessage message="Test error message" containerTransformMatrix3d="matrix3d-1" />);
    expect(screen.getByTestId('error-container')).toHaveClass('matrix3d-1');
  });

  it('renders with default container transform matrix3d when no custom container transform matrix3d provided', () => {
    render(<ErrorMessage message="Test error message" />);
    expect(screen.getByTestId('error-container')).not.toHaveClass('matrix3d-1');
  });
}); 