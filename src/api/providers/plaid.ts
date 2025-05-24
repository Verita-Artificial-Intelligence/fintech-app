// Plaid API Provider for RBB Demo
// Sprint 2: RBB-2.1 - Live FBO ledger feed

interface PlaidConfig {
  clientId?: string;
  secret?: string;
  environment: 'sandbox' | 'development' | 'production';
  webhook?: string;
}

interface PlaidTransaction {
  transaction_id: string;
  account_id: string;
  amount: number;
  date: string;
  datetime: string;
  name: string;
  merchant_name?: string;
  category: string[];
  pending: boolean;
  account_owner?: string;
  payment_channel: string;
  location?: {
    city?: string;
    region?: string;
    country?: string;
  };
}

interface PlaidAccount {
  account_id: string;
  balances: {
    available: number;
    current: number;
    limit?: number;
  };
  mask: string;
  name: string;
  official_name?: string;
  type: string;
  subtype: string;
}

// Simulated Plaid API client for demo purposes
export class PlaidClient {
  private config: PlaidConfig;
  private isConnected: boolean = false;
  
  constructor(config: PlaidConfig = { environment: 'sandbox' }) {
    this.config = config;
    // In production, would initialize with actual Plaid credentials
  }
  
  // Connect to Plaid (simulated)
  async connect(): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.isConnected = true;
        resolve(true);
      }, 1000);
    });
  }
  
  // Get accounts (simulated FBO structure)
  async getAccounts(): Promise<PlaidAccount[]> {
    if (!this.isConnected) await this.connect();
    
    return [
      {
        account_id: 'fbo_master_001',
        balances: {
          available: 15234567.89,
          current: 15534567.89,
        },
        mask: '4567',
        name: 'FBO Master Account',
        official_name: 'Royal Business Bank FBO Master',
        type: 'depository',
        subtype: 'checking',
      },
      {
        account_id: 'fbo_program_001',
        balances: {
          available: 5234567.89,
          current: 5334567.89,
        },
        mask: '7890',
        name: 'Payment Program A',
        official_name: 'RBB FBO - Payment Program A',
        type: 'depository',
        subtype: 'checking',
      },
      {
        account_id: 'fbo_program_002',
        balances: {
          available: 3456789.12,
          current: 3556789.12,
        },
        mask: '3456',
        name: 'Payroll Services',
        official_name: 'RBB FBO - Payroll Services',
        type: 'depository',
        subtype: 'checking',
      },
    ];
  }
  
  // Get recent transactions with realistic patterns
  async getTransactions(startDate?: Date, endDate?: Date): Promise<PlaidTransaction[]> {
    if (!this.isConnected) await this.connect();
    
    const transactions: PlaidTransaction[] = [];
    const merchantNames = [
      'Stripe Inc', 'Square Inc', 'PayPal', 'Shopify Payments',
      'Amazon Pay', 'Apple Pay', 'Google Pay', 'Zelle Transfer',
      'ACH Transfer', 'Wire Transfer', 'Check Deposit', 'ATM Withdrawal',
    ];
    
    const categories = [
      ['Transfer', 'Deposit'], ['Transfer', 'Withdrawal'],
      ['Payment', 'Credit Card'], ['Payment', 'Debit Card'],
      ['Bank Fees'], ['Interest'], ['Service', 'Financial'],
    ];
    
    const cities = [
      { city: 'San Francisco', region: 'CA', country: 'US' },
      { city: 'Los Angeles', region: 'CA', country: 'US' },
      { city: 'Las Vegas', region: 'NV', country: 'US' },
      { city: 'New York', region: 'NY', country: 'US' },
      { city: 'Seattle', region: 'WA', country: 'US' },
    ];
    
    // Generate realistic transactions
    const now = new Date();
    for (let i = 0; i < 50; i++) {
      const date = new Date(now.getTime() - i * 3600000); // Each hour
      const isDebit = Math.random() > 0.3;
      const amount = isDebit 
        ? -(Math.random() * 50000 + 100) 
        : (Math.random() * 75000 + 500);
      
      transactions.push({
        transaction_id: `txn_${Date.now()}_${i}`,
        account_id: ['fbo_master_001', 'fbo_program_001', 'fbo_program_002'][Math.floor(Math.random() * 3)],
        amount: parseFloat(amount.toFixed(2)),
        date: date.toISOString().split('T')[0],
        datetime: date.toISOString(),
        name: merchantNames[Math.floor(Math.random() * merchantNames.length)],
        merchant_name: merchantNames[Math.floor(Math.random() * merchantNames.length)],
        category: categories[Math.floor(Math.random() * categories.length)],
        pending: i < 5 && Math.random() > 0.7,
        payment_channel: ['online', 'in_store', 'other'][Math.floor(Math.random() * 3)],
        location: cities[Math.floor(Math.random() * cities.length)],
      });
    }
    
    return transactions;
  }
  
  // Stream transactions in real-time (simulated)
  streamTransactions(callback: (transaction: PlaidTransaction) => void): () => void {
    const interval = setInterval(async () => {
      const transactions = await this.getTransactions();
      if (transactions.length > 0) {
        // Send a random recent transaction
        callback(transactions[Math.floor(Math.random() * 5)]);
      }
    }, 3000 + Math.random() * 5000); // Random interval 3-8 seconds
    
    // Return cleanup function
    return () => clearInterval(interval);
  }
  
  // Get account hierarchy for FBO sub-accounts
  async getAccountHierarchy(): Promise<any> {
    return {
      master: {
        id: 'fbo_master_001',
        name: 'FBO Master Account',
        balance: 15234567.89,
        programs: [
          {
            id: 'fbo_program_001',
            name: 'Payment Program A',
            balance: 5234567.89,
            subAccounts: [
              { id: 'sub_001_001', name: 'Merchant Group 1', balance: 1234567.89 },
              { id: 'sub_001_002', name: 'Merchant Group 2', balance: 2345678.90 },
              { id: 'sub_001_003', name: 'Merchant Group 3', balance: 1654321.10 },
            ],
          },
          {
            id: 'fbo_program_002',
            name: 'Payroll Services',
            balance: 3456789.12,
            subAccounts: [
              { id: 'sub_002_001', name: 'Company Payroll A', balance: 1234567.89 },
              { id: 'sub_002_002', name: 'Company Payroll B', balance: 987654.32 },
              { id: 'sub_002_003', name: 'Company Payroll C', balance: 1234566.91 },
            ],
          },
        ],
      },
    };
  }
}

// Export singleton instance
export const plaidClient = new PlaidClient({
  environment: 'sandbox',
});

// Helper function to format Plaid transactions for the app
export function formatPlaidTransaction(transaction: PlaidTransaction): any {
  return {
    id: transaction.transaction_id,
    timestamp: transaction.datetime,
    type: transaction.amount > 0 ? 'credit' : 'debit',
    amount: Math.abs(transaction.amount),
    description: transaction.name,
    merchantName: transaction.merchant_name,
    category: transaction.category.join(' - '),
    status: transaction.pending ? 'pending' : 'completed',
    accountId: transaction.account_id,
    location: transaction.location,
    riskScore: Math.random() * 100, // Will be replaced by actual risk scoring
  };
}

export default plaidClient; 