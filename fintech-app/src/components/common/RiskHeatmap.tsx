import React, { useMemo, useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Chip,
  Grid,
  Card,
  CardContent,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Transaction, Customer } from '../../utils/mockDataGenerator';
import { fdicClient, BankBranch, BranchMetrics, calculateBranchHeat } from '../../api/providers/fdic';

interface RiskHeatmapProps {
  transactions: Transaction[];
  customers: Customer[];
}

const HeatmapContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(40px, 1fr))',
  gap: 2,
  padding: theme.spacing(2),
  minHeight: 400,
  maxWidth: '100%',
  aspectRatio: '2/1'
}));

const HeatmapCell = styled(Box)<{ risk: number; isSelected: boolean }>(({ theme, risk, isSelected }) => ({
  aspectRatio: '1',
  borderRadius: 4,
  cursor: 'pointer',
  position: 'relative',
  transition: 'all 0.2s ease',
  border: isSelected ? `2px solid ${theme.palette.primary.main}` : '1px solid transparent',
  backgroundColor: risk > 80 ? '#d32f2f' :
                   risk > 60 ? '#f57c00' :
                   risk > 40 ? '#ffa726' :
                   risk > 20 ? '#4caf50' : '#2e7d32',
  opacity: risk / 100,
  '&:hover': {
    transform: 'scale(1.1)',
    zIndex: 10,
    boxShadow: theme.shadows[4]
  }
}));

const GeographicRiskMap = styled(Box)(({ theme }) => ({
  height: 300,
  background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
  borderRadius: 8,
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));

const RiskIndicator = styled(Box)<{ size: number; risk: number }>(({ size, risk }) => ({
  position: 'absolute',
  width: size,
  height: size,
  borderRadius: '50%',
  backgroundColor: risk > 70 ? '#f44336' : risk > 40 ? '#ff9800' : '#4caf50',
  opacity: 0.7,
  animation: 'pulse 2s infinite',
  '@keyframes pulse': {
    '0%': { transform: 'scale(1)', opacity: 0.7 },
    '50%': { transform: 'scale(1.2)', opacity: 0.3 },
    '100%': { transform: 'scale(1)', opacity: 0.7 }
  }
}));

type ViewMode = 'temporal' | 'geographic' | 'customer' | 'transaction';

const RiskHeatmap: React.FC<RiskHeatmapProps> = ({ transactions, customers }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('temporal');
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [branches, setBranches] = useState<BankBranch[]>([]);
  const [branchMetrics, setBranchMetrics] = useState<Map<string, BranchMetrics>>(new Map());
  const [loading, setLoading] = useState(false);
  
  // Load RBB branch data when geographic view is selected
  useEffect(() => {
    if (viewMode === 'geographic') {
      setLoading(true);
      fdicClient.getRBBBranches().then(async (branchData) => {
        setBranches(branchData);
        
        // Load metrics for each branch
        const metricsMap = new Map<string, BranchMetrics>();
        for (const branch of branchData) {
          const metrics = await fdicClient.getBranchMetrics(branch.id);
          metricsMap.set(branch.id, metrics);
        }
        setBranchMetrics(metricsMap);
        setLoading(false);
      }).catch(err => {
        console.error('Failed to load branch data:', err);
        setLoading(false);
      });
    }
  }, [viewMode]);

  // Generate risk data based on view mode
  const riskData = useMemo(() => {
    console.log('🔍 RiskHeatmap Data Check:', { 
      viewMode, 
      transactionCount: transactions.length, 
      customerCount: customers.length,
      sampleTransaction: transactions[0],
      sampleCustomer: customers[0]
    });
    
    // Always ensure we have some data to display
    if (!transactions.length || !customers.length) {
      console.log('⚠️ Limited data available, using enhanced placeholder');
      // Generate richer placeholder data with realistic patterns
      return Array.from({ length: 60 }, (_, i) => ({
        index: i,
        risk: Math.random() * 80 + 10, // Risk 10-90
        count: Math.floor(Math.random() * 15) + 1,
        label: viewMode === 'temporal' ? `${Math.floor(i/2).toString().padStart(2, '0')}:${(i%2)*30}` :
               viewMode === 'customer' ? `Customer ${i + 1}` :
               viewMode === 'transaction' ? `Transaction ${i + 1}` :
               `Cell ${i + 1}`,
        details: []
      }));
    }

    switch (viewMode) {
      case 'temporal':
        // 24-hour view with enhanced data
        const temporalData = Array.from({ length: 24 }, (_, hour) => {
          const hourTransactions = transactions.filter(t => 
            new Date(t.timestamp).getHours() === hour
          );
          
          const avgRisk = hourTransactions.length > 0 
            ? hourTransactions.reduce((sum, t) => sum + t.riskScore, 0) / hourTransactions.length
            : Math.random() * 40 + 10; // Base risk 10-50 for empty hours
          
          return {
            index: hour,
            risk: Math.min(100, avgRisk),
            count: hourTransactions.length,
            label: `${hour.toString().padStart(2, '0')}:00`,
            details: hourTransactions.slice(0, 3)
          };
        });
        console.log('📊 Temporal data generated:', temporalData.length, 'cells');
        return temporalData;

      case 'customer':
        // Grid of customers (first 60 for better display)
        const customerData = customers.slice(0, 60).map((customer, index) => {
          const customerTransactions = transactions.filter(t => t.customerId === customer.id);
          let baseRisk = customer.riskProfile === 'High' ? 70 : 
                        customer.riskProfile === 'Medium' ? 40 : 20;
          
          const avgRisk = customerTransactions.length > 0
            ? customerTransactions.reduce((sum, t) => sum + t.riskScore, 0) / customerTransactions.length
            : baseRisk + Math.random() * 20;
          
          return {
            index,
            risk: Math.min(100, avgRisk),
            count: customerTransactions.length,
            label: customer.name.length > 20 ? customer.name.substring(0, 20) + '...' : customer.name,
            details: customerTransactions.slice(0, 3)
          };
        });
        console.log('👥 Customer data generated:', customerData.length, 'cells');
        return customerData;

      case 'transaction':
        // Transaction type grid (create more cells by breaking down by amount ranges)
        const transactionTypes = ['Deposit', 'Withdrawal', 'Transfer', 'Wire', 'ACH', 'Check'];
        const amountRanges = ['$0-1K', '$1K-10K', '$10K-100K', '$100K-1M', '$1M+'];
        const transactionData: Array<{
          index: number;
          risk: number;
          count: number;
          label: string;
          details: any[];
        }> = [];
        
        transactionTypes.forEach(type => {
          amountRanges.forEach(range => {
            const [min, max] = range === '$0-1K' ? [0, 1000] :
                              range === '$1K-10K' ? [1000, 10000] :
                              range === '$10K-100K' ? [10000, 100000] :
                              range === '$100K-1M' ? [100000, 1000000] :
                              [1000000, Infinity];
            
            const typeTransactions = transactions.filter(t => 
              t.type === type && t.amount >= min && t.amount < max
            );
            
            const avgRisk = typeTransactions.length > 0
              ? typeTransactions.reduce((sum, t) => sum + t.riskScore, 0) / typeTransactions.length
              : Math.random() * 50;
            
            transactionData.push({
              index: transactionData.length,
              risk: avgRisk,
              count: typeTransactions.length,
              label: `${type} ${range}`,
              details: typeTransactions.slice(0, 3)
            });
          });
        });
        console.log('💳 Transaction data generated:', transactionData.length, 'cells');
        return transactionData;

      default:
        return [];
    }
  }, [viewMode, transactions, customers]);

  const selectedData = selectedCell !== null ? riskData[selectedCell] : null;

  // Generate geographic risk indicators
  const geographicRisks = useMemo(() => {
    const countries = transactions.reduce((acc, t) => {
      const country = t.geolocation.country;
      if (!acc[country]) {
        acc[country] = { transactions: [], totalRisk: 0 };
      }
      acc[country].transactions.push(t);
      acc[country].totalRisk += t.riskScore;
      return acc;
    }, {} as Record<string, { transactions: Transaction[]; totalRisk: number }>);

    return Object.entries(countries).map(([country, data], index) => ({
      country,
      avgRisk: data.totalRisk / data.transactions.length,
      count: data.transactions.length,
      left: Math.random() * 80 + 10, // Random positioning for demo
      top: Math.random() * 60 + 20,
      size: Math.min(Math.max(data.transactions.length / 5, 8), 40)
    }));
  }, [transactions]);

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h6">Risk Analysis Heatmap</Typography>
          <Typography variant="caption" color="text.secondary">
            📊 {riskData.length} cells • {transactions.length} transactions • {customers.length} customers
          </Typography>
        </Box>
        
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, value) => value && setViewMode(value)}
          size="small"
        >
          <ToggleButton value="temporal">Temporal</ToggleButton>
          <ToggleButton value="geographic">Geographic</ToggleButton>
          <ToggleButton value="customer">Customer</ToggleButton>
          <ToggleButton value="transaction">Transaction</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {viewMode === 'geographic' ? (
            <GeographicRiskMap>
              <Typography 
                variant="h6" 
                sx={{ 
                  position: 'absolute', 
                  top: 16, 
                  left: 16, 
                  color: 'text.secondary' 
                }}
              >
                RBB Branch Risk Distribution
              </Typography>
              
              {loading ? (
                <CircularProgress />
              ) : (
                <>
                  {/* Branch locations */}
                  {branches.map((branch) => {
                    const metrics = branchMetrics.get(branch.id);
                    if (!metrics) return null;
                    
                    const heat = calculateBranchHeat(metrics);
                    // Map real lat/long to percentage positions (simplified for demo)
                    const left = ((branch.longitude + 130) / 60) * 100; // Rough US mapping
                    const top = ((50 - branch.latitude) / 30) * 100;
                    
                    return (
                      <Tooltip 
                        key={branch.id}
                        title={
                          <Box>
                            <Typography variant="caption" display="block" fontWeight="bold">
                              {branch.branchName}
                            </Typography>
                            <Typography variant="caption" display="block">
                              {branch.city}, {branch.state}
                            </Typography>
                            <Typography variant="caption" display="block">
                              Risk Level: {metrics.riskLevel}
                            </Typography>
                            <Typography variant="caption" display="block">
                              Compliance Score: {metrics.complianceScore}
                            </Typography>
                            <Typography variant="caption" display="block">
                              Fraud Incidents: {metrics.fraudIncidents}
                            </Typography>
                          </Box>
                        }
                        arrow
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            left: `${Math.max(5, Math.min(95, left))}%`,
                            top: `${Math.max(5, Math.min(95, top))}%`,
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            backgroundColor: heat > 70 ? '#f44336' : heat > 40 ? '#ff9800' : '#4caf50',
                            border: '2px solid white',
                            boxShadow: 2,
                            cursor: 'pointer',
                            zIndex: 2,
                            '&:hover': {
                              transform: 'scale(1.5)',
                              zIndex: 10
                            }
                          }}
                        />
                      </Tooltip>
                    );
                  })}
                  
                  {/* Transaction risk indicators */}
                  {geographicRisks.slice(0, 10).map((risk, index) => (
                    <Tooltip 
                      key={`tx-${index}`}
                      title={`${risk.country}: ${risk.count} transactions, ${risk.avgRisk.toFixed(1)} avg risk`}
                      arrow
                    >
                      <RiskIndicator
                        size={risk.size}
                        risk={risk.avgRisk}
                        sx={{
                          left: `${risk.left}%`,
                          top: `${risk.top}%`,
                          opacity: 0.5
                        }}
                      />
                    </Tooltip>
                  ))}
                </>
              )}
            </GeographicRiskMap>
          ) : (
            <HeatmapContainer>
              {riskData.map((data, index) => (
                <Tooltip 
                  key={index}
                  title={`${data.label}: ${data.risk.toFixed(1)} risk score, ${data.count} items`}
                  arrow
                >
                  <HeatmapCell
                    risk={data.risk}
                    isSelected={selectedCell === index}
                    onClick={() => setSelectedCell(selectedCell === index ? null : index)}
                  />
                </Tooltip>
              ))}
            </HeatmapContainer>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Risk Legend
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              {[
                { range: '80-100', color: '#d32f2f', label: 'Critical Risk' },
                { range: '60-79', color: '#f57c00', label: 'High Risk' },
                { range: '40-59', color: '#ffa726', label: 'Medium Risk' },
                { range: '20-39', color: '#4caf50', label: 'Low Risk' },
                { range: '0-19', color: '#2e7d32', label: 'Minimal Risk' }
              ].map((item) => (
                <Box key={item.range} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box 
                    sx={{ 
                      width: 16, 
                      height: 16, 
                      backgroundColor: item.color, 
                      borderRadius: 1, 
                      mr: 1 
                    }} 
                  />
                  <Typography variant="body2">
                    {item.label} ({item.range})
                  </Typography>
                </Box>
              ))}
            </Box>

            {selectedData && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Selected: {selectedData.label}
                  </Typography>
                  
                  <Box sx={{ mb: 2 }}>
                    <Chip 
                      label={`Risk: ${selectedData.risk.toFixed(1)}`} 
                      color={selectedData.risk > 60 ? 'error' : selectedData.risk > 40 ? 'warning' : 'success'}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                    <Chip 
                      label={`Count: ${selectedData.count}`} 
                      variant="outlined"
                      size="small"
                    />
                  </Box>

                  {selectedData.details && selectedData.details.length > 0 && (
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Recent Items:
                      </Typography>
                      {selectedData.details.map((detail: any, index: number) => (
                        <Typography key={index} variant="caption" display="block" color="text.secondary">
                          {detail.id || detail.name} - ${detail.amount?.toLocaleString() || 'N/A'}
                        </Typography>
                      ))}
                    </Box>
                  )}
                </CardContent>
              </Card>
            )}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default RiskHeatmap; 