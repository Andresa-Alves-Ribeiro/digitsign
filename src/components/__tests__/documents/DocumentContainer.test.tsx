import React from 'react';
import { render, screen } from '@testing-library/react';
import DocumentContainer from '../../documents/DocumentContainer';

describe('DocumentContainer', () => {
  const mockDocument = {
    id: '1',
    name: 'Test Document',
    status: 'PENDING',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    userId: 'user1',
  };

  it('renders document container with children', () => {
    render(
      <DocumentContainer document={mockDocument}>
        <div>Test content</div>
      </DocumentContainer>
    );
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders document name', () => {
    render(
      <DocumentContainer document={mockDocument}>
        <div>Test content</div>
      </DocumentContainer>
    );
    expect(screen.getByText('Test Document')).toBeInTheDocument();
  });

  it('renders document status', () => {
    render(
      <DocumentContainer document={mockDocument}>
        <div>Test content</div>
      </DocumentContainer>
    );
    expect(screen.getByText('PENDING')).toBeInTheDocument();
  });

  it('renders document creation date', () => {
    render(
      <DocumentContainer document={mockDocument}>
        <div>Test content</div>
      </DocumentContainer>
    );
    expect(screen.getByText(/Jan 1, 2024/)).toBeInTheDocument();
  });

  it('renders document update date', () => {
    render(
      <DocumentContainer document={mockDocument}>
        <div>Test content</div>
      </DocumentContainer>
    );
    expect(screen.getByText(/Last updated: Jan 1, 2024/)).toBeInTheDocument();
  });

  it('renders with custom class', () => {
    render(
      <DocumentContainer document={mockDocument} className="custom-class">
        <div>Test content</div>
      </DocumentContainer>
    );
    expect(screen.getByTestId('document-container')).toHaveClass('custom-class');
  });

  it('renders with default class when no custom class provided', () => {
    render(
      <DocumentContainer document={mockDocument}>
        <div>Test content</div>
      </DocumentContainer>
    );
    expect(screen.getByTestId('document-container')).toHaveClass('bg-white', 'shadow', 'sm:rounded-lg');
  });

  it('renders with custom header class', () => {
    render(
      <DocumentContainer document={mockDocument} headerClassName="custom-header-class">
        <div>Test content</div>
      </DocumentContainer>
    );
    expect(screen.getByTestId('document-header')).toHaveClass('custom-header-class');
  });

  it('renders with default header class when no custom header class provided', () => {
    render(
      <DocumentContainer document={mockDocument}>
        <div>Test content</div>
      </DocumentContainer>
    );
    expect(screen.getByTestId('document-header')).toHaveClass('px-4', 'py-5', 'sm:px-6');
  });

  it('renders with custom content class', () => {
    render(
      <DocumentContainer document={mockDocument} contentClassName="custom-content-class">
        <div>Test content</div>
      </DocumentContainer>
    );
    expect(screen.getByTestId('document-content')).toHaveClass('custom-content-class');
  });

  it('renders with default content class when no custom content class provided', () => {
    render(
      <DocumentContainer document={mockDocument}>
        <div>Test content</div>
      </DocumentContainer>
    );
    expect(screen.getByTestId('document-content')).toHaveClass('px-4', 'py-5', 'sm:p-6');
  });

  it('renders with custom title class', () => {
    render(
      <DocumentContainer document={mockDocument} titleClassName="custom-title-class">
        <div>Test content</div>
      </DocumentContainer>
    );
    expect(screen.getByText('Test Document')).toHaveClass('custom-title-class');
  });

  it('renders with default title class when no custom title class provided', () => {
    render(
      <DocumentContainer document={mockDocument}>
        <div>Test content</div>
      </DocumentContainer>
    );
    expect(screen.getByText('Test Document')).toHaveClass('text-lg', 'font-medium', 'text-neutral-900');
  });

  it('renders with custom status class', () => {
    render(
      <DocumentContainer document={mockDocument} statusClassName="custom-status-class">
        <div>Test content</div>
      </DocumentContainer>
    );
    expect(screen.getByText('PENDING')).toHaveClass('custom-status-class');
  });

  it('renders with default status class when no custom status class provided', () => {
    render(
      <DocumentContainer document={mockDocument}>
        <div>Test content</div>
      </DocumentContainer>
    );
    expect(screen.getByText('PENDING')).toHaveClass('inline-flex', 'items-center', 'px-2.5', 'py-0.5', 'rounded-full', 'text-xs', 'font-medium', 'bg-yellow-100', 'text-yellow-800');
  });

  it('renders with custom date class', () => {
    render(
      <DocumentContainer document={mockDocument} dateClassName="custom-date-class">
        <div>Test content</div>
      </DocumentContainer>
    );
    expect(screen.getByText(/Jan 1, 2024/)).toHaveClass('custom-date-class');
  });

  it('renders with default date class when no custom date class provided', () => {
    render(
      <DocumentContainer document={mockDocument}>
        <div>Test content</div>
      </DocumentContainer>
    );
    expect(screen.getByText(/Jan 1, 2024/)).toHaveClass('text-sm', 'text-neutral-500');
  });

  it('renders with loading state', () => {
    render(<DocumentContainer document={mockDocument} isLoading />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders with error state', () => {
    render(
      <DocumentContainer
        document={mockDocument}
        error="Test error message"
      />
    );
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('renders with custom actions', () => {
    const mockAction = jest.fn();
    render(
      <DocumentContainer
        document={mockDocument}
        actions={[
          {
            label: 'Custom Action',
            onClick: mockAction,
          },
        ]}
      />
    );
    const actionButton = screen.getByText('Custom Action');
    expect(actionButton).toBeInTheDocument();
    actionButton.click();
    expect(mockAction).toHaveBeenCalledTimes(1);
  });

  it('renders with default actions', () => {
    render(<DocumentContainer document={mockDocument} />);
    expect(screen.getByText('View')).toBeInTheDocument();
    expect(screen.getByText('Download')).toBeInTheDocument();
  });

  it('renders with custom status colors', () => {
    render(
      <DocumentContainer
        document={mockDocument}
        statusColors={{
          PENDING: 'bg-yellow-100 text-yellow-800',
        }}
      />
    );
    const statusBadge = screen.getByText('PENDING');
    expect(statusBadge).toHaveClass('bg-yellow-100', 'text-yellow-800');
  });

  it('renders with custom date format', () => {
    const dateFormat = 'MM/dd/yyyy';
    render(
      <DocumentContainer
        document={mockDocument}
        dateFormat={dateFormat}
      />
    );
    const createdAtDate = screen.getByText(/Created:/);
    expect(createdAtDate).toHaveTextContent(
      new Date(mockDocument.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    );
  });
}); 