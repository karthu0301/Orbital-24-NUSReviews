describe('SignUp Component', () => {
  beforeEach(() => {
    // Visit the sign-up page
    cy.visit('https://nusreviews-78805.web.app/login/signup');
  });

  it('renders sign-up page', () => {
    // Check if the header is visible
    cy.get('header').contains('Create an account').should('be.visible');
  });

  it('displays error for invalid NUS email', () => {
    // Interact with the sign-up form
    cy.get('input[placeholder="email@u.nus.edu"]').type('invalid@gmail.com');
    cy.get('input[placeholder="enter display name"]').type('Test User');
    cy.get('input[placeholder="enter password"]').type('password');
    cy.get('input[placeholder="re-enter password"]').type('password');
    cy.get('.verify-button').click();

    // Verify the error message
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Please use a valid NUS email address.');
    });
  });

  it('displays error for mismatched passwords', () => {
    // Interact with the sign-up form
    cy.get('input[placeholder="email@u.nus.edu"]').type('valid@u.nus.edu');
    cy.get('input[placeholder="enter display name"]').type('Test User');
    cy.get('input[placeholder="enter password"]').type('password');
    cy.get('input[placeholder="re-enter password"]').type('differentpassword');
    cy.get('.verify-button').click();

    // Verify the error message
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Passwords do not match!');
    });
  });

  it('displays error for missing display name', () => {
    // Interact with the sign-up form
    cy.get('input[placeholder="email@u.nus.edu"]').type('valid@u.nus.edu');
    cy.get('input[placeholder="enter password"]').type('password');
    cy.get('input[placeholder="re-enter password"]').type('password');
    cy.get('.verify-button').click();

    // Verify the error message
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Display Name is required.');
    });
  });

  it('signs up with valid information', () => {
    // Interact with the sign-up form
    cy.get('input[placeholder="email@u.nus.edu"]').type('valid@u.nus.edu');
    cy.get('input[placeholder="enter display name"]').type('Test User');
    cy.get('input[placeholder="enter password"]').type('password');
    cy.get('input[placeholder="re-enter password"]').type('password');
    cy.get('.verify-button').click();

    // Verify the success message and redirection
    cy.on('window:alert', (str) => {
      expect(str).to.contain('A verification email has been sent to your email address. Please verify your email to proceed.');
    });

    // Increase the timeout to wait for the URL change
    cy.url({ timeout: 10000 }).should('include', '/login');
  });
});
