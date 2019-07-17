describe('Play card', () => {
    beforeEach(() => {
        cy.server();
        cy.route({
            method: "POST",
            url: "/auth/login",
        }).as('login');
        cy.login('unicorn');
        cy.wait('@login').then(() => {
            cy.url().should('include', '/dashboard');
            cy.get('[data-cy="player-username"]').first().should('have.text', 'unicorn');
        });
    });

    describe('when first player has played card and word', () => {
        it('is prompted to play a card', () => {
            cy.request({
                method: 'GET',
                url: `http://localhost:12346/connect?url=${encodeURIComponent(Cypress.config().baseUrl)}`,
                followRedirect: false
            });
            cy.route({
                method: 'GET',
                url: '/api/start'
            }).as('start');
            cy.startGame();
            cy.wait('@start').then(() => {
                cy.request({
                    method: 'GET',
                    url: `http://localhost:12346/playCardWord?url=${encodeURIComponent(Cypress.config().baseUrl)}`,
                    followRedirect: false
                })
                .then(() => {
                    cy.get('[data-cy="play-card"]').should('exist');
                });
            });
        });
    });
});
