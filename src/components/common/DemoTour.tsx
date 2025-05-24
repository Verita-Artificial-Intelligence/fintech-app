import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Fade,
  Backdrop,
  Paper,
  IconButton,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

interface TourStep {
  id: string;
  title: string;
  description: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: () => void;
  content?: React.ReactNode;
  duration?: number;
}

interface DemoTourProps {
  isOpen: boolean;
  onClose: () => void;
  tourType: 'overview' | 'ledger' | 'fraud' | 'underwriting';
}

const SpotlightOverlay = styled(Backdrop)(({ theme }) => ({
  zIndex: theme.zIndex.modal - 1,
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
}));

const TourTooltip = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  maxWidth: 400,
  padding: theme.spacing(3),
  borderRadius: 12,
  boxShadow: theme.shadows[8],
  border: `2px solid ${theme.palette.primary.main}`,
  backgroundColor: theme.palette.background.paper,
  zIndex: theme.zIndex.modal + 1,
}));

const tourSteps: Record<string, TourStep[]> = {
  overview: [
    {
      id: 'welcome',
      title: 'Welcome to Royal Business Bank',
      description: 'Take a 2-minute guided tour of our comprehensive fintech platform with real-time compliance monitoring.',
      target: 'dashboard',
      position: 'center',
      content: (
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <Typography variant="h5" gutterBottom color="primary">
            🏦 Enterprise Banking Platform
          </Typography>
          <Typography variant="body1" paragraph>
            Experience three integrated modules working together to provide comprehensive financial oversight.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2 }}>
            <Chip label="BSA/AML Compliance" size="small" />
            <Chip label="Real-time Monitoring" size="small" />
            <Chip label="AI-powered Risk Assessment" size="small" />
          </Box>
        </Box>
      )
    },
    {
      id: 'realtime-metrics',
      title: 'Live Transaction Monitoring',
      description: 'Watch real-time transaction flows with automatic risk scoring and compliance flagging.',
      target: 'metrics-cards',
      position: 'bottom',
      action: () => {
        // Simulate new transaction arrival
        console.log('Simulating real-time transaction...');
      }
    },
    {
      id: 'risk-visualization',
      title: 'Advanced Risk Analytics',
      description: 'Interactive risk heatmaps show transaction patterns across time, geography, and customer segments.',
      target: 'charts-container',
      position: 'top'
    },
    {
      id: 'compliance-alerts',
      title: 'Intelligent Compliance Engine',
      description: 'Automated alerts for BSA, AML, and regulatory requirements with one-click reporting.',
      target: 'alerts-section',
      position: 'left'
    }
  ],
  ledger: [
    {
      id: 'fbo-overview',
      title: 'FBO-Ledger Deep Dive',
      description: 'Comprehensive view of all sub-accounts with real-time balance monitoring and transaction tracking.',
      target: 'ledger-header',
      position: 'bottom'
    },
    {
      id: 'transaction-stream',
      title: 'Live Transaction Stream',
      description: 'Every transaction is captured, categorized, and risk-scored in real-time with full audit trails.',
      target: 'transaction-table',
      position: 'top'
    },
    {
      id: 'compliance-rules',
      title: 'Automated Compliance Rules',
      description: 'Built-in BSA/AML rules automatically flag suspicious patterns and generate required reports.',
      target: 'compliance-panel',
      position: 'right'
    }
  ],
  fraud: [
    {
      id: 'fraud-detection',
      title: 'Real-time Fraud Detection',
      description: 'Advanced ML algorithms analyze transaction patterns to identify potential fraud in real-time.',
      target: 'fraud-dashboard',
      position: 'center'
    },
    {
      id: 'threat-simulation',
      title: 'Red Team Testing',
      description: 'Simulate attack scenarios to test system resilience and detection capabilities.',
      target: 'threat-sim',
      position: 'bottom'
    }
  ],
  underwriting: [
    {
      id: 'document-processing',
      title: 'AI-Powered Document Analysis',
      description: 'OCR and LLM technology automatically extract and analyze data from financial documents.',
      target: 'document-upload',
      position: 'top'
    },
    {
      id: 'risk-scoring',
      title: 'Intelligent Risk Scoring',
      description: 'Comprehensive scoring model considers multiple factors for accurate risk assessment.',
      target: 'risk-engine',
      position: 'right'
    }
  ]
};

const DemoTour: React.FC<DemoTourProps> = ({ isOpen, onClose, tourType }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSpotlight, setShowSpotlight] = useState(false);

  const steps = tourSteps[tourType] || [];
  const currentStepData = steps[currentStep];

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setIsPlaying(false);
      setShowSpotlight(true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, currentStepData?.duration || 5000);

      return () => clearTimeout(timer);
    } else if (isPlaying && currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, steps.length, currentStepData]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      currentStepData?.action?.();
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  if (!isOpen || !currentStepData) return null;

  return (
    <>
      <SpotlightOverlay open={showSpotlight} />
      
      <Dialog
        open={isOpen}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            position: 'fixed',
            top: currentStepData.position === 'center' ? '50%' : 
                 currentStepData.position === 'top' ? '20%' : 
                 currentStepData.position === 'bottom' ? '80%' : '50%',
            left: currentStepData.position === 'center' ? '50%' :
                  currentStepData.position === 'left' ? '20%' :
                  currentStepData.position === 'right' ? '80%' : '50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: 3,
            border: '2px solid',
            borderColor: 'primary.main'
          }
        }}
      >
        <DialogContent sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" color="primary" gutterBottom>
                {currentStepData.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Step {currentStep + 1} of {steps.length}
              </Typography>
            </Box>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Stepper activeStep={currentStep} alternativeLabel>
              {steps.map((step, index) => (
                <Step key={step.id}>
                  <StepLabel />
                </Step>
              ))}
            </Stepper>
          </Box>

          <Fade in={true} timeout={500}>
            <Box>
              {currentStepData.content || (
                <Typography variant="body1" paragraph>
                  {currentStepData.description}
                </Typography>
              )}
            </Box>
          </Fade>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
            <IconButton 
              onClick={handlePlayPause} 
              color="primary"
              disabled={currentStep >= steps.length - 1}
            >
              {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
            
            <IconButton onClick={handleRestart} color="secondary">
              <RestartAltIcon />
            </IconButton>

            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
              {isPlaying ? 'Auto-playing...' : 'Paused'}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              onClick={handlePrevious} 
              disabled={currentStep === 0}
              variant="outlined"
              size="small"
            >
              Previous
            </Button>
            
            <Button 
              onClick={handleNext} 
              variant="contained"
              size="small"
              endIcon={currentStep < steps.length - 1 ? <SkipNextIcon /> : undefined}
            >
              {currentStep < steps.length - 1 ? 'Next' : 'Finish Tour'}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DemoTour; 