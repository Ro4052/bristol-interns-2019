describe('The Dashboard Page', function () {

    /* WHEN LOGGING IN */
    describe('redirects to the dashboard', () => {
        before(() => {
            cy.request({
                url: '/auth/login',
                method: 'POST',
                body: {
                    username: 'unicorn'
                }
            });
        })
    
        after(() => {
            cy.request({
                url: '/auth/logout',
                method: 'POST'
            });
        })
        it('successfully loads', function() {
            cy.visit('/dashboard')
        })
    })

    /* BEFORE START OF GAME */
    describe('before start of game', () => {
        before(() => {
            cy.request({
                url: '/auth/login',
                method: 'POST',
                body: {
                    username: 'unicorn'
                }
            });
        })
    
        after(() => {
            cy.request({
                url: '/auth/logout',
                method: 'POST'
            });
        })

        it('before the game has started', () => {
            cy.get('#start-game').should('exist');
            cy.get('#round-number').should('not.exist');
            cy.get('#current-player').should('not.exist');
            cy.get('#message').should('not.exist');
        })
    })

    /* WHEN GAME HAS STARTED */
    describe('after start of game', () => {
        before(() => {
            cy.request({
                url: '/auth/login',
                method: 'POST',
                body: {
                    username: 'unicorn'
                }
            });
        })

        after(() => {
            cy.request({
                url: '/api/end',
                method: 'GET'
            });
        })

        it("after start has been pressed", () => {
            cy.get('#start-game').click()
            cy.get('#round-number').should('exist')
            cy.get('#current-player').should('exist')
            cy.get('#message').should('not.exist')
        })
    })
})