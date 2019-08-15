describe('Vote for a card', () => {
    beforeEach(() => {
        cy.login('unicorn')
        .then(() => cy.createRoom(3))
        .then(() => cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(Cypress.config().baseUrl)}`))
        .then(() => cy.get('[data-cy="room-title"]'))
        .then(() => cy.request(`http://localhost:12346/joinRoom?roomId=0&url=${encodeURIComponent(Cypress.config().baseUrl)}`))
        .then(() => cy.startGame());
    });

    describe('on everyone played cards', () => {
        it('displays all played cards', () => {
            cy.request(`http://localhost:12346/playCardWord?url=${encodeURIComponent(Cypress.config().baseUrl)}`)
            .then(() => {
                cy.playCard();
                cy.get('[data-cy="played-cards"] [data-cy="card-wrapper"]').its('length').should('eq', 2);
            });
        });
        it('prompts to vote for a card', () => {
            cy.request(`http://localhost:12346/playCardWord?url=${encodeURIComponent(Cypress.config().baseUrl)}`)
            .then(() => {
                cy.playCard();
                cy.get('[data-cy="vote-card"]');
            });
        });
    });

    describe('on vote for a card', () => {
        it("displays the votes", () => {
            cy.request(`http://localhost:12346/playCardWord?url=${encodeURIComponent(Cypress.config().baseUrl)}`)
            .then(() => {
                cy.playCard();
                cy.voteCard();
                cy.get('[data-cy="vote-card"]').should('not.exist');
                cy.get('[data-cy="voter"]').should('exist');
            });
        });
        it("marks the player's turn as finished", () => {
            cy.request(`http://localhost:12346/playCardWord?url=${encodeURIComponent(Cypress.config().baseUrl)}`)
            .then(() => {
                cy.playCard();
                cy.voteCard();
                cy.get('[data-cy="finished-turn"]').should('have.text', '✓');
            });
        });
    });
});
