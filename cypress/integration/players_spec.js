describe('Players', () => {
    describe('on login', () => {
        it('your name appears in the players list', () => {
            cy.login('player1');
            cy.get('[data-cy="players-list"]').first().should('have.text', 'player1');
        });
        it('displays the players who have already joined', () => {
            cy.login('player1');
            // TODO: Write test
        });
    });

    describe('on another player log in', () => {
        it('their name is added to the players list', () => {
            cy.login('player1');
            // TODO: Write test
        });
    });
});
