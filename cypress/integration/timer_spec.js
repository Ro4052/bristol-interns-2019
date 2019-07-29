describe('Timer', () => {
    describe(('when the storyteller plays a card and a word'), () => {
        beforeEach(() => {
            cy.login('unicorn');
            cy.createRoom();
            cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(Cypress.config().baseUrl)}`)
            .then(() => cy.get('[data-cy="room-title"]'))
            .then(($title) => {
                const id = $title.text().split(" ")[1];
                return cy.request(`http://localhost:12346/joinRoom?roomId=${id}&url=${encodeURIComponent(Cypress.config().baseUrl)}`)
            })
            .then(() => {
                cy.startGame();
                cy.request(`http://localhost:12346/playCardWord?url=${encodeURIComponent(Cypress.config().baseUrl)}`);
            });
        });

        it('displays the timer', () => {
            cy.get('[data-cy="card-timer"]');
        });

        describe('after timeout', () => {
            it('hides the timer', () => {
                cy.get('[data-cy="card-timer"]', { timeout: 6000 }).should('not.exist');
            });

            it('displays the vote prompt', () => {
                cy.get('[data-cy="vote-card"]', { timeout: 6000 });
            });

            it('displays the vote timer', () => {
                cy.get('[data-cy="vote-timer"]', { timeout: 6000 });
            });

            describe('after timeout', () => {
                it('hides the timer', () => {
                    cy.get('[data-cy="vote-timer"]', { timeout: 6000 }).should('not.exist');
                });

                it('displays all the cards', () => {
                    cy.get('[data-cy="played-cards"]', {timeout: 6000}).children().its('length').should('eq', 2);
                });
            });
        });
    });
});
