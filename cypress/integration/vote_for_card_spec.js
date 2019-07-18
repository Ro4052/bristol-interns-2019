describe('Vote for a card', () => {
    describe('on everyone played cards', () => {
        beforeEach(() => {
            cy.login('unicorn');
            cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(Cypress.config().baseUrl)}`)
            .then(() => {
                cy.startGame();
                cy.request(`http://localhost:12346/playCardWord?url=${encodeURIComponent(Cypress.config().baseUrl)}`)
                .then(() => {
                    cy.playCard();
                    console.log("done");
                });
            });
        });

        it('displays all played cards', () => {
            cy.get('[data-cy="played-cards"]').children().its('length').should('eq', 2);
        });

        it('prompts to vote for a card', () => {
            cy.get('[data-cy="vote-card"]');
        });

        describe('on vote for a card', () => {
            beforeEach(() => {
                cy.voteCard();
            });
            it("displays the votes", () => {
                cy.get('[data-cy="vote-card"]').should('not.exist');
                cy.get('[data-cy="vote"]').should('exist');
            });
        });
    });
});
