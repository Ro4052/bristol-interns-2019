// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

import './commands'

beforeEach(() => {
    cy.server();
    cy.request({
        method: 'GET',
        url: "http://localhost:12346/disconnect",
        followRedirect: false
    }).then(() => {
        cy.request({
            url: '/api/reset-server',
            method: 'POST'
        }).then(() => {
            cy.visit('/');
        });
    });
});
