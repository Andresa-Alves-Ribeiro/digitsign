import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/router';
import RecentActivities from '../../dashboard/RecentActivities';

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('RecentActivities', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  const mockActivities = [
    {
      id: '1',
      type: 'DOCUMENT_CREATED',
      documentId: 'doc1',
      documentName: 'Document 1',
      userId: 'user1',
      userName: 'User 1',
      createdAt: new Date('2024-01-01T10:00:00Z'),
    },
    {
      id: '2',
      type: 'DOCUMENT_SIGNED',
      documentId: 'doc2',
      documentName: 'Document 2',
      userId: 'user2',
      userName: 'User 2',
      createdAt: new Date('2024-01-02T11:00:00Z'),
    },
    {
      id: '3',
      type: 'DOCUMENT_REJECTED',
      documentId: 'doc3',
      documentName: 'Document 3',
      userId: 'user1',
      userName: 'User 1',
      createdAt: new Date('2024-01-03T12:00:00Z'),
    },
  ];

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders activities list', () => {
    render(<RecentActivities activities={mockActivities} />);
    expect(screen.getByText('Document 1')).toBeInTheDocument();
    expect(screen.getByText('Document 2')).toBeInTheDocument();
    expect(screen.getByText('Document 3')).toBeInTheDocument();
  });

  it('renders empty state when no activities', () => {
    render(<RecentActivities activities={[]} />);
    expect(screen.getByText('No recent activities')).toBeInTheDocument();
  });

  it('renders loading state', () => {
    render(<RecentActivities activities={[]} isLoading={true} />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders error state', () => {
    render(<RecentActivities activities={[]} error="Error loading activities" />);
    expect(screen.getByText('Error loading activities')).toBeInTheDocument();
  });

  it('navigates to document when clicking on activity', () => {
    render(<RecentActivities activities={mockActivities} />);
    fireEvent.click(screen.getByText('Document 1'));
    expect(mockRouter.push).toHaveBeenCalledWith('/documents/doc1');
  });

  it('displays activity type icons', () => {
    render(<RecentActivities activities={mockActivities} />);
    expect(screen.getByTestId('document-created-icon')).toBeInTheDocument();
    expect(screen.getByTestId('document-signed-icon')).toBeInTheDocument();
    expect(screen.getByTestId('document-rejected-icon')).toBeInTheDocument();
  });

  it('displays activity timestamps', () => {
    render(<RecentActivities activities={mockActivities} />);
    expect(screen.getByText('Jan 1, 2024, 10:00 AM')).toBeInTheDocument();
    expect(screen.getByText('Jan 2, 2024, 11:00 AM')).toBeInTheDocument();
    expect(screen.getByText('Jan 3, 2024, 12:00 PM')).toBeInTheDocument();
  });

  it('displays user names', () => {
    render(<RecentActivities activities={mockActivities} />);
    expect(screen.getByText('User 1')).toBeInTheDocument();
    expect(screen.getByText('User 2')).toBeInTheDocument();
  });

  it('filters activities by type', () => {
    render(<RecentActivities activities={mockActivities} />);
    const filterButton = screen.getByText('All');
    fireEvent.click(filterButton);
    const filterOptions = screen.getAllByRole('button');
    expect(filterOptions).toHaveLength(4); // All, Created, Signed, Rejected
  });

  it('filters activities by user', () => {
    render(<RecentActivities activities={mockActivities} />);
    const userFilter = screen.getByPlaceholderText('Filter by user');
    fireEvent.change(userFilter, { target: { value: 'User 1' } });
    expect(screen.queryByText('User 2')).not.toBeInTheDocument();
    expect(screen.getAllByText('User 1')).toHaveLength(2);
  });

  it('sorts activities by date', () => {
    render(<RecentActivities activities={mockActivities} />);
    const sortButton = screen.getByText('Most recent');
    fireEvent.click(sortButton);
    const activities = screen.getAllByTestId('activity-item');
    expect(activities[0]).toHaveTextContent('Jan 3, 2024');
    expect(activities[1]).toHaveTextContent('Jan 2, 2024');
    expect(activities[2]).toHaveTextContent('Jan 1, 2024');
  });

  it('limits number of displayed activities', () => {
    render(<RecentActivities activities={mockActivities} limit={2} />);
    expect(screen.getByText('Document 1')).toBeInTheDocument();
    expect(screen.getByText('Document 2')).toBeInTheDocument();
    expect(screen.queryByText('Document 3')).not.toBeInTheDocument();
  });

  it('shows "View more" button when there are more activities', () => {
    render(<RecentActivities activities={mockActivities} limit={2} />);
    expect(screen.getByText('View more')).toBeInTheDocument();
  });

  it('loads more activities when clicking "View more"', () => {
    const onLoadMore = jest.fn();
    render(<RecentActivities activities={mockActivities} limit={2} onLoadMore={onLoadMore} />);
    fireEvent.click(screen.getByText('View more'));
    expect(onLoadMore).toHaveBeenCalled();
  });

  it('displays activity descriptions', () => {
    render(<RecentActivities activities={mockActivities} />);
    expect(screen.getByText('created a new document')).toBeInTheDocument();
    expect(screen.getByText('signed the document')).toBeInTheDocument();
    expect(screen.getByText('rejected the document')).toBeInTheDocument();
  });

  it('renders with custom class', () => {
    render(<RecentActivities activities={mockActivities} className="custom-class" />);
    expect(screen.getByTestId('recent-activities')).toHaveClass('custom-class');
  });

  it('renders with default class when no custom class provided', () => {
    render(<RecentActivities activities={mockActivities} />);
    expect(screen.getByTestId('recent-activities')).toHaveClass('bg-white', 'shadow', 'sm:rounded-lg');
  });

  it('renders with custom header class', () => {
    render(<RecentActivities activities={mockActivities} headerClassName="custom-header-class" />);
    expect(screen.getByTestId('recent-activities-header')).toHaveClass('custom-header-class');
  });

  it('renders with default header class when no custom header class provided', () => {
    render(<RecentActivities activities={mockActivities} />);
    expect(screen.getByTestId('recent-activities-header')).toHaveClass('px-4', 'py-5', 'sm:px-6');
  });

  it('renders with custom content class', () => {
    render(<RecentActivities activities={mockActivities} contentClassName="custom-content-class" />);
    expect(screen.getByTestId('recent-activities-content')).toHaveClass('custom-content-class');
  });

  it('renders with default content class when no custom content class provided', () => {
    render(<RecentActivities activities={mockActivities} />);
    expect(screen.getByTestId('recent-activities-content')).toHaveClass('px-4', 'py-5', 'sm:p-6');
  });

  it('renders with custom title class', () => {
    render(<RecentActivities activities={mockActivities} titleClassName="custom-title-class" />);
    expect(screen.getByText('Recent Activities')).toHaveClass('custom-title-class');
  });

  it('renders with default title class when no custom title class provided', () => {
    render(<RecentActivities activities={mockActivities} />);
    expect(screen.getByText('Recent Activities')).toHaveClass('text-lg', 'font-medium', 'leading-6', 'text-gray-900');
  });

  it('renders with custom empty state class', () => {
    render(<RecentActivities activities={[]} emptyStateClassName="custom-empty-state-class" />);
    expect(screen.getByText('No recent activities')).toHaveClass('custom-empty-state-class');
  });

  it('renders with default empty state class when no custom empty state class provided', () => {
    render(<RecentActivities activities={[]} />);
    expect(screen.getByText('No recent activities')).toHaveClass('text-sm', 'text-gray-500');
  });

  it('renders with custom error state class', () => {
    render(<RecentActivities activities={[]} error="Error loading activities" errorClassName="custom-error-class" />);
    expect(screen.getByText('Error loading activities')).toHaveClass('custom-error-class');
  });

  it('renders with default error state class when no custom error state class provided', () => {
    render(<RecentActivities activities={[]} error="Error loading activities" />);
    expect(screen.getByText('Error loading activities')).toHaveClass('text-sm', 'text-red-500');
  });

  it('renders with custom loading state class', () => {
    render(<RecentActivities activities={[]} isLoading={true} loadingClassName="custom-loading-class" />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('custom-loading-class');
  });

  it('renders with default loading state class when no custom loading state class provided', () => {
    render(<RecentActivities activities={[]} isLoading={true} />);
    expect(screen.getByTestId('loading-spinner')).toHaveClass('animate-spin', 'h-5', 'w-5', 'text-gray-500');
  });

  it('renders with custom activity item class', () => {
    render(<RecentActivities activities={mockActivities} activityItemClassName="custom-activity-item-class" />);
    const activityItems = screen.getAllByTestId('activity-item');
    activityItems.forEach(item => {
      expect(item).toHaveClass('custom-activity-item-class');
    });
  });

  it('renders with default activity item class when no custom activity item class provided', () => {
    render(<RecentActivities activities={mockActivities} />);
    const activityItems = screen.getAllByTestId('activity-item');
    activityItems.forEach(item => {
      expect(item).toHaveClass('py-4', 'border-b', 'border-gray-200', 'last:border-b-0');
    });
  });

  it('renders with custom activity icon class', () => {
    render(<RecentActivities activities={mockActivities} activityIconClassName="custom-activity-icon-class" />);
    const activityIcons = screen.getAllByTestId(/icon$/);
    activityIcons.forEach(icon => {
      expect(icon).toHaveClass('custom-activity-icon-class');
    });
  });

  it('renders with default activity icon class when no custom activity icon class provided', () => {
    render(<RecentActivities activities={mockActivities} />);
    const activityIcons = screen.getAllByTestId(/icon$/);
    activityIcons.forEach(icon => {
      expect(icon).toHaveClass('h-5', 'w-5', 'text-gray-400');
    });
  });

  it('renders with custom activity content class', () => {
    render(<RecentActivities activities={mockActivities} activityContentClassName="custom-activity-content-class" />);
    const activityContents = screen.getAllByTestId('activity-content');
    activityContents.forEach(content => {
      expect(content).toHaveClass('custom-activity-content-class');
    });
  });

  it('renders with default activity content class when no custom activity content class provided', () => {
    render(<RecentActivities activities={mockActivities} />);
    const activityContents = screen.getAllByTestId('activity-content');
    activityContents.forEach(content => {
      expect(content).toHaveClass('ml-3', 'flex-1');
    });
  });

  it('renders with custom activity title class', () => {
    render(<RecentActivities activities={mockActivities} activityTitleClassName="custom-activity-title-class" />);
    const activityTitles = screen.getAllByTestId('activity-title');
    activityTitles.forEach(title => {
      expect(title).toHaveClass('custom-activity-title-class');
    });
  });

  it('renders with default activity title class when no custom activity title class provided', () => {
    render(<RecentActivities activities={mockActivities} />);
    const activityTitles = screen.getAllByTestId('activity-title');
    activityTitles.forEach(title => {
      expect(title).toHaveClass('text-sm', 'font-medium', 'text-gray-900');
    });
  });

  it('renders with custom activity description class', () => {
    render(<RecentActivities activities={mockActivities} activityDescriptionClassName="custom-activity-description-class" />);
    const activityDescriptions = screen.getAllByTestId('activity-description');
    activityDescriptions.forEach(description => {
      expect(description).toHaveClass('custom-activity-description-class');
    });
  });

  it('renders with default activity description class when no custom activity description class provided', () => {
    render(<RecentActivities activities={mockActivities} />);
    const activityDescriptions = screen.getAllByTestId('activity-description');
    activityDescriptions.forEach(description => {
      expect(description).toHaveClass('text-sm', 'text-gray-500');
    });
  });

  it('renders with custom activity time class', () => {
    render(<RecentActivities activities={mockActivities} activityTimeClassName="custom-activity-time-class" />);
    const activityTimes = screen.getAllByTestId('activity-time');
    activityTimes.forEach(time => {
      expect(time).toHaveClass('custom-activity-time-class');
    });
  });

  it('renders with default activity time class when no custom activity time class provided', () => {
    render(<RecentActivities activities={mockActivities} />);
    const activityTimes = screen.getAllByTestId('activity-time');
    activityTimes.forEach(time => {
      expect(time).toHaveClass('text-xs', 'text-gray-400');
    });
  });

  it('renders with custom activity user class', () => {
    render(<RecentActivities activities={mockActivities} activityUserClassName="custom-activity-user-class" />);
    const activityUsers = screen.getAllByTestId('activity-user');
    activityUsers.forEach(user => {
      expect(user).toHaveClass('custom-activity-user-class');
    });
  });

  it('renders with default activity user class when no custom activity user class provided', () => {
    render(<RecentActivities activities={mockActivities} />);
    const activityUsers = screen.getAllByTestId('activity-user');
    activityUsers.forEach(user => {
      expect(user).toHaveClass('text-sm', 'text-gray-500');
    });
  });

  it('renders with custom view more button class', () => {
    render(<RecentActivities activities={mockActivities} limit={2} viewMoreButtonClassName="custom-view-more-button-class" />);
    expect(screen.getByText('View more')).toHaveClass('custom-view-more-button-class');
  });

  it('renders with default view more button class when no custom view more button class provided', () => {
    render(<RecentActivities activities={mockActivities} limit={2} />);
    expect(screen.getByText('View more')).toHaveClass('text-sm', 'font-medium', 'text-indigo-600', 'hover:text-indigo-500');
  });

  it('renders with custom filter button class', () => {
    render(<RecentActivities activities={mockActivities} filterButtonClassName="custom-filter-button-class" />);
    const filterButtons = screen.getAllByRole('button');
    filterButtons.forEach(button => {
      expect(button).toHaveClass('custom-filter-button-class');
    });
  });

  it('renders with default filter button class when no custom filter button class provided', () => {
    render(<RecentActivities activities={mockActivities} />);
    const filterButtons = screen.getAllByRole('button');
    filterButtons.forEach(button => {
      expect(button).toHaveClass('text-sm', 'font-medium', 'text-gray-500', 'hover:text-gray-700');
    });
  });

  it('renders with custom filter input class', () => {
    render(<RecentActivities activities={mockActivities} filterInputClassName="custom-filter-input-class" />);
    expect(screen.getByPlaceholderText('Filter by user')).toHaveClass('custom-filter-input-class');
  });

  it('renders with default filter input class when no custom filter input class provided', () => {
    render(<RecentActivities activities={mockActivities} />);
    expect(screen.getByPlaceholderText('Filter by user')).toHaveClass('block', 'w-full', 'rounded-md', 'border-gray-300', 'shadow-sm', 'focus:border-indigo-500', 'focus:ring-indigo-500', 'sm:text-sm');
  });

  it('renders with custom sort button class', () => {
    render(<RecentActivities activities={mockActivities} sortButtonClassName="custom-sort-button-class" />);
    expect(screen.getByText('Most recent')).toHaveClass('custom-sort-button-class');
  });

  it('renders with default sort button class when no custom sort button class provided', () => {
    render(<RecentActivities activities={mockActivities} />);
    expect(screen.getByText('Most recent')).toHaveClass('text-sm', 'font-medium', 'text-gray-500', 'hover:text-gray-700');
  });
}); 