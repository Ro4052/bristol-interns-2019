describe('Play word and card', () => {
    beforeEach(() => {
        cy.login('username');
        cy.startGame();
    });

    describe('on start game', () => {
        it('prompts user to play a word and a card', () => {
            cy.get('[data-cy="play-word"]').should('exist');
            cy.get('[data-cy="play-card"]').should('exist');
        });
    });

    describe('on send a word and a card', () => {
        it('updates the game status', () => {
            // TODO
        });
    });    
});
