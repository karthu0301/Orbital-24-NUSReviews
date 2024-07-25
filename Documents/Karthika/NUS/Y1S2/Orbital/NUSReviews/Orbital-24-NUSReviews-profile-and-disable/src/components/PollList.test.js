import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PollList from './PollList';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, updateDoc, doc, getDoc, arrayUnion, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase-config';

// Mock Firebase functions
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  updateDoc: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  arrayUnion: jest.fn(),
  onSnapshot: jest.fn(),
}));

describe('PollList', () => {
  const mockPolls = [
    {
      id: '1',
      title: 'Favorite Course',
      category: 'courses',
      options: [
        { option: 'Course A', votes: 10 },
        { option: 'Course B', votes: 5 },
      ],
      voters: [],
    },
    {
      id: '2',
      title: 'Best Food',
      category: 'food',
      options: [
        { option: 'Food A', votes: 8 },
        { option: 'Food B', votes: 12 },
      ],
      voters: [],
    },
  ];

  const mockUser = { uid: 'user123' };

  beforeEach(() => {
    getAuth.mockReturnValue({ currentUser: mockUser });
    onSnapshot.mockImplementation((query, callback) => {
      callback({
        docs: mockPolls.map(poll => ({
          id: poll.id,
          data: () => poll,
        })),
      });
      return jest.fn();
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders PollList component and displays polls', async () => {
    render(<PollList filterCategory="" />);
    
    await waitFor(() => {
      expect(screen.getByText(/Favorite Course/i)).toBeInTheDocument();
      expect(screen.getByText(/Best Food/i)).toBeInTheDocument();
    });
  });

  test('handles voting for a poll', async () => {
    const mockUpdateDoc = jest.fn();
    updateDoc.mockImplementation(mockUpdateDoc);

    render(<PollList filterCategory="" />);
    
    await waitFor(() => {
      expect(screen.getByText(/Course A/i)).toBeInTheDocument();
      expect(screen.getByText(/Food A/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText(/Vote/i)[0]);

    await waitFor(() => {
      expect(mockUpdateDoc).toHaveBeenCalled();
    });
  });

  test('filters polls by category', async () => {
    render(<PollList filterCategory="food" />);

    await waitFor(() => {
      expect(screen.queryByText(/Favorite Course/i)).not.toBeInTheDocument();
      expect(screen.getByText(/Best Food/i)).toBeInTheDocument();
    });
  });

  test('opens and closes the flag modal', async () => {
    render(<PollList filterCategory="" />);
    
    await waitFor(() => {
      expect(screen.getByText(/Favorite Course/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByLabelText(/flag/i)[0]);
    expect(screen.getByText(/Flag Poll/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Cancel/i));
    expect(screen.queryByText(/Flag Poll/i)).not.toBeInTheDocument();
  });

  test('submits a flag', async () => {
    const mockDoc = jest.fn();
    doc.mockReturnValue(mockDoc);

    render(<PollList filterCategory="" />);
    
    await waitFor(() => {
      expect(screen.getByText(/Favorite Course/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByLabelText(/flag/i)[0]);
    fireEvent.change(screen.getByPlaceholderText(/Enter reason for flagging/i), { target: { value: 'Inappropriate content' } });
    fireEvent.click(screen.getByText(/Submit Flag/i));

    await waitFor(() => {
      expect(mockDoc).toHaveBeenCalled();
    });
  });
});
