import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import QuestionList from './QuestionList';
import { db, storage } from '../firebase-config';
import { collection, query, where, getDocs, getDoc, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('../firebase-config', () => ({
  db: {
    collection: jest.fn(),
  },
  storage: {
    ref: jest.fn(),
  },
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(),
  getDoc: jest.fn(),
  addDoc: jest.fn(),
  serverTimestamp: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
}));

jest.mock('firebase/storage', () => ({
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(),
}));

describe('QuestionList', () => {
  const mockQuestions = [
    {
      id: '1',
      text: 'This is a test question',
      category: 'designandengineering',
      timestamp: { seconds: 1625247600 },
      answered: false,
      askedBy: 'Test User',
      askedByUid: 'testUser1',
      fileUrl: null,
      reminderSet: false,
    },
    {
      id: '2',
      text: 'This is another test question',
      category: 'computing',
      timestamp: { seconds: 1625334000 },
      answered: true,
      askedBy: 'Test User 2',
      askedByUid: 'testUser2',
      fileUrl: 'https://example.com/file.pdf',
      reminderSet: true,
    },
  ];

  beforeEach(async () => {
    getDocs.mockResolvedValueOnce({
      docs: mockQuestions.map((question) => ({
        id: question.id,
        data: () => question,
      })),
    });

    render(
      <Router>
        <QuestionList subCategoryProp="coursesQuestions" />
      </Router>
    );

    await waitFor(() => expect(getDocs).toHaveBeenCalledTimes(1));
  });

  test('renders QuestionList component with initial elements', async () => {
    expect(screen.getByText(/Courses Question threads/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search.../i)).toBeInTheDocument();
    expect(screen.getByText(/Order by Date/i)).toBeInTheDocument();
    expect(screen.getByText(/Filter by Answered/i)).toBeInTheDocument();
    expect(screen.getByText(/Filter by Category/i)).toBeInTheDocument();
  });

  test('displays fetched questions', async () => {
    await waitFor(() => {
      expect(screen.getByText(/This is a test question/i)).toBeInTheDocument();
      expect(screen.getByText(/This is another test question/i)).toBeInTheDocument();
    });
  });

  test('filters questions by search query', async () => {
    const searchInput = screen.getByPlaceholderText(/Search.../i);

    fireEvent.change(searchInput, { target: { value: 'another' } });

    expect(screen.queryByText(/This is a test question/i)).not.toBeInTheDocument();
    expect(screen.getByText(/This is another test question/i)).toBeInTheDocument();
  });

  test('filters questions by category', async () => {
    const categorySelect = screen.getByText(/Filter by Category/i).nextElementSibling;

    fireEvent.change(categorySelect, { target: { value: 'computing' } });

    expect(screen.queryByText(/This is a test question/i)).not.toBeInTheDocument();
    expect(screen.getByText(/This is another test question/i)).toBeInTheDocument();
  });

  test('filters questions by answered status', async () => {
    const answeredSelect = screen.getByText(/Filter by Answered/i).nextElementSibling;

    fireEvent.change(answeredSelect, { target: { value: 'answered' } });

    expect(screen.queryByText(/This is a test question/i)).not.toBeInTheDocument();
    expect(screen.getByText(/This is another test question/i)).toBeInTheDocument();
  });

  test('submits a new question', async () => {
    const auth = getAuth();
    auth.currentUser = { uid: 'testUser3', displayName: 'Test User 3' };
    addDoc.mockResolvedValueOnce({ id: '3' });

    fireEvent.change(screen.getByPlaceholderText(/Ask a new question.../i), {
      target: { value: 'New test question' },
    });

    fireEvent.change(screen.getByText(/Select a category/i).nextElementSibling, {
      target: { value: 'computing' },
    });

    fireEvent.click(screen.getByText(/Create new thread/i));

    await waitFor(() => expect(addDoc).toHaveBeenCalledTimes(1));
    expect(screen.getByText(/New test question/i)).toBeInTheDocument();
  });

  test('handles file attachment', async () => {
    const fileInput = screen.getByLabelText(/file/i);
    const file = new File(['dummy content'], 'example.pdf', { type: 'application/pdf' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(fileInput.files[0]).toBe(file);
  });

  test('displays user profile popup on hover', async () => {
    getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => ({
        profileImage: 'https://example.com/profile.jpg',
        name: 'Test User',
        role: 'Student',
        courseOfStudy: 'Engineering',
        yearOfStudy: '3',
        additionalInfo: 'No additional info',
      }),
    });

    const askerCell = screen.getByText(/Test User/i);
    fireEvent.mouseEnter(askerCell);

    await waitFor(() => expect(screen.getByText(/Name: Test User/i)).toBeInTheDocument());
    expect(screen.getByText(/Role: Student/i)).toBeInTheDocument();
  });
});
