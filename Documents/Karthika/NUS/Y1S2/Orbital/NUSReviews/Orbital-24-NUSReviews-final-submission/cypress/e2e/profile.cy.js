describe('Profile Component', () => {
  beforeEach(() => {
    cy.visit('https://nusreviews-78805.web.app/login');
    cy.get('input[placeholder="email@u.nus.edu"]').type('test@u.nus.edu');
    cy.get('input[placeholder="password"]').type('testing');
    cy.get('.login-container button.login-button').click();
    cy.visit('https://nusreviews-78805.web.app/profile');
  });

  it('renders profile page', () => {
    cy.get('.profile-header').should('exist');
    cy.get('.profile-info').should('exist');
    cy.contains('Edit profile image').should('be.visible');
  });

  it('displays error for missing display name', () => {
    cy.get('input[name="displayName"]').clear();
    cy.get('.save-button').click();
    cy.get('.error').should('contain', 'Username is required');
  });

  it('updates profile with valid information', () => {
    cy.get('input[name="name"]').clear().type('Test User');
    cy.get('select[name="role"]').select('Student');
    cy.get('input[name="courseOfStudy"]').clear().type('Computer Science');
    cy.get('select[name="yearOfStudy"]').select('3');
    cy.get('input[name="additionalInfo"]').clear().type('Some additional info');
    cy.get('.save-button').click();

    // Verify the success message and the update in eligibility
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Profile updated successfully');
    });
  });
});