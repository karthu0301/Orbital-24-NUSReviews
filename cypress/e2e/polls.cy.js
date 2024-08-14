describe('PollForm Component - Category Validation', () => {
  beforeEach(() => {
    cy.visit('https://nusreviews-78805.web.app/polls');
    cy.get('.poll-form-container').should('be.visible');
  });

  it('requires category selection when fixedCategory is not set', () => {
    cy.get('input.poll-input').first().as('titleInput');
    cy.get('@titleInput').should('be.visible').type('What is your favorite programming language?');
    cy.get('input.poll-input').eq(1).type('JavaScript'); // First option input
    cy.get('input.poll-input').eq(2).type('Python'); // Second option input
    cy.get('button[type="submit"]').click();
    cy.get('.error').should('contain', 'Category is required!');
  });

  it('allows users to add and remove options', () => {
    cy.get('input.poll-input').eq(1).should('exist');
    cy.get('input.poll-input').eq(2).should('exist');

    // Adding options
    cy.get('button.add-option-button').click();
    cy.get('input.poll-input').eq(3).should('exist');

    // Removing options
    cy.get('button.remove-option-button').click();
    cy.get('input[name="options[3]"]').should('not.exist');
  });

  it('creates a new poll successfully', () => {
    cy.get('input.poll-input').first().as('titleInput');
    cy.get('@titleInput').should('be.visible').type('meep morp');
    cy.get('input.poll-input').eq(1).type('wee');
    cy.get('input.poll-input').eq(2).type('woo');
    cy.get('select.poll-input.poll-select').select('Others');
    cy.get('button[type="submit"]').click();
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Poll created successfully!');
    });
  });
});
