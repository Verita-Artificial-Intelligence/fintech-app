import React, { useState } from 'react';
import {
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TextField,
  Button
} from '@mui/material';

interface FraudCase {
  id: number;
  alert: string;
  customer: string;
  severity: string;
  status: string;
  notes: string;
}

const initialCases: FraudCase[] = [
  {
    id: 1,
    alert: 'Card Fraud',
    customer: 'Michael Johnson',
    severity: 'High',
    status: 'Open',
    notes: 'Customer contacted; awaiting response.'
  },
  {
    id: 2,
    alert: 'Suspicious Login',
    customer: 'Sarah Williams',
    severity: 'Medium',
    status: 'In Progress',
    notes: ''
  },
  {
    id: 3,
    alert: 'Transaction Anomaly',
    customer: 'Tech Innovators LLC',
    severity: 'Medium',
    status: 'Resolved',
    notes: 'Funds reversed.'
  }
];

const CaseManagement: React.FC = () => {
  const [cases, setCases] = useState<FraudCase[]>(initialCases);

  const updateStatus = (id: number, status: string) => {
    setCases(prev => prev.map(c => (c.id === id ? { ...c, status } : c)));
  };

  const updateNotes = (id: number, notes: string) => {
    setCases(prev => prev.map(c => (c.id === id ? { ...c, notes } : c)));
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Fraud Case Management
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Track investigation status and add notes for each fraud alert.
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Alert</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Severity</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cases.map(c => (
              <TableRow key={c.id}>
                <TableCell>{c.alert}</TableCell>
                <TableCell>{c.customer}</TableCell>
                <TableCell>{c.severity}</TableCell>
                <TableCell>{c.status}</TableCell>
                <TableCell>
                  <TextField
                    value={c.notes}
                    onChange={e => updateNotes(c.id, e.target.value)}
                    variant="outlined"
                    size="small"
                    fullWidth
                  />
                </TableCell>
                <TableCell align="right">
                  {c.status !== 'Resolved' && (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => updateStatus(c.id, 'Resolved')}
                    >
                      Mark Resolved
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CaseManagement;
