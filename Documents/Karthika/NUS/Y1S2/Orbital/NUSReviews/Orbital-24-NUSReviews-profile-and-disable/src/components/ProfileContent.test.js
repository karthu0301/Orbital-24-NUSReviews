import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProfileContent from './ProfileContent';
import { getAuth, updateProfile, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db, storage } from '../firebase-config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Mock Firebase functions
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  updateProfile: jest.fn(),
  onAuthStateChanged: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  onSnapshot: jest.fn(),
}));

jest.mock('firebase/storage', () => ({
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(),
}));

// Mock Firebase config
jest.mock('../firebase-config', () => ({
  db: jest.fn(),
  storage: jest.fn(),
}));

describe('ProfileContent', () => {
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
        exists: () => true,
        data: () => ({
          name: 'Test User',
          displayName: 'Test User',
          email: 'test@u.nus.edu',
          role: 'Student',
          courseOfStudy: 'Computer Science',
          yearOfStudy: '2',
          additionalInfo: 'Some info',
          profileImage: '',
          flaggedContributions: 1,
          contributionsThisSemester: 10,
          eligibilityForBonus: 'Yes',
          lastViewedThreads: {},
          hasUnreadNotifications: false
        })
      });
      return jest.fn();
    });

    // Mock getDownloadURL to simulate image upload
    getDownloadURL.mockResolvedValue('https://via.placeholder.com/128x128');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders ProfileContent component', async () => {
    render(
      <MemoryRouter>
        <ProfileContent />
      </MemoryRouter>
    );

    expect(screen.getByText(/Sign In to Contribute/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email@u.nus.edu/i)).toBeInTheDocument();
    expect(screen.getByText(/Continue/i)).toBeInTheDocument();
    expect(screen.getByText(/No existing account?/i)).toBeInTheDocument();
    expect(screen.getByText(/or/i)).toBeInTheDocument();
  });

  test('allows user to update profile data', async () => {
    render(
      <MemoryRouter>
        <ProfileContent />
      </MemoryRouter>
    );

    const displayNameInput = screen.getByLabelText(/Display Name/i);
    fireEvent.change(displayNameInput, { target: { value: 'Updated User' } });

    const saveButton = screen.getByText(/Save/i);
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(updateProfile).toHaveBeenCalledWith(mockUser, {
        displayName: 'Updated User',
      });
      expect(setDoc).toHaveBeenCalled();
      expect(screen.getByText(/Profile updated successfully/i)).toBeInTheDocument();
    });
  });

  test('shows validation error when display name is empty', async () => {
    render(
      <MemoryRouter>
        <ProfileContent />
      </MemoryRouter>
    );

    const displayNameInput = screen.getByLabelText(/Display Name/i);
    fireEvent.change(displayNameInput, { target: { value: '' } });

    const saveButton = screen.getByText(/Save/i);
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/Username is required/i)).toBeInTheDocument();
    });
  });

  test('handles image upload and updates profile image', async () => {
    render(
      <MemoryRouter>
        <ProfileContent />
      </MemoryRouter>
    );

    const file = new File(['profile'], 'profile.png', { type: 'image/png' });
    const input = screen.getByLabelText(/Edit profile image/i);
    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(uploadBytes).toHaveBeenCalled();
      expect(screen.getByAltText(/Profile/i)).toHaveAttribute('src', 'https://via.placeholder.com/128x128');
    });
  });
});
