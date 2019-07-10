describe('The Login Page', function () {

    it('sets auth cookie when logging in via form submission', function () {
        // destructuring assignment of the this.currentUser object
        cy.login('jane');

        // we should be redirected to /dashboard
        cy.url().should('include', '/dashboard');

        // our auth cookie should be present
        cy.getCookie('username').should('exist');

        // UI should reflect this user being logged in
        cy.get('#players').should('contain', 'jane');
    });
});
