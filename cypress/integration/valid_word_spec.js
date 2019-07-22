describe('Valid word', () => {
    describe('on submit a bad word', () => {
        console.log('bean')
        beforeEach(() => {
            cy.login('username');
            cy.startGame();
        });
        it('displays an error', () => {
            cy.sendWord();
            cy.get('[data-cy="send-error"]').should('contain', 'Invalid word');
        });
    });    
});
