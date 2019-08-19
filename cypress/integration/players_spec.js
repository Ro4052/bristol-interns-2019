describe('Players', () => {
    describe('on login', () => {
        it('your name appears in the players list', () => {
            cy.login('player1');
            cy.createRoom(3);
            cy.get('[data-cy="player-username"]').first().should('have.text', 'player1');
        });
    });

    describe('on enter room', () => {
        beforeEach(() => {
            cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(Cypress.config().baseUrl)}`)
            .then(() => cy.login('player1'));
            cy.createRoom(3);
            cy.request(`http://localhost:12346/joinRoom?roomId=0&url=${encodeURIComponent(Cypress.config().baseUrl)}`)
            .then(() => cy.startGame());
        });

        it('displays the initial scores of zero', () => {
            cy.get('[data-cy="player-score"]').first().should('have.text', '0');
            cy.get('[data-cy="player-score"]').last().should('have.text', '0');
        });
        
        it('displays the players who have already joined', () => {
            cy.get('[data-cy="player-username"]').first().should('have.text', 'player1');
            cy.get('[data-cy="player-username"]').last().should('have.text', 'halfling');
        });
    });

    describe('on another player log in', () => {
        it('their name is added to the players list', () => {
            cy.login('player1');
            cy.createRoom(3);
            cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(Cypress.config().baseUrl)}`)
            .then(() => cy.get('[data-cy="room-title"]'))
            .then(($title) => {
                const id = $title.text().split(" ")[1].charAt(0);
                return cy.request(`http://localhost:12346/joinRoom?roomId=${id}&url=${encodeURIComponent(Cypress.config().baseUrl)}`);
            })
            .then(() => {
                cy.get('[data-cy="player-username"]').first().should('have.text', 'player1');
                cy.get('[data-cy="player-username"]').last().should('have.text', 'halfling');
            });
        });
    });

    describe('on completing a round', () => {
        beforeEach(() => {
            cy.login('player1');
            cy.createRoom(3);
            cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(Cypress.config().baseUrl)}`)
            .then(() => cy.request(`http://localhost:12346/joinRoom?roomId=0&url=${encodeURIComponent(Cypress.config().baseUrl)}`));
            cy.get('[data-cy="player-username"]').first().should('have.text', 'player1');
            cy.get('[data-cy="player-username"]').last().should('have.text', 'halfling');
            cy.startGame();
            cy.get('[data-cy="start-game"]').should('not.exist');
            cy.request(`http://localhost:12346/playCardWord?url=${encodeURIComponent(Cypress.config().baseUrl)}`)
            .then(() => cy.get('[data-cy="round-number"]', { timeout: 20000 }).should('contain', '2'));
        });

        it('updates the scores', () => {
            cy.get('[data-cy="player-score"]').first().should('have.text', '0');
            cy.get('[data-cy="player-score"]').last().should('have.text', '3');
        });
    });
});
