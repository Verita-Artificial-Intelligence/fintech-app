// Pitch Mode Utility for RBB Demo
// Sprint 5: RBB-5.1 - Slide-deck mode with auto-cycling

export interface PitchModeConfig {
  enabled: boolean;
  autoAdvance: boolean;
  slideDuration: number; // milliseconds
  hideNavigation: boolean;
  slides: PitchSlide[];
  currentSlide: number;
}

export interface PitchSlide {
  id: string;
  title: string;
  route: string;
  duration?: number; // Override default duration
  actions?: SlideAction[];
  highlights?: string[]; // CSS selectors to highlight
  narration?: string;
}

export interface SlideAction {
  type: 'click' | 'hover' | 'scroll' | 'type' | 'wait';
  target?: string; // CSS selector
  value?: string | number;
  delay?: number;
}

// Default pitch deck configuration
export const defaultPitchDeck: PitchSlide[] = [
  {
    id: 'intro',
    title: 'Welcome to Royal Business Bank',
    route: '/dashboard',
    duration: 5000,
    highlights: ['[data-testid="app-title"]', '[data-testid="kpi-cards"]'],
    narration: 'Welcome to the Royal Business Bank enterprise financial services platform.'
  },
  {
    id: 'executive-overview',
    title: 'Executive Dashboard',
    route: '/dashboard',
    duration: 45000,
    actions: [
      { type: 'wait', delay: 2000 },
      { type: 'hover', target: '[data-testid="deposits-kpi"]', delay: 3000 },
      { type: 'hover', target: '[data-testid="compliance-kpi"]', delay: 3000 },
      { type: 'click', target: '[data-testid="view-details"]', delay: 2000 }
    ],
    highlights: ['[data-testid="kpi-cards"]', '[data-testid="risk-chart"]'],
    narration: 'Our executive dashboard provides real-time visibility into key performance indicators, compliance metrics, and risk exposure.'
  },
  {
    id: 'fbo-ledger',
    title: 'FBO Ledger Monitoring',
    route: '/ledger-monitoring',
    duration: 40000,
    actions: [
      { type: 'wait', delay: 3000 },
      { type: 'click', target: '[data-testid="filter-button"]', delay: 2000 },
      { type: 'type', target: '[data-testid="search-input"]', value: 'high risk', delay: 3000 },
      { type: 'scroll', value: 300, delay: 2000 }
    ],
    highlights: ['[data-testid="transaction-table"]', '[data-testid="risk-indicators"]'],
    narration: 'Real-time FBO ledger monitoring with sub-account drill-down capabilities and automated reconciliation.'
  },
  {
    id: 'fraud-detection',
    title: 'AI-Powered Fraud Detection',
    route: '/fraud-detection',
    duration: 40000,
    actions: [
      { type: 'wait', delay: 2000 },
      { type: 'click', target: '[data-testid="geographic-view"]', delay: 3000 },
      { type: 'hover', target: '[data-testid="risk-heatmap"]', delay: 5000 }
    ],
    highlights: ['[data-testid="fraud-alerts"]', '[data-testid="risk-heatmap"]'],
    narration: 'Advanced AI algorithms detect suspicious patterns in real-time, with OFAC screening completing in under 5 seconds.'
  },
  {
    id: 'underwriting',
    title: 'Automated Underwriting Engine',
    route: '/underwriting',
    duration: 45000,
    actions: [
      { type: 'wait', delay: 2000 },
      { type: 'click', target: '[data-testid="new-application"]', delay: 3000 },
      { type: 'wait', delay: 5000 },
      { type: 'click', target: '[data-testid="run-model"]', delay: 3000 }
    ],
    highlights: ['[data-testid="ml-decision"]', '[data-testid="shap-analysis"]'],
    narration: 'ML-powered credit decisioning with SHAP explainability ensures transparent, compliant lending decisions in seconds.'
  },
  {
    id: 'compliance',
    title: 'Regulatory Compliance',
    route: '/fraud-detection',
    duration: 30000,
    actions: [
      { type: 'scroll', value: 500, delay: 2000 },
      { type: 'click', target: '[data-testid="compliance-tab"]', delay: 3000 }
    ],
    highlights: ['[data-testid="compliance-metrics"]', '[data-testid="regulatory-alerts"]'],
    narration: 'Comprehensive compliance monitoring ensures adherence to BSA, AML, KYC, and OFAC requirements.'
  },
  {
    id: 'closing',
    title: 'Thank You',
    route: '/dashboard',
    duration: 15000,
    highlights: ['[data-testid="contact-info"]'],
    narration: 'Thank you for your time. Royal Business Bank - Empowering your financial future with cutting-edge technology.'
  }
];

export class PitchModeManager {
  private static instance: PitchModeManager;
  private config: PitchModeConfig;
  private timer: NodeJS.Timeout | null = null;
  private slideChangeCallbacks: Array<(slide: PitchSlide) => void> = [];
  
  private constructor() {
    this.config = {
      enabled: false,
      autoAdvance: true,
      slideDuration: 30000,
      hideNavigation: false,
      slides: defaultPitchDeck,
      currentSlide: 0
    };
    
    // Check URL params
    this.checkUrlParams();
  }
  
  static getInstance(): PitchModeManager {
    if (!PitchModeManager.instance) {
      PitchModeManager.instance = new PitchModeManager();
    }
    return PitchModeManager.instance;
  }
  
  private checkUrlParams(): void {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'pitch') {
      this.enable();
    }
  }
  
  enable(): void {
    this.config.enabled = true;
    if (this.config.hideNavigation) {
      document.body.classList.add('pitch-mode');
    }
    this.startAutoAdvance();
  }
  
  disable(): void {
    this.config.enabled = false;
    document.body.classList.remove('pitch-mode');
    this.stopAutoAdvance();
  }
  
  isEnabled(): boolean {
    return this.config.enabled;
  }
  
  getCurrentSlide(): PitchSlide {
    return this.config.slides[this.config.currentSlide];
  }
  
  nextSlide(): void {
    this.config.currentSlide = (this.config.currentSlide + 1) % this.config.slides.length;
    this.notifySlideChange();
    this.navigateToSlide();
    
    if (this.config.autoAdvance) {
      this.restartTimer();
    }
  }
  
  previousSlide(): void {
    this.config.currentSlide = this.config.currentSlide === 0 
      ? this.config.slides.length - 1 
      : this.config.currentSlide - 1;
    this.notifySlideChange();
    this.navigateToSlide();
    
    if (this.config.autoAdvance) {
      this.restartTimer();
    }
  }
  
  goToSlide(index: number): void {
    if (index >= 0 && index < this.config.slides.length) {
      this.config.currentSlide = index;
      this.notifySlideChange();
      this.navigateToSlide();
      
      if (this.config.autoAdvance) {
        this.restartTimer();
      }
    }
  }
  
  private navigateToSlide(): void {
    const slide = this.getCurrentSlide();
    if (window.location.pathname !== slide.route) {
      window.location.pathname = slide.route;
    }
    
    // Execute slide actions
    this.executeSlideActions(slide);
  }
  
  private async executeSlideActions(slide: PitchSlide): Promise<void> {
    if (!slide.actions) return;
    
    for (const action of slide.actions) {
      await this.wait(action.delay || 1000);
      
      switch (action.type) {
        case 'click':
          if (action.target) {
            const element = document.querySelector(action.target) as HTMLElement;
            element?.click();
          }
          break;
          
        case 'hover':
          if (action.target) {
            const element = document.querySelector(action.target) as HTMLElement;
            if (element) {
              element.dispatchEvent(new MouseEvent('mouseenter'));
              setTimeout(() => {
                element.dispatchEvent(new MouseEvent('mouseleave'));
              }, 2000);
            }
          }
          break;
          
        case 'scroll':
          if (typeof action.value === 'number') {
            window.scrollTo({ top: action.value, behavior: 'smooth' });
          }
          break;
          
        case 'type':
          if (action.target && action.value) {
            const input = document.querySelector(action.target) as HTMLInputElement;
            if (input) {
              input.focus();
              input.value = '';
              // Simulate typing
              for (let i = 0; i < action.value.toString().length; i++) {
                await this.wait(100);
                input.value += action.value.toString()[i];
                input.dispatchEvent(new Event('input', { bubbles: true }));
              }
            }
          }
          break;
          
        case 'wait':
          // Already handled by the delay
          break;
      }
    }
  }
  
  private wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  private startAutoAdvance(): void {
    if (!this.config.autoAdvance) return;
    
    const currentSlide = this.getCurrentSlide();
    const duration = currentSlide.duration || this.config.slideDuration;
    
    this.timer = setTimeout(() => {
      this.nextSlide();
    }, duration);
  }
  
  private stopAutoAdvance(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
  
  private restartTimer(): void {
    this.stopAutoAdvance();
    this.startAutoAdvance();
  }
  
  onSlideChange(callback: (slide: PitchSlide) => void): void {
    this.slideChangeCallbacks.push(callback);
  }
  
  private notifySlideChange(): void {
    const slide = this.getCurrentSlide();
    this.slideChangeCallbacks.forEach(cb => cb(slide));
  }
  
  getProgress(): { current: number; total: number; percentage: number } {
    return {
      current: this.config.currentSlide + 1,
      total: this.config.slides.length,
      percentage: ((this.config.currentSlide + 1) / this.config.slides.length) * 100
    };
  }
  
  updateConfig(updates: Partial<PitchModeConfig>): void {
    this.config = { ...this.config, ...updates };
    
    if (updates.enabled !== undefined) {
      updates.enabled ? this.enable() : this.disable();
    }
    
    if (updates.autoAdvance !== undefined && this.config.enabled) {
      updates.autoAdvance ? this.startAutoAdvance() : this.stopAutoAdvance();
    }
  }
}

// Global CSS for pitch mode
const pitchModeStyles = `
  .pitch-mode .MuiDrawer-root {
    display: none !important;
  }
  
  .pitch-mode .pitch-highlight {
    animation: pulse-highlight 2s infinite;
    position: relative;
  }
  
  .pitch-mode .pitch-highlight::after {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border: 3px solid #F4A000;
    border-radius: 8px;
    pointer-events: none;
    animation: pulse-border 2s infinite;
  }
  
  @keyframes pulse-highlight {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.02); }
  }
  
  @keyframes pulse-border {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 1; }
  }
  
  .pitch-progress {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: rgba(0, 84, 164, 0.1);
    z-index: 9999;
  }
  
  .pitch-progress-bar {
    height: 100%;
    background: linear-gradient(90deg, #0054A4 0%, #F4A000 100%);
    transition: width 0.3s ease;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = pitchModeStyles;
  document.head.appendChild(styleSheet);
}

export default PitchModeManager; 