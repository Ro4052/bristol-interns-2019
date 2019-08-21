const url = Cypress.config().baseUrl;

describe('Refresh page', () => {
    beforeEach(() => {
        cy.signup('unicorn', 'password');
        cy.createRoom(3);
        cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(url)}`)
        .then(() => cy.request(`http://localhost:12346/joinRoom?roomId=0&url=${encodeURIComponent(Cypress.config().baseUrl)}`))
        .then(() => cy.startGame());
    });

    it('refreshes on start', () => {
        cy.refreshPage();
        cy.get('[data-cy="play-card"]').should('not.exist');
    });

    describe('when first player has played card and word', () => {
        it('is prompted to play a card after refresh', () => {
            cy.request(`http://localhost:12346/playCardWord?url=${encodeURIComponent(Cypress.config().baseUrl)}`)
            .then(() => {
                cy.refreshPage();
                cy.get('[data-cy="play-card"]').should('exist');
            });
        });
    });

    describe('when second player has played a card', () => {
        it('is prompted to vote and displays the cards after refresh', () => {
            cy.request(`http://localhost:12346/playCardWord?url=${encodeURIComponent(Cypress.config().baseUrl)}`)
            .then(() => {
                cy.playCard();
                cy.refreshPage();
                cy.get('[data-cy="vote-card"]').should('exist');
                cy.get('[data-cy="played-card"]');
                cy.get('[data-cy="played-cards"] [data-cy="card-wrapper"]').its('length').should('eq', 1);
            });
        });
    });

    describe('when second player votes for a card', () => {
        it('displays the votes after refresh', () => {
            cy.request(`http://localhost:12346/playCardWord?url=${encodeURIComponent(Cypress.config().baseUrl)}`)
            .then(() => {
                cy.get('[data-cy="voter"]', { timeout: 20000 }).should('exist');
                cy.refreshPage();
                cy.get('[data-cy="voter"]').should('exist');
                cy.get('[data-cy="vote-card"]').should('not.exist');
            });
        });
    });
});
