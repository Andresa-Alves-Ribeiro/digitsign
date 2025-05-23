import React from 'react';
import { render, screen } from '@testing-library/react';
import PageTransition from '../../ui/PageTransition';

describe('PageTransition', () => {
  it('renders children', () => {
    render(
      <PageTransition>
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders with custom class', () => {
    render(
      <PageTransition className="custom-class">
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition')).toHaveClass('custom-class');
  });

  it('renders with default class when no custom class provided', () => {
    render(
      <PageTransition>
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition')).toHaveClass('min-h-screen', 'bg-neutral-100');
  });

  it('renders with custom animation class', () => {
    render(
      <PageTransition animationClassName="custom-animation-class">
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).toHaveClass('custom-animation-class');
  });

  it('renders with default animation class when no custom animation class provided', () => {
    render(
      <PageTransition>
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).toHaveClass('transition-all', 'duration-300', 'ease-in-out');
  });

  it('renders with custom content class', () => {
    render(
      <PageTransition contentClassName="custom-content-class">
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).toHaveClass('custom-content-class');
  });

  it('renders with default content class when no custom content class provided', () => {
    render(
      <PageTransition>
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).toHaveClass('max-w-7xl', 'mx-auto', 'py-6', 'sm:px-6', 'lg:px-8');
  });

  it('renders with custom container class', () => {
    render(
      <PageTransition containerClassName="custom-container-class">
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-container')).toHaveClass('custom-container-class');
  });

  it('renders with default container class when no custom container class provided', () => {
    render(
      <PageTransition>
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-container')).toHaveClass('px-4', 'py-6', 'sm:px-0');
  });

  it('renders with custom animation duration', () => {
    render(
      <PageTransition animationDuration="duration-500">
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).toHaveClass('duration-500');
  });

  it('renders with default animation duration when no custom animation duration provided', () => {
    render(
      <PageTransition>
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).toHaveClass('duration-300');
  });

  it('renders with custom animation timing', () => {
    render(
      <PageTransition animationTiming="ease-out">
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).toHaveClass('ease-out');
  });

  it('renders with default animation timing when no custom animation timing provided', () => {
    render(
      <PageTransition>
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).toHaveClass('ease-in-out');
  });

  it('renders with custom animation delay', () => {
    render(
      <PageTransition animationDelay="delay-200">
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).toHaveClass('delay-200');
  });

  it('renders with default animation delay when no custom animation delay provided', () => {
    render(
      <PageTransition>
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).not.toHaveClass('delay-');
  });

  it('renders with custom animation iteration count', () => {
    render(
      <PageTransition animationIterationCount="infinite">
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).toHaveClass('infinite');
  });

  it('renders with default animation iteration count when no custom animation iteration count provided', () => {
    render(
      <PageTransition>
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).not.toHaveClass('infinite');
  });

  it('renders with custom animation direction', () => {
    render(
      <PageTransition animationDirection="alternate">
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).toHaveClass('alternate');
  });

  it('renders with default animation direction when no custom animation direction provided', () => {
    render(
      <PageTransition>
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).not.toHaveClass('alternate');
  });

  it('renders with custom animation fill mode', () => {
    render(
      <PageTransition animationFillMode="forwards">
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).toHaveClass('forwards');
  });

  it('renders with default animation fill mode when no custom animation fill mode provided', () => {
    render(
      <PageTransition>
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).not.toHaveClass('forwards');
  });

  it('renders with custom animation play state', () => {
    render(
      <PageTransition animationPlayState="paused">
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).toHaveClass('paused');
  });

  it('renders with default animation play state when no custom animation play state provided', () => {
    render(
      <PageTransition>
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).not.toHaveClass('paused');
  });

  it('renders with custom animation name', () => {
    render(
      <PageTransition animationName="custom-animation">
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).toHaveClass('custom-animation');
  });

  it('renders with default animation name when no custom animation name provided', () => {
    render(
      <PageTransition>
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).not.toHaveClass('custom-animation');
  });

  it('renders with custom animation keyframes', () => {
    render(
      <PageTransition animationKeyframes="custom-keyframes">
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).toHaveClass('custom-keyframes');
  });

  it('renders with default animation keyframes when no custom animation keyframes provided', () => {
    render(
      <PageTransition>
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).not.toHaveClass('custom-keyframes');
  });

  it('renders with custom animation transform', () => {
    render(
      <PageTransition animationTransform="rotate-180">
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).toHaveClass('rotate-180');
  });

  it('renders with default animation transform when no custom animation transform provided', () => {
    render(
      <PageTransition>
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).not.toHaveClass('rotate-180');
  });

  it('renders with custom animation scale', () => {
    render(
      <PageTransition animationScale="scale-110">
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).toHaveClass('scale-110');
  });

  it('renders with default animation scale when no custom animation scale provided', () => {
    render(
      <PageTransition>
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).not.toHaveClass('scale-110');
  });

  it('renders with custom animation translate', () => {
    render(
      <PageTransition animationTranslate="translate-x-1">
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).toHaveClass('translate-x-1');
  });

  it('renders with default animation translate when no custom animation translate provided', () => {
    render(
      <PageTransition>
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).not.toHaveClass('translate-x-1');
  });

  it('renders with custom animation skew', () => {
    render(
      <PageTransition animationSkew="skew-x-1">
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).toHaveClass('skew-x-1');
  });

  it('renders with default animation skew when no custom animation skew provided', () => {
    render(
      <PageTransition>
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).not.toHaveClass('skew-x-1');
  });

  it('renders with custom animation perspective', () => {
    render(
      <PageTransition animationPerspective="perspective-1000">
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).toHaveClass('perspective-1000');
  });

  it('renders with default animation perspective when no custom animation perspective provided', () => {
    render(
      <PageTransition>
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).not.toHaveClass('perspective-1000');
  });

  it('renders with custom animation origin', () => {
    render(
      <PageTransition animationOrigin="origin-center">
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).toHaveClass('origin-center');
  });

  it('renders with default animation origin when no custom animation origin provided', () => {
    render(
      <PageTransition>
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).not.toHaveClass('origin-center');
  });

  it('renders with custom animation backface visibility', () => {
    render(
      <PageTransition animationBackfaceVisibility="backface-visible">
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).toHaveClass('backface-visible');
  });

  it('renders with default animation backface visibility when no custom animation backface visibility provided', () => {
    render(
      <PageTransition>
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).not.toHaveClass('backface-visible');
  });

  it('renders with custom animation transform style', () => {
    render(
      <PageTransition animationTransformStyle="preserve-3d">
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).toHaveClass('preserve-3d');
  });

  it('renders with default animation transform style when no custom animation transform style provided', () => {
    render(
      <PageTransition>
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).not.toHaveClass('preserve-3d');
  });

  it('renders with custom animation transform box', () => {
    render(
      <PageTransition animationTransformBox="fill-box">
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).toHaveClass('fill-box');
  });

  it('renders with default animation transform box when no custom animation transform box provided', () => {
    render(
      <PageTransition>
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).not.toHaveClass('fill-box');
  });

  it('renders with custom animation transform origin', () => {
    render(
      <PageTransition animationTransformOrigin="origin-center">
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).toHaveClass('origin-center');
  });

  it('renders with default animation transform origin when no custom animation transform origin provided', () => {
    render(
      <PageTransition>
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).not.toHaveClass('origin-center');
  });

  it('renders with custom animation transform perspective', () => {
    render(
      <PageTransition animationTransformPerspective="perspective-1000">
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).toHaveClass('perspective-1000');
  });

  it('renders with default animation transform perspective when no custom animation transform perspective provided', () => {
    render(
      <PageTransition>
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).not.toHaveClass('perspective-1000');
  });

  it('renders with custom animation transform scale', () => {
    render(
      <PageTransition animationTransformScale="scale-110">
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).toHaveClass('scale-110');
  });

  it('renders with default animation transform scale when no custom animation transform scale provided', () => {
    render(
      <PageTransition>
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).not.toHaveClass('scale-110');
  });

  it('renders with custom animation transform translate', () => {
    render(
      <PageTransition animationTransformTranslate="translate-x-1">
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).toHaveClass('translate-x-1');
  });

  it('renders with default animation transform translate when no custom animation transform translate provided', () => {
    render(
      <PageTransition>
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).not.toHaveClass('translate-x-1');
  });

  it('renders with custom animation transform rotate', () => {
    render(
      <PageTransition animationTransformRotate="rotate-180">
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).toHaveClass('rotate-180');
  });

  it('renders with default animation transform rotate when no custom animation transform rotate provided', () => {
    render(
      <PageTransition>
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).not.toHaveClass('rotate-180');
  });

  it('renders with custom animation transform skew', () => {
    render(
      <PageTransition animationTransformSkew="skew-x-1">
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).toHaveClass('skew-x-1');
  });

  it('renders with default animation transform skew when no custom animation transform skew provided', () => {
    render(
      <PageTransition>
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).not.toHaveClass('skew-x-1');
  });

  it('renders with custom animation transform matrix', () => {
    render(
      <PageTransition animationTransformMatrix="matrix-1">
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).toHaveClass('matrix-1');
  });

  it('renders with default animation transform matrix when no custom animation transform matrix provided', () => {
    render(
      <PageTransition>
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).not.toHaveClass('matrix-1');
  });

  it('renders with custom animation transform translate3d', () => {
    render(
      <PageTransition animationTransformTranslate3d="translate3d-1">
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).toHaveClass('translate3d-1');
  });

  it('renders with default animation transform translate3d when no custom animation transform translate3d provided', () => {
    render(
      <PageTransition>
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).not.toHaveClass('translate3d-1');
  });

  it('renders with custom animation transform scale3d', () => {
    render(
      <PageTransition animationTransformScale3d="scale3d-1">
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).toHaveClass('scale3d-1');
  });

  it('renders with default animation transform scale3d when no custom animation transform scale3d provided', () => {
    render(
      <PageTransition>
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).not.toHaveClass('scale3d-1');
  });

  it('renders with custom animation transform rotate3d', () => {
    render(
      <PageTransition animationTransformRotate3d="rotate3d-1">
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).toHaveClass('rotate3d-1');
  });

  it('renders with default animation transform rotate3d when no custom animation transform rotate3d provided', () => {
    render(
      <PageTransition>
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).not.toHaveClass('rotate3d-1');
  });

  it('renders with custom animation transform perspective3d', () => {
    render(
      <PageTransition animationTransformPerspective3d="perspective3d-1">
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).toHaveClass('perspective3d-1');
  });

  it('renders with default animation transform perspective3d when no custom animation transform perspective3d provided', () => {
    render(
      <PageTransition>
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).not.toHaveClass('perspective3d-1');
  });

  it('renders with custom animation transform matrix3d', () => {
    render(
      <PageTransition animationTransformMatrix3d="matrix3d-1">
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).toHaveClass('matrix3d-1');
  });

  it('renders with default animation transform matrix3d when no custom animation transform matrix3d provided', () => {
    render(
      <PageTransition>
        <div>Test content</div>
      </PageTransition>
    );
    expect(screen.getByTestId('page-transition-content')).not.toHaveClass('matrix3d-1');
  });
}); 