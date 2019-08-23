const url = Cypress.config().baseUrl;

let score;

describe('Leaderboard', () => {
    describe('on logging in for the first time', () => {
        beforeEach(() => {
            cy.signup('unicorn', 'password')
            .then(() => cy.goToLeaderboard());
        });

        it('displays the username of the player with their relevant score', () => {
            cy.get('[data-cy="player-username"]').contains('unicorn');
            cy.get('[data-cy="player-score"]').should('exist');
            score = cy.get('[data-cy="player-score"]').first().then($score => {
                score = $score.text();
            });
        });
    });

    describe('on playing a whole game', () => {
        beforeEach(() => {
            cy.signup('unicorn', 'password')
            .then(() => cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(url)}`))
            .then(() => cy.request(`http://localhost:12346/createRoom?rounds=1&url=${encodeURIComponent(url)}`))
            .then(() => cy.joinRoom())
            .then(() => cy.startGame())
            .then(() => cy.playCardWord())
            .then(() => cy.get('[data-cy="game-over"]', { timeout: 20000 }))
            .then(() => cy.newGame());
        });

        it('updates the score of the player after a win', () => {
            cy.goToLeaderboard();
            cy.get('[data-cy="player-score"]').first().should('contain', (parseInt(score) + 3).toString());
        });
    });
});
