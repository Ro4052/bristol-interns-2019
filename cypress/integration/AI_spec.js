import { isTSAnyKeyword } from "@babel/types";

describe("when click add auto button", () => {
    beforeEach(() => {
        cy.login('unicorn');
        cy.createRoom(3);
        cy.get('[data-cy="automated-player"]').click();
    });

    it("adds automated player to room ", () => {
        cy.get('[data-cy="room-players"]').children().should('have.length', 2);
        cy.get('[data-cy="player-username"]').contains('Computer 0');
    });
    
    describe("when the automated player is the storyteller", () => {
        beforeEach(() => {
            cy.startGame();
        });
        it("plays a word and a card", () => {
            cy.get('[data-cy="current-word"]').should('have.text', '"hello"');
            cy.get('[data-cy="play-card"]').should('exist');
        });
        describe("when the automated player is not the storyteller and the storyteller has played", () => {
            beforeEach(() => {
                cy.playCard();
                cy.voteCard();
                cy.get('[data-cy="play-card"]', {timeout: 5000}).should('exist')
                .then(cy.playCardWord());
            });
            it("plays a random card and votes for a random card", () => {
                cy.get('[data-cy="played-cards"] [data-cy="card-wrapper"]').should('have length', 2);
                cy.get('[data-cy="finished-turn"]').should('have.text', '✓');
            });           
        });
    });
});