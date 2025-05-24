// Sanctions Screening API Provider for RBB Demo
// Sprint 2: RBB-2.2 - Sanctions screening (OFAC, PEP, etc.)

export interface SanctionsCheckResult {
  id: string;
  timestamp: string;
  entityName: string;
  entityType: 'individual' | 'organization';
  checkType: 'OFAC' | 'PEP' | 'ADVERSE_MEDIA' | 'EU_SANCTIONS' | 'UN_SANCTIONS';
  status: 'CLEAR' | 'POTENTIAL_MATCH' | 'CONFIRMED_MATCH' | 'PENDING';
  matchScore: number; // 0-100
  details?: {
    listName?: string;
    listDate?: string;
    aliases?: string[];
    nationality?: string;
    dateOfBirth?: string;
    addresses?: string[];
    programs?: string[];
    remarks?: string;
  };
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

// Simulated sanctions lists for demo
const DEMO_SANCTIONED_ENTITIES = [
  { name: 'John Doe Sanctioned', type: 'individual', list: 'OFAC SDN' },
  { name: 'ABC Terrorist Org', type: 'organization', list: 'OFAC SDN' },
  { name: 'Ivan Petrov', type: 'individual', list: 'EU Sanctions' },
  { name: 'Corrupt Corp Ltd', type: 'organization', list: 'UN Sanctions' },
  { name: 'Maria Garcia PEP', type: 'individual', list: 'PEP List' },
];

export class SanctionsScreeningClient {
  private apiKey: string;
  private baseUrl: string;
  
  constructor(apiKey: string = 'demo', baseUrl: string = 'https://api.sanctions.io') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }
  
  // Perform OFAC check
  async checkOFAC(entityName: string, entityType: 'individual' | 'organization' = 'individual'): Promise<SanctionsCheckResult> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    const timestamp = new Date().toISOString();
    const normalizedName = entityName.toLowerCase().trim();
    
    // Check against demo sanctioned list
    const sanctionedMatch = DEMO_SANCTIONED_ENTITIES.find(
      entity => normalizedName.includes(entity.name.toLowerCase()) || 
                entity.name.toLowerCase().includes(normalizedName)
    );
    
    if (sanctionedMatch) {
      return {
        id: `ofac_check_${Date.now()}`,
        timestamp,
        entityName,
        entityType,
        checkType: 'OFAC',
        status: 'CONFIRMED_MATCH',
        matchScore: 85 + Math.random() * 15,
        details: {
          listName: 'OFAC Specially Designated Nationals (SDN) List',
          listDate: new Date(Date.now() - 86400000).toISOString(),
          aliases: ['Known Alias 1', 'Known Alias 2'],
          nationality: 'Unknown',
          programs: ['SDGT', 'CYBER2'],
          remarks: 'Subject to blocking pursuant to Executive Order',
        },
        riskLevel: 'CRITICAL',
      };
    }
    
    // Random chance of potential match for demo
    if (Math.random() < 0.05) {
      return {
        id: `ofac_check_${Date.now()}`,
        timestamp,
        entityName,
        entityType,
        checkType: 'OFAC',
        status: 'POTENTIAL_MATCH',
        matchScore: 40 + Math.random() * 20,
        details: {
          listName: 'OFAC SDN List',
          remarks: 'Similar name detected, manual review required',
        },
        riskLevel: 'MEDIUM',
      };
    }
    
    // Clear result
    return {
      id: `ofac_check_${Date.now()}`,
      timestamp,
      entityName,
      entityType,
      checkType: 'OFAC',
      status: 'CLEAR',
      matchScore: 0,
      riskLevel: 'LOW',
    };
  }
  
  // Check PEP (Politically Exposed Persons)
  async checkPEP(entityName: string): Promise<SanctionsCheckResult> {
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));
    
    const timestamp = new Date().toISOString();
    const isPEP = entityName.toLowerCase().includes('pep') || Math.random() < 0.02;
    
    if (isPEP) {
      return {
        id: `pep_check_${Date.now()}`,
        timestamp,
        entityName,
        entityType: 'individual',
        checkType: 'PEP',
        status: 'CONFIRMED_MATCH',
        matchScore: 90 + Math.random() * 10,
        details: {
          listName: 'Global PEP Database',
          remarks: 'Senior government official or close associate',
          nationality: 'United States',
        },
        riskLevel: 'HIGH',
      };
    }
    
    return {
      id: `pep_check_${Date.now()}`,
      timestamp,
      entityName,
      entityType: 'individual',
      checkType: 'PEP',
      status: 'CLEAR',
      matchScore: 0,
      riskLevel: 'LOW',
    };
  }
  
  // Check adverse media
  async checkAdverseMedia(entityName: string): Promise<SanctionsCheckResult> {
    await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 600));
    
    const timestamp = new Date().toISOString();
    const hasAdverseMedia = Math.random() < 0.03;
    
    if (hasAdverseMedia) {
      return {
        id: `adverse_media_check_${Date.now()}`,
        timestamp,
        entityName,
        entityType: 'individual',
        checkType: 'ADVERSE_MEDIA',
        status: 'POTENTIAL_MATCH',
        matchScore: 60 + Math.random() * 20,
        details: {
          remarks: 'Negative news articles found in financial crime context',
        },
        riskLevel: 'MEDIUM',
      };
    }
    
    return {
      id: `adverse_media_check_${Date.now()}`,
      timestamp,
      entityName,
      entityType: 'individual',
      checkType: 'ADVERSE_MEDIA',
      status: 'CLEAR',
      matchScore: 0,
      riskLevel: 'LOW',
    };
  }
  
  // Comprehensive screening (all checks)
  async comprehensiveScreening(entityName: string, entityType: 'individual' | 'organization' = 'individual'): Promise<SanctionsCheckResult[]> {
    const [ofacResult, pepResult, adverseMediaResult] = await Promise.all([
      this.checkOFAC(entityName, entityType),
      entityType === 'individual' ? this.checkPEP(entityName) : Promise.resolve(null),
      this.checkAdverseMedia(entityName),
    ]);
    
    const results = [ofacResult];
    if (pepResult) results.push(pepResult);
    results.push(adverseMediaResult);
    
    return results;
  }
  
  // Real-time monitoring subscription (simulated)
  subscribeToAlerts(callback: (alert: SanctionsCheckResult) => void): () => void {
    const interval = setInterval(() => {
      // Simulate random sanctions alert
      if (Math.random() < 0.1) {
        const randomEntity = DEMO_SANCTIONED_ENTITIES[Math.floor(Math.random() * DEMO_SANCTIONED_ENTITIES.length)];
        this.checkOFAC(randomEntity.name, randomEntity.type as any).then(callback);
      }
    }, 5000 + Math.random() * 10000);
    
    return () => clearInterval(interval);
  }
  
  // Batch screening for multiple entities
  async batchScreening(entities: Array<{name: string, type: 'individual' | 'organization'}>): Promise<Map<string, SanctionsCheckResult[]>> {
    const results = new Map<string, SanctionsCheckResult[]>();
    
    // Process in parallel batches of 5
    const batchSize = 5;
    for (let i = 0; i < entities.length; i += batchSize) {
      const batch = entities.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(entity => this.comprehensiveScreening(entity.name, entity.type))
      );
      
      batch.forEach((entity, index) => {
        results.set(entity.name, batchResults[index]);
      });
    }
    
    return results;
  }
}

// Export singleton instance
export const sanctionsClient = new SanctionsScreeningClient();

// Helper function to calculate overall risk from screening results
export function calculateOverallRisk(results: SanctionsCheckResult[]): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
  const riskScores = {
    LOW: 0,
    MEDIUM: 1,
    HIGH: 2,
    CRITICAL: 3,
  };
  
  const maxRisk = Math.max(...results.map(r => riskScores[r.riskLevel]));
  return Object.entries(riskScores).find(([_, score]) => score === maxRisk)?.[0] as any || 'LOW';
}

export default sanctionsClient; 