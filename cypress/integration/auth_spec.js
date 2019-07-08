// if authorised, should be redirected to the dashboard


describe('No auth cookie', function () {
    it('stops you getting to /dashboard', function () {
        cy.visit('http://localhost:8080/dashboard') 
  
  
      // we should not be redirected to /dashboard
      cy.url().should('include', '/')
    }); 
  })

describe('auth cookie', function () {
    beforeEach(function() {
        cy.request('POST', '/auth/login', {username: 'jane'})
    })
    it('sends you to dashboard', function() {
        cy.visit('http://localhost:8080/dashboard')
        cy.url().should('include', '/dashboard')
    })
})