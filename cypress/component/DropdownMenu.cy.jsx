import React from 'react';
import { mount } from 'cypress/react';
import { MemoryRouter } from 'react-router-dom';
import DropdownMenu from '../../src/components/DropdownMenu';

describe('DropdownMenu.cy.jsx', () => {
  const items = [
    { href: "/courses/guide", label: "Guide" },
    { href: 'https://nusmods.com', label: "NUSMods" },
    { href: "/courses/questions", label: "Question Threads" },
    { href: "/courses/polls", label: "Polls" },
  ];

  it('renders DropdownMenu component', () => {
    mount(
      <MemoryRouter>
        <DropdownMenu title="Courses" items={items} navigateTo={'/courses'} />
      </MemoryRouter>
    );

    // Check if the dropdown button is rendered with the correct title
    cy.get('.dropbtn').contains('Courses');

    // Ensure the dropdown content is hidden initially
    cy.get('.dropdown-content').should('not.be.visible');

    // Simulate hover to display dropdown content
    cy.get('.dropdown').trigger('mouseover');
    cy.get('.dropdown-content').should('be.visible');

    // Check if the dropdown items are rendered correctly
    cy.get('.dropdown-content a').should('have.length', items.length);
    items.forEach(item => {
      cy.get('.dropdown-content a').contains(item.label);
    });

    // Simulate mouse leave to hide dropdown content
    cy.get('.dropdown').trigger('mouseout');
    cy.get('.dropdown-content').should('not.be.visible');
  });
});
