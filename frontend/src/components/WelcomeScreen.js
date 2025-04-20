import React, { useState, useEffect } from 'react';
import { Box, Typography, Fade, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const features = [
  "Custom UI – Change themes with voice prompts (Gen Z, Elder Mode, Night Mode)",
  "Emotion Detection – Detects drowsiness or stress and responds instantly",
  "Voice Assistant – Control everything hands-free with natural voice commands",
  "Weather Alerts – Detects fog, adjusts brightness, and shows warnings",
  "Drive your way. GenDrive+ adapts to you."
];

const StyledFeature = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  margin: '1rem 0',
  opacity: 0,
  transform: 'translateY(20px)',
  transition: 'all 0.5s ease',
  '&.visible': {
    opacity: 1,
    transform: 'translateY(0)',
  },
}));

const WelcomeScreen = ({ onStart }) => {
  const [visibleFeatures, setVisibleFeatures] = useState([]);
  const [showStartButton, setShowStartButton] = useState(false);

  useEffect(() => {
    const synth = window.speechSynthesis;
    let currentIndex = 0;

    const speakFeature = () => {
      if (currentIndex < features.length) {
        // Show text immediately
        setVisibleFeatures(prev => [...prev, currentIndex]);
        
        // Speak the feature
        const utterance = new SpeechSynthesisUtterance(features[currentIndex]);
        utterance.rate = 0.9;
        
        // Find and set Hindi-accented voice
        const voices = synth.getVoices();
        const hindiVoice = voices.find(voice => voice.lang.includes('hi') || voice.lang.includes('en-IN'));
        if (hindiVoice) {
          utterance.voice = hindiVoice;
        }
        
        utterance.onend = () => {
          currentIndex++;
          setTimeout(speakFeature, 1000);
        };
        synth.speak(utterance);
      } else {
        setTimeout(() => {
          setShowStartButton(true);
        }, 1000);
      }
    };

    // Ensure voices are loaded before starting
    if (synth.getVoices().length === 0) {
      synth.onvoiceschanged = speakFeature;
    } else {
      speakFeature();
    }

    return () => {
      synth.cancel();
    };
  }, []);

  const handleStart = () => {
    onStart('default');
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #111111 0%, #0a0a0a 100%)',
        color: 'white',
        padding: '2rem',
      }}
    >
      <Typography
        variant="h2"
        sx={{
          marginBottom: '3rem',
          background: 'linear-gradient(90deg, #00e5ff, #ff8a65)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 700,
        }}
      >
        Welcome to GenDrive+
      </Typography>

      <Box sx={{ maxWidth: '800px', textAlign: 'center' }}>
        {features.map((feature, index) => (
          <StyledFeature
            key={index}
            className={visibleFeatures.includes(index) ? 'visible' : ''}
          >
            {feature}
          </StyledFeature>
        ))}
      </Box>

      <Fade in={showStartButton}>
        <Button
          onClick={handleStart}
          variant="contained"
          sx={{
            marginTop: '3rem',
            padding: '1rem 3rem',
            fontSize: '1.2rem',
            background: 'linear-gradient(135deg, #00e5ff, #00b0ff)',
            '&:hover': {
              background: 'linear-gradient(135deg, #00b0ff, #00e5ff)',
              transform: 'scale(1.05)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Start
        </Button>
      </Fade>
    </Box>
  );
};

export default WelcomeScreen; 