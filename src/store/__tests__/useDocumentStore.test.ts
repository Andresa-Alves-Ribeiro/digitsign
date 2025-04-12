import { renderHook, act } from '@testing-library/react';
import useDocumentStore from '../useDocumentStore';
import { Document } from '@prisma/client';

describe('useDocumentStore', () => {
  const mockDocument: Document = {
    id: '1',
    name: 'Test Document',
    size: 1024,
    status: 'PENDING',
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: '1',
    fileUrl: 'test.pdf',
    mimeType: 'application/pdf'
  };

  const mockDocument2: Document = {
    ...mockDocument,
    id: '2',
    name: 'Test Document 2'
  };

  beforeEach(() => {
    const { result } = renderHook(() => useDocumentStore());
    act(() => {
      result.current.setDocuments([]);
      result.current.setLoading(false);
      result.current.setError(null);
    });
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useDocumentStore());
    expect(result.current.documents).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should set documents', () => {
    const { result } = renderHook(() => useDocumentStore());
    act(() => {
      result.current.setDocuments([mockDocument]);
    });
    expect(result.current.documents).toEqual([mockDocument]);
  });

  it('should add a document', () => {
    const { result } = renderHook(() => useDocumentStore());
    act(() => {
      result.current.addDocument(mockDocument);
    });
    expect(result.current.documents).toEqual([mockDocument]);
  });

  it('should add multiple documents', () => {
    const { result } = renderHook(() => useDocumentStore());
    act(() => {
      result.current.addDocument(mockDocument);
      result.current.addDocument(mockDocument2);
    });
    expect(result.current.documents).toEqual([mockDocument, mockDocument2]);
  });

  it('should update a document', () => {
    const { result } = renderHook(() => useDocumentStore());
    const updatedName = 'Updated Document';

    act(() => {
      result.current.setDocuments([mockDocument]);
      result.current.updateDocument(mockDocument.id, { name: updatedName });
    });

    expect(result.current.documents[0].name).toBe(updatedName);
  });

  it('should remove a document', () => {
    const { result } = renderHook(() => useDocumentStore());
    act(() => {
      result.current.setDocuments([mockDocument, mockDocument2]);
      result.current.removeDocument(mockDocument.id);
    });
    expect(result.current.documents).toEqual([mockDocument2]);
  });

  it('should set loading state', () => {
    const { result } = renderHook(() => useDocumentStore());
    act(() => {
      result.current.setLoading(true);
    });
    expect(result.current.loading).toBe(true);
  });

  it('should set error state', () => {
    const { result } = renderHook(() => useDocumentStore());
    const errorMessage = 'Test error';
    act(() => {
      result.current.setError(errorMessage);
    });
    expect(result.current.error).toBe(errorMessage);
  });
}); 