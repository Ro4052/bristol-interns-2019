const promptDuration = 5000;

describe('Timer', () => {

    describe('Storyteller Timer', () => {
        describe('when the game starts', () => {
            beforeEach(() => {
                cy.signup('unicorn', 'password')
                .then(() => cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(Cypress.config().baseUrl)}`))
                .then(() => cy.request(`http://localhost:12346/createRoom?rounds=3&url=${encodeURIComponent(Cypress.config().baseUrl)}`))
                .then(() => cy.joinRoom())
                .then(() => cy.startGame())
            });

            it('displays the timer', () => {
                cy.get('[data-cy="storyteller-timer"]');
            });

            describe('on refresh', () => {
                it("doesn't restart the timer", () => {
                    cy.get('[data-cy="storyteller-timer"]').should('contain', 4);
                    cy.get('[data-cy="storyteller-timer"]').should('contain', 3);
                    cy.refreshPage();
                    cy.get('[data-cy="storyteller-timer"]', { timeout: 0 }).should('not.contain', 4);
                });
            });

            describe('on timeout', () => {
                it('should move onto the next round', () => {
                    cy.get('[data-cy="round-number"]', { timeout: 20000 }).should('contain', 2);
                });

                describe('on another timeout', () => {
                    beforeEach(() => {
                        cy.get('[data-cy="round-number"]', { timeout: 20000 }).should('contain', 3);
                    });

                    it('should display the timer again', () => {
                        cy.get('[data-cy="storyteller-timer"]', { timeout: 20000 }).should('exist');
                    });
                });
            });
        });
    });

    describe('Play Card Timer', () => {
        describe('after storyteller plays', () => {
            beforeEach(() => {
                cy.signup('unicorn', 'password')
                .then(() => cy.createRoom(3))
                .then(() => cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(Cypress.config().baseUrl)}`))
                .then(() => cy.request(`http://localhost:12346/joinRoom?roomId=0&url=${encodeURIComponent(Cypress.config().baseUrl)}`))
                .then(() => cy.startGame())
                .then(() => cy.request(`http://localhost:12346/playCardWord?url=${encodeURIComponent(Cypress.config().baseUrl)}`));
            });

            it('should display the timer', () => {
                cy.get('[data-cy="card-timer"]');
            });

            describe('on timeout', () => {
                it('should hide the timer', () => {
                    cy.get('[data-cy="card-timer"]', { timeout: 20000 }).should('not.exist');
                });
            });
        }); 
    });

    describe('Vote Card Timer', () => {
        describe('after everyone has played', () => {
            beforeEach(() => {
                cy.signup('unicorn', 'password')
                .then(() => cy.createRoom(3))
                .then(() => cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(Cypress.config().baseUrl)}`))
                .then(() => cy.request(`http://localhost:12346/joinRoom?roomId=0&url=${encodeURIComponent(Cypress.config().baseUrl)}`))
                .then(() => cy.startGame())
                .then(() => cy.request(`http://localhost:12346/playCardWord?url=${encodeURIComponent(Cypress.config().baseUrl)}`))
                .then(() => cy.playCard());
            });

            it('should display the timer', () => {
                cy.get('[data-cy="vote-timer"]');
            });

            describe('on timeout', () => {
                it('should hide the timer', () => {
                    cy.get('[data-cy="vote-timer"]', { timeout: 20000 }).should('not.exist');
                });
            });
        });
    });
});
