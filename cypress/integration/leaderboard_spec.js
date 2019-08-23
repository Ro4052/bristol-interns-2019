describe('Leaderboard', () => {
    describe('on logging in for the first time', () => {
        beforeEach(() => {
            cy.signup('unicorn', 'password')
            .then(() => cy.goToLeaderboard());
        });

        it('displays the username of the player with their relevant score', () => {
            cy.get('[data-cy="player-username"]').contains('unicorn');
            cy.get('[data-cy="player-score"]').should('exist');
        });
    });

    describe('on playing a whole game', () => {
        beforeEach(() => {
            cy.signup('unicorn', 'password')
            .then(() => cy.createRoom(3))
            .then(() => cy.addAIPlayer())
            .then(() => cy.startGame())
            .then(() => cy.playCard())
            .then(() => cy.voteCard())
            .then(() => cy.get('[data-cy="game-over"]', { timeout: 20000 }))
            .then(() => cy.backToLobby());
        });

        it('updates the score of the player after a win', () => {
            cy.goToLeaderboard();
            cy.get('[data-cy="player-score"]').first().should('not.contain', '0');
        });
    });
});
