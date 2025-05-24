// Custom Cypress Commands for RBB Demo
// Sprint 4: RBB-4.2

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to simulate tab key press
       * @example cy.tab()
       * @example cy.get('button').tab()
       */
      tab(): Chainable<JQuery<HTMLElement>>;
    }
  }
}

// Tab navigation command
Cypress.Commands.add('tab', { prevSubject: ['optional', 'element'] }, (subject?: JQuery<HTMLElement>) => {
  if (subject) {
    return cy.wrap(subject).trigger('keydown', { keyCode: 9, which: 9 });
  } else {
    return cy.get('body').trigger('keydown', { keyCode: 9, which: 9 });
  }
});

export {}; 