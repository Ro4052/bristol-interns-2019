describe('Played cards', () => {
    const cardsNumber = 3;
    const numberOfPlayers = 2;

    describe("at end of round", () => {
        beforeEach(() => {
            cy.login('unicorn');
            cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(Cypress.config().baseUrl)}`)
            .then(() => {
                cy.createRoom();
                cy.get('[data-cy="room-title"]').then(($title) => {
                    let id = $title.text().split(" ")[1];
                    cy.request(`http://localhost:12346/joinRoom?roomId=${id}&url=${encodeURIComponent(Cypress.config().baseUrl)}`)
                    .then(() => {
                        cy.startGame();
                        cy.request(`http://localhost:12346/playCardWord?url=${encodeURIComponent(Cypress.config().baseUrl)}`)
                        .then(() => {
                            cy.playCard();
                        });
                    })
                });
            });
        });
        it('all the played cards are displayed', () => {
            cy.get('[data-cy="my-cards"]').children().its('length').should('eq', cardsNumber - 1);
            cy.get('[data-cy="played-cards"]').children().its('length').should('eq', numberOfPlayers);
        });
    });
});
