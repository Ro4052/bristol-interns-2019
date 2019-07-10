describe('The Played Cards Component', function() {
    beforeEach(() => {        
        cy.visit('/')
        const username = "unicorn"
        cy.get('input').type(username)
        cy.get('button').click()
        /* Connect a second user using our fake client */
        const url = Cypress.config().baseUrl;
        cy.request(`http://localhost:8081/connect-and-play?url=${encodeURIComponent(url)}`)
    })

    afterEach(() => {
        cy.request({
            url: '/api/reset-server',
            method: 'POST'
        });
        cy.visit('/')
    });

    const cardsNumber = 3;
    const numberOfPlayers = 2;

    /* GAME STARTS AND PLAYERS ARE GIVEN CARDS */
    describe("on second player's turn, after first player has played", () => {
        it('player is prompted to pick a card and all the cards are displayed on the end of his turn', () => {
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
