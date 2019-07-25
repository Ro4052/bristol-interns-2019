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
    cy.route({
        method: 'POST',
        url: '/auth/login'
    }).as('login');
    cy.get('input').type(username);
    cy.get('button').click();
    cy.wait('@login');
});

Cypress.Commands.add('startGame', () => {
    cy.route({
        method: "GET",
        url: "/api/start",
    }).as('start');
    cy.get('[data-cy="start-game"]').click();
    cy.wait('@start');
});

Cypress.Commands.add('playCardWord', () => {
    cy.route({
        method: 'POST',
        url: '/api/playCardWord'
    }).as('playCardWord');
    cy.get('[data-cy="my-cards"] [data-cy="card"]').first().click();
    cy.get('[data-cy="type-word"]').type('word');
    cy.get('[data-cy="send-word"]').click();
    cy.get('[data-cy="end-turn"]').click();
    cy.wait('@playCardWord');
});

Cypress.Commands.add('playCard', () => {
    cy.route({
        method: 'POST',
        url: '/api/playCard'
    }).as('playCard');
    cy.get('[data-cy="my-cards"] [data-cy="card"]').first().click();
    cy.wait('@playCard');
});

Cypress.Commands.add('voteCard', () => {
    cy.route({
        method: 'POST',
        url: '/api/voteCard'
    }).as('voteCard');
    cy.get('[data-cy="played-cards"] [data-cy="card-wrapper"]').first().then(($wrapper) => {
        const disabled = /disabled/;
        const classList = Array.from($wrapper[0].classList);
        if (classList.some(cls => disabled.test(cls))) $wrapper = $wrapper.next();
        $wrapper.click();
    });
    cy.wait('@voteCard');
});

Cypress.Commands.add('sendWord', () => {
    cy.route({
        method: 'POST',
        url: '/api/validWord'
    }).as('validWord');
    cy.get('[data-cy="type-word"]').type('fuck');
    cy.get('[data-cy="send-word"]').click();
    cy.wait('@validWord');
});

Cypress.Commands.add('createRoom', () => {
    cy.route({
        method: 'GET',
        url: '/api/room/create'
    }).as('createRoom');
    cy.get('[data-cy="create-room"]').click();
    cy.wait('@createRoom');
});
