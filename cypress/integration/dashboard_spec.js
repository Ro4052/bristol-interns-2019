/// <reference types="Cypress" />

describe('The Dashboard Page', function () {
    it('logs in programmatically without using the UI', () => {
      // destructuring assignment of the this.currentUser object
      const username = "test-user"
  
      // programmatically log us in without needing the UI
      cy.request('POST', '/auth/login', {
        username
      })
  
      // now that we're logged in, we can visit
      // any kind of restricted route!
      cy.visit('/dashboard')
  
      // our auth cookie should be present
      cy.getCookie('username').should('exist')
  
      // UI should reflect this user being logged in
      cy.get('#players').its('length').should('eq', 1);
    })
})