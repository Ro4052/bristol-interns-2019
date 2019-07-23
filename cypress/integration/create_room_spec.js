describe('Create room', () => {
    beforeEach(() => cy.login('unicorn'));

    describe('when a player has successfully logged in', () => {
        it('is able to create a new room and is then added to that room', () => {
            cy.createRoom();
            cy.get('[data-cy="player-username"]').first().should('have.text', 'unicorn');
        });
    });
});
