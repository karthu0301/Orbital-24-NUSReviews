import React from 'react';
import { mount } from 'cypress/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../../src/components/Navbar';

describe('Navbar.cy.jsx', () => {
  it('renders Navbar component', () => {
    mount(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    cy.contains('NUSReviews').should('be.visible');
    cy.contains('About').should('be.visible');
    cy.contains('Files').should('be.visible');
    cy.contains('Polls').should('be.visible');
    cy.contains('Login').should('be.visible');
  });
});
