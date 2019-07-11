// describe('logs in and plays card', function() {
//     before(() => {
//         cy.request({
//             url: '/auth/login',
//             method: 'POST',
//             body: {
//                 username: 'jane'
//             }
//         });
//     })

//     after(() => {
//         cy.request({
//             url: '/api/end',
//             method: 'GET'
//         });
//     })
//     it('gives list of played cards', function() {
//         cy.visit('http://localhost:8080/dashboard')
    
//         cy.get('#played-cards')
//         cy.get('.error').should('eq', ') 
//     })
// })
// des