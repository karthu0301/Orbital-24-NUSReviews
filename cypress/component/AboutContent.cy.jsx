import React from 'react';
import { mount } from 'cypress/react18';
import { MemoryRouter } from 'react-router-dom';
import AboutContent from '../../src/components/AboutContent';

describe('AboutContent.cy.jsx', () => {
  it('renders AboutContent component', () => {
    mount(
      <MemoryRouter>
        <AboutContent />
      </MemoryRouter>
    );

    // Verify that the main elements are rendered
    cy.get('.about-main-content').should('exist');
    cy.get('.about-image img').should('have.attr', 'src').and('include', 'logo.png');
    
    cy.get('.about-text-content section header').contains('Aim').should('exist');
    cy.get('.about-text-content section header').contains('Motivation').should('exist');
    
    // Check for the presence of key phrases within the paragraphs
    cy.get('.about-text-content section p').contains('centralise and simplify access to data on housing, dining, and academic opportunities').should('exist');
    cy.get('.about-text-content section p').contains('one-stop solution that empowers students to make informed decisions with confidence and ease').should('exist');
    
    cy.get('.about-summary').contains('Make informed decisions!').should('exist');
    cy.get('.about-summary').contains('Get personalised help!').should('exist');
    cy.get('.about-summary').contains('Enhance your university life!').should('exist');
  });
});

