// Experian Credit Bureau API Provider
// Sprint 3: RBB-3.1 - Credit bureau stub

export interface CreditReport {
  reportId: string;
  generatedAt: string;
  business: {
    name: string;
    dba?: string;
    taxId: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
    };
    yearsInBusiness: number;
    employeeCount: number;
    annualRevenue: number;
  };
  creditScore: {
    score: number;
    rating: 'Excellent' | 'Good' | 'Fair' | 'Poor';
    percentile: number;
    factors: string[];
  };
  tradelines: Tradeline[];
  publicRecords: PublicRecord[];
  inquiries: Inquiry[];
  paymentHistory: PaymentHistorySummary;
  financialSummary: {
    totalDebt: number;
    availableCredit: number;
    utilizationRatio: number;
    monthlyObligations: number;
  };
}

export interface Tradeline {
  creditorName: string;
  accountNumber: string;
  accountType: 'Revolving' | 'Installment' | 'Mortgage' | 'Other';
  dateOpened: string;
  creditLimit: number;
  balance: number;
  monthlyPayment: number;
  paymentStatus: 'Current' | 'Late' | 'Default' | 'Charged Off';
  daysLate: number;
  paymentHistory: string; // e.g., "CCCCCCCCCCCC" for 12 months current
}

export interface PublicRecord {
  type: 'Bankruptcy' | 'Tax Lien' | 'Judgment' | 'UCC Filing';
  filingDate: string;
  amount?: number;
  status: 'Active' | 'Satisfied' | 'Released';
  court?: string;
}

export interface Inquiry {
  creditorName: string;
  inquiryDate: string;
  inquiryType: 'Hard' | 'Soft';
  purpose: string;
}

export interface PaymentHistorySummary {
  onTimePayments: number;
  latePayments: number;
  totalPayments: number;
  averageDaysLate: number;
  worstDelinquency: string;
}

export class ExperianClient {
  private apiKey: string;
  private environment: 'sandbox' | 'production';
  
  constructor(apiKey: string = 'demo', environment: 'sandbox' | 'production' = 'sandbox') {
    this.apiKey = apiKey;
    this.environment = environment;
  }
  
  // Pull business credit report
  async getBusinessCreditReport(businessName: string, taxId: string): Promise<CreditReport> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    // Generate realistic credit data based on business name
    const score = this.generateCreditScore(businessName);
    const yearsInBusiness = Math.floor(Math.random() * 20) + 1;
    const annualRevenue = Math.floor(Math.random() * 10000000) + 100000;
    
    return {
      reportId: `EXP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      generatedAt: new Date().toISOString(),
      business: {
        name: businessName,
        taxId: taxId,
        address: {
          street: '123 Business Ave',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90001'
        },
        yearsInBusiness,
        employeeCount: Math.floor(annualRevenue / 100000),
        annualRevenue
      },
      creditScore: {
        score,
        rating: score >= 800 ? 'Excellent' : score >= 700 ? 'Good' : score >= 600 ? 'Fair' : 'Poor',
        percentile: Math.floor((score - 300) / 5.5),
        factors: this.generateScoreFactors(score, yearsInBusiness)
      },
      tradelines: this.generateTradelines(score, annualRevenue),
      publicRecords: this.generatePublicRecords(score),
      inquiries: this.generateInquiries(),
      paymentHistory: this.generatePaymentHistory(score),
      financialSummary: {
        totalDebt: Math.floor(annualRevenue * 0.3 * (850 - score) / 550),
        availableCredit: Math.floor(annualRevenue * 0.5),
        utilizationRatio: (850 - score) / 550,
        monthlyObligations: Math.floor(annualRevenue / 12 * 0.1)
      }
    };
  }
  
  // Calculate debt service coverage ratio
  async calculateDSCR(creditReport: CreditReport, cashFlow: number): Promise<number> {
    const monthlyDebtService = creditReport.financialSummary.monthlyObligations;
    const monthlyCashFlow = cashFlow / 12;
    return monthlyCashFlow / monthlyDebtService;
  }
  
  // Get industry risk assessment
  async getIndustryRisk(industryCode: string): Promise<{
    riskLevel: 'Low' | 'Medium' | 'High';
    defaultRate: number;
    averageScore: number;
  }> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Industry risk mapping (simplified)
    const industryRisks: Record<string, any> = {
      'tech': { riskLevel: 'Low', defaultRate: 0.02, averageScore: 750 },
      'retail': { riskLevel: 'Medium', defaultRate: 0.05, averageScore: 680 },
      'restaurant': { riskLevel: 'High', defaultRate: 0.08, averageScore: 620 },
      'healthcare': { riskLevel: 'Low', defaultRate: 0.03, averageScore: 720 },
      'construction': { riskLevel: 'Medium', defaultRate: 0.06, averageScore: 660 },
      'manufacturing': { riskLevel: 'Medium', defaultRate: 0.04, averageScore: 700 }
    };
    
    return industryRisks[industryCode] || {
      riskLevel: 'Medium',
      defaultRate: 0.05,
      averageScore: 680
    };
  }
  
  private generateCreditScore(businessName: string): number {
    // Generate consistent scores based on business name (for demo consistency)
    let baseScore = 600;
    
    if (businessName.toLowerCase().includes('tech') || businessName.toLowerCase().includes('software')) {
      baseScore = 750;
    } else if (businessName.toLowerCase().includes('established') || businessName.toLowerCase().includes('corporation')) {
      baseScore = 720;
    } else if (businessName.toLowerCase().includes('startup')) {
      baseScore = 580;
    }
    
    // Add some randomness
    return Math.max(300, Math.min(850, baseScore + Math.floor(Math.random() * 100 - 50)));
  }
  
  private generateScoreFactors(score: number, yearsInBusiness: number): string[] {
    const factors = [];
    
    if (score < 650) {
      factors.push('High credit utilization');
      factors.push('Limited credit history');
    }
    if (yearsInBusiness < 3) {
      factors.push('Young business age');
    }
    if (score > 750) {
      factors.push('Excellent payment history');
      factors.push('Low credit utilization');
    }
    if (Math.random() > 0.7) {
      factors.push('Recent credit inquiries');
    }
    
    return factors;
  }
  
  private generateTradelines(score: number, revenue: number): Tradeline[] {
    const count = Math.floor(Math.random() * 5) + 3;
    const tradelines: Tradeline[] = [];
    
    for (let i = 0; i < count; i++) {
      const creditLimit = Math.floor(revenue * 0.01 * (Math.random() + 0.5));
      const balance = creditLimit * (score < 700 ? 0.6 + Math.random() * 0.3 : Math.random() * 0.3);
      
      tradelines.push({
        creditorName: ['Chase Bank', 'Bank of America', 'Wells Fargo', 'Capital One', 'American Express'][i % 5],
        accountNumber: `****${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        accountType: i === 0 ? 'Mortgage' : i % 2 === 0 ? 'Revolving' : 'Installment',
        dateOpened: new Date(Date.now() - Math.random() * 5 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        creditLimit,
        balance,
        monthlyPayment: balance * 0.03,
        paymentStatus: score > 700 ? 'Current' : Math.random() > 0.3 ? 'Current' : 'Late',
        daysLate: score > 700 ? 0 : Math.floor(Math.random() * 30),
        paymentHistory: score > 700 ? 'CCCCCCCCCCCC' : 'CCCCCCLCCCCC'
      });
    }
    
    return tradelines;
  }
  
  private generatePublicRecords(score: number): PublicRecord[] {
    if (score > 700 || Math.random() > 0.2) return [];
    
    return [{
      type: Math.random() > 0.5 ? 'Tax Lien' : 'UCC Filing',
      filingDate: new Date(Date.now() - Math.random() * 2 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      amount: Math.floor(Math.random() * 50000) + 5000,
      status: Math.random() > 0.5 ? 'Active' : 'Satisfied'
    }];
  }
  
  private generateInquiries(): Inquiry[] {
    const count = Math.floor(Math.random() * 3) + 1;
    return Array.from({ length: count }, (_, i) => ({
      creditorName: ['JPMorgan Chase', 'Citi', 'US Bank', 'PNC Bank'][i % 4],
      inquiryDate: new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      inquiryType: i === 0 ? 'Hard' : 'Soft',
      purpose: 'Business Loan Application'
    }));
  }
  
  private generatePaymentHistory(score: number): PaymentHistorySummary {
    const totalPayments = 120; // 10 years of monthly payments
    const lateRate = score > 750 ? 0.01 : score > 650 ? 0.05 : 0.15;
    const latePayments = Math.floor(totalPayments * lateRate);
    
    return {
      onTimePayments: totalPayments - latePayments,
      latePayments,
      totalPayments,
      averageDaysLate: latePayments > 0 ? Math.floor(Math.random() * 15) + 5 : 0,
      worstDelinquency: latePayments === 0 ? 'None' : score > 700 ? '30 days' : '60 days'
    };
  }
}

// Export singleton instance
export const experianClient = new ExperianClient();

export default experianClient; 