const url = Cypress.config().baseUrl;

describe('Play word and card', () => {
    describe('on start game', () => {
        beforeEach(() => {
            cy.signup('unicorn', 'password');
            cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(url)}`)
            .then(() => cy.request(`http://localhost:12346/createRoom?rounds=3&url=${encodeURIComponent(Cypress.config().baseUrl)}`))
            .then(() => {
                cy.joinRoom();    
                cy.startGame();
            });
        });

        describe('player clicks on a card', () => {
            beforeEach(() => {
                cy.get('[data-cy="my-cards"]').find('[data-cy="card-image"]').first().click();
                cy.get('[data-cy="play-word"]').should('exist');
            });
            
            it.skip("its class is updated to selected", () => {
                cy.get('[data-cy="my-cards"]').find('[data-cy="card-wrapper"]').first().then(($wrapper) => {
                    const classList = Array.from($wrapper[0].classList);
                    expect(classList.some(cls => cls.includes('selected'))).to.equal(true);
                });
            });
        });

        describe('on submit a bad word', () => {
            it('displays an error', () => {
                cy.playCardWordInvalid();
                cy.get('[data-cy="send-error"]').should('contain', 'Word cannot be longer than 25 characters.');
            });
        });   

        describe('on send a word and a card', () => {
            beforeEach(() => {
                cy.playCardWord();   
            });

            it('displays the word', () => {     
                cy.get('[data-cy="current-word"]').should('have.text', '"word"');
            });

            describe('at the end of the round', () => {
                it('draws you a new card', () => {
                    cy.get('[data-cy="round-number"]', { timeout: 20000 }).should('contain', '2');
                    cy.get('[data-cy="my-cards"] [data-cy="card-wrapper"]', { timeout: 20000 }).should('have.length', 6);
                });
            });
        });  
    });
});
