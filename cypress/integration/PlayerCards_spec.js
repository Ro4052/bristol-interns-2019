describe('logs in and plays card', function() {
    before(() => {
        cy.request({
            url: '/auth/login',
            method: 'POST',
            body: {
                username: 'jane'
            }
        });
    })
    
    it('is able to start game', function() {
        cy.visit('/dashboard')
        cy.get('#start-game').click()
        console.log("dog")
    })
})