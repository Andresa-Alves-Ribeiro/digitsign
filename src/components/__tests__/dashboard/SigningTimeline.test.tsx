import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SigningTimeline from '@/components/dashboard/SigningTimeline';
import { useRouter } from 'next/router';

// Mock do useRouter
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('SigningTimeline', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  const mockSignings = [
    {
      id: '1',
      documentId: 'doc1',
      documentName: 'Documento 1',
      status: 'PENDING',
      createdAt: new Date('2024-04-23T10:00:00Z'),
      updatedAt: new Date('2024-04-23T10:00:00Z'),
      userId: 'user1',
      userName: 'Usuário 1',
      signatureDate: null,
    },
    {
      id: '2',
      documentId: 'doc2',
      documentName: 'Documento 2',
      status: 'SIGNED',
      createdAt: new Date('2024-04-23T09:00:00Z'),
      updatedAt: new Date('2024-04-23T09:30:00Z'),
      userId: 'user2',
      userName: 'Usuário 2',
      signatureDate: new Date('2024-04-23T09:30:00Z'),
    },
    {
      id: '3',
      documentId: 'doc3',
      documentName: 'Documento 3',
      status: 'REJECTED',
      createdAt: new Date('2024-04-23T08:00:00Z'),
      updatedAt: new Date('2024-04-23T08:15:00Z'),
      userId: 'user1',
      userName: 'Usuário 1',
      signatureDate: null,
    },
  ];

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('should render signing timeline with signings', () => {
    render(<SigningTimeline signings={mockSignings} />);
    
    expect(screen.getByText('Documento 1')).toBeInTheDocument();
    expect(screen.getByText('Documento 2')).toBeInTheDocument();
    expect(screen.getByText('Documento 3')).toBeInTheDocument();
  });

  it('should render empty state when no signings', () => {
    render(<SigningTimeline signings={[]} />);
    
    expect(screen.getByText('Nenhuma assinatura pendente')).toBeInTheDocument();
  });

  it('should render loading state', () => {
    render(<SigningTimeline signings={[]} isLoading={true} />);
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('should render error state', () => {
    render(<SigningTimeline signings={[]} error="Erro ao carregar assinaturas" />);
    
    expect(screen.getByText('Erro ao carregar assinaturas')).toBeInTheDocument();
  });

  it('should navigate to document when clicking on signing', () => {
    render(<SigningTimeline signings={mockSignings} />);
    
    fireEvent.click(screen.getByText('Documento 1'));
    expect(mockRouter.push).toHaveBeenCalledWith('/documents/doc1');
  });

  it('should display signing status icons', () => {
    render(<SigningTimeline signings={mockSignings} />);
    
    expect(screen.getByTestId('pending-icon')).toBeInTheDocument();
    expect(screen.getByTestId('signed-icon')).toBeInTheDocument();
    expect(screen.getByTestId('rejected-icon')).toBeInTheDocument();
  });

  it('should display signing timestamps', () => {
    render(<SigningTimeline signings={mockSignings} />);
    
    expect(screen.getByText('10:00')).toBeInTheDocument();
    expect(screen.getByText('09:00')).toBeInTheDocument();
    expect(screen.getByText('08:00')).toBeInTheDocument();
  });

  it('should display user names', () => {
    render(<SigningTimeline signings={mockSignings} />);
    
    expect(screen.getByText('Usuário 1')).toBeInTheDocument();
    expect(screen.getByText('Usuário 2')).toBeInTheDocument();
  });

  it('should filter signings by status', () => {
    render(<SigningTimeline signings={mockSignings} />);
    
    const filterButton = screen.getByText('Todos');
    fireEvent.click(filterButton);
    
    const filterOptions = screen.getAllByRole('button');
    expect(filterOptions).toHaveLength(4); // Todos, Pendentes, Assinados, Rejeitados
  });

  it('should filter signings by user', () => {
    render(<SigningTimeline signings={mockSignings} />);
    
    const userFilter = screen.getByPlaceholderText('Filtrar por usuário');
    fireEvent.change(userFilter, { target: { value: 'Usuário 1' } });
    
    expect(screen.queryByText('Usuário 2')).not.toBeInTheDocument();
    expect(screen.getAllByText('Usuário 1')).toHaveLength(2);
  });

  it('should sort signings by date', () => {
    render(<SigningTimeline signings={mockSignings} />);
    
    const sortButton = screen.getByText('Mais recentes');
    fireEvent.click(sortButton);
    
    const signings = screen.getAllByTestId('signing-item');
    expect(signings[0]).toHaveTextContent('10:00');
    expect(signings[1]).toHaveTextContent('09:00');
    expect(signings[2]).toHaveTextContent('08:00');
  });

  it('should limit number of displayed signings', () => {
    render(<SigningTimeline signings={mockSignings} limit={2} />);
    
    expect(screen.getByText('Documento 1')).toBeInTheDocument();
    expect(screen.getByText('Documento 2')).toBeInTheDocument();
    expect(screen.queryByText('Documento 3')).not.toBeInTheDocument();
  });

  it('should show "Ver mais" button when there are more signings', () => {
    render(<SigningTimeline signings={mockSignings} limit={2} />);
    
    expect(screen.getByText('Ver mais')).toBeInTheDocument();
  });

  it('should load more signings when clicking "Ver mais"', () => {
    const onLoadMore = jest.fn();
    render(<SigningTimeline signings={mockSignings} limit={2} onLoadMore={onLoadMore} />);
    
    fireEvent.click(screen.getByText('Ver mais'));
    expect(onLoadMore).toHaveBeenCalled();
  });

  it('should display signature date for signed documents', () => {
    render(<SigningTimeline signings={mockSignings} />);
    
    expect(screen.getByText('Assinado em: 23/04/2024 09:30')).toBeInTheDocument();
  });

  it('should display rejection date for rejected documents', () => {
    render(<SigningTimeline signings={mockSignings} />);
    
    expect(screen.getByText('Rejeitado em: 23/04/2024 08:15')).toBeInTheDocument();
  });

  it('should display pending status for pending documents', () => {
    render(<SigningTimeline signings={mockSignings} />);
    
    expect(screen.getByText('Pendente')).toBeInTheDocument();
  });

  it('should display document creation date', () => {
    render(<SigningTimeline signings={mockSignings} />);
    
    expect(screen.getByText('Criado em: 23/04/2024 10:00')).toBeInTheDocument();
    expect(screen.getByText('Criado em: 23/04/2024 09:00')).toBeInTheDocument();
    expect(screen.getByText('Criado em: 23/04/2024 08:00')).toBeInTheDocument();
  });

  it('should display document update date', () => {
    render(<SigningTimeline signings={mockSignings} />);
    
    expect(screen.getByText('Atualizado em: 23/04/2024 10:00')).toBeInTheDocument();
    expect(screen.getByText('Atualizado em: 23/04/2024 09:30')).toBeInTheDocument();
    expect(screen.getByText('Atualizado em: 23/04/2024 08:15')).toBeInTheDocument();
  });
}); 