import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    gradient: {
      primary: string;
      secondary: string;
    };
  }
  interface PaletteOptions {
    gradient?: {
      primary?: string;
      secondary?: string;
    };
  }
}

export const rbbTheme = createTheme({
  palette: {
    primary: {
      main: '#0054A4', // RBB Primary Blue
      light: '#3574C4',
      dark: '#003973',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#F4A000', // RBB Secondary Gold
      light: '#F6B333',
      dark: '#C78000',
      contrastText: '#000000',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#666666',
    },
    error: {
      main: '#DC2626',
      light: '#EF4444',
      dark: '#B91C1C',
    },
    warning: {
      main: '#F59E0B',
      light: '#FBBF24',
      dark: '#D97706',
    },
    success: {
      main: '#059669',
      light: '#10B981',
      dark: '#047857',
    },
    info: {
      main: '#0054A4',
      light: '#3574C4',
      dark: '#003973',
    },
    gradient: {
      primary: 'linear-gradient(135deg, #0054A4 0%, #3574C4 100%)',
      secondary: 'linear-gradient(135deg, #F4A000 0%, #F6B333 100%)',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
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
          borderRadius: 8,
          padding: '10px 24px',
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #0054A4 0%, #3574C4 100%)',
          boxShadow: '0px 4px 15px rgba(0, 84, 164, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #003973 0%, #0054A4 100%)',
            boxShadow: '0px 6px 20px rgba(0, 84, 164, 0.4)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #F4A000 0%, #F6B333 100%)',
          color: '#000000',
          '&:hover': {
            background: 'linear-gradient(135deg, #C78000 0%, #F4A000 100%)',
          },
        },
        outlinedPrimary: {
          borderColor: '#0054A4',
          color: '#0054A4',
          '&:hover': {
            backgroundColor: 'rgba(0, 84, 164, 0.04)',
            borderColor: '#003973',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
          borderRadius: 12,
          border: '1px solid rgba(0, 0, 0, 0.05)',
          '&:hover': {
            boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #0054A4 0%, #3574C4 100%)',
          boxShadow: '0px 4px 20px rgba(0, 84, 164, 0.2)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
        colorPrimary: {
          backgroundColor: '#0054A4',
          color: '#ffffff',
        },
        colorSecondary: {
          backgroundColor: '#F4A000',
          color: '#000000',
        },
      },
    },
  },
});

export default rbbTheme; 