import React from 'react';
import { render, screen } from '@testing-library/react';
import StatCard from '@/components/dashboard/StatCard';

describe('StatCard', () => {
  it('should render stat card with title and value', () => {
    render(
      <StatCard
        title="Total de Documentos"
        value={42}
        icon="document"
      />
    );
    
    expect(screen.getByText('Total de Documentos')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('should render stat card with icon', () => {
    render(
      <StatCard
        title="Total de Documentos"
        value={42}
        icon="document"
      />
    );
    
    expect(screen.getByTestId('document-icon')).toBeInTheDocument();
  });

  it('should render stat card with trend up', () => {
    render(
      <StatCard
        title="Total de Documentos"
        value={42}
        icon="document"
        trend="up"
        trendValue={10}
      />
    );
    
    expect(screen.getByTestId('trend-up-icon')).toBeInTheDocument();
    expect(screen.getByText('+10%')).toBeInTheDocument();
  });

  it('should render stat card with trend down', () => {
    render(
      <StatCard
        title="Total de Documentos"
        value={42}
        icon="document"
        trend="down"
        trendValue={5}
      />
    );
    
    expect(screen.getByTestId('trend-down-icon')).toBeInTheDocument();
    expect(screen.getByText('-5%')).toBeInTheDocument();
  });

  it('should render stat card with trend neutral', () => {
    render(
      <StatCard
        title="Total de Documentos"
        value={42}
        icon="document"
        trend="neutral"
        trendValue={0}
      />
    );
    
    expect(screen.getByTestId('trend-neutral-icon')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('should render stat card with custom class', () => {
    render(
      <StatCard
        title="Total de Documentos"
        value={42}
        icon="document"
        className="custom-class"
      />
    );
    
    const card = screen.getByTestId('stat-card');
    expect(card).toHaveClass('custom-class');
  });

  it('should render stat card with custom icon color', () => {
    render(
      <StatCard
        title="Total de Documentos"
        value={42}
        icon="document"
        iconColor="text-blue-500"
      />
    );
    
    const icon = screen.getByTestId('document-icon');
    expect(icon).toHaveClass('text-blue-500');
  });

  it('should render stat card with custom value color', () => {
    render(
      <StatCard
        title="Total de Documentos"
        value={42}
        icon="document"
        valueColor="text-green-500"
      />
    );
    
    const value = screen.getByText('42');
    expect(value).toHaveClass('text-green-500');
  });

  it('should render stat card with custom title color', () => {
    render(
      <StatCard
        title="Total de Documentos"
        value={42}
        icon="document"
        titleColor="text-gray-500"
      />
    );
    
    const title = screen.getByText('Total de Documentos');
    expect(title).toHaveClass('text-gray-500');
  });

  it('should render stat card with custom trend color', () => {
    render(
      <StatCard
        title="Total de Documentos"
        value={42}
        icon="document"
        trend="up"
        trendValue={10}
        trendColor="text-purple-500"
      />
    );
    
    const trend = screen.getByText('+10%');
    expect(trend).toHaveClass('text-purple-500');
  });

  it('should render stat card with custom background color', () => {
    render(
      <StatCard
        title="Total de Documentos"
        value={42}
        icon="document"
        bgColor="bg-gray-100"
      />
    );
    
    const card = screen.getByTestId('stat-card');
    expect(card).toHaveClass('bg-gray-100');
  });

  it('should render stat card with custom border color', () => {
    render(
      <StatCard
        title="Total de Documentos"
        value={42}
        icon="document"
        borderColor="border-blue-500"
      />
    );
    
    const card = screen.getByTestId('stat-card');
    expect(card).toHaveClass('border-blue-500');
  });

  it('should render stat card with custom shadow', () => {
    render(
      <StatCard
        title="Total de Documentos"
        value={42}
        icon="document"
        shadow="shadow-lg"
      />
    );
    
    const card = screen.getByTestId('stat-card');
    expect(card).toHaveClass('shadow-lg');
  });

  it('should render stat card with custom padding', () => {
    render(
      <StatCard
        title="Total de Documentos"
        value={42}
        icon="document"
        padding="p-6"
      />
    );
    
    const card = screen.getByTestId('stat-card');
    expect(card).toHaveClass('p-6');
  });

  it('should render stat card with custom margin', () => {
    render(
      <StatCard
        title="Total de Documentos"
        value={42}
        icon="document"
        margin="m-4"
      />
    );
    
    const card = screen.getByTestId('stat-card');
    expect(card).toHaveClass('m-4');
  });

  it('should render stat card with custom width', () => {
    render(
      <StatCard
        title="Total de Documentos"
        value={42}
        icon="document"
        width="w-64"
      />
    );
    
    const card = screen.getByTestId('stat-card');
    expect(card).toHaveClass('w-64');
  });

  it('should render stat card with custom height', () => {
    render(
      <StatCard
        title="Total de Documentos"
        value={42}
        icon="document"
        height="h-32"
      />
    );
    
    const card = screen.getByTestId('stat-card');
    expect(card).toHaveClass('h-32');
  });

  it('should render stat card with custom rounded corners', () => {
    render(
      <StatCard
        title="Total de Documentos"
        value={42}
        icon="document"
        rounded="rounded-xl"
      />
    );
    
    const card = screen.getByTestId('stat-card');
    expect(card).toHaveClass('rounded-xl');
  });

  it('should render stat card with custom opacity', () => {
    render(
      <StatCard
        title="Total de Documentos"
        value={42}
        icon="document"
        opacity="opacity-75"
      />
    );
    
    const card = screen.getByTestId('stat-card');
    expect(card).toHaveClass('opacity-75');
  });

  it('should render stat card with custom transition', () => {
    render(
      <StatCard
        title="Total de Documentos"
        value={42}
        icon="document"
        transition="transition-transform duration-300"
      />
    );
    
    const card = screen.getByTestId('stat-card');
    expect(card).toHaveClass('transition-transform', 'duration-300');
  });

  it('should render stat card with custom hover effect', () => {
    render(
      <StatCard
        title="Total de Documentos"
        value={42}
        icon="document"
        hover="hover:scale-105"
      />
    );
    
    const card = screen.getByTestId('stat-card');
    expect(card).toHaveClass('hover:scale-105');
  });

  it('should render stat card with custom focus effect', () => {
    render(
      <StatCard
        title="Total de Documentos"
        value={42}
        icon="document"
        focus="focus:ring-2 focus:ring-blue-500"
      />
    );
    
    const card = screen.getByTestId('stat-card');
    expect(card).toHaveClass('focus:ring-2', 'focus:ring-blue-500');
  });

  it('should render stat card with custom active effect', () => {
    render(
      <StatCard
        title="Total de Documentos"
        value={42}
        icon="document"
        active="active:scale-95"
      />
    );
    
    const card = screen.getByTestId('stat-card');
    expect(card).toHaveClass('active:scale-95');
  });

  it('should render stat card with custom disabled effect', () => {
    render(
      <StatCard
        title="Total de Documentos"
        value={42}
        icon="document"
        disabled="disabled:opacity-50"
      />
    );
    
    const card = screen.getByTestId('stat-card');
    expect(card).toHaveClass('disabled:opacity-50');
  });
}); 