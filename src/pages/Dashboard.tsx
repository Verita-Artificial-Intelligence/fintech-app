import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  Button, 
  Box, 
  Chip, 
  Alert, 
  Card, 
  CardContent, 
  Switch, 
  FormControlLabel,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  LinearProgress,
  IconButton,
  Badge,
  Fab,
  Tooltip,
  CardHeader,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SecurityIcon from '@mui/icons-material/Security';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import NotificationsIcon from '@mui/icons-material/Notifications';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PeopleIcon from '@mui/icons-material/People';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import SpeedIcon from '@mui/icons-material/Speed';
import RefreshIcon from '@mui/icons-material/Refresh';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useRealTimeData } from '../hooks/useRealTimeData';
import { aiInsights } from '../utils/aiInsights';
import BiometricAuth from '../components/common/BiometricAuth';
import DemoTour from '../components/common/DemoTour';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ComposedChart,
  Legend
} from 'recharts';

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.12)',
  },
}));

const MetricCard = styled(Card)<{ trend?: 'up' | 'down' | 'neutral' }>(({ theme, trend }) => ({
  height: '100%',
  background: trend === 'up' ? 'linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%)' :
              trend === 'down' ? 'linear-gradient(135deg, #ffeaa7 0%, #fab1a0 100%)' :
              'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
  borderLeft: `4px solid ${
    trend === 'up' ? theme.palette.success.main :
    trend === 'down' ? theme.palette.error.main :
    theme.palette.primary.main
  }`,
}));

const LiveIndicator = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  '&::before': {
    content: '""',
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: theme.palette.success.main,
    marginRight: theme.spacing(1),
    animation: 'pulse 1.5s infinite',
  },
  '@keyframes pulse': {
    '0%': { opacity: 1 },
    '50%': { opacity: 0.5 },
    '100%': { opacity: 1 },
  },
}));

const AlertCard = styled(Card)<{ severity: 'error' | 'warning' | 'info' | 'success' }>(({ theme, severity }) => ({
  borderLeft: `4px solid ${theme.palette[severity].main}`,
  marginBottom: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

// Chart Data
const marketData = [
  { time: '09:00', price: 4250, volume: 1200, transactions: 45 },
  { time: '09:30', price: 4275, volume: 1800, transactions: 67 },
  { time: '10:00', price: 4290, volume: 2100, transactions: 89 },
  { time: '10:30', price: 4305, volume: 1900, transactions: 72 },
  { time: '11:00', price: 4320, volume: 2300, transactions: 94 },
  { time: '11:30', price: 4315, volume: 2000, transactions: 81 },
  { time: '12:00', price: 4340, volume: 2500, transactions: 108 },
];

const riskDistribution = [
  { name: 'Low Risk', value: 68, color: '#4caf50' },
  { name: 'Medium Risk', value: 24, color: '#ff9800' },
  { name: 'High Risk', value: 6, color: '#f44336' },
  { name: 'Critical', value: 2, color: '#d32f2f' },
];

const complianceMetrics = [
  { metric: 'BSA Reports', current: 45, target: 50, completion: 90 },
  { metric: 'KYC Reviews', current: 128, target: 135, completion: 95 },
  { metric: 'OFAC Checks', current: 234, target: 240, completion: 98 },
  { metric: 'SAR Filings', current: 12, target: 15, completion: 80 },
];

const portfolioData = [
  { month: 'Jan', loans: 45000000, deposits: 120000000, revenue: 2400000 },
  { month: 'Feb', loans: 48000000, deposits: 125000000, revenue: 2600000 },
  { month: 'Mar', loans: 52000000, deposits: 130000000, revenue: 2800000 },
  { month: 'Apr', loans: 55000000, deposits: 128000000, revenue: 2950000 },
  { month: 'May', loans: 58000000, deposits: 135000000, revenue: 3100000 },
  { month: 'Jun', loans: 61000000, deposits: 142000000, revenue: 3250000 },
];

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  // Real-time data
  const { transactions, alerts, customers, isConnected, metrics } = useRealTimeData();
  
  // State management
  const [showBiometric, setShowBiometric] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [realtimeEnabled, setRealtimeEnabled] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Live market simulation
  const [marketPrice, setMarketPrice] = useState(4340);
  const [priceChange, setPriceChange] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const change = (Math.random() - 0.5) * 20;
      setMarketPrice(prev => {
        const newPrice = prev + change;
        setPriceChange(change);
        return Math.max(4000, Math.min(5000, newPrice));
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  // Handlers
  const handleQuickAction = (action: string) => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
    
    switch (action) {
      case 'ledger':
        navigate('/ledger');
        break;
      case 'fraud':
        navigate('/fraud');
        break;
      case 'underwriting':
        navigate('/underwriting');
        break;
      case 'biometric':
        setShowBiometric(true);
        break;
      case 'tour':
        setShowTour(true);
        break;
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary">
            Business Banking Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <LiveIndicator>
              <Typography variant="body2" color="text.secondary">
                Live Data Stream Active
              </Typography>
            </LiveIndicator>
            <Chip 
              label={`${transactions.length} Active Transactions`} 
              size="small" 
              color="primary" 
              sx={{ ml: 2 }}
            />
            <Chip 
              label={`${customers.length} Customers`} 
              size="small" 
              color="secondary" 
              sx={{ ml: 1 }}
            />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Refresh Data">
            <IconButton onClick={handleRefresh} disabled={refreshing}>
              {refreshing ? <CircularProgress size={24} /> : <RefreshIcon />}
            </IconButton>
          </Tooltip>
          <FormControlLabel
            control={
              <Switch 
                checked={realtimeEnabled} 
                onChange={(e) => setRealtimeEnabled(e.target.checked)}
                color="primary"
              />
            }
            label="Real-time"
          />
          <Button 
            variant="outlined" 
            onClick={() => handleQuickAction('tour')}
            startIcon={<InfoIcon />}
          >
            Demo Tour
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Key Performance Metrics */}
        <Grid item xs={12} md={3}>
          <MetricCard trend="up">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <MonetizationOnIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    $142.8M
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Deposits
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUpIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="body2" color="success.main">
                  +12.5% vs last month
                </Typography>
              </Box>
            </CardContent>
          </MetricCard>
        </Grid>

        <Grid item xs={12} md={3}>
          <MetricCard trend="up">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <AccountBalanceIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    $61.2M
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Loans
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUpIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="body2" color="success.main">
                  +8.3% vs last month
                </Typography>
              </Box>
            </CardContent>
          </MetricCard>
        </Grid>

        <Grid item xs={12} md={3}>
          <MetricCard trend="neutral">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <SecurityIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {alerts.length + 28}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Alerts
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <WarningIcon color="warning" sx={{ mr: 1 }} />
                <Typography variant="body2" color="warning.main">
                  {alerts.filter(a => a.severity === 'High').length} high priority
                </Typography>
              </Box>
            </CardContent>
          </MetricCard>
        </Grid>

        <Grid item xs={12} md={3}>
          <MetricCard trend="up">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                  <PeopleIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {customers.length + 1420}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Customers
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUpIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="body2" color="success.main">
                  +146 new this month
                </Typography>
              </Box>
            </CardContent>
          </MetricCard>
        </Grid>

        {/* Live Market Data */}
        <Grid item xs={12} md={8}>
          <StyledCard>
            <CardHeader
              title="Portfolio Performance & Market Data"
              action={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h6" color={priceChange >= 0 ? 'success.main' : 'error.main'}>
                    ${marketPrice.toFixed(2)}
                  </Typography>
                  {priceChange >= 0 ? 
                    <TrendingUpIcon color="success" /> : 
                    <TrendingDownIcon color="error" />
                  }
                </Box>
              }
            />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={portfolioData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <RechartsTooltip 
                    formatter={(value, name) => [
                      typeof value === 'number' ? `$${(value / 1000000).toFixed(1)}M` : value, 
                      name
                    ]}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="deposits" fill="#2196f3" name="Deposits" />
                  <Bar yAxisId="left" dataKey="loans" fill="#4caf50" name="Loans" />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#ff9800" strokeWidth={3} name="Revenue" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Risk Distribution */}
        <Grid item xs={12} md={4}>
          <StyledCard>
            <CardHeader title="Risk Distribution" />
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                </PieChart>
              </ResponsiveContainer>
              <Box sx={{ mt: 2 }}>
                {riskDistribution.map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box 
                      sx={{ 
                        width: 12, 
                        height: 12, 
                        bgcolor: item.color, 
                        borderRadius: 1, 
                        mr: 1 
                      }} 
                    />
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {item.value}%
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Live Transaction Feed */}
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardHeader 
              title="Live Transaction Feed" 
              action={
                <Badge badgeContent={transactions.length} color="primary">
                  <ShowChartIcon />
                </Badge>
              }
            />
            <CardContent sx={{ maxHeight: 300, overflow: 'auto' }}>
              <List dense>
                {transactions.slice(0, 8).map((transaction, index) => (
                  <React.Fragment key={transaction.id}>
                    <ListItem 
                      sx={{ 
                        backgroundColor: index < 2 ? 'rgba(76, 175, 80, 0.1)' : 'inherit',
                        borderRadius: 1,
                        mb: 0.5
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar 
                          sx={{ 
                            bgcolor: transaction.riskScore > 70 ? 'error.main' : 
                                     transaction.riskScore > 40 ? 'warning.main' : 'success.main',
                            width: 32,
                            height: 32
                          }}
                        >
                          <MonetizationOnIcon fontSize="small" />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" fontWeight="bold">
                              {transaction.type} - ${transaction.amount.toLocaleString()}
                            </Typography>
                            <Chip 
                              label={`Risk: ${transaction.riskScore}`}
                              size="small"
                              color={transaction.riskScore > 70 ? 'error' : 
                                     transaction.riskScore > 40 ? 'warning' : 'success'}
                            />
                          </Box>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            {transaction.customerId.substring(0, 12)}... • {new Date(transaction.timestamp).toLocaleTimeString()}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < 7 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Compliance Dashboard */}
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardHeader title="Compliance Metrics" />
            <CardContent>
              {complianceMetrics.map((metric, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" fontWeight="medium">
                      {metric.metric}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {metric.current}/{metric.target}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={metric.completion} 
                    color={metric.completion >= 95 ? 'success' : metric.completion >= 80 ? 'warning' : 'error'}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {metric.completion}% Complete
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Recent Alerts */}
        <Grid item xs={12}>
          <StyledCard>
            <CardHeader 
              title="Active Alerts & Notifications" 
              action={
                <Badge badgeContent={alerts.length + 5} color="error">
                  <NotificationsIcon />
                </Badge>
              }
            />
            <CardContent>
              <Grid container spacing={2}>
                {alerts.slice(0, 3).map((alert) => (
                  <Grid item xs={12} md={4} key={alert.id}>
                    <AlertCard severity={alert.severity === 'High' ? 'error' : alert.severity === 'Medium' ? 'warning' : 'info'}>
                      <CardContent sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          {alert.severity === 'High' ? <ErrorIcon color="error" sx={{ mr: 1 }} /> :
                           alert.severity === 'Medium' ? <WarningIcon color="warning" sx={{ mr: 1 }} /> :
                           <InfoIcon color="info" sx={{ mr: 1 }} />}
                          <Typography variant="subtitle2" fontWeight="bold">
                            {alert.type} Alert
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                          {alert.description}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(alert.createdAt).toLocaleDateString()} • {alert.accountId}
                        </Typography>
                      </CardContent>
                    </AlertCard>
                  </Grid>
                ))}
                
                {/* Additional Static Alerts */}
                <Grid item xs={12} md={4}>
                  <AlertCard severity="warning">
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <WarningIcon color="warning" sx={{ mr: 1 }} />
                        <Typography variant="subtitle2" fontWeight="bold">
                          Compliance Review
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        Quarterly BSA/AML review due in 3 days. 2 pending reports require attention.
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Today • Multiple Accounts
                      </Typography>
                    </CardContent>
                  </AlertCard>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <AlertCard severity="success">
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                        <Typography variant="subtitle2" fontWeight="bold">
                          System Update
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        AI fraud detection model updated with 12.3% accuracy improvement.
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        2 hours ago • System
                      </Typography>
                    </CardContent>
                  </AlertCard>
                </Grid>
              </Grid>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <StyledCard>
            <CardHeader title="Quick Actions" />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={6} md={2}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<AccountBalanceIcon />}
                    onClick={() => handleQuickAction('ledger')}
                    sx={{ py: 1.5 }}
                  >
                    FBO Ledger
                  </Button>
                </Grid>
                <Grid item xs={6} md={2}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<SecurityIcon />}
                    onClick={() => handleQuickAction('fraud')}
                    sx={{ py: 1.5 }}
                  >
                    Fraud Detection
                  </Button>
                </Grid>
                <Grid item xs={6} md={2}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<AssessmentIcon />}
                    onClick={() => handleQuickAction('underwriting')}
                    sx={{ py: 1.5 }}
                  >
                    Underwriting
                  </Button>
                </Grid>
                <Grid item xs={6} md={2}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<SmartToyIcon />}
                    onClick={() => handleQuickAction('biometric')}
                    sx={{ py: 1.5 }}
                  >
                    Biometric Auth
                  </Button>
                </Grid>
                <Grid item xs={6} md={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<SpeedIcon />}
                    onClick={() => handleQuickAction('tour')}
                    sx={{ py: 1.5 }}
                  >
                    Demo Tour
                  </Button>
                </Grid>
                <Grid item xs={6} md={2}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<FullscreenIcon />}
                    sx={{ py: 1.5 }}
                  >
                    Full Screen
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>

      {/* Floating Action Button */}
      <Fab 
        color="primary" 
        aria-label="ai-insights"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => handleQuickAction('tour')}
      >
        <SmartToyIcon />
      </Fab>

      {/* Biometric Authentication Dialog */}
      <BiometricAuth
        open={showBiometric}
        onClose={() => setShowBiometric(false)}
        onSuccess={() => console.log('Biometric authentication successful')}
        authType="fingerprint"
      />

      {/* Demo Tour */}
      <DemoTour
        isOpen={showTour}
        onClose={() => setShowTour(false)}
        tourType="overview"
      />
    </Box>
  );
};

export default Dashboard; 