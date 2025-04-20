import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { LocationOn } from '@mui/icons-material';

const MapDisplay = ({ preferences }) => {
  return (
    <Paper
      sx={{
        height: 200,
        position: 'relative',
        overflow: 'hidden',
        background: preferences.theme === 'dark' ? '#1a1a1a' : '#f5f5f5',
        borderRadius: preferences.borderRadius === 'large' ? '16px' : '8px',
      }}
    >
      {/* Mock Map Display */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(45deg, 
            ${preferences.theme === 'dark' ? '#1a1a1a' : '#e0e0e0'} 25%, 
            ${preferences.theme === 'dark' ? '#2c2c2c' : '#f5f5f5'} 25%)`,
          backgroundSize: '10px 10px',
          opacity: 0.1,
        }}
      />

      {/* Center Marker */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: preferences.accentColor || '#00ff00',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <LocationOn sx={{ fontSize: 40 }} />
        <Typography variant="caption" sx={{ mt: 1, color: 'text.secondary' }}>
          Current Location
        </Typography>
      </Box>

      {/* Navigation Line */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100px',
          height: '2px',
          background: preferences.accentColor || '#00ff00',
          transform: 'translate(0%, -50%)',
          opacity: 0.5,
          '&::after': {
            content: '""',
            position: 'absolute',
            right: 0,
            top: '-4px',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: preferences.accentColor || '#00ff00',
          },
        }}
      />
    </Paper>
  );
};

export default MapDisplay; 