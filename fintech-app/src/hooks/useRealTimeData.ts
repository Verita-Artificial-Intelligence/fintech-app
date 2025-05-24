import { useState, useEffect, useCallback } from 'react';
import { mockDataGenerator, Transaction, ComplianceAlert, Customer } from '../utils/mockDataGenerator';

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
}

export const useRealTimeData = (): RealTimeDataHook => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [alerts, setAlerts] = useState<ComplianceAlert[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [metrics, setMetrics] = useState({
    totalVolume: 0,
    transactionCount: 0,
    alertCount: 0,
    avgRiskScore: 0
  });

  // Simulate WebSocket connection for real-time updates
  const subscribeToTransactions = useCallback(() => {
    setIsConnected(true);
    
    // Simulate new transactions every 3-8 seconds
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
    unsubscribeFromTransactions
  };
}; 