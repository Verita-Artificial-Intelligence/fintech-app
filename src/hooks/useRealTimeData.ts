import { useState, useEffect, useCallback, useRef } from 'react';
import { mockDataGenerator, Transaction, ComplianceAlert, Customer } from '../utils/mockDataGenerator';
import { plaidClient, formatPlaidTransaction } from '../api/providers/plaid';
import { sanctionsClient, SanctionsCheckResult } from '../api/providers/sanctions';

interface RealTimeDataHook {
  transactions: Transaction[];
  alerts: ComplianceAlert[];
  customers: Customer[];
  isConnected: boolean;
  metrics: {
    totalVolume: number;
    transactionCount: number;
    alertCount: number;
    avgRiskScore: number;
  };
  subscribeToTransactions: () => void;
  unsubscribeFromTransactions: () => void;
  accounts: any[];
  sanctionsAlerts: SanctionsCheckResult[];
}

export const useRealTimeData = (): RealTimeDataHook => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [alerts, setAlerts] = useState<ComplianceAlert[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [sanctionsAlerts, setSanctionsAlerts] = useState<SanctionsCheckResult[]>([]);
  const [metrics, setMetrics] = useState({
    totalVolume: 0,
    transactionCount: 0,
    alertCount: 0,
    avgRiskScore: 0
  });
  const plaidUnsubscribe = useRef<(() => void) | null>(null);
  const sanctionsUnsubscribe = useRef<(() => void) | null>(null);

  // Enhanced real-time data subscription with Plaid integration
  const subscribeToTransactions = useCallback(() => {
    setIsConnected(true);
    
    // Connect to Plaid and start streaming
    plaidClient.connect().then(async () => {
      // Get initial accounts
      const plaidAccounts = await plaidClient.getAccounts();
      setAccounts(plaidAccounts);
      
      // Subscribe to Plaid transaction stream
      plaidUnsubscribe.current = plaidClient.streamTransactions((plaidTx) => {
        const formattedTx = formatPlaidTransaction(plaidTx);
        
        // Convert to app Transaction format
        const newTransaction: Transaction = {
          id: formattedTx.id,
          timestamp: new Date(formattedTx.timestamp),
          type: formattedTx.type === 'credit' ? 'Deposit' : 'Withdrawal',
          amount: formattedTx.amount,
          currency: 'USD',
          accountId: formattedTx.accountId,
          subAccountId: 'SUB-DEFAULT',
          customerId: 'CUST-PLAID-001',
          status: formattedTx.status === 'pending' ? 'Pending' : formattedTx.status === 'completed' ? 'Completed' : 'Failed',
          riskScore: formattedTx.riskScore,
          counterparty: formattedTx.merchantName || 'Unknown',
          purpose: formattedTx.category || 'General',
          fees: 0,
          complianceFlags: [],
          geolocation: {
            lat: formattedTx.location?.city ? 37.7749 : 0,
            lng: formattedTx.location?.city ? -122.4194 : 0,
            country: formattedTx.location?.country || 'US'
          }
        };
        
        setTransactions(prev => [newTransaction, ...prev].slice(0, 100));
        
        // Run sanctions check on merchant name
        if (formattedTx.merchantName) {
          sanctionsClient.checkOFAC(formattedTx.merchantName, 'organization').then(result => {
            if (result.status !== 'CLEAR') {
              setSanctionsAlerts(prev => [result, ...prev].slice(0, 50));
              
              // Create compliance alert
              const alert: ComplianceAlert = {
                id: `alert_${Date.now()}`,
                type: 'OFAC',
                severity: result.riskLevel === 'CRITICAL' ? 'Critical' : result.riskLevel === 'HIGH' ? 'High' : 'Medium',
                description: `${result.checkType} Alert: ${result.entityName} - ${result.status}`,
                accountId: formattedTx.accountId,
                customerId: 'CUST-PLAID-001',
                transactionIds: [formattedTx.id],
                createdAt: new Date(),
                status: 'Open',
                assignedTo: 'Compliance Team',
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                regulatoryDeadline: result.riskLevel === 'CRITICAL' ? 
                  new Date(Date.now() + 24 * 60 * 60 * 1000) : // 24 hours for critical
                  undefined
              };
              
              setAlerts(prev => [alert, ...prev].slice(0, 50));
            }
          });
        }
      });
      
      // Subscribe to sanctions monitoring
      sanctionsUnsubscribe.current = sanctionsClient.subscribeToAlerts((alert) => {
        setSanctionsAlerts(prev => [alert, ...prev].slice(0, 50));
      });
    });
    
    // Also run original mock data generation in parallel
    const interval = setInterval(() => {
      // Generate mock customers and accounts for new transactions
      const customers = mockDataGenerator.generateCustomers(50);
      const accounts = customers.map(customer => ({
        id: `ACC-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        customerId: customer.id,
        type: 'FBO' as const,
        balance: Math.random() * 1000000,
        currency: 'USD',
        status: 'Active' as const,
        openDate: new Date(),
        subAccounts: [{
          id: `SUB-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          parentAccountId: '',
          purpose: 'Operating',
          balance: Math.random() * 100000,
          restrictions: [],
          lastTransactionDate: new Date()
        }],
        complianceLevel: 'Standard' as const
      }));

      // Generate 1-3 new transactions
      const newTransactions = mockDataGenerator.generateTransactions(
        Math.floor(Math.random() * 3) + 1,
        customers,
        accounts
      );

      setTransactions(prev => [...newTransactions, ...prev].slice(0, 100)); // Keep last 100

      // Generate alerts based on new transactions
      const newAlerts = mockDataGenerator.generateComplianceAlerts(newTransactions, customers);
      if (newAlerts.length > 0) {
        setAlerts(prev => [...newAlerts, ...prev].slice(0, 50)); // Keep last 50
      }

      // Update metrics
      setMetrics(current => ({
        totalVolume: current.totalVolume + newTransactions.reduce((sum, t) => sum + t.amount, 0),
        transactionCount: current.transactionCount + newTransactions.length,
        alertCount: current.alertCount + newAlerts.length,
        avgRiskScore: newTransactions.reduce((sum, t) => sum + t.riskScore, 0) / newTransactions.length || 0
      }));

    }, Math.random() * 5000 + 3000); // 3-8 seconds

    return () => {
      clearInterval(interval);
      setIsConnected(false);
    };
  }, []);

  const unsubscribeFromTransactions = useCallback(() => {
    setIsConnected(false);
  }, []);

  // Initialize with some base data
  useEffect(() => {
    // Generate a diverse set of customers with varied risk profiles for rich heatmap data
    const initialCustomers = mockDataGenerator.generateCustomers(200);
    const accounts = initialCustomers.map(customer => ({
      id: `ACC-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      customerId: customer.id,
      type: 'FBO' as const,
      balance: Math.random() * 1000000,
      currency: 'USD',
      status: 'Active' as const,
      openDate: new Date(),
      subAccounts: [{
        id: `SUB-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        parentAccountId: '',
        purpose: 'Operating',
        balance: Math.random() * 100000,
        restrictions: [],
        lastTransactionDate: new Date()
      }],
      complianceLevel: 'Standard' as const
    }));

    // Generate more initial transactions for better heatmap population
    const initialTransactions = mockDataGenerator.generateTransactions(150, initialCustomers, accounts);
    const initialAlerts = mockDataGenerator.generateComplianceAlerts(initialTransactions, initialCustomers);

    setCustomers(initialCustomers);
    setTransactions(initialTransactions);
    setAlerts(initialAlerts);
    setMetrics({
      totalVolume: initialTransactions.reduce((sum, t) => sum + t.amount, 0),
      transactionCount: initialTransactions.length,
      alertCount: initialAlerts.length,
      avgRiskScore: initialTransactions.reduce((sum, t) => sum + t.riskScore, 0) / initialTransactions.length
    });
  }, []);

  return {
    transactions,
    alerts,
    customers,
    isConnected,
    metrics,
    subscribeToTransactions,
    unsubscribeFromTransactions,
    accounts,
    sanctionsAlerts
  };
}; 