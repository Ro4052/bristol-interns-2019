const url = Cypress.config().baseUrl;

describe('Play word and card', () => {
    describe('on start game', () => {
        beforeEach(() => {
            cy.login('unicorn');
            cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(url)}`)
            .then(() => cy.request(`http://localhost:12346/createRoom?url=${encodeURIComponent(Cypress.config().baseUrl)}`))
            .then(() => {
                cy.joinRoom();    
                cy.startGame();
            });
        });

        it('prompts user to play a word and a card', () => {
            cy.get('[data-cy="play-word"]').should('exist');
            cy.get('[data-cy="play-card"]').should('exist');
        });

        describe('player clicks on a card', () => {
            beforeEach(() => {
                cy.get('[data-cy="my-cards"]').find('[data-cy="card"]').first().click();
            });
            it("its class is updated to selected", () => {
                cy.get('[data-cy="my-cards"]').find('[data-cy="card-wrapper"]').first().then(($wrapper) => {
                    const selected = /selected/;
                    const classList = Array.from($wrapper[0].classList);
                    expect(classList.some(cls => selected.test(cls))).to.equal(true);
                });
            });
        });

        describe('on submit a bad word', () => {
            it('displays an error', () => {
                cy.sendWord();
                cy.get('[data-cy="send-error"]').should('contain', 'Invalid word');
            });
        });   

        describe('on send a word and a card', () => {
            it('displays the word', () => {
                cy.playCardWord();            
                cy.get('[data-cy="current-word"]').should('have.text', 'word');
            });
        });  
    });
});
