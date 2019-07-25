describe('Valid word', () => {
    beforeEach(() => {
        cy.login('unicorn')
        cy.createRoom();
        cy.startGame();
    });

    describe('on submit a bad word', () => {
        it('displays an error', () => {
            cy.get('[data-cy="start-game"]').should('not.exist');
            cy.sendWord();
            cy.get('[data-cy="send-error"]').should('contain', 'Invalid word');
        });
    });    
});