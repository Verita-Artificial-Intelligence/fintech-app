// Executive Preset Layouts for RBB Demo
// Sprint 4: RBB-4.3 - Executive preset layout

export interface DashboardPreset {
  id: string;
  name: string;
  description: string;
  widgets: WidgetConfig[];
  kpiPriority: string[];
  refreshInterval: number;
  theme?: 'light' | 'dark';
}

export interface WidgetConfig {
  id: string;
  type: 'kpi' | 'chart' | 'table' | 'heatmap' | 'alerts';
  title: string;
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  config?: any;
  dataSource?: string;
}

// Predefined executive layouts
export const executivePresets: Record<string, DashboardPreset> = {
  'rbb-executive': {
    id: 'rbb-executive',
    name: 'RBB Executive View',
    description: 'High-level KPIs and compliance metrics for C-suite',
    refreshInterval: 30000, // 30 seconds
    kpiPriority: [
      'totalDeposits',
      'totalLoans',
      'complianceScore',
      'fraudAlerts',
      'riskExposure',
      'customerGrowth'
    ],
    widgets: [
      {
        id: 'executive-kpis',
        type: 'kpi',
        title: 'Key Performance Indicators',
        position: { x: 0, y: 0, w: 12, h: 2 },
        config: {
          showTrend: true,
          showSparkline: true,
          compareToLastPeriod: true
        }
      },
      {
        id: 'compliance-overview',
        type: 'chart',
        title: 'Compliance & Risk Overview',
        position: { x: 0, y: 2, w: 6, h: 3 },
        dataSource: 'compliance',
        config: {
          chartType: 'gauge',
          metrics: ['BSA', 'AML', 'OFAC', 'KYC']
        }
      },
      {
        id: 'deposit-trends',
        type: 'chart',
        title: 'Deposit Growth Trends',
        position: { x: 6, y: 2, w: 6, h: 3 },
        dataSource: 'deposits',
        config: {
          chartType: 'area',
          timeRange: '30d'
        }
      },
      {
        id: 'risk-heatmap',
        type: 'heatmap',
        title: 'Enterprise Risk Heat Map',
        position: { x: 0, y: 5, w: 8, h: 4 },
        dataSource: 'risk',
        config: {
          viewMode: 'geographic',
          showBranches: true
        }
      },
      {
        id: 'critical-alerts',
        type: 'alerts',
        title: 'Critical Alerts',
        position: { x: 8, y: 5, w: 4, h: 4 },
        config: {
          severity: ['critical', 'high'],
          maxItems: 5
        }
      }
    ]
  },
  
  'risk-manager': {
    id: 'risk-manager',
    name: 'Risk Manager Dashboard',
    description: 'Detailed risk analytics and fraud monitoring',
    refreshInterval: 15000, // 15 seconds
    kpiPriority: [
      'fraudAlerts',
      'riskScore',
      'suspiciousTransactions',
      'sanctionsHits',
      'complianceScore'
    ],
    widgets: [
      {
        id: 'fraud-monitoring',
        type: 'table',
        title: 'Real-time Fraud Monitoring',
        position: { x: 0, y: 0, w: 12, h: 4 },
        dataSource: 'fraudAlerts',
        config: {
          columns: ['timestamp', 'type', 'severity', 'account', 'amount', 'action'],
          autoRefresh: true
        }
      },
      {
        id: 'risk-distribution',
        type: 'chart',
        title: 'Risk Distribution by Category',
        position: { x: 0, y: 4, w: 6, h: 3 },
        config: {
          chartType: 'pie',
          categories: ['Credit', 'Market', 'Operational', 'Compliance', 'Cyber']
        }
      },
      {
        id: 'sanctions-screening',
        type: 'table',
        title: 'Sanctions Screening Results',
        position: { x: 6, y: 4, w: 6, h: 3 },
        dataSource: 'sanctions',
        config: {
          showOnlyHits: true
        }
      }
    ]
  },
  
  'operations': {
    id: 'operations',
    name: 'Operations Dashboard',
    description: 'Transaction processing and operational metrics',
    refreshInterval: 5000, // 5 seconds
    kpiPriority: [
      'transactionVolume',
      'processingTime',
      'failureRate',
      'queueDepth',
      'systemHealth'
    ],
    widgets: [
      {
        id: 'transaction-stream',
        type: 'table',
        title: 'Live Transaction Stream',
        position: { x: 0, y: 0, w: 8, h: 5 },
        dataSource: 'transactions',
        config: {
          streaming: true,
          maxRows: 50
        }
      },
      {
        id: 'system-metrics',
        type: 'chart',
        title: 'System Performance',
        position: { x: 8, y: 0, w: 4, h: 5 },
        config: {
          chartType: 'line',
          metrics: ['cpu', 'memory', 'latency']
        }
      }
    ]
  }
};

// Preset management functions
export class PresetManager {
  private static STORAGE_KEY = 'rbb-dashboard-preset';
  
  static savePreset(preset: DashboardPreset): void {
    localStorage.setItem(`${this.STORAGE_KEY}-custom-${preset.id}`, JSON.stringify(preset));
  }
  
  static loadPreset(presetId: string): DashboardPreset | null {
    // Check predefined presets first
    if (executivePresets[presetId]) {
      return executivePresets[presetId];
    }
    
    // Check custom presets
    const customPreset = localStorage.getItem(`${this.STORAGE_KEY}-custom-${presetId}`);
    if (customPreset) {
      return JSON.parse(customPreset);
    }
    
    return null;
  }
  
  static setActivePreset(presetId: string): void {
    localStorage.setItem(`${this.STORAGE_KEY}-active`, presetId);
  }
  
  static getActivePreset(): string | null {
    return localStorage.getItem(`${this.STORAGE_KEY}-active`);
  }
  
  static listPresets(): Array<{ id: string; name: string; custom: boolean }> {
    const presets = Object.keys(executivePresets).map(id => ({
      id,
      name: executivePresets[id].name,
      custom: false
    }));
    
    // Add custom presets from localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(`${this.STORAGE_KEY}-custom-`)) {
        const preset = JSON.parse(localStorage.getItem(key) || '{}');
        presets.push({
          id: preset.id,
          name: preset.name,
          custom: true
        });
      }
    }
    
    return presets;
  }
  
  static deleteCustomPreset(presetId: string): void {
    localStorage.removeItem(`${this.STORAGE_KEY}-custom-${presetId}`);
  }
}

// Export for use in components
export default PresetManager; 