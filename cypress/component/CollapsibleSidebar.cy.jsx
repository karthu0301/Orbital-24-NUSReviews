import React from 'react';
import { mount } from 'cypress/react';
import { MemoryRouter } from 'react-router-dom';
import CollapsibleSidebar from '../../src/components/CollapsibleSidebar';

describe('CollapsibleSidebar.cy.jsx', () => {
  it('renders CollapsibleSidebar component', () => {
    mount(
      <MemoryRouter>
        <CollapsibleSidebar />
      </MemoryRouter>
    );

    // Check if the sidebar is initially collapsed
    cy.get('.collapsible-sidebar').should('not.have.class', 'expanded');

    // Toggle the sidebar and check if it expands
    cy.get('.sidebar-toggle-button').click();
    cy.get('.collapsible-sidebar').should('have.class', 'expanded');

    // Check if the sidebar items are rendered
    cy.get('.collapsible-sidebar-header').contains('Subpages');
    cy.get('.collapsible-sidebar-header').contains('Library');

    // Toggle back and check if it collapses
    cy.get('.sidebar-toggle-button').click();
    cy.get('.collapsible-sidebar').should('not.have.class', 'expanded');
  });
});
