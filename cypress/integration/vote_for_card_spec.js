describe('Vote for a card', () => {
    /* TODO: comment back in when join functionality is integrated */
    beforeEach(() => {
        cy.login('unicorn');
        cy.createRoom();
        cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(Cypress.config().baseUrl)}`)
        .then(() => {
            cy.get('[data-cy="room-title"]').then(($title) => {
                let id = $title.text().split(" ")[1];
                cy.request(`http://localhost:12346/joinRoom?roomId=${id}&url=${encodeURIComponent(Cypress.config().baseUrl)}`)
                .then(() => {
                    cy.startGame();
                    cy.request(`http://localhost:12346/playCardWord?url=${encodeURIComponent(Cypress.config().baseUrl)}`)
                    .then(() => {
                        cy.playCard();
                    });
                })
            });
        });
    });

    describe('on everyone played cards', () => {
        it('displays all played cards', () => {
            cy.get('[data-cy="played-cards"]').children().its('length').should('eq', 2);
        });

        it('prompts to vote for a card', () => {
            cy.get('[data-cy="vote-card"]');
        });
    });

    describe('on vote for a card', () => {
        it("displays the votes", () => {
            cy.voteCard();
            cy.get('[data-cy="vote-card"]').should('not.exist');
            cy.get('[data-cy="vote"]').should('exist');
        });
    });
});
