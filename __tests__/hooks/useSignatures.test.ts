import { renderHook, act } from '@testing-library/react';
import { useSignatures } from '@/hooks/useSignatures';
import { api } from '@/services/api';

// Mock da API
jest.mock('@/services/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('useSignatures', () => {
  const mockSignatures = [
    {
      id: '1',
      documentId: '1',
      userId: '1',
      signature: 'data:image/png;base64,...',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      documentId: '2',
      userId: '1',
      signature: 'data:image/png;base64,...',
      createdAt: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches signatures successfully', async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({ data: mockSignatures });

    const { result } = renderHook(() => useSignatures());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe(null);

    await act(async () => {
      await result.current.fetchSignatures();
    });

    expect(result.current.signatures).toEqual(mockSignatures);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('handles error when fetching signatures', async () => {
    const error = new Error('Failed to fetch signatures');
    (api.get as jest.Mock).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useSignatures());

    await act(async () => {
      await result.current.fetchSignatures();
    });

    expect(result.current.signatures).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toEqual(error);
  });

  it('creates a new signature', async () => {
    const newSignature = {
      documentId: '1',
      signature: 'data:image/png;base64,...',
    };
    (api.post as jest.Mock).mockResolvedValueOnce({ data: { ...newSignature, id: '3' } });

    const { result } = renderHook(() => useSignatures());

    await act(async () => {
      await result.current.createSignature(newSignature);
    });

    expect(api.post).toHaveBeenCalledWith('/signatures', newSignature);
  });

  it('deletes a signature', async () => {
    const signatureId = '1';
    (api.delete as jest.Mock).mockResolvedValueOnce({ data: null });

    const { result } = renderHook(() => useSignatures());

    await act(async () => {
      await result.current.deleteSignature(signatureId);
    });

    expect(api.delete).toHaveBeenCalledWith(`/signatures/${signatureId}`);
  });

  it('validates signature data before saving', async () => {
    const invalidSignature = {
      documentId: '1',
      signature: '', // Empty signature
    };

    const { result } = renderHook(() => useSignatures());

    await act(async () => {
      await result.current.createSignature(invalidSignature);
    });

    expect(api.post).not.toHaveBeenCalled();
    expect(result.current.error).toBeTruthy();
  });
}); 