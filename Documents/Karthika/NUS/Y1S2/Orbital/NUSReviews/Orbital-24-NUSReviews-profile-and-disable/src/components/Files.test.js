import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Files from './Files';
import { db } from '../firebase-config';
import { collection, query, getDocs } from 'firebase/firestore';
import { BrowserRouter as Router } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faSearch } from '@fortawesome/free-solid-svg-icons';

jest.mock('../firebase-config', () => ({
  db: {
    collection: jest.fn(),
  },
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  getDocs: jest.fn(),
}));

describe('Files', () => {
  const mockFiles = [
    {
      id: '1',
      url: 'https://example.com/file1.pdf',
      type: 'Question Thread',
      relatedId: 'q1',
      category: 'housingQuestions',
      timestamp: { seconds: 1625247600 },
      fileType: 'pdf',
    },
    {
      id: '2',
      url: 'https://example.com/file2.jpg',
      type: 'Reply',
      relatedId: 'r1',
      category: 'coursesReplies',
      timestamp: { seconds: 1625334000 },
      fileType: 'jpg',
    },
  ];

  beforeEach(async () => {
    getDocs.mockResolvedValueOnce({
      docs: mockFiles.map((file) => ({
        id: file.id,
        data: () => ({
          fileUrl: file.url,
          timestamp: file.timestamp,
        }),
      })),
    });

    render(
      <Router>
        <Files />
      </Router>
    );

    await waitFor(() => expect(getDocs).toHaveBeenCalledTimes(1));
  });

  test('renders Files component with initial elements', async () => {
    expect(screen.getByText(/Uploaded Files/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search files.../i)).toBeInTheDocument();
    expect(screen.getByText(/Filter by Category/i)).toBeInTheDocument();
    expect(screen.getByText(/Filter by File Type/i)).toBeInTheDocument();
    expect(screen.getByText(/Sort by Date/i)).toBeInTheDocument();
  });

  test('displays fetched files', async () => {
    await waitFor(() => {
      expect(screen.getByText(/Category: Housing/i)).toBeInTheDocument();
      expect(screen.getByText(/Category: Courses/i)).toBeInTheDocument();
    });
  });

  test('filters files by search query', async () => {
    const searchInput = screen.getByPlaceholderText(/Search files.../i);

    fireEvent.change(searchInput, { target: { value: 'file1' } });

    expect(screen.getByText(/file1.pdf/i)).toBeInTheDocument();
    expect(screen.queryByText(/file2.jpg/i)).not.toBeInTheDocument();
  });

  test('filters files by category', async () => {
    const categorySelect = screen.getByText(/Filter by Category/i).nextElementSibling;

    fireEvent.change(categorySelect, { target: { value: 'housing' } });

    expect(screen.getByText(/file1.pdf/i)).toBeInTheDocument();
    expect(screen.queryByText(/file2.jpg/i)).not.toBeInTheDocument();
  });

  test('filters files by file type', async () => {
    const fileTypeSelect = screen.getByText(/Filter by File Type/i).nextElementSibling;

    fireEvent.change(fileTypeSelect, { target: { value: 'jpg' } });

    expect(screen.getByText(/file2.jpg/i)).toBeInTheDocument();
    expect(screen.queryByText(/file1.pdf/i)).not.toBeInTheDocument();
  });

  test('sorts files by date', async () => {
    const dateOrderSelect = screen.getByText(/Sort by Date/i).nextElementSibling;

    fireEvent.change(dateOrderSelect, { target: { value: 'latest' } });

    const files = screen.getAllByText(/View File/i);
    expect(files[0].parentElement.querySelector('p strong').textContent).toBe('Category: Courses');
    expect(files[1].parentElement.querySelector('p strong').textContent).toBe('Category: Housing');
  });
});
