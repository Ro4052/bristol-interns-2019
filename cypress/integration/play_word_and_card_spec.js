describe('Play word and card', () => {
    beforeEach(() => {
        cy.login('username');
        cy.startGame();
    });

    afterEach(() => cy.resetGame());

    describe('on start game', () => {
        it('prompts user to play a word and a card', () => {
            // Word prompt exists
            // cy.get('[data-cy=play-card]').should('exist');
            // Card prompt exists
            // cy.get('[data-cy=play-word]').should('exist');
        });
    });
    
    describe('on send a word and a card', () => {
        it('updates the game status', () => {
            // TODO
        });
    });    
});
