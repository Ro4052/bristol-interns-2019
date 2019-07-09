beforeEach(() => {
    cy.visit('/');
    const username = 'username';
    cy.get('input').type(username);
    cy.get('button').click();
});

describe('on start game', () => {
    it('prompts user to play a word and a card', () => {
        
    });
});

describe('on send a word and a card', () => {
    it('updates the game status', () => {
        
    });
});