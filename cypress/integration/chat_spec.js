const url = Cypress.config().baseUrl;

describe('on send a message', () => {
    beforeEach(() => {
        cy.login('Bob');
        cy.sendMessage();   
    });

    it('displays the message', () => {     
        cy.get('[data-cy="messages"]').should('have.text', 'Bob : message');
    });
});

describe('on someone else sends a message', () => {
    beforeEach(() => {
        cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(url)}`)
        .then(() => cy.login('Bob'));
        cy.createRoom(3);
        cy.request(`http://localhost:12346/send-message?url=${encodeURIComponent(url)}`);
    });

    it("others see the message", () => {
        cy.get('[data-cy="messages"]').should('have.text', 'halfling : message');
    });
});
