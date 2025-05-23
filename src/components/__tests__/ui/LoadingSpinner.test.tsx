import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('should render loading spinner', () => {
    render(<LoadingSpinner />);
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toBeInTheDocument();
  });

  it('should render loading spinner with custom class', () => {
    render(<LoadingSpinner className="custom-class" />);
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('custom-class');
  });

  it('should render loading spinner with custom color', () => {
    render(<LoadingSpinner color="text-blue-500" />);
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('text-blue-500');
  });

  it('should render loading spinner with custom size', () => {
    render(<LoadingSpinner size="w-8 h-8" />);
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('w-8 h-8');
  });

  it('should render loading spinner with custom margin', () => {
    render(<LoadingSpinner margin="mt-4" />);
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('mt-4');
  });

  it('should render loading spinner with custom padding', () => {
    render(<LoadingSpinner padding="p-4" />);
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('p-4');
  });

  it('should render loading spinner with custom background color', () => {
    render(<LoadingSpinner backgroundColor="bg-blue-100" />);
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('bg-blue-100');
  });

  it('should render loading spinner with custom border color', () => {
    render(<LoadingSpinner borderColor="border-blue-500" />);
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('border-blue-500');
  });

  it('should render loading spinner with custom shadow', () => {
    render(<LoadingSpinner shadow="shadow-lg" />);
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('shadow-lg');
  });

  it('should render loading spinner with custom width', () => {
    render(<LoadingSpinner width="w-full" />);
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('w-full');
  });

  it('should render loading spinner with custom height', () => {
    render(<LoadingSpinner height="h-full" />);
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('h-full');
  });

  it('should render loading spinner with custom rounded corners', () => {
    render(<LoadingSpinner rounded="rounded-lg" />);
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('rounded-lg');
  });

  it('should render loading spinner with custom opacity', () => {
    render(<LoadingSpinner opacity="opacity-75" />);
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('opacity-75');
  });

  it('should render loading spinner with custom transition', () => {
    render(<LoadingSpinner transition="transition-all" />);
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('transition-all');
  });

  it('should render loading spinner with custom animation', () => {
    render(<LoadingSpinner animation="animate-spin" />);
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('animate-spin');
  });

  it('should render loading spinner with custom animation duration', () => {
    render(<LoadingSpinner animationDuration="duration-1000" />);
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('duration-1000');
  });

  it('should render loading spinner with custom animation timing', () => {
    render(<LoadingSpinner animationTiming="ease-in-out" />);
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('ease-in-out');
  });

  it('should render loading spinner with custom animation delay', () => {
    render(<LoadingSpinner animationDelay="delay-100" />);
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('delay-100');
  });

  it('should render loading spinner with custom animation iteration count', () => {
    render(<LoadingSpinner animationIterationCount="infinite" />);
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('infinite');
  });

  it('should render loading spinner with custom animation direction', () => {
    render(<LoadingSpinner animationDirection="alternate" />);
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('alternate');
  });

  it('should render loading spinner with custom animation fill mode', () => {
    render(<LoadingSpinner animationFillMode="forwards" />);
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('forwards');
  });

  it('should render loading spinner with custom animation play state', () => {
    render(<LoadingSpinner animationPlayState="paused" />);
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('paused');
  });

  it('should render loading spinner with custom animation name', () => {
    render(<LoadingSpinner animationName="custom-spin" />);
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('custom-spin');
  });

  it('should render loading spinner with custom animation keyframes', () => {
    render(<LoadingSpinner animationKeyframes="spin" />);
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('spin');
  });

  it('should render loading spinner with custom animation transform', () => {
    render(<LoadingSpinner animationTransform="rotate-180" />);
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('rotate-180');
  });

  it('should render loading spinner with custom animation scale', () => {
    render(<LoadingSpinner animationScale="scale-110" />);
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('scale-110');
  });

  it('should render loading spinner with custom animation translate', () => {
    render(<LoadingSpinner animationTranslate="translate-x-1" />);
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('translate-x-1');
  });

  it('should render loading spinner with custom animation skew', () => {
    render(<LoadingSpinner animationSkew="skew-x-1" />);
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('skew-x-1');
  });

  it('should render loading spinner with custom animation perspective', () => {
    render(<LoadingSpinner animationPerspective="perspective-1000" />);
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('perspective-1000');
  });

  it('should render loading spinner with custom animation origin', () => {
    render(<LoadingSpinner animationOrigin="origin-center" />);
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('origin-center');
  });

  it('should render loading spinner with custom animation backface visibility', () => {
    render(<LoadingSpinner animationBackfaceVisibility="backface-visible" />);
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('backface-visible');
  });

  it('should render loading spinner with custom animation transform style', () => {
    render(<LoadingSpinner animationTransformStyle="preserve-3d" />);
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('preserve-3d');
  });

  it('should render loading spinner with custom animation transform box', () => {
    render(<LoadingSpinner animationTransformBox="fill-box" />);
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('fill-box');
  });

  it('should render loading spinner with custom animation transform origin', () => {
    render(<LoadingSpinner animationTransformOrigin="origin-center" />);
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('origin-center');
  });

  it('should render loading spinner with custom animation transform perspective', () => {
    render(<LoadingSpinner animationTransformPerspective="perspective-1000" />);
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('perspective-1000');
  });

  it('should render loading spinner with custom animation transform scale', () => {
    render(<LoadingSpinner animationTransformScale="scale-110" />);
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('scale-110');
  });

  it('should render loading spinner with custom animation transform translate', () => {
    render(<LoadingSpinner animationTransformTranslate="translate-x-1" />);
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('translate-x-1');
  });

  it('should render loading spinner with custom animation transform rotate', () => {
    render(<LoadingSpinner animationTransformRotate="rotate-180" />);
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('rotate-180');
  });

  it('should render loading spinner with custom animation transform skew', () => {
    render(<LoadingSpinner animationTransformSkew="skew-x-1" />);
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('skew-x-1');
  });

  it('should render loading spinner with custom animation transform matrix', () => {
    render(<LoadingSpinner animationTransformMatrix="matrix-1" />);
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('matrix-1');
  });

  it('should render loading spinner with custom animation transform translate3d', () => {
    render(<LoadingSpinner animationTransformTranslate3d="translate3d-1" />);
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('translate3d-1');
  });

  it('should render loading spinner with custom animation transform scale3d', () => {
    render(<LoadingSpinner animationTransformScale3d="scale3d-1" />);
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('scale3d-1');
  });

  it('should render loading spinner with custom animation transform rotate3d', () => {
    render(<LoadingSpinner animationTransformRotate3d="rotate3d-1" />);
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('rotate3d-1');
  });

  it('should render loading spinner with custom animation transform perspective3d', () => {
    render(<LoadingSpinner animationTransformPerspective3d="perspective3d-1" />);
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('perspective3d-1');
  });

  it('should render loading spinner with custom animation transform matrix3d', () => {
    render(<LoadingSpinner animationTransformMatrix3d="matrix3d-1" />);
    
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('matrix3d-1');
  });
}); 