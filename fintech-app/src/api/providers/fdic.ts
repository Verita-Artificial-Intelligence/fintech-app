// FDIC API Provider for RBB Branch Data
// Sprint 2: RBB-2.3 - Branch geo heat-map

export interface BankBranch {
  id: string;
  bankName: string;
  branchName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  county: string;
  latitude: number;
  longitude: number;
  establishedDate?: string;
  acquiredDate?: string;
  branchType: 'Full Service' | 'Limited Service' | 'ATM Only' | 'Corporate';
  deposits?: number;
  assets?: number;
}

export interface BranchMetrics {
  transactionVolume: number;
  customerCount: number;
  fraudIncidents: number;
  complianceScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
}

// RBB branch locations based on their real presence in CA, NV, and NY
const RBB_BRANCHES: BankBranch[] = [
  // California Branches
  {
    id: 'RBB-CA-001',
    bankName: 'Royal Business Bank',
    branchName: 'RBB Los Angeles Main',
    address: '660 S Figueroa St',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90017',
    county: 'Los Angeles',
    latitude: 34.0522,
    longitude: -118.2437,
    establishedDate: '2008-11-24',
    branchType: 'Full Service',
    deposits: 324567890,
    assets: 445678901
  },
  {
    id: 'RBB-CA-002',
    bankName: 'Royal Business Bank',
    branchName: 'RBB San Francisco',
    address: '555 Montgomery St',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94111',
    county: 'San Francisco',
    latitude: 37.7749,
    longitude: -122.4194,
    establishedDate: '2010-03-15',
    branchType: 'Full Service',
    deposits: 278456789,
    assets: 367890123
  },
  {
    id: 'RBB-CA-003',
    bankName: 'Royal Business Bank',
    branchName: 'RBB Irvine',
    address: '2030 Main St',
    city: 'Irvine',
    state: 'CA',
    zipCode: '92614',
    county: 'Orange',
    latitude: 33.6846,
    longitude: -117.8265,
    establishedDate: '2012-07-20',
    branchType: 'Full Service',
    deposits: 189234567,
    assets: 234567890
  },
  {
    id: 'RBB-CA-004',
    bankName: 'Royal Business Bank',
    branchName: 'RBB San Diego',
    address: '701 B St',
    city: 'San Diego',
    state: 'CA',
    zipCode: '92101',
    county: 'San Diego',
    latitude: 32.7157,
    longitude: -117.1611,
    establishedDate: '2014-11-10',
    branchType: 'Full Service',
    deposits: 156789012,
    assets: 198765432
  },
  {
    id: 'RBB-CA-005',
    bankName: 'Royal Business Bank',
    branchName: 'RBB Sacramento',
    address: '980 9th St',
    city: 'Sacramento',
    state: 'CA',
    zipCode: '95814',
    county: 'Sacramento',
    latitude: 38.5816,
    longitude: -121.4944,
    establishedDate: '2016-02-28',
    branchType: 'Limited Service',
    deposits: 89012345,
    assets: 112345678
  },
  // Nevada Branches
  {
    id: 'RBB-NV-001',
    bankName: 'Royal Business Bank',
    branchName: 'RBB Las Vegas',
    address: '3960 Howard Hughes Pkwy',
    city: 'Las Vegas',
    state: 'NV',
    zipCode: '89169',
    county: 'Clark',
    latitude: 36.1699,
    longitude: -115.1398,
    establishedDate: '2011-09-12',
    branchType: 'Full Service',
    deposits: 234567890,
    assets: 298765432
  },
  {
    id: 'RBB-NV-002',
    bankName: 'Royal Business Bank',
    branchName: 'RBB Reno',
    address: '5310 Kietzke Ln',
    city: 'Reno',
    state: 'NV',
    zipCode: '89511',
    county: 'Washoe',
    latitude: 39.5296,
    longitude: -119.8138,
    establishedDate: '2015-04-18',
    branchType: 'Limited Service',
    deposits: 67890123,
    assets: 87654321
  },
  // New York Branches
  {
    id: 'RBB-NY-001',
    bankName: 'Royal Business Bank',
    branchName: 'RBB Manhattan',
    address: '745 7th Ave',
    city: 'New York',
    state: 'NY',
    zipCode: '10019',
    county: 'New York',
    latitude: 40.7614,
    longitude: -73.9776,
    establishedDate: '2013-06-25',
    branchType: 'Full Service',
    deposits: 456789012,
    assets: 567890123
  },
  {
    id: 'RBB-NY-002',
    bankName: 'Royal Business Bank',
    branchName: 'RBB Queens',
    address: '136-20 38th Ave',
    city: 'Flushing',
    state: 'NY',
    zipCode: '11354',
    county: 'Queens',
    latitude: 40.7608,
    longitude: -73.8239,
    establishedDate: '2017-10-30',
    branchType: 'Full Service',
    deposits: 178901234,
    assets: 212345678
  }
];

export class FDICBankDataClient {
  private baseUrl: string = 'https://banks.data.fdic.gov/api';
  
  // Get RBB branch locations (simulated for demo)
  async getRBBBranches(): Promise<BankBranch[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In production, would call actual FDIC API:
    // const response = await fetch(`${this.baseUrl}/institutions?filters=STNAME:CA,NV,NY%20AND%20INSNAME:Royal%20Business%20Bank`);
    
    return RBB_BRANCHES;
  }
  
  // Get branch-specific metrics
  async getBranchMetrics(branchId: string): Promise<BranchMetrics> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const branch = RBB_BRANCHES.find(b => b.id === branchId);
    if (!branch) throw new Error(`Branch ${branchId} not found`);
    
    // Generate realistic metrics based on branch size
    const baseVolume = branch.deposits || 100000000;
    
    return {
      transactionVolume: Math.floor(baseVolume * 0.01 * (0.8 + Math.random() * 0.4)),
      customerCount: Math.floor(baseVolume / 500000 * (0.9 + Math.random() * 0.2)),
      fraudIncidents: Math.floor(Math.random() * 10),
      complianceScore: 85 + Math.floor(Math.random() * 15),
      riskLevel: Math.random() < 0.7 ? 'Low' : Math.random() < 0.9 ? 'Medium' : 'High'
    };
  }
  
  // Get real-time branch activity (simulated)
  async getBranchActivity(branchId: string): Promise<any> {
    const metrics = await this.getBranchMetrics(branchId);
    const branch = RBB_BRANCHES.find(b => b.id === branchId);
    
    return {
      branchId,
      branchName: branch?.branchName || 'Unknown',
      currentActivity: {
        transactionsLastHour: Math.floor(metrics.transactionVolume / 24 / 30),
        activeUsers: Math.floor(metrics.customerCount * 0.001),
        pendingAlerts: Math.floor(Math.random() * 5),
        queueLength: Math.floor(Math.random() * 20)
      },
      trends: {
        volumeChange: (Math.random() - 0.5) * 20, // -10% to +10%
        customerGrowth: Math.random() * 5, // 0-5% growth
        fraudTrend: Math.random() < 0.3 ? 'increasing' : 'stable'
      }
    };
  }
  
  // Search for banks/branches by name or location
  async searchBranches(query: string): Promise<BankBranch[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const lowerQuery = query.toLowerCase();
    return RBB_BRANCHES.filter(branch => 
      branch.branchName.toLowerCase().includes(lowerQuery) ||
      branch.city.toLowerCase().includes(lowerQuery) ||
      branch.state.toLowerCase().includes(lowerQuery)
    );
  }
  
  // Get aggregated metrics for all branches
  async getAggregatedMetrics(): Promise<any> {
    const allMetrics = await Promise.all(
      RBB_BRANCHES.map(branch => this.getBranchMetrics(branch.id))
    );
    
    return {
      totalBranches: RBB_BRANCHES.length,
      totalDeposits: RBB_BRANCHES.reduce((sum, b) => sum + (b.deposits || 0), 0),
      totalAssets: RBB_BRANCHES.reduce((sum, b) => sum + (b.assets || 0), 0),
      avgComplianceScore: allMetrics.reduce((sum, m) => sum + m.complianceScore, 0) / allMetrics.length,
      totalFraudIncidents: allMetrics.reduce((sum, m) => sum + m.fraudIncidents, 0),
      branchesByRisk: {
        low: allMetrics.filter(m => m.riskLevel === 'Low').length,
        medium: allMetrics.filter(m => m.riskLevel === 'Medium').length,
        high: allMetrics.filter(m => m.riskLevel === 'High').length
      }
    };
  }
}

// Export singleton instance
export const fdicClient = new FDICBankDataClient();

// Helper function to calculate risk heat for map visualization
export function calculateBranchHeat(metrics: BranchMetrics): number {
  let heat = 0;
  
  // Risk level contribution
  switch (metrics.riskLevel) {
    case 'High': heat += 50; break;
    case 'Medium': heat += 25; break;
    case 'Low': heat += 10; break;
  }
  
  // Fraud incidents contribution
  heat += Math.min(30, metrics.fraudIncidents * 3);
  
  // Compliance score contribution (inverse)
  heat += Math.max(0, (100 - metrics.complianceScore) * 0.2);
  
  return Math.min(100, heat);
}

export default fdicClient; 