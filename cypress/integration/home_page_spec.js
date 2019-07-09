describe('The Home Page', function() {
    it('successfully loads', function() {
      cy.visit('http://localhost:1234') // change URL to match your dev URL
    })
})

describe('The Login Page', function () {
  it('sets auth cookie when logging in via form submission', function () {
    // destructuring assignment of the this.currentUser object
    const username = 'jane'

    cy.get('input').type(username)
    cy.get('button').click() 

    // we should be redirected to /dashboard
    cy.url().should('include', '/dashboard')

    // our auth cookie should be present
    cy.getCookie('username').should('exist')

    // UI should reflect this user being logged in
    cy.get('#players').should('contain', 'jane')
  })
})
