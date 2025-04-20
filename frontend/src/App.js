import React, { useState, useEffect, createContext } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Dashboard from './components/Dashboard';
import PromptInput from './components/PromptInput';
import axios from 'axios';
import { Speed as SpeedIcon, Settings as SettingsIcon, Dashboard as DashboardIcon } from '@mui/icons-material';

export const ThemeContext = createContext();

// Default preferences structure
const defaultPreferences = {
  theme: 'light',
  fontSize: 'medium',
  layout: 'standard',
  colorScheme: 'default',
  accessibility: {
    highContrast: false,
    reducedMotion: false
  },
  accentColor: '#1976d2',
  backgroundColor: '#ffffff',
  fontFamily: 'modern',
  borderRadius: 'medium',
  shadow: 'subtle',
  backgroundImage: null,
  iconStyle: 'material',
  iconColor: '#1976d2',
  animationStyle: 'subtle'
};

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5000'
});

function App() {
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);

  const theme = createTheme({
    palette: {
      mode: preferences.theme === 'dark' ? 'dark' : 'light',
      primary: {
        main: preferences.accentColor || (preferences.theme === 'dark' ? '#90caf9' : '#1976d2'),
      },
      background: {
        default: preferences.backgroundColor || (preferences.theme === 'dark' ? '#121212' : '#f5f5f5'),
        paper: preferences.theme === 'dark' ? '#1e1e1e' : '#ffffff',
      },
    },
    typography: {
      fontSize: preferences.fontSize === 'large' ? 16 : 
               preferences.fontSize === 'small' ? 12 : 
               preferences.fontSize === 'extraLarge' ? 20 : 14,
      fontFamily: preferences.fontFamily === 'modern' ? '"Roboto", "Helvetica", "Arial", sans-serif' :
                 preferences.fontFamily === 'elegant' ? '"Playfair Display", serif' :
                 preferences.fontFamily === 'playful' ? '"Comic Sans MS", cursive' :
                 preferences.fontFamily === 'tech' ? '"Courier New", monospace' :
                 preferences.fontFamily === 'italic' ? '"Roboto", "Helvetica", "Arial", sans-serif' :
                 preferences.fontFamily === 'bold' ? '"Roboto", "Helvetica", "Arial", sans-serif' :
                 '"Roboto", "Helvetica", "Arial", sans-serif',
      fontStyle: preferences.fontFamily === 'italic' ? 'italic' : 'normal',
      fontWeight: preferences.fontFamily === 'bold' ? 700 : 400,
    },
    shape: {
      borderRadius: preferences.borderRadius === 'small' ? 4 :
                   preferences.borderRadius === 'large' ? 16 :
                   preferences.borderRadius === 'none' ? 0 : 8,
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow: preferences.shadow === 'none' ? 'none' :
                      preferences.shadow === 'subtle' ? '0 2px 4px rgba(0,0,0,0.1)' :
                      preferences.shadow === 'strong' ? '0 4px 8px rgba(0,0,0,0.2)' :
                      '0 2px 4px rgba(0,0,0,0.1)',
            backgroundImage: preferences.backgroundImage ? `url(${preferences.backgroundImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            transition: preferences.animationStyle === 'dynamic' ? 'all 0.3s ease-in-out' : 'none',
            '&:hover': {
              transform: preferences.animationStyle === 'dynamic' ? 'scale(1.05)' : 'none',
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: preferences.iconColor,
            transition: preferences.animationStyle === 'dynamic' ? 'all 0.3s ease-in-out' : 'none',
            '&:hover': {
              transform: preferences.animationStyle === 'dynamic' ? 'scale(1.1)' : 'none',
            },
          },
        },
      },
    },
  });

  const handlePromptSubmit = async (prompt) => {
    try {
      console.log('Submitting prompt:', prompt);
      const response = await api.post('/api/interpret-prompt', {
        prompt,
        userId: 'user123'
      });
      console.log('Received response:', response.data);
      
      // Ensure the response has the complete preferences structure
      const updatedPreferences = {
        ...defaultPreferences,
        ...response.data,
        accessibility: {
          ...defaultPreferences.accessibility,
          ...(response.data.accessibility || {})
        }
      };
      console.log('Updated preferences:', updatedPreferences);
      setPreferences(updatedPreferences);
    } catch (error) {
      console.error('Error processing prompt:', error);
    }
  };

  useEffect(() => {
    // Load saved preferences
    const loadPreferences = async () => {
      try {
        const response = await api.get('/api/preferences/user123');
        console.log('Loaded preferences:', response.data);
        if (response.data) {
          // Ensure the loaded preferences have the complete structure
          const loadedPreferences = {
            ...defaultPreferences,
            ...response.data,
            accessibility: {
              ...defaultPreferences.accessibility,
              ...(response.data.accessibility || {})
            }
          };
          console.log('Processed loaded preferences:', loadedPreferences);
          setPreferences(loadedPreferences);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading preferences:', error);
        setIsLoading(false);
      }
    };
    loadPreferences();
  }, []);

  // Debug effect to log preference changes
  useEffect(() => {
    console.log('Current preferences:', preferences);
  }, [preferences]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeContext.Provider value={{ preferences, setPreferences }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100vh',
          bgcolor: 'background.default'
        }}>
          <PromptInput onSubmit={handlePromptSubmit} />
          <Dashboard preferences={preferences} />
        </Box>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default App; 