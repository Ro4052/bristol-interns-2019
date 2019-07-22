describe('Vote for a card', () => {
    describe('on everyone played cards', () => {
        it('displays all played cards', () => {
            cy.login('unicorn');
            cy.request({
                method: 'GET',
                url: `http://localhost:12346/connect?url=${encodeURIComponent(Cypress.config().baseUrl)}`,
                followRedirect: false
            }).then(() => {
                cy.startGame();
                cy.request(`http://localhost:12346/playCardWord?url=${encodeURIComponent(Cypress.config().baseUrl)}`)
                .then(() => {
                    cy.playCard();
                    cy.get('[data-cy="played-cards"]').children().its('length').should('eq', 2);
                });
            });
        });

        it('prompts to vote for a card', () => {
            cy.login('unicorn');
            cy.request({
                method: 'GET',
                url: `http://localhost:12346/connect?url=${encodeURIComponent(Cypress.config().baseUrl)}`,
                followRedirect: false
            }).then(() => {
                cy.startGame();
                cy.request(`http://localhost:12346/playCardWord?url=${encodeURIComponent(Cypress.config().baseUrl)}`)
                .then(() => {
                    cy.playCard();
                    cy.get('[data-cy="vote-card"]');
                });
            });
        });

        describe('on vote for a card', () => {
            it("displays the votes", () => {
                cy.login('unicorn');
                cy.request({
                    method: 'GET',
                    url: `http://localhost:12346/connect?url=${encodeURIComponent(Cypress.config().baseUrl)}`,
                    followRedirect: false
                }).then(() => {
                    cy.startGame();
                    cy.request(`http://localhost:12346/playCardWord?url=${encodeURIComponent(Cypress.config().baseUrl)}`)
                    .then(() => {
                        cy.playCard();
                        cy.voteCard();
                        cy.get('[data-cy="vote-card"]').should('not.exist');
                        cy.get('[data-cy="vote"]').should('exist');
                    });
                });
            });
        });
    });
});
