import React from 'react';
import { Grid, Paper, Typography, Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SecurityIcon from '@mui/icons-material/Security';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
}));

const ProductCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  position: 'relative',
  borderLeft: '4px solid',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
  },
}));

const barChartData = [
  { name: 'Jan', transactions: 4000, accounts: 2400 },
  { name: 'Feb', transactions: 3000, accounts: 1398 },
  { name: 'Mar', transactions: 2000, accounts: 9800 },
  { name: 'Apr', transactions: 2780, accounts: 3908 },
  { name: 'May', transactions: 1890, accounts: 4800 },
  { name: 'Jun', transactions: 2390, accounts: 3800 },
  { name: 'Jul', transactions: 3490, accounts: 4300 },
];

const pieChartData = [
  { name: 'Approved', value: 78 },
  { name: 'In Review', value: 17 },
  { name: 'Rejected', value: 5 },
];

const COLORS = ['#002366', '#0056b3', '#808080'];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  
  const handleNavigate = (path: string) => {
    navigate(path);
  };
  
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Welcome to Royal Business Bank. View your key metrics and access all platform features.
        </Typography>
      </Grid>
      
      {/* Product Cards */}
      <Grid item xs={12} md={4}>
        <ProductCard sx={{ borderLeftColor: 'primary.main' }}>
          <Box display="flex" alignItems="center" mb={2}>
            <AccountBalanceIcon color="primary" sx={{ fontSize: 28, mr: 1 }} />
            <Typography variant="h6">FBO-Ledger Monitoring</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 3 }}>
            Real-time visibility on every sub-account with automated BSA/AML rules and enhanced security.
          </Typography>
          <Box sx={{ mt: 'auto' }}>
            <Button 
              variant="outlined" 
              color="primary" 
              endIcon={<ArrowForwardIcon />}
              onClick={() => handleNavigate('/ledger-monitoring')}
            >
              View Dashboard
            </Button>
          </Box>
        </ProductCard>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <ProductCard sx={{ borderLeftColor: 'secondary.main' }}>
          <Box display="flex" alignItems="center" mb={2}>
            <SecurityIcon color="secondary" sx={{ fontSize: 28, mr: 1 }} />
            <Typography variant="h6">Fraud Detection</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 3 }}>
            Advanced fraud alerts and compliance tools with continuous regulatory compliance monitoring.
          </Typography>
          <Box sx={{ mt: 'auto' }}>
            <Button 
              variant="outlined" 
              color="secondary" 
              endIcon={<ArrowForwardIcon />}
              onClick={() => handleNavigate('/fraud-detection')}
            >
              View Dashboard
            </Button>
          </Box>
        </ProductCard>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <ProductCard sx={{ borderLeftColor: '#ff9800' }}>
          <Box display="flex" alignItems="center" mb={2}>
            <AssessmentIcon sx={{ fontSize: 28, mr: 1, color: '#ff9800' }} />
            <Typography variant="h6">Underwriting Engine</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 3 }}>
            Intelligent underwriting with ML-powered risk assessment and automated document processing.
          </Typography>
          <Box sx={{ mt: 'auto' }}>
            <Button 
              variant="outlined" 
              sx={{ color: '#ff9800', borderColor: '#ff9800' }} 
              endIcon={<ArrowForwardIcon />}
              onClick={() => handleNavigate('/underwriting')}
            >
              View Dashboard
            </Button>
          </Box>
        </ProductCard>
      </Grid>
      
      {/* Activity Charts */}
      <Grid item xs={12} md={8}>
        <StyledPaper>
          <Typography variant="h6" gutterBottom>
            Transaction Activity
          </Typography>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart
                data={barChartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="transactions" fill="#2e5bff" />
                <Bar dataKey="accounts" fill="#00c9ff" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </StyledPaper>
      </Grid>
      
      <Grid item xs={12} md={4}>
        <StyledPaper>
          <Typography variant="h6" gutterBottom>
            Underwriting Status
          </Typography>
          <div style={{ width: '100%', height: 300, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  fill="#8884d8"
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </StyledPaper>
      </Grid>
      
      {/* Recent Alerts */}
      <Grid item xs={12}>
        <StyledPaper>
          <Typography variant="h6" gutterBottom>
            Recent Alerts
          </Typography>
          <Box sx={{ p: 2, bgcolor: '#fff9f0', borderRadius: 1, mb: 2 }}>
            <Typography variant="subtitle2" color="warning.main">
              Suspicious Transaction Alert: Account #7821-093
            </Typography>
            <Typography variant="body2">
              Multiple high-value transfers detected in short time period. Review required.
            </Typography>
          </Box>
          <Box sx={{ p: 2, bgcolor: '#f0f5ff', borderRadius: 1, mb: 2 }}>
            <Typography variant="subtitle2" color="primary.main">
              Compliance Update: BSA Filing Due
            </Typography>
            <Typography variant="body2">
              Quarterly BSA/AML reports due in 3 days. 2 pending reports require attention.
            </Typography>
          </Box>
          <Box sx={{ p: 2, bgcolor: '#f0faff', borderRadius: 1 }}>
            <Typography variant="subtitle2" color="secondary.main">
              System Notice: Model Retraining Complete
            </Typography>
            <Typography variant="body2">
              Underwriting model retraining complete with 2.3% accuracy improvement.
            </Typography>
          </Box>
        </StyledPaper>
      </Grid>
    </Grid>
  );
};

export default Dashboard;