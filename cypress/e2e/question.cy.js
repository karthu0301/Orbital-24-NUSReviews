describe('QuestionList Component', () => {
  beforeEach(() => {
      cy.visit('https://nusreviews-78805.web.app/courses/questions');
  });

  it('should display error for missing category on submission', () => {
      cy.get('input[name="newQuestion"]').type('How do I reset my password?');
      cy.get('button[type="submit"]').click();
      cy.get('.error').should('contain', 'Category is required!');
  });

  it('submits a new question successfully', () => {
      cy.get('input[name="newQuestion"]').type('What is the deadline for module registration?');
      cy.get('.category-select select').select('Application Matters');
      cy.get('button[type="submit"]').click();
  });

  it('checks profanity filter on question input', () => {
      cy.get('input[name="newQuestion"]').type('This is a shitty question');
      cy.get('button[type="submit"]').click();
      cy.get('.error-message').should('contain', 'Your input contains inappropriate content.');
  });

  it('submits question with attachment', () => {
      const fileName = '../fixtures/book-icon.png';
      cy.get('input[name="newQuestion"]').type('Here is a photo related to my query.');
      cy.get('.category-select select').select('Design & Engineering');
      cy.get('input[type="file"]').attachFile(fileName);
      cy.get('button[type="submit"]').click();
  });

  it('toggles anonymous submission', () => {
      cy.get('input[name="newQuestion"]').type('Anonymous question test');
      cy.get('.category-select select').select('Others');
      cy.get('#anonymous').check();
      cy.get('button[type="submit"]').click();
  });
});