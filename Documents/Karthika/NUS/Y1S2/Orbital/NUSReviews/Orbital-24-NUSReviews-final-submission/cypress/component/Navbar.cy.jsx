import React from 'react';
import { mount } from 'cypress/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../../src/components/Navbar';

describe('Navbar Component', () => {
  beforeEach(() => {
    // Mount the Navbar component before each test
    mount(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
  });

  it('renders the Navbar component', () => {
    // Check if the Navbar is visible
    cy.get('.navbar').should('be.visible');
  });

  it('displays the logo with correct text', () => {
    // Check if the logo is correctly rendered
    cy.contains('NUSReviews').should('be.visible');
  });

  it('displays the About button in the Navbar', () => {
    // Check if the About button is visible
    cy.contains('About').should('be.visible');
  });

  it('displays the Files button in the Navbar', () => {
    // Check if the Files button is visible
    cy.contains('Files').should('be.visible');
  });

  it('displays the Polls button in the Navbar', () => {
    // Check if the Polls button is visible
    cy.contains('Polls').should('be.visible');
  });

  it('displays the Login button in the Navbar', () => {
    // Check if the Login button is visible
    cy.contains('Login').should('be.visible');
  });
});

