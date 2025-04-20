import React, { useState, useEffect, createContext } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Dashboard from './components/Dashboard';
import PromptInput from './components/PromptInput';
import WelcomeScreen from './components/WelcomeScreen';
import axios from 'axios';
import { Speed as SpeedIcon, Settings as SettingsIcon, Dashboard as DashboardIcon } from '@mui/icons-material';
import { CircularProgress, Typography } from '@mui/material';

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
  const [showDashboard, setShowDashboard] = useState(false);
  const [userPreferences, setUserPreferences] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#00e5ff',
      },
      secondary: {
        main: '#ff8a65',
      },
    },
    typography: {
      fontSize: userPreferences.fontSize === 'large' ? 16 : 
               userPreferences.fontSize === 'small' ? 12 : 
               userPreferences.fontSize === 'extraLarge' ? 20 : 14,
      fontFamily: userPreferences.fontFamily === 'modern' ? '"Roboto", "Helvetica", "Arial", sans-serif' :
                 userPreferences.fontFamily === 'elegant' ? '"Playfair Display", serif' :
                 userPreferences.fontFamily === 'playful' ? '"Comic Sans MS", cursive' :
                 userPreferences.fontFamily === 'tech' ? '"Courier New", monospace' :
                 userPreferences.fontFamily === 'italic' ? '"Roboto", "Helvetica", "Arial", sans-serif' :
                 userPreferences.fontFamily === 'bold' ? '"Roboto", "Helvetica", "Arial", sans-serif' :
                 '"Roboto", "Helvetica", "Arial", sans-serif',
      fontStyle: userPreferences.fontFamily === 'italic' ? 'italic' : 'normal',
      fontWeight: userPreferences.fontFamily === 'bold' ? 700 : 400,
    },
    shape: {
      borderRadius: userPreferences.borderRadius === 'small' ? 4 :
                   userPreferences.borderRadius === 'large' ? 16 :
                   userPreferences.borderRadius === 'none' ? 0 : 8,
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow: userPreferences.shadow === 'none' ? 'none' :
                      userPreferences.shadow === 'subtle' ? '0 2px 4px rgba(0,0,0,0.1)' :
                      userPreferences.shadow === 'strong' ? '0 4px 8px rgba(0,0,0,0.2)' :
                      '0 2px 4px rgba(0,0,0,0.1)',
            backgroundImage: userPreferences.backgroundImage ? `url(${userPreferences.backgroundImage})` : 'none',
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
            transition: userPreferences.animationStyle === 'dynamic' ? 'all 0.3s ease-in-out' : 'none',
            '&:hover': {
              transform: userPreferences.animationStyle === 'dynamic' ? 'scale(1.05)' : 'none',
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: userPreferences.iconColor,
            transition: userPreferences.animationStyle === 'dynamic' ? 'all 0.3s ease-in-out' : 'none',
            '&:hover': {
              transform: userPreferences.animationStyle === 'dynamic' ? 'scale(1.1)' : 'none',
            },
          },
        },
      },
    },
  });

  const handleWelcomeComplete = (voiceCommand) => {
    // Process voice command and set preferences
    const preferences = {
      theme: voiceCommand.toLowerCase().includes('night') ? 'dark' : 'light',
      accentColor: '#00e5ff',
      // Add more preference processing based on voice command
    };
    setUserPreferences(preferences);
    setShowDashboard(true);
  };

  const handlePromptSubmit = async (prompt) => {
    try {
      setIsUpdating(true);
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
      setUserPreferences(updatedPreferences);
    } catch (error) {
      console.error('Error processing prompt:', error);
    } finally {
      setIsUpdating(false);
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
          setUserPreferences(loadedPreferences);
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
    console.log('Current preferences:', userPreferences);
  }, [userPreferences]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: 'linear-gradient(135deg, #111111 0%, #0a0a0a 100%)',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 100,
            height: 100,
          }}
        >
          <CircularProgress
            size={100}
            thickness={4}
            sx={{
              color: 'primary.main',
              position: 'absolute',
              animation: 'spin 1.5s linear infinite',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' },
              },
            }}
          />
          <CircularProgress
            size={100}
            thickness={4}
            variant="determinate"
            value={75}
            sx={{
              color: 'primary.light',
              opacity: 0.3,
              position: 'absolute',
            }}
          />
        </Box>
      </Box>
    );
  }

  return (
    <ThemeContext.Provider value={{ preferences: userPreferences, setPreferences: setUserPreferences }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          minHeight: '100vh',
          bgcolor: 'background.default',
          position: 'relative',
        }}>
          {!showDashboard ? (
            <WelcomeScreen onStart={handleWelcomeComplete} />
          ) : (
            <>
              <PromptInput onSubmit={handlePromptSubmit} isUpdating={isUpdating} />
              <Dashboard preferences={userPreferences} />
              {isUpdating && (
                <Box
                  sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: 'rgba(0, 0, 0, 0.7)',
                    zIndex: 1300,
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 120,
                      height: 120,
                    }}
                  >
                    <CircularProgress
                      size={120}
                      thickness={4}
                      sx={{
                        color: 'primary.main',
                        position: 'absolute',
                        animation: 'spin 1.5s linear infinite',
                        '@keyframes spin': {
                          '0%': { transform: 'rotate(0deg)' },
                          '100%': { transform: 'rotate(360deg)' },
                        },
                      }}
                    />
                    <CircularProgress
                      size={120}
                      thickness={4}
                      variant="determinate"
                      value={75}
                      sx={{
                        color: 'primary.light',
                        opacity: 0.3,
                        position: 'absolute',
                      }}
                    />
                    <Typography
                      variant="h6"
                      sx={{
                        position: 'absolute',
                        color: 'white',
                        textAlign: 'center',
                        mt: 15,
                        fontWeight: 300,
                      }}
                    >
                      Updating Dashboard...
                    </Typography>
                  </Box>
                </Box>
              )}
            </>
          )}
        </Box>
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}

export default App; 