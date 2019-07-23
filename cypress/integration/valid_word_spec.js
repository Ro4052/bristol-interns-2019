describe('Valid word', () => {
    describe('on submit a bad word', () => {
        beforeEach(() => {
            cy.login('username');
            cy.createRoom();
            cy.startGame();
        });
        it('displays an error', () => {
            cy.sendWord();
            cy.get('[data-cy="send-error"]').should('contain', 'Invalid word');
        });
    });    
});
