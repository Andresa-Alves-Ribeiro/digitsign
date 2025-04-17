import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import { scrollModePlugin } from '@react-pdf-viewer/scroll-mode';
import { searchPlugin } from '@react-pdf-viewer/search';
import { selectionModePlugin } from '@react-pdf-viewer/selection-mode';
import { thumbnailPlugin } from '@react-pdf-viewer/thumbnail';

// Import only core styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

interface PDFViewerProps {
  url: string;
  className?: string;
}

export function PDFViewer({ url, className = '' }: PDFViewerProps): JSX.Element {
  // Create the plugins
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const zoomPluginInstance = zoomPlugin();
  const scrollModePluginInstance = scrollModePlugin();
  const searchPluginInstance = searchPlugin();
  const selectionModePluginInstance = selectionModePlugin();
  const thumbnailPluginInstance = thumbnailPlugin();

  return (
    <div className={`h-[800px] w-full ${className}`}>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <Viewer
          fileUrl={url}
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