describe('Play word and card', () => {
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

    describe('on start game', () => {
        it('prompts user to play a word and a card', () => {
            cy.route({
                method: "GET",
                url: "/api/start",
            }).as('start');
            cy.startGame();
            cy.wait('@start').then(() => {
                cy.get('[data-cy="start-game"]').should('not.exist');
                cy.get('[data-cy="play-word"]').should('exist');
                cy.get('[data-cy="play-card"]').should('exist');
            });
        });
    });

    describe('on send a word and a card', () => {
        it('displays the word', () => {
            cy.route({
                method: "GET",
                url: "/api/start",
            }).as('start');
            cy.startGame();
            cy.wait('@start').then(() => {
                cy.playWordCard();
                cy.get('[data-cy="current-word"]').should('have.text', 'word');
            });
        });
    });    
});
