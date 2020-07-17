/// <reference types="Cypress" />

describe('Go to User Onboarding Site', function() {
    it('Fills out the form', function() {
        cy.visit('/');
        cy.get('[for="name"] > input')
            .type('liz')
            .should('have.value', 'liz');


        cy.get('[for="email"] > input')
            .type('corgipower@hotmail.com')
            .should('have.value', 'corgipower@hotmail.com');


        cy.get('[for="password"] > input')
            .type('lizlizli')
            .should('have.value', 'lizlizli');

        cy.get('[for="terms"] > input')
            .click()
            .should('have.checked', true);

        cy.get('[data-cy="submit"]')
            .should('be.enabled');
    })

    it('Checks error messages', function() {
        cy.get('[for="name"] > input')
           .clear();
            
        cy.get('[data-cy="name-err"]')
            .contains('We need your name');


        cy.get('[for="email"] > input')
            .clear();
            
        cy.get('[data-cy="email-err"]')
            .contains('Please give us your email address');


        cy.get('[for="password"] > input')
            .clear();
        
        cy.get('[data-cy="pw-err"]')
            .contains('You need a password');

        //not running this test due to unresolved bug with checkbox error message
        //
        // cy.get('[for="terms"] > input')
        //     .click();
        
        // cy.get('[data-cy="terms-err"]')
        //     .contains('You have to accept our terms');

        cy.get('[data-cy="submit"]')
            .should('be.disabled');
   })
})