import React, { useState } from 'react';
import { Box, Paper, Typography, IconButton } from '@mui/material';
import { LocationOn, LocationSearching, AccessTime, Directions } from '@mui/icons-material';

const MapDisplay = ({ preferences }) => {
  const [navigationInfo] = useState({
    currentLocation: "Monaco Grand Boulevard",
    destination: "Nice Côte d'Azur Airport",
    distance: "25.4 km",
    timeToDestination: "32 min",
    eta: "14:45"
  });

  return (
    <Paper
      sx={{
        height: 380,
        position: 'relative',
        overflow: 'hidden',
        background: 'rgba(20,20,20,0.6)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        border: '1px solid rgba(255,255,255,0.05)',
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

      {/* Current Location Marker */}
      <Box
        sx={{
          position: 'absolute',
          top: '40%',
          left: '30%',
          transform: 'translate(-50%, -50%)',
          color: preferences.accentColor || '#00e5ff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 2,
        }}
      >
        <LocationOn sx={{ 
          fontSize: 40,
          filter: `drop-shadow(0 0 8px ${preferences.accentColor || '#00e5ff'}80)`
        }} />
        <Typography 
          variant="caption" 
          sx={{ 
            mt: 1, 
            color: 'white',
            background: 'rgba(0,0,0,0.6)',
            px: 1,
            py: 0.5,
            borderRadius: '4px',
            backdropFilter: 'blur(4px)'
          }}
        >
          Current
        </Typography>
      </Box>

      {/* Destination Marker */}
      <Box
        sx={{
          position: 'absolute',
          top: '60%',
          left: '70%',
          transform: 'translate(-50%, -50%)',
          color: '#ff8a65',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 2,
        }}
      >
        <LocationSearching sx={{ 
          fontSize: 40,
          filter: 'drop-shadow(0 0 8px #ff8a6580)'
        }} />
        <Typography 
          variant="caption" 
          sx={{ 
            mt: 1, 
            color: 'white',
            background: 'rgba(0,0,0,0.6)',
            px: 1,
            py: 0.5,
            borderRadius: '4px',
            backdropFilter: 'blur(4px)'
          }}
        >
          Destination
        </Typography>
      </Box>

      {/* Navigation Line */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '30%',
          width: '40%',
          height: '2px',
          background: `linear-gradient(90deg, 
            ${preferences.accentColor || '#00e5ff'}, 
            #ff8a65)`,
          transform: 'translate(0%, -50%)',
          opacity: 0.7,
          '&::after': {
            content: '""',
            position: 'absolute',
            right: 0,
            top: '-4px',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: '#ff8a65',
            boxShadow: '0 0 8px #ff8a6580',
          },
        }}
      />

      {/* Navigation Info Panel */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          right: 16,
          background: 'rgba(15,15,15,0.8)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          p: 2,
          border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            {navigationInfo.currentLocation}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
            → {navigationInfo.destination}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Directions sx={{ color: preferences.accentColor || '#00e5ff', fontSize: 20 }} />
            <Typography variant="body2" sx={{ color: 'white' }}>
              {navigationInfo.distance}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <AccessTime sx={{ color: preferences.accentColor || '#00e5ff', fontSize: 20 }} />
            <Typography variant="body2" sx={{ color: 'white' }}>
              {navigationInfo.timeToDestination}
            </Typography>
          </Box>
          
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'white',
              background: 'rgba(255,255,255,0.1)',
              px: 1.5,
              py: 0.5,
              borderRadius: '4px'
            }}
          >
            ETA: {navigationInfo.eta}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default MapDisplay; 