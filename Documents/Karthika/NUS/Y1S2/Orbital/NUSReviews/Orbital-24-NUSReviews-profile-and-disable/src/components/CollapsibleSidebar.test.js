import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CollapsibleSidebar from './CollapsibleSidebar';
import { BrowserRouter as Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { Router as RouterComponent } from 'react-router';

describe('CollapsibleSidebar', () => {
  const renderWithRouter = (ui, { route = '/' } = {}) => {
    const history = createMemoryHistory({ initialEntries: [route] });
    return {
      ...render(<RouterComponent history={history}>{ui}</RouterComponent>),
      history,
    };
  };

  test('renders CollapsibleSidebar component with initial elements', () => {
    render(
      <Router>
        <CollapsibleSidebar />
      </Router>
    );

    expect(screen.getByText(/Subpages/i)).toBeInTheDocument();
    expect(screen.getByText(/Library/i)).toBeInTheDocument();
    expect(screen.getByText(/Courses/i)).toBeInTheDocument();
    expect(screen.getByText(/Housing/i)).toBeInTheDocument();
    expect(screen.getByText(/Food/i)).toBeInTheDocument();
    expect(screen.getByText(/Polls/i)).toBeInTheDocument();
    expect(screen.getByText(/All Files/i)).toBeInTheDocument();
  });

  test('toggles sidebar open and close', () => {
    render(
      <Router>
        <CollapsibleSidebar />
      </Router>
    );

    const toggleButton = screen.getByText(/>/i);
    fireEvent.click(toggleButton);

    expect(screen.getByText(/</i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/</i));

    expect(screen.getByText(/>/i)).toBeInTheDocument();
  });

  test('displays and hides submenus on hover', () => {
    render(
      <Router>
        <CollapsibleSidebar />
      </Router>
    );

    const coursesItem = screen.getByText(/Courses/i);
    const submenu = document.getElementById('submenu-Courses');

    fireEvent.mouseEnter(coursesItem);
    expect(submenu.style.display).toBe('flex');

    fireEvent.mouseLeave(coursesItem);
    expect(submenu.style.display).toBe('none');
  });

  test('navigates to correct link when item is clicked', () => {
    const { history } = renderWithRouter(<CollapsibleSidebar />);

    const coursesItem = screen.getByText(/Courses/i);
    fireEvent.click(coursesItem);

    expect(history.location.pathname).toBe('/courses');
  });
});
