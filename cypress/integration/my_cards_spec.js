describe('My Cards', () => {
    beforeEach(() => {
        cy.login('unicorn');
        cy.createRoom();
        cy.startGame();
    });
    
    describe('when the game has started', () => {
        it("displays the correct number of cards", () => {
            cy.get('[data-cy="my-cards"]').children().its('length').should('eq', 3);
        });
    });

    describe('player clicks on a card', () => {
        it("its class is updated to selected", () => {
            cy.wait(1000);
            cy.get('[data-cy="my-cards"]').find('[data-cy="card"]').first().click().then(() => {
                cy.get('[data-cy="my-cards"]').find('[data-cy="card-wrapper"]').first().then(($wrapper) => {
                    const selected = /selected/;
                    const classList = Array.from($wrapper[0].classList);
                    expect(classList.some(cls => selected.test(cls))).to.equal(true);
                });
            });
        });
    });
});
