describe('logs in and plays card', function() {
    before(() => {
        cy.request({
            url: '/auth/login',
            method: 'POST',
            body: {
                username: 'jane'
            }
        });
        cy.visit('/dashboard')
    })

    after(() => {
        cy.request({
            url: '/api/end',
            method: 'GET'
        });
    })
    it('displays card', function() {
        cy.get('#start-game').click()
        cy.get('#my-cards').click()
        console.log("dog")
    })
})