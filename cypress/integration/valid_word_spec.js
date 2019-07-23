describe('Valid word', () => {
    describe('on submit invalid word', () => {
        beforeEach(() => {
            cy.login('username');
            cy.startGame();
        });
        it('displays error', () => {
            cy.sendWord();
            cy.get('[data-cy="send-error"]').should('contain', 'Invalid word');
        });
    });    
});
