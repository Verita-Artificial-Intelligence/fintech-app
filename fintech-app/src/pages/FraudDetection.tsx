import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Switch,
  FormControlLabel,
  Badge,
  Menu,
  MenuItem,
  CircularProgress,
  AlertTitle,
  Alert
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import FlagIcon from '@mui/icons-material/Flag';
import FilterListIcon from '@mui/icons-material/FilterList';
import SecurityIcon from '@mui/icons-material/Security';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import GavelIcon from '@mui/icons-material/Gavel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TimelineIcon from '@mui/icons-material/Timeline';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import DescriptionIcon from '@mui/icons-material/Description';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const AlertItem = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderLeft: '4px solid',
}));

const StatTrend = styled(Box)(({ trend }: { trend: 'up' | 'down' | 'neutral' }) => ({
  color: trend === 'down' ? 'green' : 
         trend === 'up' ? 'red' : 
         'gray',
  display: 'flex',
  alignItems: 'center',
  fontSize: '0.875rem',
}));

const AnalyticsCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  height: '100%',
}));

// Mock data
const fraudTrendsData = [
  { month: 'Jan', actual: 35, predicted: 38 },
  { month: 'Feb', actual: 28, predicted: 30 },
  { month: 'Mar', actual: 32, predicted: 33 },
  { month: 'Apr', actual: 39, predicted: 40 },
  { month: 'May', actual: 42, predicted: 46 },
  { month: 'Jun', actual: 50, predicted: 48 },
];

const fraudTypeData = [
  { name: 'Card Fraud', value: 42 },
  { name: 'Account Takeover', value: 28 },
  { name: 'Synthetic ID', value: 16 },
  { name: 'Application Fraud', value: 14 },
];

const COLORS = ['#ff5c5c', '#ff9800', '#2e5bff', '#00c9ff'];

const mockAlerts = [
  {
    id: 1,
    type: 'Card Fraud',
    severity: 'High',
    description: 'Multiple declined transactions followed by successful small charges',
    cardNumber: '****-****-****-5492',
    customer: 'Michael Johnson',
    timestamp: '10 minutes ago',
    status: 'New'
  },
  {
    id: 2,
    type: 'Suspicious Login',
    severity: 'Medium',
    description: 'Login attempt from unrecognized device and unusual location (Sofia, Bulgaria)',
    customer: 'Sarah Williams',
    timestamp: '37 minutes ago',
    status: 'New'
  },
  {
    id: 3,
    type: 'Transaction Anomaly',
    severity: 'Medium',
    description: 'Unusual transaction pattern detected: 3 large transfers in 24h period',
    customer: 'Tech Innovators LLC',
    timestamp: '1 hour ago',
    status: 'Under Review'
  },
  {
    id: 4,
    type: 'Possible ATO',
    severity: 'High',
    description: 'Account password reset followed by immediate funds transfer attempt',
    customer: 'Robert Chen',
    timestamp: '2 hours ago',
    status: 'Under Review'
  },
  {
    id: 5,
    type: 'Velocity Alert',
    severity: 'Low',
    description: 'Multiple small transactions at same merchant within 1 hour',
    cardNumber: '****-****-****-7731',
    customer: 'Emily Parker',
    timestamp: '4 hours ago',
    status: 'Resolved'
  },
];

const complianceStatuses = [
  {
    name: 'PCI DSS',
    status: 'Compliant',
    lastChecked: '2 days ago',
    nextAudit: '89 days remaining',
    items: '173/173 controls verified'
  },
  {
    name: 'GDPR',
    status: 'Compliant',
    lastChecked: '5 days ago',
    nextAudit: '55 days remaining',
    items: '97/98 controls verified'
  },
  {
    name: 'SOC 2',
    status: 'Action Required',
    lastChecked: '1 day ago',
    nextAudit: '12 days remaining',
    items: '126/135 controls verified'
  },
  {
    name: 'BSA/AML',
    status: 'Compliant',
    lastChecked: 'Today',
    nextAudit: '32 days remaining',
    items: '56/56 controls verified'
  },
];

const FraudDetection: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [simulating, setSimulating] = useState(false);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleFilterOpen = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };
  
  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };
  
  const handleSimulation = () => {
    setSimulating(true);
    setTimeout(() => {
      setSimulating(false);
    }, 3000);
  };
  
  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'info';
      default: return 'default';
    }
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Compliant': return 'success';
      case 'Action Required': return 'warning';
      case 'Non-Compliant': return 'error';
      default: return 'default';
    }
  };
  
  const getAlertBorderColor = (severity: string) => {
    switch(severity) {
      case 'High': return '#ff5c5c';
      case 'Medium': return '#ff9800';
      case 'Low': return '#00c9ff';
      default: return '#e0e0e0';
    }
  };
  
  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Typography variant="h4" gutterBottom>
            Fraud Detection & Compliance Toolkit
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Comprehensive system for fraud prevention and regulatory compliance
          </Typography>
        </div>
        <Box>
          <Button 
            variant="contained" 
            color="secondary" 
            startIcon={<ReportProblemIcon />}
            sx={{ mr: 2 }}
            onClick={handleSimulation}
            disabled={simulating}
          >
            {simulating ? (
              <>
                <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                Simulating...
              </>
            ) : (
              'Run Threat Simulation'
            )}
          </Button>
          <Button 
            variant="outlined"
            startIcon={<DownloadIcon />}
          >
            Export Report
          </Button>
        </Box>
      </Box>
      
      {/* Key Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <StyledCard>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Fraud Rate (30 days)
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                0.082%
              </Typography>
              <StatTrend trend="down">
                <Typography component="span" sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                  ↓ 0.023%
                </Typography>
                from last month
              </StatTrend>
            </CardContent>
          </StyledCard>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <StyledCard>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Mean Time to Respond
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                14.3 min
              </Typography>
              <StatTrend trend="down">
                <Typography component="span" sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                  ↓ 3.4 min
                </Typography>
                from last month
              </StatTrend>
            </CardContent>
          </StyledCard>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <StyledCard>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Active Alerts
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                17
              </Typography>
              <StatTrend trend="up">
                <Typography component="span" sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                  ↑ 5
                </Typography>
                from yesterday
              </StatTrend>
            </CardContent>
          </StyledCard>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <StyledCard>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Compliance Score
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                96%
              </Typography>
              <StatTrend trend="neutral">
                <Typography component="span" sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                  ↔ No change
                </Typography>
                this quarter
              </StatTrend>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
      
      {/* Tabs */}
      <Paper sx={{ width: '100%', mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="fraud detection tabs"
          >
            <Tab label={
              <Badge color="error" badgeContent={4} sx={{ pr: 2 }}>
                Fraud Alerts
              </Badge>
            } />
            <Tab label="Compliance Dashboard" />
            <Tab label="Fraud Analytics" />
          </Tabs>
        </Box>
        
        {/* Fraud Alerts Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <TextField
              placeholder="Search alerts..."
              variant="outlined"
              size="small"
              sx={{ width: 300 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Box>
              <Button 
                variant="outlined" 
                startIcon={<FilterListIcon />}
                onClick={handleFilterOpen}
                sx={{ mr: 1 }}
              >
                Filter
              </Button>
              <Menu
                anchorEl={filterAnchorEl}
                open={Boolean(filterAnchorEl)}
                onClose={handleFilterClose}
              >
                <MenuItem onClick={handleFilterClose}>All Alerts</MenuItem>
                <MenuItem onClick={handleFilterClose}>High Priority</MenuItem>
                <MenuItem onClick={handleFilterClose}>New Only</MenuItem>
                <MenuItem onClick={handleFilterClose}>Card Fraud</MenuItem>
                <MenuItem onClick={handleFilterClose}>Account Takeover</MenuItem>
              </Menu>
              
              <Button 
                variant="contained" 
                color="primary"
              >
                Create SAR/CTR Report
              </Button>
            </Box>
          </Box>
          
          {mockAlerts.map((alert) => (
            <AlertItem 
              key={alert.id} 
              sx={{ borderLeftColor: getAlertBorderColor(alert.severity) }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={9}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Chip 
                      label={alert.severity} 
                      size="small" 
                      color={getSeverityColor(alert.severity) as any}
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="subtitle1" sx={{ mr: 1 }}>
                      {alert.type}
                    </Typography>
                    <Chip 
                      label={alert.status} 
                      size="small" 
                      variant="outlined"
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
                      {alert.timestamp}
                    </Typography>
                  </Box>
                  <Typography variant="body1" paragraph>
                    {alert.description}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Customer:</strong> {alert.customer}
                    {alert.cardNumber && <span> | <strong>Card:</strong> {alert.cardNumber}</span>}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={3} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <Button variant="outlined" sx={{ mr: 1 }}>
                    Investigate
                  </Button>
                  <Button variant="contained" color="error" startIcon={<FlagIcon />}>
                    Flag
                  </Button>
                </Grid>
              </Grid>
            </AlertItem>
          ))}
        </TabPanel>
        
        {/* Compliance Dashboard Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Regulatory Compliance Status
            </Typography>
            <Grid container spacing={3}>
              {complianceStatuses.map((item, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Paper sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ mr: 2 }}>
                        {item.status === 'Compliant' ? (
                          <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />
                        ) : item.status === 'Action Required' ? (
                          <WarningIcon color="warning" sx={{ fontSize: 40 }} />
                        ) : (
                          <ErrorIcon color="error" sx={{ fontSize: 40 }} />
                        )}
                      </Box>
                      <Box>
                        <Typography variant="h6">{item.name}</Typography>
                        <Chip 
                          label={item.status} 
                          size="small" 
                          color={getStatusColor(item.status) as any}
                        />
                      </Box>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Last checked:
                      </Typography>
                      <Typography variant="body2">
                        {item.lastChecked}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Next audit:
                      </Typography>
                      <Typography variant="body2">
                        {item.nextAudit}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2" color="text.secondary">
                        Controls verification:
                      </Typography>
                      <Typography variant="body2">
                        {item.items}
                      </Typography>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        fullWidth
                        startIcon={<VisibilityIcon />}
                      >
                        View Details
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Evidence Pack Generation
            </Typography>
            <Paper sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Typography variant="subtitle1" gutterBottom>
                    Continuous Compliance Documentation
                  </Typography>
                  <Typography variant="body2" paragraph>
                    Generate evidence packs for audits and regulatory reviews with one click. All documentation is automatically gathered from your compliance activities.
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <FormControlLabel 
                      control={<Switch defaultChecked />} 
                      label="PCI DSS" 
                    />
                    <FormControlLabel 
                      control={<Switch defaultChecked />} 
                      label="GDPR" 
                    />
                    <FormControlLabel 
                      control={<Switch defaultChecked />} 
                      label="SOC 2" 
                    />
                    <FormControlLabel 
                      control={<Switch defaultChecked />} 
                      label="BSA/AML" 
                    />
                  </Box>
                  <Box>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      sx={{ mr: 2 }}
                      startIcon={<VerifiedUserIcon />}
                    >
                      Generate Evidence Pack
                    </Button>
                    <Button 
                      variant="outlined"
                      startIcon={<GavelIcon />}
                    >
                      Schedule Audit
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>
                    Recent Packs
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <DescriptionIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="SOC 2 Evidence Pack" 
                        secondary="Generated April 15, 2023"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <DescriptionIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="PCI DSS Evidence Pack" 
                        secondary="Generated March 28, 2023"
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <DescriptionIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="GDPR Evidence Pack" 
                        secondary="Generated February 12, 2023"
                      />
                    </ListItem>
                  </List>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </TabPanel>
        
        {/* Fraud Analytics Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <AnalyticsCard>
                <Typography variant="h6" gutterBottom>
                  Fraud Trends
                </Typography>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <LineChart
                      data={fraudTrendsData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="actual" 
                        stroke="#2e5bff" 
                        activeDot={{ r: 8 }} 
                        name="Actual Fraud Cases"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="predicted" 
                        stroke="#ff5c5c" 
                        strokeDasharray="5 5" 
                        name="Predicted Fraud Cases"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button 
                    variant="outlined" 
                    startIcon={<TimelineIcon />}
                  >
                    View Detailed Analysis
                  </Button>
                </Box>
              </AnalyticsCard>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <AnalyticsCard>
                <Typography variant="h6" gutterBottom>
                  Fraud By Type
                </Typography>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={fraudTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {fraudTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </AnalyticsCard>
            </Grid>
            
            <Grid item xs={12}>
              <AnalyticsCard>
                <Typography variant="h6" gutterBottom>
                  Threat Simulation Results
                </Typography>
                {simulating ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <>
                    <Alert severity="info" sx={{ mb: 2 }}>
                      <AlertTitle>Ready to Simulate</AlertTitle>
                      Run the "Threat Simulation" to test your system's response to various fraud scenarios.
                    </Alert>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 2, borderRadius: 1, bgcolor: '#f8f9fc' }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Card Testing Defense
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ position: 'relative', display: 'inline-flex', mr: 2 }}>
                              <CircularProgress
                                variant="determinate"
                                value={92}
                                size={40}
                                thickness={4}
                                sx={{ color: '#4caf50' }}
                              />
                              <Box
                                sx={{
                                  top: 0,
                                  left: 0,
                                  bottom: 0,
                                  right: 0,
                                  position: 'absolute',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  component="div"
                                  color="text.secondary"
                                >
                                  92%
                                </Typography>
                              </Box>
                            </Box>
                            <Typography variant="body2">
                              Last tested: 2 days ago
                            </Typography>
                          </Box>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 2, borderRadius: 1, bgcolor: '#f8f9fc' }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Account Takeover Defense
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ position: 'relative', display: 'inline-flex', mr: 2 }}>
                              <CircularProgress
                                variant="determinate"
                                value={86}
                                size={40}
                                thickness={4}
                                sx={{ color: '#4caf50' }}
                              />
                              <Box
                                sx={{
                                  top: 0,
                                  left: 0,
                                  bottom: 0,
                                  right: 0,
                                  position: 'absolute',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  component="div"
                                  color="text.secondary"
                                >
                                  86%
                                </Typography>
                              </Box>
                            </Box>
                            <Typography variant="body2">
                              Last tested: 5 days ago
                            </Typography>
                          </Box>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 2, borderRadius: 1, bgcolor: '#f8f9fc' }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Synthetic ID Defense
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ position: 'relative', display: 'inline-flex', mr: 2 }}>
                              <CircularProgress
                                variant="determinate"
                                value={78}
                                size={40}
                                thickness={4}
                                sx={{ color: '#fb8c00' }}
                              />
                              <Box
                                sx={{
                                  top: 0,
                                  left: 0,
                                  bottom: 0,
                                  right: 0,
                                  position: 'absolute',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  component="div"
                                  color="text.secondary"
                                >
                                  78%
                                </Typography>
                              </Box>
                            </Box>
                            <Typography variant="body2">
                              Last tested: 7 days ago
                            </Typography>
                          </Box>
                        </Paper>
                      </Grid>
                    </Grid>
                  </>
                )}
              </AnalyticsCard>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
      
      {/* KPI Dashboard */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          KPI Dashboard
        </Typography>
        <Paper sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" gutterBottom>
                Fraud Rate
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ mr: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    0.082%
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="success.main">
                    ↓ 21.9% vs. last period
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Industry avg: 0.11%
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" gutterBottom>
                MTTR (Mean Time to Respond)
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ mr: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    14.3 min
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="success.main">
                    ↓ 19.2% vs. last period
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    SLA: &lt;30 min
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" gutterBottom>
                Open Compliance Gaps
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ mr: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    9
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="error.main">
                    ↑ 2 since last audit
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    7 being addressed
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Box>
  );
};

export default FraudDetection;