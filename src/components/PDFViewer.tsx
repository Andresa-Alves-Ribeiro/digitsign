import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import { scrollModePlugin } from '@react-pdf-viewer/scroll-mode';
import { searchPlugin } from '@react-pdf-viewer/search';
import { selectionModePlugin } from '@react-pdf-viewer/selection-mode';
import { thumbnailPlugin } from '@react-pdf-viewer/thumbnail';
import { useState, useEffect } from 'react';

// Import only core styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

interface PDFViewerProps {
  url: string;
  className?: string;
}

interface ApiResponse {
  url: string;
  error?: string;
}

export function PDFViewer({ url, className = '' }: PDFViewerProps): JSX.Element {
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPdfUrl = async (): Promise<void> => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch PDF URL');
        }
        const data = await response.json() as ApiResponse;
        if (data.error) {
          throw new Error(data.error);
        }
        setPdfUrl(data.url);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load PDF');
      }
    };

    fetchPdfUrl();
  }, [url]);

  // Create the plugins
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const zoomPluginInstance = zoomPlugin();
  const scrollModePluginInstance = scrollModePlugin();
  const searchPluginInstance = searchPlugin();
  const selectionModePluginInstance = selectionModePlugin();
  const thumbnailPluginInstance = thumbnailPlugin();

  if (error) {
    return (
      <div className={`h-[800px] w-full flex items-center justify-center ${className}`}>
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!pdfUrl) {
    return (
      <div className={`h-[800px] w-full flex items-center justify-center ${className}`}>
        <div className="text-gray-500">Loading PDF...</div>
      </div>
    );
  }

  return (
    <div className={`h-[800px] w-full ${className}`}>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <Viewer
          fileUrl={pdfUrl}
          plugins={[
            defaultLayoutPluginInstance,
            zoomPluginInstance,
            scrollModePluginInstance,
            searchPluginInstance,
            selectionModePluginInstance,
            thumbnailPluginInstance,
          ]}
          theme={{
            theme: 'auto',
          }}
        />
      </Worker>
    </div>
  );
} 