import React, { useState } from 'react';
import { IconButton, Box, CircularProgress } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';

const PromptInput = ({ onSubmit, isUpdating }) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleVoiceInput = () => {
    if (!isListening && !isUpdating) {
      setIsProcessing(true);
      // Start voice recognition
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = 'en-US';
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setIsProcessing(false);
        onSubmit(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
        setIsProcessing(false);
      };

      recognition.start();
      setIsListening(true);
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}
    >
      {(isProcessing || isUpdating) && (
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40
          }}
        >
          <CircularProgress
            size={40}
            thickness={4}
            sx={{
              color: 'primary.main',
              position: 'absolute',
              animation: 'spin 1.5s linear infinite',
              '@keyframes spin': {
                '0%': {
                  transform: 'rotate(0deg)',
                },
                '100%': {
                  transform: 'rotate(360deg)',
                },
              },
            }}
          />
          <CircularProgress
            size={40}
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
      )}
      <IconButton 
        onClick={handleVoiceInput} 
        disabled={isUpdating}
        sx={{
          width: 56,
          height: 56,
          background: isListening 
            ? 'linear-gradient(135deg, #ff8a65, #ff5252)'
            : isUpdating
            ? 'linear-gradient(135deg, #666666, #999999)'
            : 'linear-gradient(135deg, #00e5ff, #00b0ff)',
          '&:hover': {
            transform: isUpdating ? 'none' : 'scale(1.1)',
            background: isListening 
              ? 'linear-gradient(135deg, #ff5252, #ff8a65)'
              : isUpdating
              ? 'linear-gradient(135deg, #666666, #999999)'
              : 'linear-gradient(135deg, #00b0ff, #00e5ff)',
          },
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          opacity: isUpdating ? 0.7 : 1,
        }}
      >
        <MicIcon sx={{ 
          color: 'white',
          fontSize: 28,
          animation: isListening ? 'pulse 1.5s infinite' : 'none',
          '@keyframes pulse': {
            '0%': {
              transform: 'scale(1)',
            },
            '50%': {
              transform: 'scale(1.2)',
            },
            '100%': {
              transform: 'scale(1)',
            },
          },
        }} />
      </IconButton>
    </Box>
  );
};

export default PromptInput; 