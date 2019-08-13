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
    cy.get('[data-cy="username"]').type(username)
    .then(() => cy.get('[data-cy="login"]').click());
    cy.wait('@login');
});

Cypress.Commands.add('logout', () => {
    cy.route({
        method: 'POST',
        url: '/auth/logout'
    }).as('logout');
    cy.get('[data-cy="logout"]').click();
    cy.wait('@logout');
});

Cypress.Commands.add('createRoom', numRounds => {
    cy.route({
        method: 'POST',
        url: '/api/room/create'
    }).as('createRoom');
    cy.get('[data-cy="num-rounds-options"]').select(numRounds.toString());
    cy.get('[data-cy="create-room"]').click();
    cy.wait('@createRoom');
});

Cypress.Commands.add('joinRoom', () => {
    cy.route({
        method: 'POST',
        url: '/api/room/join'
    }).as('joinRoom');
    cy.get('[data-cy="join-room"]').click();
    cy.wait('@joinRoom');
});

Cypress.Commands.add('leaveRoom', () => {
    cy.route({
        method: 'POST',
        url: '/api/room/leave'
    }).as('leaveRoom');
    cy.get('[data-cy="leave-room"]').click();
    cy.wait('@leaveRoom');
});

Cypress.Commands.add('sendMessage', () => {
    cy.get('[data-cy="type-message"]').type('message');
    cy.get('[data-cy="send-message"]').click();
});

Cypress.Commands.add('startGame', () => {
    cy.route({
        method: "GET",
        url: "/api/start",
    }).as('start');
    cy.route({
        method: "GET",
        url: "/api/game-state",
    }).as('getState');
    cy.get('[data-cy="start-game"]').click();
    cy.wait('@start');
    cy.wait('@getState');
});

Cypress.Commands.add('refreshPage', () => {
    cy.route({
        method: "GET",
        url: "/api/game-state",
    }).as('getState');
    cy.visit('/dashboard');
    cy.wait('@getState');
});

Cypress.Commands.add('playCardWord', () => {
    cy.route({
        method: 'POST',
        url: '/api/play-card-word'
    }).as('playCardWord');
    cy.get('[data-cy="my-cards"] [data-cy="card-image"]').first().click();
    cy.get('[data-cy="type-word"]').type('word');
    cy.get('[data-cy="send-word"]').click();
    cy.wait('@playCardWord');
});

Cypress.Commands.add('playCardWordInvalid', () => {
    cy.route({
        method: 'POST',
        url: '/api/play-card-word'
    }).as('playCardWord');
    cy.get('[data-cy="my-cards"] [data-cy="card"]').first().click();
    cy.get('[data-cy="type-word"]').type('notaword');
    cy.get('[data-cy="send-word"]').click();
    cy.wait('@playCardWord');
});

Cypress.Commands.add('playCard', () => {
    cy.route({
        method: 'POST',
        url: '/api/play-card'
    }).as('playCard');
    cy.get('[data-cy="play-card"]').should('exist');
    cy.get('[data-cy="my-cards"] [data-cy="card-image"]').first().click();
    cy.wait('@playCard');
});

Cypress.Commands.add('voteCard', () => {
    cy.get('[data-cy="vote-card"]').should('exist');
    cy.route({
        method: 'POST',
        url: '/api/vote-card'
    }).as('voteCard');
    cy.get('[data-cy="played-cards"] [data-cy="card-front"] [data-cy="card-image"]').first()
    .then($wrapper => {
        const classList = Array.from($wrapper[0].classList);
        if (classList.some(cls => cls.includes('fade'))) {
            cy.get('[data-cy="played-cards"] [data-cy="card-front"] [data-cy="card-image"]').last().click();
        } else {
            $wrapper.click();
        }
    })
    .then(() => cy.wait('@voteCard'));
});

Cypress.Commands.add('newGame', () => {
    cy.route({
        method: 'GET',
        url: '/api/end'
    }).as('endGame');
    cy.get('[data-cy="new-game"]').click();
    cy.wait('@endGame');
});

Cypress.Commands.add('goToLeaderboard', () => {
    cy.route({
        method: 'GET',
        url: '/api/all-players'
    }).as('getPlayers');
    cy.get('[data-cy="go-leaderboard"]').click();
    cy.wait('@getPlayers');
});
