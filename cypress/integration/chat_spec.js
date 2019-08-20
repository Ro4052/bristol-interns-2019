const url = Cypress.config().baseUrl;

describe('Chat', () => {
    describe('on send a message in the main lobby', () => {
        beforeEach(() => {
            cy.login('Bob');
            cy.sendMessage();   
        });

        it('displays the message', () => {     
            cy.get('[data-cy="message-text"]').should('have.text', 'message');
            cy.get('[data-cy="message-username"]').should('have.text', 'Bob');
        });

        it('clears the input', () => {
            cy.get('[data-cy="type-message"]').should('be.empty');
        });
    });

    describe('on someone else sends a message in the lobby when chat is shown', () => {
        beforeEach(() => {
            cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(url)}`)
            .then(() => cy.login('Bob'))
            .then(() => cy.createRoom(3))
            .then(() => cy.request(`http://localhost:12346/send-message?url=${encodeURIComponent(url)}`));
        });

        it("others see the message", () => {
            cy.get('[data-cy="message-text"]').should('have.text', 'message');
            cy.get('[data-cy="message-username"]').should('have.text', 'halfling');
        });
    });

    describe('on someone else sends a message in the lobby when chat is hidden', () => {
        beforeEach(() => {
            cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(url)}`)
            .then(() => cy.login('Bob'))
            .then(() => cy.createRoom(3))
            .then(() => cy.get('[data-cy="chat-arrow"]').click())
            .then(() => cy.request(`http://localhost:12346/send-message?url=${encodeURIComponent(url)}`));
        });

        it("others see the message", () => {
            cy.get('[data-cy="new-message"]').should('have.text', '+1');
        });
    });

    describe('on someone else sends a message in a room', () => {
        beforeEach(() => {
            cy.login('Bob')
            .then(() => cy.url().should('contain', '/lobby'))
            .then(() => cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(url)}`))
            .then(() => cy.request(`http://localhost:12346/createRoom?url=${encodeURIComponent(url)}`))
            .then(() => cy.request(`http://localhost:12346/startGame?url=${encodeURIComponent(url)}`))
            .then(() => cy.request(`http://localhost:12346/send-message?url=${encodeURIComponent(url)}`));
        });

        it('does not display the message in the lobby', () => {     
            cy.get('[data-cy="messages"]').should('not.exist');
        });
    });
});
