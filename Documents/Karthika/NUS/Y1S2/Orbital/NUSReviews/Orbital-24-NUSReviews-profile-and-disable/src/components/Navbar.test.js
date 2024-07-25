import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase-config';

// Mock Firebase functions
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  onAuthStateChanged: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  onSnapshot: jest.fn(),
}));

// Mock useNavigate and useLocation from react-router-dom
const mockNavigate = jest.fn();
const mockLocation = {
  pathname: '/current',
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
}));

describe('Navbar', () => {
  const mockUser = {
    uid: 'user123',
    displayName: 'Test User',
    email: 'test@u.nus.edu',
  };

  beforeEach(() => {
    // Mock onAuthStateChanged to simulate user authentication
    onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(mockUser);
      return jest.fn();
    });

    // Mock onSnapshot to simulate Firestore user document
    onSnapshot.mockImplementation((docRef, callback) => {
      callback({
        data: () => ({
          hasUnreadNotifications: true,
        }),
      });
      return jest.fn();
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders Navbar component', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText(/NUSReviews/i)).toBeInTheDocument();
    expect(screen.getByText(/About/i)).toBeInTheDocument();
    expect(screen.getByText(/Files/i)).toBeInTheDocument();
    expect(screen.getByText(/Polls/i)).toBeInTheDocument();
  });

  test('shows login button when user is not authenticated', () => {
    onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(null); // No user
      return jest.fn();
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  test('shows user dropdown when user is authenticated', async () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/More/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/More/i));

    await waitFor(() => {
      expect(screen.getByText(/Profile/i)).toBeInTheDocument();
      expect(screen.getByText(/Saved Threads/i)).toBeInTheDocument();
      expect(screen.getByText(/Log Out/i)).toBeInTheDocument();
    });
  });

  test('shows notification dot when user has unread notifications', async () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/More/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/More/i));

    await waitFor(() => {
      expect(screen.getByText(/Profile/i)).toBeInTheDocument();
      expect(screen.getByText(/Saved Threads/i)).toBeInTheDocument();
      expect(screen.getByText(/Log Out/i)).toBeInTheDocument();
      expect(screen.getByClass('notification-dot-in')).toBeInTheDocument();
      expect(screen.getByClass('notification-dot-more')).toBeInTheDocument();
    });
  });

  test('handles sign out', async () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/More/i));
    await waitFor(() => {
      expect(screen.getByText(/Log Out/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Log Out/i));
    expect(getAuth().signOut).toHaveBeenCalled();
  });

  test('handles login navigation', () => {
    onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(null); // No user
      return jest.fn();
    });

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Login/i));
    expect(mockNavigate).toHaveBeenCalledWith('/login', { state: { from: mockLocation } });
  });
});
