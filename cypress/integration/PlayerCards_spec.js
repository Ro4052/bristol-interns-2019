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
    })

    it('is able to select card', function() {
        cy.get('#my-cards').click()
        cy.playCard()
        console.log("dog")
    })
})