const promptDuration = 5000;

describe('Timer', () => {
    describe(('when the storyteller plays a card and a word'), () => {
        beforeEach(() => {
            cy.login('unicorn');
            cy.createRoom();
            cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(Cypress.config().baseUrl)}`)
            .then(() => cy.get('[data-cy="room-title"]'))
            .then(() => cy.request(`http://localhost:12346/joinRoom?roomId=0&url=${encodeURIComponent(Cypress.config().baseUrl)}`))
            .then(() => cy.startGame())
            .then(() => cy.request(`http://localhost:12346/playCardWord?url=${encodeURIComponent(Cypress.config().baseUrl)}`))
            .then(() => cy.get('[data-cy="play-card"]'));
        });

        it('displays the timer', () => {
            cy.get('[data-cy="card-timer"]');
        });

        describe('after play card timeout', () => {
            beforeEach(() => {
                cy.get('[data-cy="play-card"]', { timeout: promptDuration + 2000 }).should('not.exist');
            });

            it('hides the play card timer and displays the vote prompt and timer', () => {
                cy.get('[data-cy="card-timer"]').should('not.exist');
                cy.get('[data-cy="vote-card"]');
                cy.get('[data-cy="vote-timer"]');
            });

            describe('after vote timeout', () => {
                beforeEach(() => {
                    cy.get('[data-cy="vote-card"]', { timeout: promptDuration + 2000 }).should('not.exist');
                });

                it('hides the timer and displays the cards', () => {
                    cy.get('[data-cy="vote-timer"]').should('not.exist');
                    cy.get('[data-cy="played-cards"]').children().its('length').should('eq', 2);
                });
            });
        });
    });
});
