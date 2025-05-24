// AI-Powered Insights Engine for High-Fidelity Demo
import { Transaction, Customer, ComplianceAlert } from './mockDataGenerator';

export interface AIPrediction {
  type: 'risk_trend' | 'compliance_alert' | 'fraud_pattern' | 'market_opportunity';
  confidence: number;
  description: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  timeframe: string;
  recommendations: string[];
  data: any;
}

export interface TrendAnalysis {
  metric: string;
  direction: 'up' | 'down' | 'stable';
  magnitude: number;
  period: string;
  projection: number[];
  factors: string[];
}

export class AIInsightsEngine {
  private static instance: AIInsightsEngine;
  
  static getInstance(): AIInsightsEngine {
    if (!this.instance) {
      this.instance = new AIInsightsEngine();
    }
    return this.instance;
  }

  // Generate predictive compliance alerts
  generateCompliancePredictions(transactions: Transaction[], customers: Customer[]): AIPrediction[] {
    const predictions: AIPrediction[] = [];

    // Detect emerging suspicious patterns
    const customerActivity = this.analyzeCustomerActivity(transactions, customers);
    
    customerActivity.forEach(activity => {
      if (activity.riskScore > 75 && activity.transactionVelocity > 10) {
        predictions.push({
          type: 'compliance_alert',
          confidence: 0.87,
          description: `Customer ${activity.customerId} showing elevated risk pattern. 
                      Increased transaction velocity combined with high-value transfers may require SAR filing.`,
          impact: 'high',
          timeframe: '3-5 days',
          recommendations: [
            'Initiate enhanced due diligence review',
            'Monitor for structuring patterns',
            'Prepare SAR documentation if pattern continues'
          ],
          data: activity
        });
      }
    });

    // Regulatory deadline predictions
    predictions.push({
      type: 'compliance_alert',
      confidence: 0.95,
      description: 'BSA/AML quarterly filing deadline approaching. 14 pending cases require review.',
      impact: 'medium',
      timeframe: '7 days',
      recommendations: [
        'Schedule compliance team review meeting',
        'Prioritize high-risk cases for immediate attention',
        'Prepare regulatory submission package'
      ],
      data: { pendingCases: 14, deadline: '2024-01-15' }
    });

    return predictions;
  }

  // Generate fraud risk predictions
  generateFraudPredictions(transactions: Transaction[]): AIPrediction[] {
    const predictions: AIPrediction[] = [];

    // Analyze transaction patterns for fraud indicators
    const fraudPatterns = this.detectFraudPatterns(transactions);
    
    if (fraudPatterns.structuringRisk > 0.7) {
      predictions.push({
        type: 'fraud_pattern',
        confidence: 0.82,
        description: 'Detected potential structuring behavior: Multiple transactions just below reporting thresholds.',
        impact: 'high',
        timeframe: 'immediate',
        recommendations: [
          'Flag account for enhanced monitoring',
          'Review customer transaction history',
          'Consider freezing account if pattern continues'
        ],
        data: fraudPatterns
      });
    }

    // Geographic risk analysis
    const geographicRisk = this.analyzeGeographicRisk(transactions);
    if (geographicRisk.anomalyScore > 0.6) {
      predictions.push({
        type: 'fraud_pattern',
        confidence: 0.73,
        description: 'Unusual geographic transaction pattern detected. Transactions from multiple high-risk jurisdictions.',
        impact: 'medium',
        timeframe: '24 hours',
        recommendations: [
          'Verify customer travel/business activities',
          'Check IP address geolocation consistency',
          'Implement additional authentication for international transactions'
        ],
        data: geographicRisk
      });
    }

    return predictions;
  }

  // Generate business intelligence insights
  generateBusinessInsights(transactions: Transaction[], customers: Customer[]): AIPrediction[] {
    const insights: AIPrediction[] = [];

    // Market opportunity analysis
    const industryTrends = this.analyzeIndustryTrends(customers, transactions);
    
    insights.push({
      type: 'market_opportunity',
      confidence: 0.78,
      description: 'Technology sector customers showing 45% growth in transaction volume. Opportunity for specialized financial products.',
      impact: 'medium',
      timeframe: 'next quarter',
      recommendations: [
        'Develop tech-focused banking packages',
        'Create specialized lending products for startups',
        'Partner with fintech accelerators'
      ],
      data: industryTrends
    });

    // Risk trend analysis
    const riskTrends = this.analyzeRiskTrends(transactions);
    insights.push({
      type: 'risk_trend',
      confidence: 0.85,
      description: 'Overall portfolio risk decreasing by 12% month-over-month due to improved customer onboarding.',
      impact: 'low',
      timeframe: 'ongoing',
      recommendations: [
        'Continue current onboarding practices',
        'Consider expanding customer acquisition',
        'Review risk pricing models for optimization'
      ],
      data: riskTrends
    });

    return insights;
  }

  // Analyze trend patterns
  analyzeTrends(transactions: Transaction[]): TrendAnalysis[] {
    const trends: TrendAnalysis[] = [];

    // Transaction volume trend
    const volumeTrend = this.calculateTrend(
      transactions.map(t => t.amount),
      'Transaction Volume'
    );
    trends.push(volumeTrend);

    // Risk score trend
    const riskTrend = this.calculateTrend(
      transactions.map(t => t.riskScore),
      'Average Risk Score'
    );
    trends.push(riskTrend);

    // Transaction frequency trend
    const frequencyData = this.groupTransactionsByDay(transactions);
    const frequencyTrend = this.calculateTrend(
      Object.values(frequencyData),
      'Transaction Frequency'
    );
    trends.push(frequencyTrend);

    return trends;
  }

  private analyzeCustomerActivity(transactions: Transaction[], customers: Customer[]) {
    return customers.map(customer => {
      const customerTxns = transactions.filter(t => t.customerId === customer.id);
      const avgAmount = customerTxns.reduce((sum, t) => sum + t.amount, 0) / customerTxns.length || 0;
      const avgRisk = customerTxns.reduce((sum, t) => sum + t.riskScore, 0) / customerTxns.length || 0;
      
      return {
        customerId: customer.id,
        customerName: customer.name,
        transactionCount: customerTxns.length,
        transactionVelocity: customerTxns.length / 30, // per day over last 30 days
        averageAmount: avgAmount,
        riskScore: avgRisk,
        riskProfile: customer.riskProfile
      };
    });
  }

  private detectFraudPatterns(transactions: Transaction[]) {
    // Simulate structuring detection
    const smallTransactions = transactions.filter(t => t.amount < 10000 && t.amount > 9000).length;
    const totalTransactions = transactions.length;
    const structuringRisk = smallTransactions / totalTransactions;

    // Velocity analysis
    const recentTransactions = transactions.filter(t => 
      new Date(t.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    );
    
    return {
      structuringRisk,
      velocityRisk: recentTransactions.length > 20 ? 0.8 : 0.2,
      amountRisk: Math.random() * 0.5, // Simulate complex analysis
      patternRisk: Math.random() * 0.7
    };
  }

  private analyzeGeographicRisk(transactions: Transaction[]) {
    const countries = new Set(transactions.map(t => t.geolocation.country));
    const highRiskCountries = ['Country A', 'Country B']; // Simulated high-risk jurisdictions
    
    const riskCountryCount = Array.from(countries).filter(c => 
      highRiskCountries.includes(c)
    ).length;
    
    return {
      uniqueCountries: countries.size,
      highRiskCountries: riskCountryCount,
      anomalyScore: countries.size > 5 ? 0.8 : 0.3,
      riskFactors: riskCountryCount > 0 ? ['High-risk jurisdiction activity'] : []
    };
  }

  private analyzeIndustryTrends(customers: Customer[], transactions: Transaction[]) {
    const industryActivity = customers.reduce((acc, customer) => {
      const customerTxns = transactions.filter(t => t.customerId === customer.id);
      const industry = customer.industry || 'Unknown';
      
      if (!acc[industry]) {
        acc[industry] = { count: 0, volume: 0, customers: 0 };
      }
      
      acc[industry].customers += 1;
      acc[industry].count += customerTxns.length;
      acc[industry].volume += customerTxns.reduce((sum, t) => sum + t.amount, 0);
      
      return acc;
    }, {} as Record<string, { count: number; volume: number; customers: number }>);

    return industryActivity;
  }

  private analyzeRiskTrends(transactions: Transaction[]) {
    const riskByMonth = transactions.reduce((acc, txn) => {
      const month = new Date(txn.timestamp).toISOString().slice(0, 7);
      if (!acc[month]) acc[month] = [];
      acc[month].push(txn.riskScore);
      return acc;
    }, {} as Record<string, number[]>);

    const monthlyAverage = Object.entries(riskByMonth).map(([month, scores]) => ({
      month,
      averageRisk: scores.reduce((sum, score) => sum + score, 0) / scores.length
    }));

    return {
      monthly: monthlyAverage,
      trend: 'decreasing',
      magnitude: 12 // 12% decrease
    };
  }

  private calculateTrend(data: number[], metric: string): TrendAnalysis {
    const recentAvg = data.slice(-7).reduce((a, b) => a + b, 0) / 7;
    const previousAvg = data.slice(-14, -7).reduce((a, b) => a + b, 0) / 7;
    const direction = recentAvg > previousAvg ? 'up' : recentAvg < previousAvg ? 'down' : 'stable';
    const magnitude = Math.abs((recentAvg - previousAvg) / previousAvg) * 100;

    // Generate simple projection
    const projection = Array.from({ length: 7 }, (_, i) => 
      recentAvg + (Math.random() - 0.5) * recentAvg * 0.1
    );

    return {
      metric,
      direction,
      magnitude,
      period: '7 days',
      projection,
      factors: this.generateTrendFactors(direction, magnitude)
    };
  }

  private generateTrendFactors(direction: string, magnitude: number): string[] {
    const factors = [];
    
    if (magnitude > 10) {
      factors.push('Significant market activity');
    }
    if (direction === 'up') {
      factors.push('Increased customer engagement', 'Market expansion');
    } else if (direction === 'down') {
      factors.push('Seasonal adjustment', 'Risk mitigation measures');
    }
    
    return factors;
  }

  private groupTransactionsByDay(transactions: Transaction[]) {
    return transactions.reduce((acc, txn) => {
      const day = new Date(txn.timestamp).toISOString().slice(0, 10);
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }
}

export const aiInsights = AIInsightsEngine.getInstance(); 