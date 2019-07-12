describe('Play word and card', () => {
    beforeEach(() => {
        cy.login('username');
        cy.wait(500);
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
            cy.get('[data-cy="type-word"]').type('word');
            cy.get('[data-cy="send-word"]').click();
            cy.get('[data-cy="my-cards"] > img').first().click();
            cy.get('[data-cy="end-turn"]').click();
            cy.get('[data-cy="current-word"]').should('have.text', 'word');
        });
        it('can be done in either order', () => {
            cy.get('[data-cy="my-cards"] > img').first().click();
            cy.get('[data-cy="type-word"]').type('word');
            cy.get('[data-cy="send-word"]').click();
            cy.get('[data-cy="end-turn"]').click();
            cy.get('[data-cy="current-word"]').should('have.text', 'word');
        });
    });    
});
