import React from 'react';
import { render, screen } from '@testing-library/react';
import StatCard from '@/components/dashboard/StatCard';
import { DocumentIcon } from '@/assets/icons';

describe('StatCard', () => {
  it('should render stat card with title and value', () => {
    render(
      <StatCard
        title="Total de Documentos"
        value={42}
        icon={DocumentIcon}
        iconColor="text-blue-500"
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
        icon={DocumentIcon}
        iconColor="text-blue-500"
      />
    );
    
    expect(screen.getByTestId('document-icon')).toBeInTheDocument();
  });

  it('should render stat card with custom value color', () => {
    render(
      <StatCard
        title="Total de Documentos"
        value={42}
        icon={DocumentIcon}
        iconColor="text-blue-500"
        valueColor="text-green-500"
      />
    );
    
    const value = screen.getByText('42');
    expect(value).toHaveClass('text-green-500');
  });

  it('should render stat card with custom percentage color', () => {
    render(
      <StatCard
        title="Total de Documentos"
        value={42}
        total={100}
        icon={DocumentIcon}
        iconColor="text-blue-500"
        percentageColor="text-purple-500"
      />
    );
    
    const percentage = screen.getByText('42%');
    expect(percentage).toHaveClass('text-purple-500');
  });

  it('should render stat card with description', () => {
    render(
      <StatCard
        title="Total de Documentos"
        value={42}
        icon={DocumentIcon}
        iconColor="text-blue-500"
        description="Documentos assinados este mês"
      />
    );
    
    expect(screen.getByText('Documentos assinados este mês')).toBeInTheDocument();
  });

  it('should render stat card with button', () => {
    render(
      <StatCard
        title="Total de Documentos"
        value={42}
        icon={DocumentIcon}
        iconColor="text-blue-500"
        buttonText="Ver todos"
        buttonColor="bg-blue-500"
        buttonHoverColor="hover:bg-blue-600"
        href="/documents"
      />
    );
    
    expect(screen.getByText('Ver todos')).toBeInTheDocument();
  });

  it('should render stat card as action card', () => {
    render(
      <StatCard
        title="Total de Documentos"
        value={42}
        icon={DocumentIcon}
        iconColor="text-blue-500"
        isActionCard={true}
      />
    );
    
    const card = screen.getByTestId('stat-card');
    expect(card).toHaveClass('bg-white', 'dark:bg-component-bg-dark', 'overflow-hidden', 'rounded-xl', 'shadow-sm', 'hover:shadow-md', 'transition-all', 'duration-200', 'border', 'border-neutral-100', 'dark:border-neutral-700', 'h-full');
  });
}); 