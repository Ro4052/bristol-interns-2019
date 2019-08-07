const url = Cypress.config().baseUrl;

describe('Timothy', () => {
    describe('on initial render', () => {
        it('timothy is neutral', () => {
            cy.get('[data-cy="timothy-body"]').then(($wrapper) => {
                const classList = Array.from($wrapper[0].classList);
                expect(classList.some(cls => cls.includes('disappointed'))).to.equal(false);
            });
            cy.get('[data-cy="timothy-body"]').then(($wrapper) => {
                const classList = Array.from($wrapper[0].classList);
                expect(classList.some(cls => cls.includes('victory'))).to.equal(false);
            });
            cy.get('[data-cy="timothy-eyelid"]').then(($wrapper) => {
                const classList = Array.from($wrapper[0].classList);
                expect(classList.some(cls => cls.includes('angry'))).to.equal(false);
            });
            cy.get('[data-cy="timothy-meaneye"]').then(($wrapper) => {
                const classList = Array.from($wrapper[0].classList);
                expect(classList.some(cls => cls.includes('mean'))).to.equal(false);
            });
            cy.get('[data-cy="timothy-tear"]').should('not.exist');
        });
    });

    describe('on enter an invalid word', () => {
        beforeEach(() => {
            cy.login('unicorn');
            cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(url)}`)
            .then(() => cy.request(`http://localhost:12346/createRoom?rounds=3&url=${encodeURIComponent(Cypress.config().baseUrl)}`))
            .then(() => cy.joinRoom())
            .then(() => cy.startGame())
            .then(() => cy.playCardWordInvalid());
        });

        it('timothy gets angry', () => {
            cy.get('[data-cy="timothy-body"]').then(($wrapper) => {
                const classList = Array.from($wrapper[0].classList);
                expect(classList.some(cls => cls.includes('disappointed'))).to.equal(true);
            });
            cy.get('[data-cy="timothy-eyelid"]').then(($wrapper) => {
                const classList = Array.from($wrapper[0].classList);
                expect(classList.some(cls => cls.includes('angry'))).to.equal(true);
            });
            cy.get('[data-cy="timothy-meaneye"]').then(($wrapper) => {
                const classList = Array.from($wrapper[0].classList);
                expect(classList.some(cls => cls.includes('mean'))).to.equal(true);
            });
        });
    });

    describe('on win', () => {
        beforeEach(() => {
            cy.login('unicorn');
            cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(url)}`)
            .then(() => cy.request(`http://localhost:12346/createRoom?rounds=3&url=${encodeURIComponent(Cypress.config().baseUrl)}`))
            .then(() => cy.joinRoom())
            .then(() => cy.startGame())
            .then(() => cy.playCardWordInvalid())
            .then(() => cy.get('[data-cy="game-over"]', { timeout: 20000 }));
        });

        it('timothy does victory dance', () => {
            cy.get('[data-cy="timothy-body"]').then(($wrapper) => {
                const classList = Array.from($wrapper[0].classList);
                expect(classList.some(cls => cls.includes('victory'))).to.equal(true);
            });
        });

        it("timothy doesn't have tear", () => {
            cy.get('[data-cy="timothy-meaneye"]').then(($wrapper) => {
                const classList = Array.from($wrapper[0].classList);
                expect(classList.some(cls => cls.includes('mean'))).to.equal(false);
            });
            cy.get('[data-cy="timothy-eyelid"]').then(($wrapper) => {
                const classList = Array.from($wrapper[0].classList);
                expect(classList.some(cls => cls.includes('angry'))).to.equal(false);
            });
        });
    });
});
