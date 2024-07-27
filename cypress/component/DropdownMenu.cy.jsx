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

  beforeEach(() => {
    mount(
      <MemoryRouter>
        <DropdownMenu title="Courses" items={items} navigateTo={'/courses'} />
      </MemoryRouter>
    );
  });

  it('renders the dropdown button with the correct title', () => {
    cy.get('.dropbtn').should('contain', 'Courses').and('be.visible');
  });

  it('initially hides the dropdown content', () => {
    cy.get('.dropdown-content').should('not.be.visible');
  });

  it('shows the dropdown content on hover', () => {
    cy.get('.dropdown').trigger('mouseover');
    cy.get('.dropdown-content').should('be.visible');
  });

  it('renders all dropdown items correctly', () => {
    cy.get('.dropdown').trigger('mouseover');
    cy.get('.dropdown-content a').should('have.length', items.length);
    items.forEach(item => {
      cy.get('.dropdown-content').contains(item.label).should('be.visible');
    });
  });

  it('hides the dropdown content on mouseout', () => {
    cy.get('.dropdown').trigger('mouseover');
    cy.get('.dropdown').trigger('mouseout');
    cy.get('.dropdown-content').should('not.be.visible');
  });
});
