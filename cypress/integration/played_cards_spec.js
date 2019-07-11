describe('The Played Cards Component', function() {
    beforeEach(() => {        
        cy.login('unicorn');
        /* Connect a second user using our fake client */
        const url = Cypress.config().baseUrl;
        cy.request(`http://localhost:12346/connect-and-play?url=${encodeURIComponent(url)}`)
    })

    const cardsNumber = 3;
    const numberOfPlayers = 2;

    /* GAME STARTS AND PLAYERS ARE GIVEN CARDS */
    describe("on second player's turn, after first player has played", () => {
        it('player is prompted to pick a card and all the cards are displayed on the end of their turn', () => {
            cy.get('#round-number');
            cy.get('h3').contains("Pick a card");
            cy.get('#my-cards').click();
            cy.get('#my-cards ul').children().should(($ul) => {
                expect($ul).to.have.length(cardsNumber-1);
            });
            cy.get('#played-cards').children().should(($ul) => {
                expect($ul).to.have.length(numberOfPlayers);
            });
        });
    });
});