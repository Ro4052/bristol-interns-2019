const url = Cypress.config().baseUrl;

describe('My Cards', () => {
    describe('when you are the storyteller', () => {
        beforeEach(() => {
            cy.signup('unicorn', 'password')
            .then(() => cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(url)}`))
            .then(() => cy.request(`http://localhost:12346/createRoom?rounds=3&url=${encodeURIComponent(Cypress.config().baseUrl)}`))
            .then(() => cy.joinRoom())
            .then(() => cy.startGame());
        });

        it("displays the correct number of cards", () => {
            cy.get('[data-cy="my-cards"] [data-cy="card-wrapper"]').its('length').should('eq', 6);
        });
    });
});
