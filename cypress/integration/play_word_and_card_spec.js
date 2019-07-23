describe('Play word and card', () => {
    beforeEach(() => cy.login('unicorn'));
    describe('on start game', () => {
        it('prompts user to play a word and a card', () => {
            cy.startGame();
            cy.get('[data-cy="play-word"]').should('exist');
            cy.get('[data-cy="play-card"]').should('exist');
        });
    });

    describe('on send a word and a card', () => {
        it('displays the word', () => {
            cy.startGame();
            cy.playCardWord();            
            cy.get('[data-cy="current-word"]').should('have.text', 'word');
        });
    });    
});
