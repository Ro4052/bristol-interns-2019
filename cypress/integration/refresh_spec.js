const url = Cypress.config().baseUrl;

describe('Refresh page', () => {
    beforeEach(() => {
        cy.login('unicorn');
        cy.createRoom();
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
                cy.get('[data-cy="played-cards"]').children().its('length').should('eq', 2);
            });
        });
    });

    describe('when second player votes for a card', () => {
        it('displays the cards after refresh', () => {
            cy.request(`http://localhost:12346/playCardWord?url=${encodeURIComponent(Cypress.config().baseUrl)}`)
            .then(() => {
                cy.playCard();
                cy.voteCard();
                cy.refreshPage();
                cy.get('[data-cy="vote-card"]').should('not.exist');
                cy.get('[data-cy="vote"]').should('exist');
            })
        });
    })
});
