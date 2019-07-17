// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('login', username => {
    cy.get('input').type(username);
    cy.get('button').click();
});

Cypress.Commands.add('startGame', () => {
    cy.url().should('include', '/dashboard');
    cy.get('[data-cy="start-game"]').should('be.visible')
    cy.get('[data-cy="start-game"]').click({ force: true });
});

Cypress.Commands.add('resetGame', () => {
    cy.request({
        url: '/api/reset-server',
        method: 'POST'
    });
});

Cypress.Commands.add('playWordCard', () => {
    cy.get('[data-cy="my-cards"] > img').first().click();
    cy.get('[data-cy="type-word"]').type('word');
    cy.get('[data-cy="send-word"]').click();
    cy.get('[data-cy="end-turn"]').click();
});

Cypress.Commands.add('playCard', () => {
    cy.get('[data-cy="my-cards"] > img').first().click();
});

Cypress.Commands.add('voteCard', () => {
    cy.get('[data-cy="played-cards"] > li > img').first().click();
});

Cypress.Commands.add('sendWord', () => {
    cy.get('[data-cy="type-word"]').type('fuck');
    cy.get('[data-cy="send-word"]').click();
})