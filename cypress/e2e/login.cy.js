describe('Login Component', () => {
  beforeEach(() => {
    // Visit the login page
    cy.visit('https://nusreviews-78805.web.app/login');  // Adjust the URL to the path of your login component
  });

  it('renders login page', () => {
    // Check if the header is visible
    cy.get('header').contains('Sign In to Contribute').should('be.visible');
  });

  it('displays error for invalid account', () => {
    // Interact with the login form
    cy.get('input[placeholder="email@u.nus.edu"]').type('invalid@u.nus.edu');
    cy.get('input[placeholder="password"]').type('password');
    cy.get('.login-container button.login-button').click();

    // Verify the error message
    cy.get('.error-message').should('contain', 'No account found with this email.');
  });

  it('logs in with valid account', () => {
    // Interact with the login form
    cy.get('input[placeholder="email@u.nus.edu"]').type('valid@u.nus.edu');
    cy.get('input[placeholder="password"]').type('password');
    cy.get('.login-container button.login-button').click();

    cy.url().should('include', '/');  // Adjust according to your app's behavior
  });

  it('redirects to the sign-up page when clicking create account', () => {
    // Click the create account button
    cy.get('.login-container a.login-button').click();  // Use a more specific selector

    // Check that the URL includes the sign-up path
    cy.url().should('include', '/login/signup');  // Adjust according to your app's sign-up path
  });
});
