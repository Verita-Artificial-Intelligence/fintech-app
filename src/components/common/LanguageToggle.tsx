import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ToggleButton, 
  ToggleButtonGroup,
  Typography,
  Box
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: theme.shape.borderRadius,
  '& .MuiToggleButtonGroup-grouped': {
    margin: theme.spacing(0.5),
    border: 0,
    borderRadius: theme.shape.borderRadius,
    '&.Mui-selected': {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.secondary.contrastText,
      '&:hover': {
        backgroundColor: theme.palette.secondary.dark,
      },
    },
    '&:not(:first-of-type)': {
      borderRadius: theme.shape.borderRadius,
      marginLeft: 0,
    },
    '&:first-of-type': {
      borderRadius: theme.shape.borderRadius,
    },
  },
}));

const LanguageToggle: React.FC = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (
    event: React.MouseEvent<HTMLElement>,
    newLanguage: string | null
  ) => {
    if (newLanguage !== null) {
      i18n.changeLanguage(newLanguage);
      // Store preference in localStorage
      localStorage.setItem('rbb-language', newLanguage);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <StyledToggleButtonGroup
        value={i18n.language}
        exclusive
        onChange={handleLanguageChange}
        size="small"
        aria-label="language selection"
      >
        <ToggleButton value="en" aria-label="English">
          <Typography variant="button" sx={{ fontWeight: 600 }}>
            EN
          </Typography>
        </ToggleButton>
        <ToggleButton value="zh" aria-label="Chinese">
          <Typography variant="button" sx={{ fontWeight: 600 }}>
            中文
          </Typography>
        </ToggleButton>
      </StyledToggleButtonGroup>
    </Box>
  );
};

export default LanguageToggle; 