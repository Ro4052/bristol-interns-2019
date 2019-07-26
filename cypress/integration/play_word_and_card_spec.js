describe('Play word and card', () => {
    beforeEach(() => {
        cy.login('unicorn')
        cy.createRoom();
        cy.startGame();
    });

    describe('on start game', () => {
        it('prompts user to play a word and a card', () => {
            cy.get('[data-cy="play-word"]').should('exist');
            cy.get('[data-cy="play-card"]').should('exist');
        });
    });

    describe('on send a word and a card', () => {
        it('displays the word', () => {
            cy.playCardWord();
            cy.get('[data-cy="current-word"]').should('have.text', 'word');
        });
        it("marks the player's turn as finished", () => {
            cy.playCardWord();
            cy.get('[data-cy="finished-turn"]').should('have.text', '✓');
        });
    });    
});
