import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/router';
import { useDocumentStore } from '@/store/useDocumentStore';
import DocumentCards from '@/components/documents/DocumentCards';

// Mock do useRouter
jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));

// Mock do useDocumentStore
jest.mock('@/store/useDocumentStore', () => ({
  useDocumentStore: jest.fn()
}));

describe('DocumentCards', () => {
  const mockRouter = {
    push: jest.fn()
  };

  const mockDocuments = [
    {
      id: '1',
      name: 'Documento 1',
      status: 'PENDING',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
      userId: 'user1'
    },
    {
      id: '2',
      name: 'Documento 2',
      status: 'SIGNED',
      createdAt: new Date('2023-01-02'),
      updatedAt: new Date('2023-01-03'),
      userId: 'user1'
    },
    {
      id: '3',
      name: 'Documento 3',
      status: 'PENDING',
      createdAt: new Date('2023-01-03'),
      updatedAt: new Date('2023-01-03'),
      userId: 'user1'
    }
  ];

  const mockUpdateDocumentStatus = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useDocumentStore as jest.Mock).mockReturnValue({
      updateDocumentStatus: mockUpdateDocumentStatus
    });
  });

  it('should render the document cards with documents', () => {
    render(<DocumentCards documents={mockDocuments} />);

    // Verificar se os documentos são renderizados
    expect(screen.getByText('Documento 1')).toBeInTheDocument();
    expect(screen.getByText('Documento 2')).toBeInTheDocument();
    expect(screen.getByText('Documento 3')).toBeInTheDocument();

    // Verificar se os status são renderizados
    expect(screen.getByText('PENDING')).toBeInTheDocument();
    expect(screen.getByText('SIGNED')).toBeInTheDocument();
  });

  it('should render empty state when no documents are provided', () => {
    render(<DocumentCards documents={[]} />);

    expect(screen.getByText('Nenhum documento encontrado')).toBeInTheDocument();
  });

  it('should render loading state when isLoading is true', () => {
    render(<DocumentCards documents={[]} isLoading={true} />);

    expect(screen.getByText('Carregando documentos...')).toBeInTheDocument();
  });

  it('should render error state when error is provided', () => {
    render(<DocumentCards documents={[]} error="Erro ao carregar documentos" />);

    expect(screen.getByText('Erro ao carregar documentos')).toBeInTheDocument();
  });

  it('should navigate to document details when clicking on a document card', () => {
    render(<DocumentCards documents={mockDocuments} />);

    fireEvent.click(screen.getByText('Documento 1'));

    expect(mockRouter.push).toHaveBeenCalledWith('/1');
  });

  it('should update document status when clicking on status change button', () => {
    render(<DocumentCards documents={mockDocuments} />);

    // Encontrar o botão de mudança de status para o primeiro documento
    const statusButton = screen.getAllByRole('button', { name: /mudar status/i })[0];
    
    fireEvent.click(statusButton);

    // Verificar se o modal de confirmação é exibido
    expect(screen.getByText('Confirmar mudança de status')).toBeInTheDocument();
    
    // Confirmar a mudança de status
    fireEvent.click(screen.getByText('Confirmar'));

    // Verificar se a função de atualização foi chamada
    expect(mockUpdateDocumentStatus).toHaveBeenCalledWith('1', 'SIGNED');
  });

  it('should cancel status change when clicking on cancel button', () => {
    render(<DocumentCards documents={mockDocuments} />);

    // Encontrar o botão de mudança de status para o primeiro documento
    const statusButton = screen.getAllByRole('button', { name: /mudar status/i })[0];
    
    fireEvent.click(statusButton);

    // Verificar se o modal de confirmação é exibido
    expect(screen.getByText('Confirmar mudança de status')).toBeInTheDocument();
    
    // Cancelar a mudança de status
    fireEvent.click(screen.getByText('Cancelar'));

    // Verificar se o modal foi fechado
    expect(screen.queryByText('Confirmar mudança de status')).not.toBeInTheDocument();
    
    // Verificar se a função de atualização não foi chamada
    expect(mockUpdateDocumentStatus).not.toHaveBeenCalled();
  });

  it('should filter documents by status when selecting a status filter', () => {
    render(<DocumentCards documents={mockDocuments} />);

    // Encontrar o seletor de filtro de status
    const statusFilter = screen.getByRole('combobox', { name: /filtrar por status/i });
    
    // Filtrar por status PENDING
    fireEvent.change(statusFilter, { target: { value: 'PENDING' } });
    
    // Verificar se apenas os documentos com status PENDING são exibidos
    expect(screen.getByText('Documento 1')).toBeInTheDocument();
    expect(screen.getByText('Documento 3')).toBeInTheDocument();
    expect(screen.queryByText('Documento 2')).not.toBeInTheDocument();
    
    // Filtrar por status SIGNED
    fireEvent.change(statusFilter, { target: { value: 'SIGNED' } });
    
    // Verificar se apenas os documentos com status SIGNED são exibidos
    expect(screen.queryByText('Documento 1')).not.toBeInTheDocument();
    expect(screen.getByText('Documento 2')).toBeInTheDocument();
    expect(screen.queryByText('Documento 3')).not.toBeInTheDocument();
    
    // Remover o filtro
    fireEvent.change(statusFilter, { target: { value: '' } });
    
    // Verificar se todos os documentos são exibidos
    expect(screen.getByText('Documento 1')).toBeInTheDocument();
    expect(screen.getByText('Documento 2')).toBeInTheDocument();
    expect(screen.getByText('Documento 3')).toBeInTheDocument();
  });

  it('should search documents by name when typing in the search input', () => {
    render(<DocumentCards documents={mockDocuments} />);

    // Encontrar o campo de busca
    const searchInput = screen.getByPlaceholderText(/buscar documentos/i);
    
    // Buscar por "Documento 1"
    fireEvent.change(searchInput, { target: { value: 'Documento 1' } });
    
    // Verificar se apenas o documento com o nome "Documento 1" é exibido
    expect(screen.getByText('Documento 1')).toBeInTheDocument();
    expect(screen.queryByText('Documento 2')).not.toBeInTheDocument();
    expect(screen.queryByText('Documento 3')).not.toBeInTheDocument();
    
    // Buscar por "Documento"
    fireEvent.change(searchInput, { target: { value: 'Documento' } });
    
    // Verificar se todos os documentos são exibidos
    expect(screen.getByText('Documento 1')).toBeInTheDocument();
    expect(screen.getByText('Documento 2')).toBeInTheDocument();
    expect(screen.getByText('Documento 3')).toBeInTheDocument();
  });

  it('should display document creation date', () => {
    render(<DocumentCards documents={mockDocuments} />);

    // Verificar se as datas de criação são exibidas
    expect(screen.getByText(/01\/01\/2023/i)).toBeInTheDocument();
    expect(screen.getByText(/02\/01\/2023/i)).toBeInTheDocument();
    expect(screen.getByText(/03\/01\/2023/i)).toBeInTheDocument();
  });

  it('should display document update date', () => {
    render(<DocumentCards documents={mockDocuments} />);

    // Verificar se as datas de atualização são exibidas
    expect(screen.getByText(/01\/01\/2023/i)).toBeInTheDocument();
    expect(screen.getByText(/03\/01\/2023/i)).toBeInTheDocument();
  });
}); 