describe('The Played Cards Component', function() {
    beforeEach(() => {
        cy.visit('/')
        const username = "unicorn"
        cy.get('input').type(username)
        cy.get('button').click() 
    })

    afterEach(() => {
        cy.request({
            url: '/api/reset-server',
            method: 'POST'
        });
        cy.visit('/');
    });

    const cardsNumber = 3;

    /* GAME STARTS AND PLAYERS ARE GIVEN CARDS */
    describe("on current player's turn he is able to play a card and a word", () => {
        it('is able to start the game', () => {
            cy.get('#start-game').click();
            cy.get('#round-number');
            cy.get('#send-message');
            cy.get('#my-cards').click();
            cy.get('#my-cards ul').children().should(($ul) => {
                expect($ul).to.have.length(cardsNumber-1);
            });
        }); 
    });
});