import React, { useState } from 'react';
import { Box, TextField, IconButton, Paper } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import SendIcon from '@mui/icons-material/Send';

const PromptInput = ({ onSubmit }) => {
  const [prompt, setPrompt] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt);
      setPrompt('');
    }
  };

  const handleVoiceInput = () => {
    if (!isListening) {
      // Start voice recognition
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = 'en-US';
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setPrompt(transcript);
        onSubmit(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
      setIsListening(true);
    }
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 2, 
        mb: 2,
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000
      }}
    >
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Tell me how you want your dashboard to look..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          sx={{ flexGrow: 1 }}
        />
        <IconButton 
          onClick={handleVoiceInput} 
          color={isListening ? 'primary' : 'default'}
          sx={{ mr: 1 }}
        >
          <MicIcon />
        </IconButton>
        <IconButton type="submit" color="primary">
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default PromptInput; 