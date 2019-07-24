const url = Cypress.config().baseUrl;

describe('Play card', () => {
    beforeEach(() =>  cy.login('unicorn'));

    /* TODO: comment back in when join functionality is integrated */
    describe('when first player has played card and word', () => {
        it('is prompted to play a card', () => {
            // cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(url)}`)
            // .then(() => {
            //     cy.request(`http://localhost:12346/createRoom?url=${encodeURIComponent(url)}`)
            //     .then(() => {
            //         cy.joinRoom();
            //         cy.startGame();
            //         cy.request(`http://localhost:12346/playCardWord?url=${encodeURIComponent(url)}`)
            //         .then(() => {
            //             cy.get('[data-cy="play-card"]').should('exist');
            //         });
            //     })
            // });
            cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(url)}`)
            .then(() => {
                cy.request(`http://localhost:12346/createRoom?url=${encodeURIComponent(url)}`)
                .then(() => {
                    cy.joinRoom();
                    cy.get('[data-cy="player-username"]').first().should('have.text', 'halfling');
                    cy.get('[data-cy="player-username"]').last().should('have.text', 'unicorn');
                })
            })
        });
    });
});
