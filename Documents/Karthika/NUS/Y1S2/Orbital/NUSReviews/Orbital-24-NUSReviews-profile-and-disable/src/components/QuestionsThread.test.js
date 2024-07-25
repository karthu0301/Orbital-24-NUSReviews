import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import QuestionsThread from './QuestionsThread';
import { db, storage } from '../firebase-config';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, serverTimestamp, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('../firebase-config', () => ({
  db: jest.fn(),
  storage: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  serverTimestamp: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  increment: jest.fn(),
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn((auth, callback) => {
    callback({ uid: 'testUser', displayName: 'Test User' });
    return jest.fn();
  }),
}));

jest.mock('firebase/storage', () => ({
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(),
}));

describe('QuestionsThread', () => {
  const mockQuestionData = {
    text: 'This is a test question',
    fileUrl: 'https://example.com/file.pdf',
    flagged: false,
  };

  const mockReplies = [
    {
      id: 'reply1',
      text: 'This is a test reply',
      timestamp: { seconds: 1625247600 },
      answeredBy: 'Test User',
      answeredByUid: 'testUser1',
      fileUrl: null,
      flagged: false,
    },
  ];

  beforeEach(async () => {
    getDoc.mockResolvedValueOnce({
      exists: () => true,
      data: () => mockQuestionData,
    });

    getDocs.mockResolvedValueOnce({
      docs: mockReplies.map((reply) => ({
        id: reply.id,
        data: () => reply,
      })),
    });

    render(
      <Router>
        <QuestionsThread subCategoryPropQ="coursesQuestions" subCategoryPropR="replies" subtopic="courses" />
      </Router>
    );

    await waitFor(() => expect(getDoc).toHaveBeenCalledTimes(1));
  });

  test('renders question and replies correctly', async () => {
    expect(screen.getByText(/this is a test question/i)).toBeInTheDocument();
    expect(screen.getByText(/this is a test reply/i)).toBeInTheDocument();
  });

  test('submits a new reply', async () => {
    const auth = getAuth();
    auth.currentUser = { uid: 'testUser2', displayName: 'Test User 2' };
    addDoc.mockResolvedValueOnce({ id: 'reply2' });

    fireEvent.change(screen.getByPlaceholderText(/write your answer here.../i), {
      target: { value: 'New test reply' },
    });

    fireEvent.click(screen.getByText(/submit answer/i));

    await waitFor(() => expect(addDoc).toHaveBeenCalledTimes(1));
    expect(screen.getByText(/new test reply/i)).toBeInTheDocument();
  });

  test('flags a question', async () => {
    fireEvent.click(screen.getByText(/flag/i));

    const flagTextarea = screen.getByPlaceholderText(/reason for flagging this question.../i);
    fireEvent.change(flagTextarea, { target: { value: 'Inappropriate content' } });

    fireEvent.click(screen.getByText(/submit flag/i));

    await waitFor(() => expect(addDoc).toHaveBeenCalledTimes(2)); // One for flagging
    expect(screen.getByText(/the response has been flagged and will be manually reviewed!/i)).toBeInTheDocument();
  });

  test('deletes a reply', async () => {
    const auth = getAuth();
    auth.currentUser = { uid: 'testUser1' }; // Same as the user who posted the reply

    fireEvent.click(screen.getAllByText(/delete/i)[0]);

    await waitFor(() => expect(deleteDoc).toHaveBeenCalledTimes(1));
    expect(screen.queryByText(/this is a test reply/i)).not.toBeInTheDocument();
  });

  test('handles reminders', async () => {
    const auth = getAuth();
    auth.currentUser = { uid: 'testUser3', displayName: 'Test User 3' };
    addDoc.mockResolvedValueOnce({ id: 'reminder1' });

    fireEvent.click(screen.getByText(/remind me!/i));

    await waitFor(() => expect(addDoc).toHaveBeenCalledTimes(1));
    expect(screen.getByText(/remove reminder/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/remove reminder/i));

    await waitFor(() => expect(deleteDoc).toHaveBeenCalledTimes(1));
    expect(screen.getByText(/remind me!/i)).toBeInTheDocument();
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

    const askerCell = screen.getByText(/test user/i);
    fireEvent.mouseEnter(askerCell);

    await waitFor(() => expect(screen.getByText(/name: test user/i)).toBeInTheDocument());
    expect(screen.getByText(/role: student/i)).toBeInTheDocument();
  });
});
