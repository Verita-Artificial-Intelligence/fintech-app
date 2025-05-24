// RBB Demo End-to-End Tests
// Sprint 4: RBB-4.2 - Main flow testing

describe('RBB Demo - Main Flows', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Navigation and Basic Functionality', () => {
    it('should load the dashboard with RBB branding', () => {
      cy.contains('Royal Business Bank').should('be.visible');
      cy.get('[data-testid="dashboard"]').should('exist');
    });

    it('should navigate between main sections', () => {
      // Navigate to FBO Ledger
      cy.contains('FBO Ledger Monitoring').click();
      cy.url().should('include', '/ledger-monitoring');
      cy.contains('Real-time transaction monitoring').should('be.visible');

      // Navigate to Fraud Detection
      cy.contains('Fraud Detection').click();
      cy.url().should('include', '/fraud-detection');
      cy.contains('AI-powered fraud detection').should('be.visible');

      // Navigate to Underwriting
      cy.contains('Automated Underwriting').click();
      cy.url().should('include', '/underwriting');
      cy.contains('ML-powered credit decisioning').should('be.visible');

      // Return to Dashboard
      cy.contains('Dashboard').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/dashboard');
    });

    it('should toggle between languages', () => {
      // Find language toggle
      cy.get('[aria-label="language selection"]').within(() => {
        // Switch to Chinese
        cy.contains('中文').click();
      });
      
      // Verify Chinese text appears
      cy.contains('仪表板').should('be.visible');
      
      // Switch back to English
      cy.get('[aria-label="language selection"]').within(() => {
        cy.contains('EN').click();
      });
      
      // Verify English text restored
      cy.contains('Dashboard').should('be.visible');
    });
  });

  describe('FBO Ledger Monitoring', () => {
    beforeEach(() => {
      cy.visit('/ledger-monitoring');
    });

    it('should display real-time transactions', () => {
      // Check for transaction table
      cy.get('table').should('exist');
      cy.get('tbody tr').should('have.length.greaterThan', 0);
      
      // Verify transaction details
      cy.get('tbody tr').first().within(() => {
        cy.get('td').should('have.length.greaterThan', 5);
        cy.contains(/\$[\d,]+/).should('exist'); // Amount
        cy.contains(/TXN-/).should('exist'); // Transaction ID
      });
    });

    it('should filter transactions', () => {
      // Open filter panel if exists
      cy.get('input[placeholder*="Search"]').type('Deposit');
      
      // Wait for filtered results
      cy.wait(500);
      
      // Verify filtered results
      cy.get('tbody tr').each(($row) => {
        cy.wrap($row).should('contain.text', 'Deposit');
      });
    });
  });

  describe('Fraud Detection & Compliance', () => {
    beforeEach(() => {
      cy.visit('/fraud-detection');
    });

    it('should display fraud alerts', () => {
      // Check for alerts section
      cy.contains('Active Fraud Alerts').should('be.visible');
      
      // Verify alert cards exist
      cy.get('[data-testid="fraud-alert-card"]').should('exist');
    });

    it('should show compliance metrics', () => {
      // Check compliance scores
      cy.contains('BSA Compliance').should('be.visible');
      cy.contains('AML Status').should('be.visible');
      cy.contains('KYC Completion').should('be.visible');
      
      // Verify progress indicators
      cy.get('[role="progressbar"]').should('have.length.greaterThan', 0);
    });

    it('should display risk heatmap', () => {
      // Check for heatmap component
      cy.contains('Risk Analysis Heatmap').should('be.visible');
      
      // Verify view mode toggles
      cy.contains('Temporal').should('exist');
      cy.contains('Geographic').should('exist');
      cy.contains('Customer').should('exist');
      
      // Switch to geographic view
      cy.contains('Geographic').click();
      cy.contains('RBB Branch Risk Distribution').should('be.visible');
    });
  });

  describe('Automated Underwriting', () => {
    beforeEach(() => {
      cy.visit('/underwriting');
    });

    it('should display application list', () => {
      // Check applications table
      cy.get('table').should('exist');
      cy.contains('Application ID').should('be.visible');
      cy.contains('Applicant').should('be.visible');
      cy.contains('Score').should('be.visible');
      cy.contains('Status').should('be.visible');
    });

    it('should show application details', () => {
      // Click on view details for first application
      cy.get('[data-testid="view-details-button"]').first().click();
      
      // Verify details panel
      cy.contains('Applicant Details').should('be.visible');
      cy.contains('Business Type').should('be.visible');
      cy.contains('Credit Score').should('be.visible');
    });

    it('should initiate new application', () => {
      // Click new application button
      cy.contains('New Application').click();
      
      // Verify dialog opens
      cy.get('[role="dialog"]').should('be.visible');
      cy.contains('Upload Documents').should('be.visible');
      
      // Close dialog
      cy.get('[aria-label="close"]').click();
    });
  });

  describe('Accessibility Compliance', () => {
    it('should have proper ARIA labels', () => {
      // Check main navigation
      cy.get('nav').should('have.attr', 'aria-label');
      
      // Check buttons have accessible text
      cy.get('button').each(($button) => {
        cy.wrap($button).should('satisfy', ($el) => {
          const text = $el.text().trim();
          const ariaLabel = $el.attr('aria-label');
          return text.length > 0 || ariaLabel?.length > 0;
        });
      });
    });

    it('should be keyboard navigable', () => {
      // Tab through main navigation
      cy.get('body').trigger('keydown', { keyCode: 9, which: 9 });
      cy.focused().should('have.attr', 'role');
      
      // Tab to main content
      cy.focused().trigger('keydown', { keyCode: 9, which: 9 });
      cy.focused().trigger('keydown', { keyCode: 9, which: 9 });
      cy.focused().trigger('keydown', { keyCode: 9, which: 9 });
      cy.focused().should('be.visible');
    });

    it('should have sufficient color contrast', () => {
      // Check primary buttons
      cy.get('button[variant="contained"]').should('have.css', 'background-color')
        .and('not.equal', 'rgba(0, 0, 0, 0)');
    });
  });

  describe('Real-time Data Updates', () => {
    it('should show live transaction updates', () => {
      cy.visit('/dashboard');
      
      // Wait for dashboard to load
      cy.contains('Total Deposits').should('be.visible');
      
      // Check that real-time updates are occurring
      // Look for changing values in KPI cards
      cy.get('[data-testid="kpi-value"]').first().invoke('text').then((initialText) => {
        // Wait for updates (real-time simulation runs every 3-8 seconds)
        cy.wait(10000);
        
        // Check if any KPI value has changed
        cy.get('[data-testid="kpi-value"]').first().invoke('text').should((newText) => {
          // At least one value should have changed
          expect(newText).to.not.equal(initialText);
        });
      });
    });
  });

  describe('Executive Preset Layout', () => {
    it('should save and restore executive layout preferences', () => {
      // Set executive layout preference
      localStorage.setItem('rbb-layout-preset', 'executive');
      
      cy.visit('/dashboard');
      
      // Verify executive-focused KPIs are prominently displayed
      cy.contains('Total Deposits').should('be.visible');
      cy.contains('Compliance Score').should('be.visible');
      cy.contains('Risk Distribution').should('be.visible');
    });
  });
}); 