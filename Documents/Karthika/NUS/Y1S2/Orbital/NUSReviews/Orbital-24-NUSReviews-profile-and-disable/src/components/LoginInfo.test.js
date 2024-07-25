import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginInfo from './LoginInfo';

test('renders login form', () => {
  render(
    <MemoryRouter>
      <LoginInfo />
    </MemoryRouter>
  );
  
  expect(screen.getByText(/Sign In to Contribute/i)).toBeInTheDocument();
});

test('allows the user to login', async () => {
  const mockLogin = jest.fn();
  
  render(
    <MemoryRouter>
      <LoginInfo onLogin={mockLogin} />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'test@u.nus.edu' } });
  fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'password' } });
  fireEvent.click(screen.getByTestId('submit-button'));

  await waitFor(() => {
    expect(mockLogin).toHaveBeenCalled();
  });
});
