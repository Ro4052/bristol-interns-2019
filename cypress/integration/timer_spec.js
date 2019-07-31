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
            .then(() => cy.request(`http://localhost:12346/playCardWord?url=${encodeURIComponent(Cypress.config().baseUrl)}`));
        });

        it('displays the timer', () => {
            cy.get('[data-cy="card-timer"]');
        });

        describe('after timeout', () => {
            it('hides the timer', () => {
                cy.get('[data-cy="card-timer"]', { timeout: promptDuration + 2000 }).should('not.exist');
            });

            it('displays the vote prompt', () => {
                cy.get('[data-cy="vote-card"]', { timeout: promptDuration + 2000 });
            });

            it('displays the vote timer', () => {
                cy.get('[data-cy="vote-timer"]', { timeout: promptDuration + 2000 });
            });

            it('hides the timer', () => {
                cy.get('[data-cy="card-timer"]', { timeout: promptDuration + 2000 }).should('not.exist');
            });

            it('displays all the cards', () => {
                cy.get('[data-cy="played-cards"]', {timeout: promptDuration + 2000 }).children().its('length').should('eq', 2);
            });
        });
    });
});
