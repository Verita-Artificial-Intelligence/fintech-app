import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Stepper,
  Step,
  StepLabel,
  TextField,
  InputAdornment,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tabs,
  Tab,
  Avatar,
  Tooltip,
  Alert,
  AlertTitle,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import DescriptionIcon from '@mui/icons-material/Description';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ScoreIcon from '@mui/icons-material/Score';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import HistoryIcon from '@mui/icons-material/History';
import InfoIcon from '@mui/icons-material/Info';
import PsychologyIcon from '@mui/icons-material/Psychology';
import RuleIcon from '@mui/icons-material/Rule';
import WarningIcon from '@mui/icons-material/Warning';
import TuneIcon from '@mui/icons-material/Tune';
import DownloadIcon from '@mui/icons-material/Download';
import AssessmentIcon from '@mui/icons-material/Assessment';
import {
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ComposedChart,
  Line,
  Area
} from 'recharts';
import { useTranslation } from 'react-i18next';
// Sprint 3 imports
import { experianClient, CreditReport } from '../api/providers/experian';
import { underwritingModel, LoanApplication, UnderwritingDecision, generateShapWaterfallData } from '../ml/underwritingModel';
import { sbaFormFiller, downloadSBAForm, SBAFormData } from '../utils/sbaFormFiller';

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

const ScoreGauge = styled(Box)(({ score }: { score: number }) => {
  const getColor = () => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'orange';
    return 'red';
  };
  
  return {
    position: 'relative',
    width: '100%',
    height: '8px',
    backgroundColor: '#e0e0e0',
    borderRadius: '4px',
    marginBottom: '8px',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: `${score}%`,
      height: '100%',
      backgroundColor: getColor(),
      borderRadius: '4px',
      transition: 'width 1s ease-in-out',
    },
  };
});

const FactorItem = styled(Box)(({ impact }: { impact: 'positive' | 'negative' | 'neutral' }) => {
  const getColor = () => {
    if (impact === 'positive') return 'green';
    if (impact === 'negative') return 'red';
    return 'gray';
  };
  
  return {
    display: 'flex',
    alignItems: 'center',
    padding: '12px',
    borderLeft: `4px solid ${getColor()}`,
    backgroundColor: 'white',
    marginBottom: '8px',
    borderRadius: '0 4px 4px 0',
  };
});

const steps = ['Upload Documents', 'OCR & Data Extraction', 'Scoring & Analysis', 'Decision'];

// Mock data
const mockApplications = [
  {
    id: 'APP-4927',
    applicant: 'Sarah Williams',
    type: 'Personal Loan',
    amount: 35000,
    submitted: '2023-04-10',
    score: 87,
    status: 'Approved'
  },
  {
    id: 'APP-4926',
    applicant: 'TechFuture Inc.',
    type: 'Business Line of Credit',
    amount: 150000,
    submitted: '2023-04-09',
    score: 73,
    status: 'In Review'
  },
  {
    id: 'APP-4925',
    applicant: 'James Rodriguez',
    type: 'Personal Loan',
    amount: 20000,
    submitted: '2023-04-09',
    score: 58,
    status: 'In Review'
  },
  {
    id: 'APP-4924',
    applicant: 'Green Valley Farms LLC',
    type: 'Equipment Financing',
    amount: 250000,
    submitted: '2023-04-08',
    score: 82,
    status: 'Approved'
  },
  {
    id: 'APP-4923',
    applicant: 'Michael Chen',
    type: 'Mortgage',
    amount: 450000,
    submitted: '2023-04-08',
    score: 45,
    status: 'Declined'
  },
];

const applicantDetails = {
  name: 'TechFuture Inc.',
  type: 'Business',
  founded: '2018',
  industry: 'Software Development',
  revenue: '$1.2M',
  employees: '12',
  creditScore: '720',
  existingCustomer: 'Yes - Since 2020',
  previousApplications: '1 (Approved)',
  requestedAmount: '$150,000',
  purpose: 'Business Expansion',
  term: '5 years',
};

const scoreFactors: Array<{
  factor: string;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
  weight: number;
}> = [
  {
    factor: 'Strong Business Growth Trajectory',
    impact: 'positive',
    description: '24% YoY revenue growth for past 2 years',
    weight: 15
  },
  {
    factor: 'Consistent Cash Flow',
    impact: 'positive',
    description: 'Stable monthly revenue with low volatility',
    weight: 20
  },
  {
    factor: 'Existing Banking Relationship',
    impact: 'positive',
    description: 'Customer since 2020 with no negative history',
    weight: 10
  },
  {
    factor: 'Limited Business Credit History',
    impact: 'negative',
    description: 'Only 3 years of established business credit',
    weight: -12
  },
  {
    factor: 'Industry Risk Assessment',
    impact: 'neutral',
    description: 'Software industry shows medium volatility',
    weight: 5
  },
];

const documentScores = [
  { name: 'Business Tax Returns', score: 82 },
  { name: 'Bank Statements', score: 88 },
  { name: 'Financial Statements', score: 76 },
  { name: 'Business Plan', score: 65 },
  { name: 'Owner Credit History', score: 79 },
];

const radarData = [
  {
    subject: 'Credit History',
    score: 75,
    fullMark: 100,
  },
  {
    subject: 'Cash Flow',
    score: 85,
    fullMark: 100,
  },
  {
    subject: 'Business Model',
    score: 70,
    fullMark: 100,
  },
  {
    subject: 'Industry Outlook',
    score: 65,
    fullMark: 100,
  },
  {
    subject: 'Management Team',
    score: 80,
    fullMark: 100,
  },
];

const decisionsPieData = [
  { name: 'Approved', value: 62 },
  { name: 'In Review', value: 23 },
  { name: 'Declined', value: 15 },
];

const COLORS = ['#4caf50', '#2196f3', '#f44336'];

const UnderwritingEngine: React.FC = () => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [creditReport, setCreditReport] = useState<CreditReport | null>(null);
  const [underwritingDecision, setUnderwritingDecision] = useState<UnderwritingDecision | null>(null);
  const [loadingCredit, setLoadingCredit] = useState(false);
  const [loadingDecision, setLoadingDecision] = useState(false);
  const [showSHAP, setShowSHAP] = useState(false);
  const [applicationForm, setApplicationForm] = useState<LoanApplication>({
    businessName: '',
    requestedAmount: 0,
    loanPurpose: '',
    loanTerm: 60,
    industry: '',
    annualRevenue: 0,
    monthlyRevenue: 0,
    yearsInBusiness: 0,
    employeeCount: 0,
    creditScore: 0,
    debtServiceCoverageRatio: 0,
    collateralValue: 0,
    existingDebt: 0,
    cashFlow: 0,
    bankingRelationshipMonths: 0
  });
  
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  const handleReset = () => {
    setActiveStep(0);
  };
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleDialogOpen = () => {
    setOpenDialog(true);
  };
  
  const handleDialogClose = () => {
    setOpenDialog(false);
  };
  
  const handleUploadDoc = () => {
    setUploadingDoc(true);
    setTimeout(() => {
      setUploadingDoc(false);
    }, 2000);
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Approved': return 'success';
      case 'In Review': return 'info';
      case 'Declined': return 'error';
      default: return 'default';
    }
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#4caf50';
    if (score >= 60) return '#ff9800';
    return '#f44336';
  };
  
  // Fetch credit report from Experian
  const fetchCreditReport = async (businessName: string, taxId: string = '12-3456789') => {
    setLoadingCredit(true);
    try {
      const report = await experianClient.getBusinessCreditReport(businessName, taxId);
      setCreditReport(report);
      // Update application form with credit score
      setApplicationForm(prev => ({
        ...prev,
        creditScore: report.creditScore.score,
        businessName: businessName
      }));
      // Auto-advance to next step
      handleNext();
    } catch (error) {
      console.error('Failed to fetch credit report:', error);
    } finally {
      setLoadingCredit(false);
    }
  };
  
  // Run ML underwriting model
  const runUnderwritingModel = async () => {
    setLoadingDecision(true);
    try {
      // Calculate DSCR if we have credit report
      let dscr = applicationForm.debtServiceCoverageRatio;
      if (creditReport && applicationForm.cashFlow > 0) {
        dscr = await experianClient.calculateDSCR(creditReport, applicationForm.cashFlow);
      }
      
      const updatedApplication = {
        ...applicationForm,
        debtServiceCoverageRatio: dscr,
        creditScore: creditReport?.creditScore.score || applicationForm.creditScore
      };
      
      const decision = await underwritingModel.predict(updatedApplication);
      setUnderwritingDecision(decision);
      // Auto-advance to decision step
      setActiveStep(3);
    } catch (error) {
      console.error('Underwriting model error:', error);
    } finally {
      setLoadingDecision(false);
    }
  };
  
  // Download SBA Form
  const handleDownloadSBAForm = async () => {
    if (!underwritingDecision || underwritingDecision.decision !== 'Approved') {
      return;
    }
    
    const formData: SBAFormData = {
      businessName: applicationForm.businessName,
      taxId: creditReport?.business.taxId || '12-3456789',
      businessAddress: creditReport?.business.address || {
        street: '123 Main St',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90001'
      },
      businessPhone: '(310) 555-0123',
      businessEmail: 'contact@' + applicationForm.businessName.toLowerCase().replace(/\s+/g, '') + '.com',
      dateEstablished: new Date(Date.now() - applicationForm.yearsInBusiness * 365 * 24 * 60 * 60 * 1000).toISOString(),
      stateOfIncorporation: 'CA',
      ownerName: 'Business Owner',
      ownerTitle: 'CEO',
      ownershipPercentage: 100,
      ownerSSN: '123-45-6789',
      ownerAddress: {
        street: '456 Executive Dr',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90001'
      },
      loanAmount: underwritingDecision.approvedAmount || applicationForm.requestedAmount,
      loanPurpose: applicationForm.loanPurpose,
      loanTerm: applicationForm.loanTerm,
      collateralOffered: (applicationForm.collateralValue && applicationForm.collateralValue > 0) ? 'Business assets' : undefined,
      annualRevenue: applicationForm.annualRevenue,
      netProfit: applicationForm.annualRevenue * 0.15,
      totalAssets: applicationForm.annualRevenue * 0.8,
      totalLiabilities: applicationForm.existingDebt,
      numberOfEmployees: applicationForm.employeeCount,
      workingCapital: applicationForm.requestedAmount * 0.6,
      equipmentPurchase: applicationForm.requestedAmount * 0.4
    };
    
    await downloadSBAForm(formData, `SBA_Form_${applicationForm.businessName.replace(/\s+/g, '_')}.json`);
  };
  
  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Typography variant="h4" gutterBottom>
            Automated Underwriting Engine
          </Typography>
          <Typography variant="body1" color="text.secondary">
            ML-powered credit decisioning with document analysis and risk assessment
          </Typography>
        </div>
        <Box>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<DocumentScannerIcon />}
            onClick={handleDialogOpen}
          >
            New Application
          </Button>
        </Box>
      </Box>
      
      {/* Tabs */}
      <Paper sx={{ width: '100%', mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="underwriting tabs"
          >
            <Tab label="Applications" />
            <Tab label="Applicant Details" />
            <Tab label="Analytics" />
          </Tabs>
        </Box>
        
        {/* Applications Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <TextField
              placeholder="Search applications..."
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
          </Box>
          
          <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="applications table">
              <TableHead>
                <TableRow>
                  <TableCell>Application ID</TableCell>
                  <TableCell>Applicant</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Submitted</TableCell>
                  <TableCell>Score</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockApplications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>{app.id}</TableCell>
                    <TableCell>{app.applicant}</TableCell>
                    <TableCell>{app.type}</TableCell>
                    <TableCell align="right">${app.amount.toLocaleString()}</TableCell>
                    <TableCell>{app.submitted}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                          sx={{
                            width: 35,
                            height: 35,
                            borderRadius: '50%',
                            bgcolor: getScoreColor(app.score),
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 1,
                            fontWeight: 'bold',
                          }}
                        >
                          {app.score}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={app.status} 
                        size="small" 
                        color={getStatusColor(app.status) as any}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Details">
                        <IconButton size="small" onClick={() => setTabValue(1)}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        
        {/* Applicant Details Tab */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <BusinessIcon />
                  </Avatar>
                  <Typography variant="h6">{applicantDetails.name}</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Business Type
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {applicantDetails.type}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Founded
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {applicantDetails.founded}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Industry
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {applicantDetails.industry}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Annual Revenue
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {applicantDetails.revenue}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Employees
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {applicantDetails.employees}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Credit Score
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {applicantDetails.creditScore}
                    </Typography>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom>
                  Application Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Amount Requested
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {applicantDetails.requestedAmount}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Purpose
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {applicantDetails.purpose}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Term
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {applicantDetails.term}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Existing Customer
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {applicantDetails.existingCustomer}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Eligibility Score: 73/100
                  </Typography>
                  <Chip label="In Review" color="info" />
                </Box>
                <ScoreGauge score={73} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="body2" color="text.secondary">0</Typography>
                  <Typography variant="body2" color="text.secondary">50</Typography>
                  <Typography variant="body2" color="text.secondary">100</Typography>
                </Box>
                
                <Typography variant="subtitle1" gutterBottom>
                  Key Factors
                </Typography>
                {scoreFactors.map((factor, index) => (
                  <FactorItem key={index} impact={factor.impact}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle2">
                        {factor.factor}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {factor.description}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography 
                        variant="subtitle2" 
                        color={
                          factor.impact === 'positive' ? 'success.main' : 
                          factor.impact === 'negative' ? 'error.main' : 
                          'text.secondary'
                        }
                      >
                        {factor.weight > 0 ? `+${factor.weight}` : factor.weight}
                      </Typography>
                    </Box>
                  </FactorItem>
                ))}
                
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    startIcon={<PsychologyIcon />}
                    sx={{ mr: 2 }}
                  >
                    Human Review
                  </Button>
                  <Button 
                    variant="contained" 
                    color="primary"
                    startIcon={<CheckIcon />}
                  >
                    Approve Application
                  </Button>
                </Box>
              </Paper>
              
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Document Analysis
                </Typography>
                <Grid container spacing={2}>
                  {documentScores.map((doc, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <DescriptionIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="subtitle2">
                            {doc.name}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={doc.score} 
                            sx={{ 
                              width: '70%', 
                              height: 8, 
                              borderRadius: 4,
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 4,
                                backgroundColor: getScoreColor(doc.score)
                              }
                            }} 
                          />
                          <Box
                            sx={{
                              width: 35,
                              height: 35,
                              borderRadius: '50%',
                              bgcolor: getScoreColor(doc.score),
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold',
                            }}
                          >
                            {doc.score}
                          </Box>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
                
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button 
                    variant="outlined" 
                    startIcon={<VisibilityIcon />}
                  >
                    View All Documents
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Analytics Tab */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Risk Assessment Radar
                </Typography>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <RadarChart outerRadius={90} width={730} height={250} data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar
                        name="Score"
                        dataKey="score"
                        stroke="#2e5bff"
                        fill="#2e5bff"
                        fillOpacity={0.6}
                      />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Application Decisions
                </Typography>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={decisionsPieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {decisionsPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Paper>
            </Grid>
            
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Model Performance Metrics
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Accuracy
                      </Typography>
                      <Typography variant="h4" color="primary.main">
                        91.3%
                      </Typography>
                      <Typography variant="body2" color="success.main">
                        ↑ 1.2% since last calibration
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Default Prediction
                      </Typography>
                      <Typography variant="h4" color="primary.main">
                        88.7%
                      </Typography>
                      <Typography variant="body2" color="success.main">
                        ↑ 2.5% since last calibration
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        OCR Accuracy
                      </Typography>
                      <Typography variant="h4" color="primary.main">
                        95.2%
                      </Typography>
                      <Typography variant="body2" color="success.main">
                        ↑ 0.8% since last calibration
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="subtitle1">
                    Last Model Retraining: 7 days ago
                  </Typography>
                  <Box>
                    <Button 
                      variant="outlined" 
                      startIcon={<AnalyticsIcon />}
                      sx={{ mr: 2 }}
                    >
                      View Model Details
                    </Button>
                    <Button 
                      variant="outlined" 
                      startIcon={<TuneIcon />}
                    >
                      Adjust Parameters
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Human-in-the-Loop Feedback
                </Typography>
                <Alert severity="info" sx={{ mb: 3 }}>
                  Human override decisions are automatically used to retrain and improve the model.
                </Alert>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Application</TableCell>
                        <TableCell>Original Score</TableCell>
                        <TableCell>Original Decision</TableCell>
                        <TableCell>Override Decision</TableCell>
                        <TableCell>Reason</TableCell>
                        <TableCell>Reviewer</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>2023-04-05</TableCell>
                        <TableCell>APP-4912</TableCell>
                        <TableCell>57</TableCell>
                        <TableCell>
                          <Chip size="small" label="Decline" color="error" />
                        </TableCell>
                        <TableCell>
                          <Chip size="small" label="Approve" color="success" />
                        </TableCell>
                        <TableCell>Recent market entry explains limited history</TableCell>
                        <TableCell>Emma Wilson</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>2023-04-01</TableCell>
                        <TableCell>APP-4903</TableCell>
                        <TableCell>82</TableCell>
                        <TableCell>
                          <Chip size="small" label="Approve" color="success" />
                        </TableCell>
                        <TableCell>
                          <Chip size="small" label="Decline" color="error" />
                        </TableCell>
                        <TableCell>Undisclosed pending litigation discovered</TableCell>
                        <TableCell>Marcus Johnson</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>2023-03-28</TableCell>
                        <TableCell>APP-4887</TableCell>
                        <TableCell>64</TableCell>
                        <TableCell>
                          <Chip size="small" label="In Review" color="info" />
                        </TableCell>
                        <TableCell>
                          <Chip size="small" label="Approve" color="success" />
                        </TableCell>
                        <TableCell>Strong collateral justifies approval</TableCell>
                        <TableCell>Emma Wilson</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
      
      {/* New Application Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          New Loan Application
        </DialogTitle>
        <DialogContent>
          <Stepper activeStep={activeStep} sx={{ py: 3 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {activeStep === 0 && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Upload Required Documents
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Please upload all required documents for OCR processing and automated analysis.
              </Typography>
              
              <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <DescriptionIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="subtitle2">
                      W-2 Form (Last 2 Years)
                    </Typography>
                  </Box>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    startIcon={<AttachFileIcon />}
                    onClick={handleUploadDoc}
                  >
                    {uploadingDoc ? (
                      <>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Uploading...
                      </>
                    ) : (
                      'Upload'
                    )}
                  </Button>
                </Box>
              </Paper>
              
              <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <DescriptionIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="subtitle2">
                      Bank Statements (Last 3 Months)
                    </Typography>
                  </Box>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    startIcon={<AttachFileIcon />}
                  >
                    Upload
                  </Button>
                </Box>
              </Paper>
              
              <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <DescriptionIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="subtitle2">
                      Government ID
                    </Typography>
                  </Box>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    startIcon={<AttachFileIcon />}
                  >
                    Upload
                  </Button>
                </Box>
              </Paper>
              
              <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <DescriptionIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="subtitle2">
                      Proof of Income
                    </Typography>
                  </Box>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    startIcon={<AttachFileIcon />}
                  >
                    Upload
                  </Button>
                </Box>
              </Paper>
            </Box>
          )}
          
          {activeStep === 1 && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                OCR & Data Extraction
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Our AI is extracting key information from your documents.
              </Typography>
              
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress size={60} />
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Processing Documents
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  This usually takes 1-3 minutes
                </Typography>
              </Box>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="W-2 Form" 
                    secondary="Successfully extracted income data: $76,500/year"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CircularProgress size={24} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Bank Statements" 
                    secondary="Analyzing transactions and cash flow..."
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Government ID" 
                    secondary="Successfully verified identity"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CircularProgress size={24} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Proof of Income" 
                    secondary="Verifying employment details..."
                  />
                </ListItem>
              </List>
            </Box>
          )}
          
          {activeStep === 2 && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Credit Scoring & Analysis
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Our ML model is analyzing all data points to generate a credit decision.
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Eligibility Score: Calculating...
                </Typography>
                <LinearProgress />
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      FICO Score
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: '50%',
                          bgcolor: '#4caf50',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          fontSize: '1.2rem',
                          mr: 2,
                        }}
                      >
                        722
                      </Box>
                      <Box>
                        <Typography variant="body2">
                          Good Credit Score
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Top 30% of applicants
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Debt-to-Income Ratio
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: '50%',
                          bgcolor: '#ff9800',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold',
                          fontSize: '1.2rem',
                          mr: 2,
                        }}
                      >
                        34%
                      </Box>
                      <Box>
                        <Typography variant="body2">
                          Moderate DTI
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Within acceptable range
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Analysis in Progress
                    </Typography>
                    <Typography variant="body2" paragraph>
                      Our ML model is analyzing additional factors:
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <CircularProgress size={20} />
                        </ListItemIcon>
                        <ListItemText primary="Bank statement transaction patterns" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CircularProgress size={20} />
                        </ListItemIcon>
                        <ListItemText primary="Employment verification" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CircularProgress size={20} />
                        </ListItemIcon>
                        <ListItemText primary="Credit utilization analysis" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CircularProgress size={20} />
                        </ListItemIcon>
                        <ListItemText primary="Payment history evaluation" />
                      </ListItem>
                    </List>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}
          
          {activeStep === 3 && (
            <Box>
              <Alert severity="success" sx={{ mb: 3 }}>
                <AlertTitle>Application Pre-Approved</AlertTitle>
                Based on our automated analysis, this application is eligible for a loan.
              </Alert>
              
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Final Eligibility Score: 78/100
                </Typography>
                <ScoreGauge score={78} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">0</Typography>
                  <Typography variant="body2" color="text.secondary">50</Typography>
                  <Typography variant="body2" color="text.secondary">100</Typography>
                </Box>
                
                <Typography variant="subtitle2" gutterBottom>
                  Approved Terms:
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">
                      Loan Amount
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      $25,000
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">
                      Interest Rate
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      5.75% APR
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2" color="text.secondary">
                      Term
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      60 months
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
              
              <Paper sx={{ p: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Key Factors for Decision
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FactorItem impact="positive">
                      <Box>
                        <Typography variant="subtitle2">
                          Strong Payment History
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          No late payments in past 24 months
                        </Typography>
                      </Box>
                    </FactorItem>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FactorItem impact="positive">
                      <Box>
                        <Typography variant="subtitle2">
                          Stable Income
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Continuous employment for 3+ years
                        </Typography>
                      </Box>
                    </FactorItem>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FactorItem impact="negative">
                      <Box>
                        <Typography variant="subtitle2">
                          Higher Debt-to-Income Ratio
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          DTI of 34% is above preferred 30% threshold
                        </Typography>
                      </Box>
                    </FactorItem>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FactorItem impact="neutral">
                      <Box>
                        <Typography variant="subtitle2">
                          Limited Credit History
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Credit history of 5 years
                        </Typography>
                      </Box>
                    </FactorItem>
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Final Steps:
                  </Typography>
                  <Typography variant="body2" paragraph>
                    This application has been pre-approved by our automated system. A human underwriter will review the final details before sending the official offer.
                  </Typography>
                </Box>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {activeStep > 0 && (
            <Button onClick={handleBack}>
              Back
            </Button>
          )}
          {activeStep < steps.length - 1 ? (
            <Button variant="contained" onClick={handleNext}>
              {activeStep === 0 ? 'Upload & Continue' : 'Continue'}
            </Button>
          ) : (
            <Button variant="contained" onClick={handleDialogClose}>
              Complete Application
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UnderwritingEngine;