// Enhanced Mock Data Generator for High-Fidelity Demo
import { faker } from '@faker-js/faker';

// Types for realistic financial data
export interface Customer {
  id: string;
  name: string;
  type: 'Individual' | 'Corporate' | 'Trust' | 'Partnership';
  riskProfile: 'Low' | 'Medium' | 'High';
  kycStatus: 'Verified' | 'Pending' | 'Incomplete';
  sanctionsCheck: 'Clear' | 'Watch' | 'Blocked';
  onboardingDate: Date;
  lastActivity: Date;
  totalAssets: number;
  jurisdiction: string;
  industry?: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  subAccountId: string;
  customerId: string;
  type: 'Deposit' | 'Withdrawal' | 'Transfer' | 'Wire' | 'ACH' | 'Check';
  amount: number;
  currency: string;
  timestamp: Date;
  status: 'Completed' | 'Pending' | 'Failed' | 'Suspended' | 'Under Review';
  riskScore: number;
  counterparty: string;
  purpose: string;
  fees: number;
  exchangeRate?: number;
  complianceFlags: string[];
  geolocation: { lat: number; lng: number; country: string };
}

export interface ComplianceAlert {
  id: string;
  type: 'BSA' | 'AML' | 'OFAC' | 'KYC' | 'SAR' | 'CTR' | 'FBAR';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  accountId: string;
  customerId: string;
  transactionIds: string[];
  createdAt: Date;
  status: 'Open' | 'Under Review' | 'Resolved' | 'Escalated';
  assignedTo: string;
  dueDate: Date;
  regulatoryDeadline?: Date;
}

export interface Account {
  id: string;
  customerId: string;
  type: 'FBO' | 'Operating' | 'Escrow' | 'Trust';
  balance: number;
  currency: string;
  status: 'Active' | 'Dormant' | 'Suspended' | 'Closed';
  openDate: Date;
  subAccounts: SubAccount[];
  complianceLevel: 'Standard' | 'Enhanced' | 'Restricted';
}

export interface SubAccount {
  id: string;
  parentAccountId: string;
  purpose: string;
  balance: number;
  restrictions: string[];
  lastTransactionDate: Date;
}

// Advanced data generators
export class AdvancedMockDataGenerator {
  private static instance: AdvancedMockDataGenerator;
  
  static getInstance(): AdvancedMockDataGenerator {
    if (!this.instance) {
      this.instance = new AdvancedMockDataGenerator();
    }
    return this.instance;
  }

  // Generate realistic customer data with proper risk profiles
  generateCustomers(count: number): Customer[] {
    return Array.from({ length: count }, () => ({
      id: `CUST-${faker.string.alphanumeric(8).toUpperCase()}`,
      name: faker.helpers.arrayElement([
        faker.company.name(),
        faker.person.fullName(),
        `${faker.company.name()} Trust`,
        `${faker.person.lastName()} Family Partnership`
      ]),
      type: faker.helpers.arrayElement(['Individual', 'Corporate', 'Trust', 'Partnership']),
      riskProfile: faker.helpers.weightedArrayElement([
        { weight: 60, value: 'Low' as const },
        { weight: 30, value: 'Medium' as const },
        { weight: 10, value: 'High' as const }
      ]),
      kycStatus: faker.helpers.weightedArrayElement([
        { weight: 85, value: 'Verified' as const },
        { weight: 10, value: 'Pending' as const },
        { weight: 5, value: 'Incomplete' as const }
      ]),
      sanctionsCheck: faker.helpers.weightedArrayElement([
        { weight: 95, value: 'Clear' as const },
        { weight: 4, value: 'Watch' as const },
        { weight: 1, value: 'Blocked' as const }
      ]),
      onboardingDate: faker.date.past({ years: 3 }),
      lastActivity: faker.date.recent({ days: 30 }),
      totalAssets: faker.number.int({ min: 50000, max: 50000000 }),
      jurisdiction: faker.location.country(),
      industry: faker.helpers.arrayElement([
        'Technology', 'Finance', 'Healthcare', 'Real Estate', 'Manufacturing',
        'Retail', 'Energy', 'Telecommunications', 'Legal Services', 'Consulting'
      ])
    }));
  }

  // Generate sophisticated transaction patterns
  generateTransactions(count: number, customers: Customer[], accounts: Account[]): Transaction[] {
    const transactions: Transaction[] = [];
    
    for (let i = 0; i < count; i++) {
      const customer = faker.helpers.arrayElement(customers);
      const account = accounts.find(acc => acc.customerId === customer.id) || faker.helpers.arrayElement(accounts);
      const subAccount = faker.helpers.arrayElement(account.subAccounts);
      
      // Risk-based transaction patterns
      const baseAmount = customer.riskProfile === 'High' ? 
        faker.number.int({ min: 100000, max: 5000000 }) :
        customer.riskProfile === 'Medium' ?
        faker.number.int({ min: 10000, max: 500000 }) :
        faker.number.int({ min: 100, max: 50000 });

      const transaction: Transaction = {
        id: `TXN-${faker.string.alphanumeric(12).toUpperCase()}`,
        accountId: account.id,
        subAccountId: subAccount.id,
        customerId: customer.id,
        type: faker.helpers.arrayElement(['Deposit', 'Withdrawal', 'Transfer', 'Wire', 'ACH', 'Check']),
        amount: baseAmount,
        currency: faker.helpers.arrayElement(['USD', 'EUR', 'GBP', 'CAD', 'JPY']),
        timestamp: this.generateRealisticTimestamp(),
        status: faker.helpers.weightedArrayElement([
          { weight: 80, value: 'Completed' as const },
          { weight: 10, value: 'Pending' as const },
          { weight: 5, value: 'Under Review' as const },
          { weight: 3, value: 'Suspended' as const },
          { weight: 2, value: 'Failed' as const }
        ]),
        riskScore: this.calculateRiskScore(customer, baseAmount),
        counterparty: faker.company.name(),
        purpose: faker.helpers.arrayElement([
          'Operating expenses', 'Investment', 'Loan repayment', 'Dividend distribution',
          'Property purchase', 'Equipment financing', 'Working capital', 'Tax payment'
        ]),
        fees: faker.number.float({ min: 5, max: 250, precision: 0.01 }),
        exchangeRate: faker.number.float({ min: 0.5, max: 2.0, precision: 0.0001 }),
        complianceFlags: this.generateComplianceFlags(customer, baseAmount),
        geolocation: {
          lat: faker.location.latitude(),
          lng: faker.location.longitude(),
          country: faker.location.country()
        }
      };
      
      transactions.push(transaction);
    }
    
    return transactions;
  }

  // Generate realistic compliance alerts based on transaction patterns
  generateComplianceAlerts(transactions: Transaction[], customers: Customer[]): ComplianceAlert[] {
    const alerts: ComplianceAlert[] = [];
    
    // Detect suspicious patterns
    const groupedByCustomer = transactions.reduce((acc, txn) => {
      if (!acc[txn.customerId]) acc[txn.customerId] = [];
      acc[txn.customerId].push(txn);
      return acc;
    }, {} as Record<string, Transaction[]>);

    Object.entries(groupedByCustomer).forEach(([customerId, customerTxns]) => {
      const customer = customers.find(c => c.id === customerId);
      if (!customer) return;

      // Structuring detection (multiple small deposits followed by large withdrawal)
      const deposits = customerTxns.filter(t => t.type === 'Deposit' && t.amount < 10000);
      const largeWithdrawals = customerTxns.filter(t => t.type === 'Withdrawal' && t.amount > 50000);
      
      if (deposits.length >= 5 && largeWithdrawals.length >= 1) {
        alerts.push({
          id: `ALERT-${faker.string.alphanumeric(8).toUpperCase()}`,
          type: 'AML',
          severity: 'High',
          description: 'Potential structuring detected: Multiple deposits under $10K followed by large withdrawal',
          accountId: customerTxns[0].accountId,
          customerId,
          transactionIds: [...deposits.slice(0, 5), ...largeWithdrawals.slice(0, 1)].map(t => t.id),
          createdAt: faker.date.recent({ days: 7 }),
          status: faker.helpers.arrayElement(['Open', 'Under Review', 'Escalated']),
          assignedTo: faker.person.fullName(),
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          regulatoryDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });
      }

      // Large cash transactions (CTR threshold)
      const largeCashTxns = customerTxns.filter(t => t.amount > 10000);
      if (largeCashTxns.length > 0) {
        alerts.push({
          id: `ALERT-${faker.string.alphanumeric(8).toUpperCase()}`,
          type: 'CTR',
          severity: 'Medium',
          description: 'Currency Transaction Report required for cash transactions over $10,000',
          accountId: largeCashTxns[0].accountId,
          customerId,
          transactionIds: largeCashTxns.map(t => t.id),
          createdAt: faker.date.recent({ days: 3 }),
          status: 'Open',
          assignedTo: faker.person.fullName(),
          dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          regulatoryDeadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
        });
      }
    });

    return alerts;
  }

  private calculateRiskScore(customer: Customer, amount: number): number {
    let score = 0;
    
    // Customer risk profile weight
    switch (customer.riskProfile) {
      case 'High': score += 40; break;
      case 'Medium': score += 20; break;
      case 'Low': score += 5; break;
    }
    
    // Amount-based risk
    if (amount > 1000000) score += 30;
    else if (amount > 100000) score += 20;
    else if (amount > 10000) score += 10;
    
    // Sanctions/KYC status
    if (customer.sanctionsCheck !== 'Clear') score += 25;
    if (customer.kycStatus !== 'Verified') score += 15;
    
    return Math.min(100, score + faker.number.int({ min: 0, max: 10 }));
  }

  private generateComplianceFlags(customer: Customer, amount: number): string[] {
    const flags: string[] = [];
    
    if (amount > 10000) flags.push('CTR_THRESHOLD');
    if (customer.riskProfile === 'High') flags.push('HIGH_RISK_CUSTOMER');
    if (customer.sanctionsCheck !== 'Clear') flags.push('SANCTIONS_WATCH');
    if (amount > 100000) flags.push('LARGE_TRANSACTION');
    
    return flags;
  }

  private generateRealisticTimestamp(): Date {
    // Generate timestamps with realistic business patterns
    const now = new Date();
    const daysBack = faker.number.int({ min: 0, max: 90 });
    const date = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
    
    // Weight towards business hours (9 AM - 5 PM)
    const hour = faker.helpers.weightedArrayElement([
      { weight: 2, value: 8 },
      { weight: 15, value: 9 },
      { weight: 20, value: 10 },
      { weight: 25, value: 11 },
      { weight: 20, value: 12 },
      { weight: 25, value: 13 },
      { weight: 20, value: 14 },
      { weight: 15, value: 15 },
      { weight: 10, value: 16 },
      { weight: 5, value: 17 },
      { weight: 3, value: 18 },
      { weight: 1, value: 19 },
      { weight: 1, value: 20 },
      { weight: 1, value: 21 },
      { weight: 1, value: 22 },
      { weight: 1, value: 23 },
      { weight: 1, value: 0 },
      { weight: 1, value: 1 },
      { weight: 1, value: 2 },
      { weight: 1, value: 3 },
      { weight: 1, value: 4 },
      { weight: 1, value: 5 },
      { weight: 1, value: 6 },
      { weight: 2, value: 7 }
    ]);
    
    date.setHours(hour, faker.number.int({ min: 0, max: 59 }), faker.number.int({ min: 0, max: 59 }));
    return date;
  }
}

// Export singleton instance
export const mockDataGenerator = AdvancedMockDataGenerator.getInstance(); 