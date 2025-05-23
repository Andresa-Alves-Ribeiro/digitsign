import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import { useDocumentStore } from '@/store/useDocumentStore';
import DocumentTable from '@/components/documents/DocumentTable';

// Mock do useRouter
jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));

// Mock do useDocumentStore
jest.mock('@/store/useDocumentStore', () => ({
  useDocumentStore: jest.fn()
}));

describe('DocumentTable', () => {
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

  it('should render the document table with documents', () => {
    render(<DocumentTable documents={mockDocuments} />);

    // Verificar se os documentos são renderizados
    expect(screen.getByText('Documento 1')).toBeInTheDocument();
    expect(screen.getByText('Documento 2')).toBeInTheDocument();
    expect(screen.getByText('Documento 3')).toBeInTheDocument();

    // Verificar se os status são renderizados
    expect(screen.getByText('PENDING')).toBeInTheDocument();
    expect(screen.getByText('SIGNED')).toBeInTheDocument();
  });

  it('should render empty state when no documents are provided', () => {
    render(<DocumentTable documents={[]} />);

    expect(screen.getByText('Nenhum documento encontrado')).toBeInTheDocument();
  });

  it('should render loading state when isLoading is true', () => {
    render(<DocumentTable documents={[]} isLoading={true} />);

    expect(screen.getByText('Carregando documentos...')).toBeInTheDocument();
  });

  it('should render error state when error is provided', () => {
    render(<DocumentTable documents={[]} error="Erro ao carregar documentos" />);

    expect(screen.getByText('Erro ao carregar documentos')).toBeInTheDocument();
  });

  it('should navigate to document details when clicking on a document', () => {
    render(<DocumentTable documents={mockDocuments} />);

    fireEvent.click(screen.getByText('Documento 1'));

    expect(mockRouter.push).toHaveBeenCalledWith('/1');
  });

  it('should update document status when clicking on status change button', async () => {
    render(<DocumentTable documents={mockDocuments} />);

    // Encontrar o botão de mudança de status para o primeiro documento
    const statusButton = screen.getAllByRole('button', { name: /mudar status/i })[0];
    
    fireEvent.click(statusButton);

    // Verificar se o modal de confirmação é exibido
    expect(screen.getByText('Confirmar mudança de status')).toBeInTheDocument();
    
    // Confirmar a mudança de status
    fireEvent.click(screen.getByText('Confirmar'));

    // Verificar se a função de atualização foi chamada
    expect(mockUpdateDocumentStatus).toHaveBeenCalledWith('1', 'SIGNED');

    // Verificar se o modal foi fechado
    await waitFor(() => {
      expect(screen.queryByText('Confirmar mudança de status')).not.toBeInTheDocument();
    });
  });

  it('should cancel status change when clicking on cancel button', () => {
    render(<DocumentTable documents={mockDocuments} />);

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

  it('should sort documents by date when clicking on sort button', () => {
    render(<DocumentTable documents={mockDocuments} />);

    // Encontrar o botão de ordenação
    const sortButton = screen.getByRole('button', { name: /ordenar por data/i });
    
    // Ordenar por data (crescente)
    fireEvent.click(sortButton);
    
    // Verificar se os documentos estão ordenados por data (crescente)
    const documentRows = screen.getAllByRole('row');
    expect(documentRows[1]).toHaveTextContent('Documento 1');
    expect(documentRows[2]).toHaveTextContent('Documento 2');
    expect(documentRows[3]).toHaveTextContent('Documento 3');
    
    // Ordenar por data (decrescente)
    fireEvent.click(sortButton);
    
    // Verificar se os documentos estão ordenados por data (decrescente)
    const documentRowsDesc = screen.getAllByRole('row');
    expect(documentRowsDesc[1]).toHaveTextContent('Documento 3');
    expect(documentRowsDesc[2]).toHaveTextContent('Documento 2');
    expect(documentRowsDesc[3]).toHaveTextContent('Documento 1');
  });

  it('should filter documents by status when selecting a status filter', () => {
    render(<DocumentTable documents={mockDocuments} />);

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
    render(<DocumentTable documents={mockDocuments} />);

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
}); 