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
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AlertIcon from '@mui/icons-material/NotificationsActive';
import DescriptionIcon from '@mui/icons-material/Description';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
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
  justifyContent: 'space-between',
}));

const HighlightCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  backgroundColor: theme.palette.primary.main,
  color: 'white',
}));

const accountActivityData = [
  { date: 'Apr 1', amount: 4000 },
  { date: 'Apr 2', amount: 3000 },
  { date: 'Apr 3', amount: 5000 },
  { date: 'Apr 4', amount: 2780 },
  { date: 'Apr 5', amount: 1890 },
  { date: 'Apr 6', amount: 2390 },
  { date: 'Apr 7', amount: 3490 },
  { date: 'Apr 8', amount: 4000 },
  { date: 'Apr 9', amount: 4500 },
  { date: 'Apr 10', amount: 5200 },
];

const complianceData = [
  { month: 'Jan', alerts: 12, reports: 8 },
  { month: 'Feb', alerts: 19, reports: 10 },
  { month: 'Mar', alerts: 14, reports: 12 },
  { month: 'Apr', alerts: 21, reports: 15 },
  { month: 'May', alerts: 25, reports: 18 },
];

const mockTransactions = [
  { 
    id: 1, 
    account: 'ACCT-87392-01', 
    subAccount: 'SA-10093',
    customer: 'TechSolutions Inc.', 
    type: 'Deposit', 
    amount: 25000.50, 
    date: '2023-04-10', 
    status: 'Completed',
    risk: 'Low'
  },
  { 
    id: 2, 
    account: 'ACCT-46372-03', 
    subAccount: 'SA-20045',
    customer: 'Global Traders Ltd', 
    type: 'Transfer', 
    amount: 150000.00, 
    date: '2023-04-10', 
    status: 'Pending Review',
    risk: 'Medium'
  },
  { 
    id: 3, 
    account: 'ACCT-92845-02', 
    subAccount: 'SA-30076',
    customer: 'Innovate Partners', 
    type: 'Withdrawal', 
    amount: 18750.25, 
    date: '2023-04-09', 
    status: 'Completed',
    risk: 'Low'
  },
  { 
    id: 4, 
    account: 'ACCT-12093-01', 
    subAccount: 'SA-40123',
    customer: 'NextGen Financials', 
    type: 'International Transfer', 
    amount: 87500.00, 
    date: '2023-04-09', 
    status: 'Flagged',
    risk: 'High'
  },
  { 
    id: 5, 
    account: 'ACCT-76452-04', 
    subAccount: 'SA-50014',
    customer: 'Apex Investments', 
    type: 'Deposit', 
    amount: 225000.75, 
    date: '2023-04-08', 
    status: 'Completed',
    risk: 'Low'
  },
];

const mockAlerts = [
  {
    id: 1,
    type: 'BSA Alert',
    description: 'Multiple large transactions exceeding $10,000 threshold',
    account: 'ACCT-12093-01',
    date: '2023-04-10',
    priority: 'High'
  },
  {
    id: 2,
    type: 'AML Flag',
    description: 'Unusual pattern detected - Multiple small deposits followed by large transfer',
    account: 'ACCT-46372-03',
    date: '2023-04-09',
    priority: 'Medium'
  },
  {
    id: 3,
    type: 'SAR Required',
    description: 'Suspicious activity report required for international transfers to flagged region',
    account: 'ACCT-12093-01',
    date: '2023-04-09',
    priority: 'High'
  },
];

const LedgerMonitoring: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleFilterOpen = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };
  
  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };
  
  const getRiskColor = (risk: string) => {
    switch(risk) {
      case 'Low': return 'success';
      case 'Medium': return 'warning';
      case 'High': return 'error';
      default: return 'default';
    }
  };
  
  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'Low': return 'info';
      case 'Medium': return 'warning';
      case 'High': return 'error';
      default: return 'default';
    }
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Completed': return 'success';
      case 'Pending Review': return 'warning';
      case 'Flagged': return 'error';
      default: return 'default';
    }
  };
  
  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Typography variant="h4" gutterBottom>
            Unified FBO-Ledger Monitoring
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Real-time visibility into all accounts, transactions, and compliance activities
          </Typography>
        </div>
        <Box>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<DescriptionIcon />}
            sx={{ mr: 2 }}
          >
            Generate Report
          </Button>
          <Button 
            variant="outlined"
            startIcon={<DownloadIcon />}
          >
            Export Data
          </Button>
        </Box>
      </Box>
      
      {/* Key Metrics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <StyledCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccountBalanceWalletIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Accounts</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                1,349
              </Typography>
              <Typography variant="body2" color="text.secondary">
                146 new accounts this month
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <HighlightCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Transaction Volume</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                $24.8M
              </Typography>
              <Typography variant="body2">
                Up 12% from last month
              </Typography>
            </CardContent>
          </HighlightCard>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <StyledCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AlertIcon color="error" sx={{ mr: 1 }} />
                <Typography variant="h6">Active Alerts</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                28
              </Typography>
              <Typography variant="body2" color="error.main">
                7 high-priority alerts
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>
        
        <Grid item xs={12} md={3}>
          <StyledCard>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PeopleIcon color="secondary" sx={{ mr: 1 }} />
                <Typography variant="h6">Sub-Accounts</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                5,201
              </Typography>
              <Typography variant="body2" color="text.secondary">
                18% increase year-to-date
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
      
      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              FBO Account Activity
            </Typography>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <AreaChart
                  data={accountActivityData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2e5bff" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#2e5bff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <RechartsTooltip />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#2e5bff" 
                    fillOpacity={1} 
                    fill="url(#colorAmount)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Compliance Activity
            </Typography>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart
                  data={complianceData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="alerts" fill="#ff5c5c" name="Alerts" />
                  <Bar dataKey="reports" fill="#00c9ff" name="Reports Filed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Tabs for Transaction Monitor and Alerts */}
      <Paper sx={{ width: '100%', mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="ledger monitoring tabs"
          >
            <Tab label="Transaction Monitor" />
            <Tab 
              label={
                <Badge color="error" badgeContent={3} sx={{ pr: 2 }}>
                  Compliance Alerts
                </Badge>
              } 
            />
            <Tab label="Account Explorer" />
          </Tabs>
        </Box>
        
        {/* Transaction Monitor Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <TextField
              placeholder="Search transactions..."
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
                <MenuItem onClick={handleFilterClose}>All Transactions</MenuItem>
                <MenuItem onClick={handleFilterClose}>Deposits Only</MenuItem>
                <MenuItem onClick={handleFilterClose}>Withdrawals Only</MenuItem>
                <MenuItem onClick={handleFilterClose}>Transfers Only</MenuItem>
                <MenuItem onClick={handleFilterClose}>High Risk Only</MenuItem>
              </Menu>
              
              <Button variant="outlined" startIcon={<DownloadIcon />}>
                Export
              </Button>
            </Box>
          </Box>
          
          <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="transaction table">
              <TableHead>
                <TableRow>
                  <TableCell>Account</TableCell>
                  <TableCell>Sub-Account</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Risk Level</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.account}</TableCell>
                    <TableCell>{transaction.subAccount}</TableCell>
                    <TableCell>{transaction.customer}</TableCell>
                    <TableCell>{transaction.type}</TableCell>
                    <TableCell align="right">${transaction.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>
                      <Chip 
                        label={transaction.status} 
                        size="small" 
                        color={getStatusColor(transaction.status) as any}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={transaction.risk} 
                        size="small" 
                        color={getRiskColor(transaction.risk) as any}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Details">
                        <IconButton size="small">
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="More Options">
                        <IconButton 
                          size="small"
                          onClick={handleMenuOpen}
                        >
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                      >
                        <MenuItem onClick={handleMenuClose}>Full Transaction Details</MenuItem>
                        <MenuItem onClick={handleMenuClose}>View Account History</MenuItem>
                        <MenuItem onClick={handleMenuClose}>Generate BSA Report</MenuItem>
                        <MenuItem onClick={handleMenuClose}>Flag for Review</MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        
        {/* Compliance Alerts Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="subtitle1">
              Active Compliance Alerts (3 new alerts)
            </Typography>
            <Box>
              <Button 
                variant="contained" 
                color="primary"
                sx={{ mr: 1 }}
              >
                Generate SAR Report
              </Button>
              <Button 
                variant="outlined"
              >
                Generate CTR Report
              </Button>
            </Box>
          </Box>
          
          {mockAlerts.map((alert) => (
            <Paper key={alert.id} sx={{ p: 2, mb: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Chip 
                      label={alert.priority} 
                      size="small" 
                      color={getPriorityColor(alert.priority) as any}
                      sx={{ mr: 1 }}
                    />
                    <Typography variant="subtitle1">
                      {alert.type}
                    </Typography>
                  </Box>
                  <Typography variant="body1">
                    {alert.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Account: {alert.account} • {alert.date}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                  <Button variant="outlined" color="primary" sx={{ mr: 1 }}>
                    Review
                  </Button>
                  <Button variant="outlined" color="error">
                    Flag
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          ))}
        </TabPanel>
        
        {/* Account Explorer Tab */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography variant="h6" gutterBottom>
              Account Explorer
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Search for accounts or select an account from recent activity to explore.
            </Typography>
            <TextField
              placeholder="Search by account number, customer name, or EIN..."
              variant="outlined"
              fullWidth
              sx={{ maxWidth: 500, mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button variant="contained" color="primary">
              Search Accounts
            </Button>
          </Box>
        </TabPanel>
      </Paper>
      
      {/* Row-level encryption notice */}
      <Paper sx={{ p: 2, bgcolor: '#f0f5ff', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            <span role="img" aria-label="secure">🔒</span> All data shown is secured with row-level encryption and protected by advanced access controls. Full audit trails are available.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default LedgerMonitoring;