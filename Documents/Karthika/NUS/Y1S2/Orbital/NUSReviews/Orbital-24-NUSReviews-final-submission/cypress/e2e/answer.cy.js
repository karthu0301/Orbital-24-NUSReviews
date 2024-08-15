describe('QuestionsThread Logged out', () => {
  beforeEach(() => {
    cy.visit('https://nusreviews-78805.web.app/courses/questions/hlIYNOfkyv5s1kg4iACb');
  });

  it('alerts user to log in when submitting a reply without being logged in', () => {
    cy.get('textarea').type('meep bop.');
    cy.get('button[type="submit"]').click();

    cy.on('window:alert', (text) => {
      expect(text).to.contains('Please Log in to proceed.');
    });
  });
});

describe('QuestionsThread Logged in', () => {
  beforeEach(() => {
    cy.visit('https://nusreviews-78805.web.app/login');
    cy.get('input[placeholder="email@u.nus.edu"]').type('test@u.nus.edu');
    cy.get('input[placeholder="password"]').type('testing');
    cy.get('.login-container button.login-button').click();
    cy.visit('https://nusreviews-78805.web.app/courses/questions/hlIYNOfkyv5s1kg4iACb');
  });

  it('checks profanity filter on replies', () => {
    cy.get('textarea').type('This is a shitty question');
    cy.get('button[type="submit"]').click();
    cy.get('.text').should('contain', 'This response has been flagged for inappropriate content.');
  });

  it('submit reply when logged in', () => {
    cy.get('textarea').type('beep boop.');
    cy.get('button[type="submit"]').click();
  });

  it('submits reply with attachment', () => {
    const fileName = '../fixtures/book-icon.png';
    cy.get('textarea').type('Here is a photo related to my query.');
    cy.get('input[type="file"]').attachFile(fileName);
    cy.get('button[type="submit"]').click();
  });
});