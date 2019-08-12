const url = Cypress.config().baseUrl;

let score;

describe('Leaderboard', () => {
    describe('on logging in for the first time', () => {
        beforeEach(() => {
            cy.login('unicorn')
            .then(() => {
                return cy.route({
                method: "GET",
                url: "/api/game-state",
            }).as('getState')})
            .then(() => cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(url)}`));
        });

        it('displays the username with a score of zero', () => {

            cy.wait('@getState');
            cy.get('[data-cy="go-leaderboard"]').click();
            cy.get('[data-cy="player-username"]').contains('unicorn');
            score = cy.get('[data-cy="player-score"]').first().then($score => {
                score = $score.text();
            })
        });
    });

    describe('on playing a whole game', () => {
        beforeEach(() => {
            cy.login('unicorn')
            .then(() => cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(url)}`))
            .then(() => cy.request(`http://localhost:12346/createRoom?rounds=1&url=${encodeURIComponent(url)}`))
            .then(() => cy.joinRoom())
            .then(() => cy.startGame())
            .then(() => cy.playCardWord())
            .then(() => cy.get('[data-cy="game-over"]', { timeout: 20000 }))
            .then(() => cy.newGame());
        });

        it('updates the score of the player', () => {
            cy.get('[data-cy="go-leaderboard"]').click();  
            cy.get('[data-cy="player-score"]').first().should('contain', (parseInt(score) + 3).toString());
        });
    });
});
