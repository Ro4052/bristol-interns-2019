const url = Cypress.config().baseUrl;

describe('Lobby', () => {
    describe('on clicking create room', () => {
        beforeEach(() => {
            cy.login('unicorn');
            cy.createRoom(3);
        });

        it('creates a new room and adds the player to that room', () => {
            cy.get('[data-cy="room"]').should('have.length', 1);
            cy.get('[data-cy="player-username"]').contains('unicorn');
            cy.get('[data-cy="leave-room"]').should('exist');
        });

        describe('on clicking create room again', () => {
            it("doesn't create a new room", () => {
                cy.createRoom(3);
                cy.get('[data-cy="room"]').contains('Room: 0');
            });
        });

        describe('on clicking leave room', () => {
            beforeEach(() => cy.leaveRoom());

            it('deletes the room', () => {
                cy.get('[data-cy="room"]').should('have.length', 0);
            });
        });

        describe('on another player joining the room', () => {
            beforeEach(() => {
                cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(url)}`)
                .then(() => cy.request(`http://localhost:12346/joinRoom?roomId=0&url=${encodeURIComponent(Cypress.config().baseUrl)}`));
            });

            it('displays that player', () => {
                cy.get('[data-cy="room-players"]').children().should('have.length', 2);
                cy.get('[data-cy="player-username"]').contains('unicorn');
                cy.get('[data-cy="player-username"]').contains('halfling');
            });

            it('displays the start game button', () => {
                cy.get('[data-cy="start-game"]').should('exist');
            });

            describe('on clicking start game button', () => {
                it('redirects to the dashboard', () => {
                    cy.startGame();
                    cy.url().should('include', '/dashboard');
                });
            });
        });
    });

    describe('on logging in when a room already exists', () => {
        beforeEach(() => {
            cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(url)}`)
            .then(() => cy.request(`http://localhost:12346/createRoom?rounds=3&url=${encodeURIComponent(url)}`))
            .then(() => cy.login('unicorn'));
        });

        it('displays the existing room', () => {
            cy.get('[data-cy="room"]').should('have.length', 1);
            cy.get('[data-cy="room"]').should('exist');
            cy.get('[data-cy="player-username"]').first().should('have.text', 'halfling');
            cy.get('[data-cy="join-room"]').should('exist');
        });

        describe('on clicking the join room button', () => {
            beforeEach(() => cy.joinRoom());

            it('adds the player to the room', () => {
                cy.get('[data-cy="room-players"]').children().should('have.length', 2);
                cy.get('[data-cy="player-username"]').contains('unicorn');
                cy.get('[data-cy="player-username"]').contains('halfling');
            });

            describe('on clicking the create room button', () => {
                beforeEach(() => cy.createRoom(3));

                it('creates the room', () => {
                    cy.get('[data-cy="room"]').should('have.length', 2);
                    cy.get('[data-cy="room-title"]').contains('Room: 1');
                });

                it('switches your room', () => {
                    cy.get('[data-cy="room"]').last().contains('unicorn');
                    cy.get('[data-cy="room"]').first().should('not.contain', 'unicorn');
                });

                describe('on clicking join room on the first room', () => {
                    beforeEach(() => cy.joinRoom());

                    it('adds you to that room', () => {
                        cy.get('[data-cy="room"]').first().contains('unicorn');
                    });

                    it('deletes your room', () => {
                        cy.get('[data-cy="room"]').should('have.length', 1);
                        cy.get('[data-cy="room"]').contains('Room: 0');
                    });
                });
            });
        });
    });
});
