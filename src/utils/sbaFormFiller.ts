// SBA Form 1919 Autofill Utility
// Sprint 3: RBB-3.4 - SBA Form autofill

export interface SBAFormData {
  // Business Information
  businessName: string;
  dba?: string;
  taxId: string;
  businessAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  businessPhone: string;
  businessEmail: string;
  dateEstablished: string;
  stateOfIncorporation: string;
  
  // Ownership Information
  ownerName: string;
  ownerTitle: string;
  ownershipPercentage: number;
  ownerSSN: string;
  ownerAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  
  // Loan Information
  loanAmount: number;
  loanPurpose: string;
  loanTerm: number; // months
  collateralOffered?: string;
  
  // Financial Information
  annualRevenue: number;
  netProfit: number;
  totalAssets: number;
  totalLiabilities: number;
  numberOfEmployees: number;
  
  // Use of Proceeds
  workingCapital?: number;
  equipmentPurchase?: number;
  realEstatePurchase?: number;
  debtRefinancing?: number;
  businessAcquisition?: number;
  other?: {
    amount: number;
    description: string;
  };
}

export class SBAFormFiller {
  // Generate form field mappings for SBA Form 1919
  generateFormFields(data: SBAFormData): Record<string, string | boolean> {
    const fields: Record<string, string | boolean> = {
      // Section 1: Business Information
      'business_name': data.businessName,
      'dba_name': data.dba || '',
      'ein_tin': data.taxId,
      'business_address': data.businessAddress.street,
      'business_city': data.businessAddress.city,
      'business_state': data.businessAddress.state,
      'business_zip': data.businessAddress.zipCode,
      'business_phone': data.businessPhone,
      'business_email': data.businessEmail,
      'date_established': this.formatDate(data.dateEstablished),
      'state_of_incorporation': data.stateOfIncorporation,
      
      // Section 2: Ownership
      'owner_name': data.ownerName,
      'owner_title': data.ownerTitle,
      'ownership_percentage': data.ownershipPercentage.toString() + '%',
      'owner_ssn': this.maskSSN(data.ownerSSN),
      'owner_address': data.ownerAddress.street,
      'owner_city': data.ownerAddress.city,
      'owner_state': data.ownerAddress.state,
      'owner_zip': data.ownerAddress.zipCode,
      
      // Section 3: Loan Request
      'loan_amount_requested': this.formatCurrency(data.loanAmount),
      'loan_purpose': data.loanPurpose,
      'loan_term_months': data.loanTerm.toString(),
      'collateral_description': data.collateralOffered || 'None',
      
      // Section 4: Financial Information
      'annual_revenue': this.formatCurrency(data.annualRevenue),
      'net_profit': this.formatCurrency(data.netProfit),
      'total_assets': this.formatCurrency(data.totalAssets),
      'total_liabilities': this.formatCurrency(data.totalLiabilities),
      'number_of_employees': data.numberOfEmployees.toString(),
      
      // Section 5: Use of Proceeds
      'working_capital_amount': data.workingCapital ? this.formatCurrency(data.workingCapital) : '',
      'equipment_purchase_amount': data.equipmentPurchase ? this.formatCurrency(data.equipmentPurchase) : '',
      'real_estate_amount': data.realEstatePurchase ? this.formatCurrency(data.realEstatePurchase) : '',
      'debt_refinance_amount': data.debtRefinancing ? this.formatCurrency(data.debtRefinancing) : '',
      'business_acquisition_amount': data.businessAcquisition ? this.formatCurrency(data.businessAcquisition) : '',
      'other_amount': data.other ? this.formatCurrency(data.other.amount) : '',
      'other_description': data.other?.description || '',
      
      // Checkboxes
      'is_franchise': false,
      'is_export_business': false,
      'is_seasonal': false,
      
      // Certifications
      'certification_true': true,
      'certification_authorized': true,
      'signature_date': this.formatDate(new Date().toISOString())
    };
    
    return fields;
  }
  
  // Generate a downloadable form data object (for PDF libraries)
  async generatePDFData(formData: SBAFormData): Promise<Blob> {
    // In a real implementation, this would use a PDF library like pdf-lib or pdfmake
    // For demo purposes, we'll create a JSON representation
    const fields = this.generateFormFields(formData);
    
    const pdfData = {
      formType: 'SBA Form 1919',
      generatedAt: new Date().toISOString(),
      fields: fields,
      metadata: {
        version: '2024-01',
        preparedBy: 'Royal Business Bank - Automated Underwriting System',
        disclaimer: 'This is a draft form. Please review all information before submission.'
      }
    };
    
    // Simulate PDF generation delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return as blob (in production, this would be actual PDF binary)
    return new Blob([JSON.stringify(pdfData, null, 2)], { 
      type: 'application/json' // Would be 'application/pdf' in production
    });
  }
  
  // Validate form data completeness
  validateFormData(data: SBAFormData): { isValid: boolean; missingFields: string[] } {
    const required = [
      'businessName', 'taxId', 'businessAddress', 'businessPhone',
      'ownerName', 'ownerTitle', 'ownershipPercentage',
      'loanAmount', 'loanPurpose', 'loanTerm',
      'annualRevenue', 'numberOfEmployees'
    ];
    
    const missingFields: string[] = [];
    
    for (const field of required) {
      if (!data[field as keyof SBAFormData]) {
        missingFields.push(field);
      }
    }
    
    // Check address objects
    if (!data.businessAddress?.street || !data.businessAddress?.city || 
        !data.businessAddress?.state || !data.businessAddress?.zipCode) {
      missingFields.push('businessAddress (incomplete)');
    }
    
    return {
      isValid: missingFields.length === 0,
      missingFields
    };
  }
  
  // Helper methods
  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
  }
  
  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
  
  private maskSSN(ssn: string): string {
    // For security, only show last 4 digits
    return `XXX-XX-${ssn.slice(-4)}`;
  }
  
  // Generate sample form data for testing
  generateSampleData(): SBAFormData {
    return {
      businessName: 'Tech Innovations Inc.',
      dba: 'TechInno',
      taxId: '12-3456789',
      businessAddress: {
        street: '123 Innovation Way',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90001'
      },
      businessPhone: '(310) 555-0123',
      businessEmail: 'finance@techinno.com',
      dateEstablished: '2019-03-15',
      stateOfIncorporation: 'CA',
      
      ownerName: 'John Smith',
      ownerTitle: 'CEO',
      ownershipPercentage: 75,
      ownerSSN: '123-45-6789',
      ownerAddress: {
        street: '456 Executive Dr',
        city: 'Beverly Hills',
        state: 'CA',
        zipCode: '90210'
      },
      
      loanAmount: 500000,
      loanPurpose: 'Working capital and equipment purchase',
      loanTerm: 60,
      collateralOffered: 'Business equipment and inventory',
      
      annualRevenue: 2500000,
      netProfit: 450000,
      totalAssets: 1800000,
      totalLiabilities: 600000,
      numberOfEmployees: 25,
      
      workingCapital: 300000,
      equipmentPurchase: 150000,
      other: {
        amount: 50000,
        description: 'Marketing and business development'
      }
    };
  }
}

// Export singleton instance
export const sbaFormFiller = new SBAFormFiller();

// Helper function to trigger form download
export async function downloadSBAForm(formData: SBAFormData, filename: string = 'SBA_Form_1919_Draft.json'): Promise<void> {
  const blob = await sbaFormFiller.generatePDFData(formData);
  
  // Create download link
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  
  // Cleanup
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export default sbaFormFiller; 