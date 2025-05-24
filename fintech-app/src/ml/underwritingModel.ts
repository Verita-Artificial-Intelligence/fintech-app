// ML Underwriting Model with SHAP Explainability
// Sprint 3: RBB-3.2 & RBB-3.3 - ML risk model with SHAP

export interface LoanApplication {
  businessName: string;
  requestedAmount: number;
  loanPurpose: string;
  loanTerm: number; // months
  industry: string;
  annualRevenue: number;
  monthlyRevenue: number;
  yearsInBusiness: number;
  employeeCount: number;
  creditScore: number;
  debtServiceCoverageRatio: number;
  collateralValue?: number;
  existingDebt: number;
  cashFlow: number;
  bankingRelationshipMonths?: number;
}

export interface UnderwritingDecision {
  decision: 'Approved' | 'Declined' | 'Manual Review';
  score: number;
  probability: number;
  approvedAmount?: number;
  interestRate?: number;
  term?: number;
  conditions?: string[];
  declineReasons?: string[];
  shapValues: ShapValue[];
  timestamp: string;
}

export interface ShapValue {
  feature: string;
  value: any;
  impact: number;
  displayValue: string;
}

// Simulated XGBoost-style model weights
const FEATURE_WEIGHTS = {
  creditScore: 0.25,
  debtServiceCoverageRatio: 0.20,
  yearsInBusiness: 0.15,
  monthlyRevenue: 0.10,
  existingDebt: -0.10,
  collateralValue: 0.08,
  industryRisk: -0.05,
  loanAmountRatio: -0.05,
  employeeCount: 0.05,
  cashFlowRatio: 0.07
};

export class UnderwritingModel {
  private threshold = 0.65; // Approval threshold
  
  // Main prediction function
  async predict(application: LoanApplication): Promise<UnderwritingDecision> {
    // Simulate ML inference time
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Feature engineering
    const features = this.extractFeatures(application);
    
    // Calculate base score (simulated XGBoost output)
    const baseScore = this.calculateScore(features);
    const probability = this.sigmoid(baseScore);
    
    // Calculate SHAP values
    const shapValues = this.calculateShapValues(features, baseScore);
    
    // Make decision
    let decision: UnderwritingDecision['decision'];
    let approvedAmount: number | undefined;
    let interestRate: number | undefined;
    
    if (probability >= this.threshold) {
      decision = 'Approved';
      approvedAmount = this.calculateApprovedAmount(application, probability);
      interestRate = this.calculateInterestRate(application, probability);
    } else if (probability >= 0.45) {
      decision = 'Manual Review';
    } else {
      decision = 'Declined';
    }
    
    return {
      decision,
      score: Math.round(probability * 1000), // Convert to 0-1000 scale
      probability,
      approvedAmount,
      interestRate,
      term: decision === 'Approved' ? application.loanTerm : undefined,
      conditions: this.generateConditions(application, probability),
      declineReasons: decision === 'Declined' ? this.generateDeclineReasons(shapValues) : undefined,
      shapValues: shapValues.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact)),
      timestamp: new Date().toISOString()
    };
  }
  
  // Extract and normalize features
  private extractFeatures(app: LoanApplication): Record<string, number> {
    const loanToRevenue = app.requestedAmount / app.annualRevenue;
    const industryRiskScore = this.getIndustryRiskScore(app.industry);
    
    return {
      creditScore: (app.creditScore - 300) / 550, // Normalize to 0-1
      debtServiceCoverageRatio: Math.min(app.debtServiceCoverageRatio / 3, 1),
      yearsInBusiness: Math.min(app.yearsInBusiness / 10, 1),
      monthlyRevenue: Math.min(app.monthlyRevenue / 1000000, 1),
      existingDebt: Math.min(app.existingDebt / app.annualRevenue, 1),
      collateralValue: app.collateralValue ? Math.min(app.collateralValue / app.requestedAmount, 2) : 0,
      industryRisk: industryRiskScore,
      loanAmountRatio: Math.min(loanToRevenue, 1),
      employeeCount: Math.min(app.employeeCount / 100, 1),
      cashFlowRatio: Math.min(app.cashFlow / app.monthlyRevenue, 1)
    };
  }
  
  // Calculate model score
  private calculateScore(features: Record<string, number>): number {
    let score = 0;
    
    for (const [feature, value] of Object.entries(features)) {
      const weight = FEATURE_WEIGHTS[feature as keyof typeof FEATURE_WEIGHTS] || 0;
      score += weight * value;
    }
    
    // Add non-linear interactions (simulated tree ensemble)
    if (features.creditScore > 0.7 && features.debtServiceCoverageRatio > 0.5) {
      score += 0.1; // Bonus for strong fundamentals
    }
    
    if (features.existingDebt > 0.7 && features.cashFlowRatio < 0.3) {
      score -= 0.15; // Penalty for high debt with low cash flow
    }
    
    return score;
  }
  
  // Calculate SHAP values (simplified)
  private calculateShapValues(features: Record<string, number>, baseScore: number): ShapValue[] {
    const shapValues: ShapValue[] = [];
    const baseline = 0.5; // Average approval probability
    
    for (const [feature, value] of Object.entries(features)) {
      const weight = FEATURE_WEIGHTS[feature as keyof typeof FEATURE_WEIGHTS] || 0;
      const impact = weight * (value - 0.5) * 100; // Simplified SHAP
      
      shapValues.push({
        feature: this.getFeatureDisplayName(feature),
        value: value,
        impact: impact,
        displayValue: this.formatFeatureValue(feature, value)
      });
    }
    
    return shapValues;
  }
  
  // Helper functions
  private sigmoid(x: number): number {
    return 1 / (1 + Math.exp(-x * 5));
  }
  
  private getIndustryRiskScore(industry: string): number {
    const riskScores: Record<string, number> = {
      'tech': 0.8,
      'healthcare': 0.75,
      'manufacturing': 0.6,
      'retail': 0.5,
      'restaurant': 0.3,
      'construction': 0.4
    };
    return riskScores[industry.toLowerCase()] || 0.5;
  }
  
  private calculateApprovedAmount(app: LoanApplication, probability: number): number {
    const riskAdjustment = 0.5 + (probability * 0.5);
    const maxAmount = Math.min(
      app.requestedAmount,
      app.annualRevenue * 0.25,
      app.monthlyRevenue * app.debtServiceCoverageRatio * 12
    );
    return Math.floor(maxAmount * riskAdjustment);
  }
  
  private calculateInterestRate(app: LoanApplication, probability: number): number {
    const baseRate = 5.5; // Current prime rate approximation
    const riskPremium = (1 - probability) * 8; // 0-8% risk premium
    const termAdjustment = app.loanTerm > 60 ? 0.5 : 0; // Long-term adjustment
    
    return parseFloat((baseRate + riskPremium + termAdjustment).toFixed(2));
  }
  
  private generateConditions(app: LoanApplication, probability: number): string[] {
    const conditions: string[] = [];
    
    if (probability < 0.8) {
      conditions.push('Personal guarantee required');
    }
    if (app.collateralValue && app.collateralValue < app.requestedAmount) {
      conditions.push('Additional collateral may be required');
    }
    if (app.yearsInBusiness < 2) {
      conditions.push('Quarterly financial reporting required');
    }
    if (app.debtServiceCoverageRatio < 1.5) {
      conditions.push('Cash flow covenant: maintain DSCR > 1.25');
    }
    
    return conditions;
  }
  
  private generateDeclineReasons(shapValues: ShapValue[]): string[] {
    const reasons: string[] = [];
    const negativeFactors = shapValues.filter(s => s.impact < -5).slice(0, 3);
    
    for (const factor of negativeFactors) {
      if (factor.feature.includes('Credit')) {
        reasons.push('Credit score below minimum requirements');
      } else if (factor.feature.includes('Debt Service')) {
        reasons.push('Insufficient debt service coverage ratio');
      } else if (factor.feature.includes('Revenue')) {
        reasons.push('Revenue insufficient for requested loan amount');
      } else if (factor.feature.includes('Years')) {
        reasons.push('Limited business operating history');
      } else {
        reasons.push(`Unfavorable ${factor.feature.toLowerCase()}`);
      }
    }
    
    return reasons;
  }
  
  private getFeatureDisplayName(feature: string): string {
    const displayNames: Record<string, string> = {
      creditScore: 'Credit Score',
      debtServiceCoverageRatio: 'Debt Service Coverage',
      yearsInBusiness: 'Years in Business',
      monthlyRevenue: 'Monthly Revenue',
      existingDebt: 'Existing Debt Burden',
      collateralValue: 'Collateral Coverage',
      industryRisk: 'Industry Risk Factor',
      loanAmountRatio: 'Loan to Revenue Ratio',
      employeeCount: 'Employee Count',
      cashFlowRatio: 'Cash Flow Strength'
    };
    return displayNames[feature] || feature;
  }
  
  private formatFeatureValue(feature: string, value: number): string {
    if (feature === 'creditScore') {
      return Math.round(value * 550 + 300).toString();
    } else if (feature === 'debtServiceCoverageRatio') {
      return (value * 3).toFixed(2) + 'x';
    } else if (feature === 'yearsInBusiness') {
      return Math.round(value * 10) + ' years';
    } else if (feature === 'monthlyRevenue') {
      return '$' + Math.round(value * 1000000).toLocaleString();
    } else if (feature.includes('Ratio')) {
      return (value * 100).toFixed(0) + '%';
    }
    return value.toFixed(2);
  }
}

// Export singleton instance
export const underwritingModel = new UnderwritingModel();

// Helper function to generate SHAP waterfall chart data
export function generateShapWaterfallData(shapValues: ShapValue[]): any[] {
  const data = [];
  let cumulative = 50; // Start from baseline
  
  // Add baseline
  data.push({
    name: 'Base Rate',
    value: cumulative,
    delta: 0,
    color: '#666'
  });
  
  // Add each feature impact
  for (const shap of shapValues.slice(0, 8)) { // Top 8 features
    cumulative += shap.impact;
    data.push({
      name: shap.feature,
      value: cumulative,
      delta: shap.impact,
      displayValue: shap.displayValue,
      color: shap.impact > 0 ? '#4caf50' : '#f44336'
    });
  }
  
  // Add final prediction
  data.push({
    name: 'Final Score',
    value: cumulative,
    delta: 0,
    color: '#2196f3'
  });
  
  return data;
}

export default underwritingModel; 