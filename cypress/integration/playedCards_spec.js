// describe('logs in and plays card', function() {
//     before(() => {
//         cy.request({
//             url: '/auth/login',
//             method: 'POST',
//             body: {
//                 username: 'jane'
//             }
//         });
//         cy.request('http://localhost:8081/connect?url=http://localhost:8080')

//         // tell the http server at 8081 to send a message
//         cy.request('http://localhost:8081/message?m=hello')

//         // tell the http server at 8081 to disconnect
//         cy.request('http://localhost:8081/disconnect')
//     })

//     after(() => {
//         cy.request({
//             url: '/api/end',
//             method: 'GET'
//         });
//     })
//     it('gives list of played cards', function() {
//         cy.visit('http://localhost:8080/dashboard')
    
//         console.log(cy.get('#played-cards'))
//     })
// })
// des