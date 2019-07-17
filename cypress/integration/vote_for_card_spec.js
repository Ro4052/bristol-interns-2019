describe('Vote for a card', () => {
    beforeEach(() => {
        cy.login('unicorn');
        cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(Cypress.config().baseUrl)}`)
        .then(() => {
            cy.server();
            cy.route({
                method: 'GET',
                url: '/api/start'
            }).as('start');
            cy.get('[data-cy="player-username"]').first().should('have.text', 'unicorn');
            cy.get('[data-cy="player-username"]').last().should('have.text', 'halfling');
            cy.startGame();
            cy.wait('@start').then(() => {
                cy.request(`http://localhost:12346/playCardWord?url=${encodeURIComponent(Cypress.config().baseUrl)}`)
                .then(() => {
                    cy.get('[data-cy="my-cards"] > img').first().click();
                });
            })
        });
    });

    describe('on everyone played cards', () => {
        it('displays all played cards', () => {
            cy.get('[data-cy="played-cards"]').children().its('length').should('eq', 2);
        });
        it('player is prompted to vote for a card', () => {
            cy.get('[data-cy="vote-card"]');
        });
    });

    describe('on vote for a card', () => {
        beforeEach(() => {
            cy.get('[data-cy="played-cards"] > li > img').first().click();
        });
        it("displays the votes", () => {
        //     cy.get('[data-cy="played-cards"] > li > img').first().then(($img) => {
        //         if ($img.hasClass('Cards_allCards__2SdBy')) {
        //             cy.get('[data-cy="played-cards"] > li').first().click()
        //         } else {
        //             cy.get('[data-cy="played-cards"] > li').last().click();
        //         }
        //     });
            cy.get('[data-cy="vote-card"]').should('not.exist');
        //     cy.get('[data-cy="votes"]').should('exist');
        });
    });
});
