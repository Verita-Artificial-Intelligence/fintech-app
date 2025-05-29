import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
} from '@mui/material';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

interface Case {
  id: number;
  type: string;
  severity: string;
  description: string;
  customer: string;
  status: string;
  notes: string;
}

const initialCases: Case[] = [
  {
    id: 1,
    type: 'Card Fraud',
    severity: 'High',
    description: 'Multiple declined transactions followed by successful small charges',
    customer: 'Michael Johnson',
    status: 'New',
    notes: '',
  },
  {
    id: 2,
    type: 'Suspicious Login',
    severity: 'Medium',
    description: 'Login attempt from unrecognized device and unusual location (Sofia, Bulgaria)',
    customer: 'Sarah Williams',
    status: 'New',
    notes: '',
  },
  {
    id: 3,
    type: 'Transaction Anomaly',
    severity: 'Medium',
    description: 'Unusual transaction pattern detected: 3 large transfers in 24h period',
    customer: 'Tech Innovators LLC',
    status: 'In Progress',
    notes: '',
  },
  {
    id: 4,
    type: 'Possible ATO',
    severity: 'High',
    description: 'Account password reset followed by immediate funds transfer attempt',
    customer: 'Robert Chen',
    status: 'In Progress',
    notes: '',
  },
  {
    id: 5,
    type: 'Velocity Alert',
    severity: 'Low',
    description: 'Multiple small transactions at same merchant within 1 hour',
    customer: 'Emily Parker',
    status: 'Resolved',
    notes: 'Customer confirmed transactions',
  },
];

const CaseManagement: React.FC = () => {
  const [cases, setCases] = useState<Case[]>(initialCases);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [open, setOpen] = useState(false);

  const handleOpen = (c: Case) => {
    setSelectedCase({ ...c });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    if (selectedCase) {
      setCases(prev => prev.map(c => (c.id === selectedCase.id ? selectedCase : c)));
    }
    setOpen(false);
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Fraud Case Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track fraud alerts as cases with status updates and notes.
        </Typography>
      </Box>

      <Paper>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Severity</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cases.map((c) => (
              <TableRow key={c.id} hover>
                <TableCell>{c.id}</TableCell>
                <TableCell>{c.type}</TableCell>
                <TableCell>{c.severity}</TableCell>
                <TableCell>{c.customer}</TableCell>
                <TableCell>{c.status}</TableCell>
                <TableCell align="right">
                  <Button size="small" onClick={() => handleOpen(c)}>
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Case Details</DialogTitle>
        <DialogContent>
          {selectedCase && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                {selectedCase.type} - {selectedCase.severity}
              </Typography>
              <Typography variant="body2" paragraph>
                {selectedCase.description}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Customer: {selectedCase.customer}
              </Typography>
              <Box sx={{ my: 2 }}>
                <Select
                  fullWidth
                  value={selectedCase.status}
                  onChange={(e) =>
                    setSelectedCase({
                      ...selectedCase,
                      status: e.target.value as string,
                    })
                  }
                >
                  <MenuItem value="New">New</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Resolved">Resolved</MenuItem>
                </Select>
              </Box>
              <TextField
                label="Notes"
                multiline
                rows={3}
                fullWidth
                value={selectedCase.notes}
                onChange={(e) =>
                  setSelectedCase({ ...selectedCase, notes: e.target.value })
                }
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" startIcon={<AssignmentTurnedInIcon />} onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CaseManagement;
