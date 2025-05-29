import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Layout from './components/common/Layout';
import Dashboard from './pages/Dashboard';
import LedgerMonitoring from './pages/LedgerMonitoring';
import FraudDetection from './pages/FraudDetection';
import UnderwritingEngine from './pages/UnderwritingEngine';
import CaseManagement from './pages/CaseManagement';
import NotFound from './pages/NotFound';

const theme = createTheme({
  palette: {
    primary: {
      main: '#002366', // Royal Blue
    },
    secondary: {
      main: '#0056b3', // Lighter blue for secondary elements
    },
    background: {
      default: '#f8f9fc',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#808080', // Gray for secondary text
    },
    error: {
      main: '#d32f2f',
    },
    warning: {
      main: '#f57c00',
    },
    success: {
      main: '#388e3c',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
        containedPrimary: {
          backgroundColor: '#002366',
          '&:hover': {
            backgroundColor: '#001a4d',
          },
        },
        outlinedPrimary: {
          borderColor: '#002366',
          color: '#002366',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: '#002366',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/ledger-monitoring" element={<LedgerMonitoring />} />
            <Route path="/fraud-detection" element={<FraudDetection />} />
            <Route path="/case-management" element={<CaseManagement />} />
            <Route path="/underwriting" element={<UnderwritingEngine />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
