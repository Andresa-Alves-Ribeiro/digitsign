import { renderHook, act } from '@testing-library/react';
import { useDocuments } from '@/hooks/useDocuments';
import { api } from '@/services/api';

// Mock da API
jest.mock('@/services/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('useDocuments', () => {
  const mockDocuments = [
    {
      id: '1',
      title: 'Test Document 1',
      description: 'Test Description 1',
      status: 'pending',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Test Document 2',
      description: 'Test Description 2',
      status: 'signed',
      createdAt: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches documents successfully', async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({ data: mockDocuments });

    const { result } = renderHook(() => useDocuments());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe(null);

    await act(async () => {
      await result.current.fetchDocuments();
    });

    expect(result.current.documents).toEqual(mockDocuments);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('handles error when fetching documents', async () => {
    const error = new Error('Failed to fetch documents');
    (api.get as jest.Mock).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useDocuments());

    await act(async () => {
      await result.current.fetchDocuments();
    });

    expect(result.current.documents).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toEqual(error);
  });

  it('creates a new document', async () => {
    const newDocument = {
      title: 'New Document',
      description: 'New Description',
    };
    (api.post as jest.Mock).mockResolvedValueOnce({ data: { ...newDocument, id: '3' } });

    const { result } = renderHook(() => useDocuments());

    await act(async () => {
      await result.current.createDocument(newDocument);
    });

    expect(api.post).toHaveBeenCalledWith('/documents', newDocument);
  });

  it('deletes a document', async () => {
    const documentId = '1';
    (api.delete as jest.Mock).mockResolvedValueOnce({ data: null });

    const { result } = renderHook(() => useDocuments());

    await act(async () => {
      await result.current.deleteDocument(documentId);
    });

    expect(api.delete).toHaveBeenCalledWith(`/documents/${documentId}`);
  });
}); 