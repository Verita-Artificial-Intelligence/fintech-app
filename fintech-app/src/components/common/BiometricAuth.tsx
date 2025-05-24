import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  Stack
} from '@mui/material';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import FaceIcon from '@mui/icons-material/Face';
import SecurityIcon from '@mui/icons-material/Security';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

interface BiometricAuthProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  authType?: 'fingerprint' | 'face' | 'multi-factor';
}

const BiometricAuth: React.FC<BiometricAuthProps> = ({
  open,
  onClose,
  onSuccess,
  authType = 'fingerprint'
}) => {
  const [authStatus, setAuthStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [authMessage, setAuthMessage] = useState('');
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    if (open) {
      setAuthStatus('idle');
      setScanProgress(0);
      setAuthMessage('');
    }
  }, [open]);

  const simulateBiometricScan = () => {
    setAuthStatus('scanning');
    setAuthMessage('Scanning...');
    setScanProgress(0);

    // Simulate scanning progress
    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          
          // 90% success rate for demo
          const isSuccess = Math.random() > 0.1;
          
          if (isSuccess) {
            setAuthStatus('success');
            setAuthMessage('Authentication successful');
            setTimeout(() => {
              onSuccess();
              onClose();
            }, 1500);
          } else {
            setAuthStatus('error');
            setAuthMessage('Authentication failed. Please try again.');
          }
          
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 100);
  };

  const getAuthIcon = () => {
    switch (authType) {
      case 'face':
        return <FaceIcon sx={{ fontSize: 80, color: 'primary.main' }} />;
      case 'multi-factor':
        return <SecurityIcon sx={{ fontSize: 80, color: 'primary.main' }} />;
      default:
        return <FingerprintIcon sx={{ fontSize: 80, color: 'primary.main' }} />;
    }
  };

  const getAuthTitle = () => {
    switch (authType) {
      case 'face':
        return 'Face Recognition';
      case 'multi-factor':
        return 'Multi-Factor Authentication';
      default:
        return 'Fingerprint Authentication';
    }
  };

  const getAuthInstructions = () => {
    switch (authType) {
      case 'face':
        return 'Position your face within the frame and look directly at the camera';
      case 'multi-factor':
        return 'Complete biometric authentication and enter your secure token';
      default:
        return 'Place your finger on the sensor and hold steady';
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 2
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Typography variant="h5" component="div" fontWeight="bold">
          {getAuthTitle()}
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3 }}>
          
          {/* Biometric Icon with Animation */}
          <Box sx={{ 
            position: 'relative', 
            mb: 3,
            animation: authStatus === 'scanning' ? 'pulse 1.5s infinite' : 'none',
            '@keyframes pulse': {
              '0%': { transform: 'scale(1)', opacity: 1 },
              '50%': { transform: 'scale(1.05)', opacity: 0.8 },
              '100%': { transform: 'scale(1)', opacity: 1 }
            }
          }}>
            {authStatus === 'success' ? (
              <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main' }} />
            ) : authStatus === 'error' ? (
              <ErrorIcon sx={{ fontSize: 80, color: 'error.main' }} />
            ) : (
              getAuthIcon()
            )}
            
            {authStatus === 'scanning' && (
              <CircularProgress
                variant="determinate"
                value={scanProgress}
                size={100}
                thickness={2}
                sx={{
                  position: 'absolute',
                  top: -10,
                  left: -10,
                  color: 'primary.main'
                }}
              />
            )}
          </Box>

          {/* Status Message */}
          <Typography 
            variant="body1" 
            color="text.secondary" 
            textAlign="center"
            sx={{ mb: 3, minHeight: 48 }}
          >
            {authMessage || getAuthInstructions()}
          </Typography>

          {/* Alert for error state */}
          {authStatus === 'error' && (
            <Alert severity="error" sx={{ mb: 3, width: '100%' }}>
              Authentication failed. Please ensure your biometric data is properly registered.
            </Alert>
          )}

          {/* Success message */}
          {authStatus === 'success' && (
            <Alert severity="success" sx={{ mb: 3, width: '100%' }}>
              Access granted. Redirecting to secure area...
            </Alert>
          )}

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
            {authStatus === 'idle' && (
              <>
                <Button 
                  variant="outlined" 
                  onClick={onClose}
                  sx={{ flex: 1 }}
                >
                  Cancel
                </Button>
                <Button 
                  variant="contained" 
                  onClick={simulateBiometricScan}
                  startIcon={<FingerprintIcon />}
                  sx={{ flex: 1 }}
                >
                  Scan Now
                </Button>
              </>
            )}
            
            {authStatus === 'scanning' && (
              <Button 
                variant="outlined" 
                onClick={() => setAuthStatus('idle')}
                sx={{ width: '100%' }}
              >
                Cancel Scan
              </Button>
            )}
            
            {authStatus === 'error' && (
              <>
                <Button 
                  variant="outlined" 
                  onClick={onClose}
                  sx={{ flex: 1 }}
                >
                  Cancel
                </Button>
                <Button 
                  variant="contained" 
                  onClick={simulateBiometricScan}
                  sx={{ flex: 1 }}
                >
                  Try Again
                </Button>
              </>
            )}
          </Stack>

          {/* Security Notice */}
          <Typography 
            variant="caption" 
            color="text.secondary" 
            textAlign="center"
            sx={{ mt: 3, px: 2 }}
          >
            Your biometric data is encrypted and stored securely on your device. 
            Royal Business Bank does not store biometric templates on our servers.
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default BiometricAuth; 