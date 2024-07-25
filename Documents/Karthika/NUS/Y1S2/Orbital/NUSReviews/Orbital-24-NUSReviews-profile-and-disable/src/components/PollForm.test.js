import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PollForm from './PollForm';
import { getAuth } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase-config';

// Mock Firebase functions
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
}));

describe('PollForm', () => {
  const mockUser = { uid: 'user123' };

  beforeEach(() => {
    getAuth.mockReturnValue({ currentUser: mockUser });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders PollForm component with initial elements', () => {
    render(<PollForm fixedCategory="" />);

    expect(screen.getByPlaceholderText(/Poll Title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Option 1/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Option 2/i)).toBeInTheDocument();
    expect(screen.getByText(/Create Poll/i)).toBeInTheDocument();
  });

  test('handles input changes for poll title and options', () => {
    render(<PollForm fixedCategory="" />);

    const titleInput = screen.getByPlaceholderText(/Poll Title/i);
    fireEvent.change(titleInput, { target: { value: 'New Poll Title' } });
    expect(titleInput.value).toBe('New Poll Title');

    const optionInput = screen.getByPlaceholderText(/Option 1/i);
    fireEvent.change(optionInput, { target: { value: 'Option A' } });
    expect(optionInput.value).toBe('Option A');
  });

  test('adds and removes poll options', () => {
    render(<PollForm fixedCategory="" />);

    const addOptionButton = screen.getByRole('button', { name: /plus/i });
    fireEvent.click(addOptionButton);

    expect(screen.getByPlaceholderText(/Option 3/i)).toBeInTheDocument();

    const removeOptionButton = screen.getByRole('button', { name: /minus/i });
    fireEvent.click(removeOptionButton);

    expect(screen.queryByPlaceholderText(/Option 3/i)).not.toBeInTheDocument();
  });

  test('validates the form before submission', async () => {
    render(<PollForm fixedCategory="" />);

    const submitButton = screen.getByText(/Create Poll/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Title is required!/i)).toBeInTheDocument();
      expect(screen.getByText(/Category is required!/i)).toBeInTheDocument();
      expect(screen.getByText(/At least two options are required!/i)).toBeInTheDocument();
    });
  });

  test('submits the form and creates a new poll', async () => {
    addDoc.mockResolvedValueOnce({ id: 'new_poll_id' });

    render(<PollForm fixedCategory="courses" />);

    const titleInput = screen.getByPlaceholderText(/Poll Title/i);
    fireEvent.change(titleInput, { target: { value: 'New Poll Title' } });

    const option1Input = screen.getByPlaceholderText(/Option 1/i);
    fireEvent.change(option1Input, { target: { value: 'Option A' } });

    const option2Input = screen.getByPlaceholderText(/Option 2/i);
    fireEvent.change(option2Input, { target: { value: 'Option B' } });

    const submitButton = screen.getByText(/Create Poll/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(addDoc).toHaveBeenCalledWith(collection(db, 'polls'), {
        title: 'New Poll Title',
        options: [
          { option: 'Option A', votes: 0 },
          { option: 'Option B', votes: 0 },
        ],
        category: 'courses',
        multiple: false,
        creatorId: 'user123',
        createdAt: expect.any(Date),
      });
    });

    expect(screen.getByPlaceholderText(/Poll Title/i).value).toBe('');
    expect(screen.getByPlaceholderText(/Option 1/i).value).toBe('');
    expect(screen.getByPlaceholderText(/Option 2/i).value).toBe('');
  });
});
