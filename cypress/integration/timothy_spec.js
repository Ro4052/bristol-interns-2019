const url = Cypress.config().baseUrl;

describe('Timothy', () => {
    describe('on initial render', () => {
        it('timothy is neutral', () => {
            cy.get('[data-cy="timothy-body"]').then(($wrapper) => {
                const classList = Array.from($wrapper[0].classList);
                expect(classList.some(cls => /disappointed/.test(cls))).to.equal(false);
            });
            cy.get('[data-cy="timothy-body"]').then(($wrapper) => {
                const classList = Array.from($wrapper[0].classList);
                expect(classList.some(cls => /victory/.test(cls))).to.equal(false);
            });
            cy.get('[data-cy="timothy-eyelid"]').then(($wrapper) => {
                const classList = Array.from($wrapper[0].classList);
                expect(classList.some(cls => /angry/.test(cls))).to.equal(false);
            });
            cy.get('[data-cy="timothy-meaneye"]').then(($wrapper) => {
                const classList = Array.from($wrapper[0].classList);
                expect(classList.some(cls => /mean/.test(cls))).to.equal(false);
            });
            cy.get('[data-cy="timothy-tear"]').should('not.exist');
        });
    });

    describe('on enter an invalid word', () => {
        beforeEach(() => {
            cy.login('unicorn');
            cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(url)}`)
            .then(() => cy.request(`http://localhost:12346/createRoom?url=${encodeURIComponent(Cypress.config().baseUrl)}`))
            .then(() => cy.joinRoom())
            .then(() => cy.startGame())
            .then(() => cy.sendInvalidWord());
        });

        it('timothy gets angry', () => {
            cy.get('[data-cy="timothy-body"]').then(($wrapper) => {
                const classList = Array.from($wrapper[0].classList);
                expect(classList.some(cls => /disappointed/.test(cls))).to.equal(true);
            });
            cy.get('[data-cy="timothy-eyelid"]').then(($wrapper) => {
                const classList = Array.from($wrapper[0].classList);
                expect(classList.some(cls => /angry/.test(cls))).to.equal(true);
            });
            cy.get('[data-cy="timothy-meaneye"]').then(($wrapper) => {
                const classList = Array.from($wrapper[0].classList);
                expect(classList.some(cls => /mean/.test(cls))).to.equal(true);
            });
        });
    });

    describe('on win', () => {
        beforeEach(() => {
            cy.login('unicorn');
            cy.request(`http://localhost:12346/connect?url=${encodeURIComponent(url)}`)
            .then(() => cy.request(`http://localhost:12346/createRoom?url=${encodeURIComponent(Cypress.config().baseUrl)}`))
            .then(() => cy.joinRoom())
            .then(() => cy.startGame())
            .then(() => cy.sendInvalidWord())
            .then(() => cy.get('[data-cy="game-over"]', { timeout: 20000 }));
        });

        it('timothy does victory dance', () => {
            cy.get('[data-cy="timothy-body"]').then(($wrapper) => {
                const classList = Array.from($wrapper[0].classList);
                expect(classList.some(cls => /victory/.test(cls))).to.equal(true);
            });
        });

        it("timothy doesn't have tear victory dance", () => {
            cy.get('[data-cy="timothy-meaneye"]').then(($wrapper) => {
                const classList = Array.from($wrapper[0].classList);
                expect(classList.some(cls => /mean/.test(cls))).to.equal(false);
            });
            cy.get('[data-cy="timothy-eyelid"]').then(($wrapper) => {
                const classList = Array.from($wrapper[0].classList);
                expect(classList.some(cls => /angry/.test(cls))).to.equal(false);
            });
        });
    });
});
