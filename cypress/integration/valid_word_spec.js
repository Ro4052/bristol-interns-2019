describe('on receive 400 from server due to invalid word entered', () => {
    beforeEach(() => {
        cy.login('username');
        cy.startGame();
    });

    it('returns error', () => {
        // cy.sendWord();
        // cy.get('[data-cy="send-error"]').should('contain', 'Invalid word');
    })
})

