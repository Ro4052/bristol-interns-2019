describe('Vote for a card', () => {
    beforeEach(() => {
        cy.login('unicorn');
        /* Connect a second user using our fake client */
        cy
            .request(`http://localhost:12346/connect?url=${encodeURIComponent(Cypress.config().baseUrl)}`)
            .then((response) => {
                if (response.status === 200) {
                    cy.startGame();
                    cy.request(`http://localhost:12346/playCardWord?url=${encodeURIComponent(Cypress.config().baseUrl)}`)
                }
            });
        cy.get('#current-player').then(($player) => {
            if ($player.text() === 'Current player: unicorn') {
                cy.get('[data-cy="type-word"]').type('word');
                cy.get('[data-cy="send-word"]').click();
                cy.get('[data-cy="my-cards"] > img').first().click();
            } else {
                cy.get('[data-cy="my-cards"] > img').first().click(); 
            }
        });
    });

    describe('on player plays a card and then votes for one', () => {
        it('displays all played cards after current player plays their card', () => {
            cy.get('[data-cy="played-cards"]').children().its('length').should('eq', 2);
        });
        it('player is prompted to vote for a card', () => {
            cy.get('[data-cy="vote-card"]');
        });
        it("player is able to vote for the other player's card only", () => {
            cy.get('[data-cy="played-cards"] > img').first().then(($img) => {
                if ($img.hasClass('Cards_allCards__2SdBy')) {
                    cy.get('[data-cy="played-cards"] > img').first().click()
                } else {
                    cy.get('[data-cy="played-cards"] > img').last().click();
                }
            })
            cy.get('[data-cy="played-cards"] > img').should('not.exist');
        });
    });

    describe('on all players have voted and votes are displayed', () => {
        it('displays all cards that can be voted for', () => {
            cy.get('[data-cy="played-cards"]').children().its('length').should('eq', 2);
        });
        it("displays votes when all players vote for a card", () => {
            cy.get('[data-cy="played-cards"] > img').first().then(($img) => {
                if ($img.hasClass('Cards_allCards__2SdBy')) {
                    cy.get('[data-cy="played-cards"] > img').first().click()
                } else {
                    cy.get('[data-cy="played-cards"] > img').last().click();
                }
            })
            cy.get('[data-cy="played-cards"] > img').should('not.exist');
        });
    });
});
