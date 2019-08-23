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

Cypress.Commands.add('signup', (username, password) => {
    cy.route({
        method: 'POST',
        url: '/auth/signup'
    }).as('signup');
    cy.get('[data-cy="toggle-signup"]').click();
    cy.get('[data-cy="username"]').type(username);
    cy.get('[data-cy="password"]').type(password)
    .then(() => cy.get('[data-cy="login"]').click());
    cy.wait('@signup');
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

Cypress.Commands.add('addAIPlayer', () => {
    cy.route({
        method: 'POST',
        url: '/api/room/addAIPlayer'
    }).as('addAIPlayer');
    cy.get('[data-cy="automated-player"]').click();
    cy.wait('@addAIPlayer');
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
    cy.get('[data-cy="start-game"]').click();
    cy.wait('@start');
});

Cypress.Commands.add('refreshPage', () => {
    cy.visit('/dashboard');
});

Cypress.Commands.add('showChat', () => {
    cy.get('[data-cy="show-chat"]').click();
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
    cy.get('[data-cy="type-word"]').type('somethingveryveryveryverylong');
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

Cypress.Commands.add('nextRound', () => {
    cy.route({
        method: 'GET',
        url: '/api/nextRound'
    }).as('nextRound');
    cy.get('[data-cy="next-round"]').click();
    cy.wait('@nextRound');
});

Cypress.Commands.add('backToLobby', () => {
    cy.get('[data-cy="back-to-lobby"]').click();
});

Cypress.Commands.add('goToLeaderboard', () => {
    cy.route({
        method: 'GET',
        url: '/api/all-players'
    }).as('getPlayers');
    cy.get('[data-cy="go-leaderboard"]').click();
    cy.wait('@getPlayers');
});
