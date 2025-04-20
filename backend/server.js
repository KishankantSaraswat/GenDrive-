require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
const net = require('net');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// OpenAI Configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gendrive', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB Connection Error:', err));

// User Preferences Schema
const userPreferencesSchema = new mongoose.Schema({
  userId: String,
  theme: String,
  fontSize: String,
  layout: String,
  colorScheme: String,
  accessibility: Object,
  lastUpdated: { type: Date, default: Date.now }
});

const UserPreferences = mongoose.model('UserPreferences', userPreferencesSchema);

// Routes
app.post('/api/interpret-prompt', async (req, res) => {
  try {
    const { prompt, userId } = req.body;
    console.log('Received prompt:', prompt);
    console.log('User ID:', userId);

    if (!prompt) {
      console.error('No prompt provided');
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is not configured');
      return res.status(500).json({ error: 'OpenAI API key is not configured' });
    }

    let preferences;
    try {
      console.log('Attempting to call OpenAI API...');
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a creative UI/UX designer specializing in modern, attractive interfaces. 
            Analyze the user's prompt and return a JSON object with the following structure, 
            but with more creative and modern theme suggestions:
            
            {
              theme: "light" | "dark" | "modern" | "minimal" | "gradient" | "neon" | "pastel" | "monochrome",
              fontSize: "small" | "medium" | "large" | "extraLarge",
              layout: "minimal" | "standard" | "detailed" | "modern" | "grid" | "card" | "split",
              colorScheme: "default" | "highContrast" | "calm" | "vibrant" | "professional" | "playful" | "elegant",
              accessibility: {
                highContrast: boolean,
                reducedMotion: boolean
              },
              accentColor: string (hex color code),
              backgroundColor: string (hex color code),
              fontFamily: "default" | "modern" | "elegant" | "playful" | "tech" | "italic" | "bold",
              borderRadius: "small" | "medium" | "large" | "none",
              shadow: "none" | "subtle" | "medium" | "strong",
              backgroundImage: string (URL or description),
              iconStyle: "material" | "outlined" | "filled" | "rounded" | "sharp" | "two-tone",
              iconColor: string (hex color code),
              animationStyle: "none" | "subtle" | "moderate" | "dynamic"
            }
            
            For specific requests:
            - For color requests (red, blue, etc.), use appropriate hex codes
            - For font requests (italic, bold), set appropriate fontFamily
            - For background requests, suggest appropriate backgroundImage
            - For racing/sports themes, use dynamic animations and sharp icons
            - For elegant themes, use subtle animations and rounded icons
            
            Example responses:
            - "red color and italic font": Use #FF0000 accent color and italic font family
            - "racing background": Use a racing-themed background image with dynamic animations
            - "modern icons": Use material or sharp icon style with accent color`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 250
      });

      console.log('OpenAI Response:', completion.choices[0].message.content);
      preferences = JSON.parse(completion.choices[0].message.content);
    } catch (openaiError) {
      console.error('OpenAI Error:', openaiError);
      console.error('Error details:', {
        message: openaiError.message,
        code: openaiError.code,
        status: openaiError.status,
        type: openaiError.type
      });
      
      // Enhanced fallback preferences with specific handling
      preferences = {
        theme: prompt.toLowerCase().includes('dark') ? 'dark' : 
               prompt.toLowerCase().includes('modern') ? 'modern' : 'light',
        fontSize: prompt.toLowerCase().includes('large') ? 'large' : 
                 prompt.toLowerCase().includes('small') ? 'small' : 'medium',
        layout: prompt.toLowerCase().includes('minimal') ? 'minimal' : 
                prompt.toLowerCase().includes('detailed') ? 'detailed' : 'modern',
        colorScheme: prompt.toLowerCase().includes('contrast') ? 'highContrast' : 
                     prompt.toLowerCase().includes('calm') ? 'calm' : 'vibrant',
        accessibility: {
          highContrast: prompt.toLowerCase().includes('contrast'),
          reducedMotion: prompt.toLowerCase().includes('motion')
        },
        accentColor: prompt.toLowerCase().includes('red') ? '#FF0000' : 
                    prompt.toLowerCase().includes('blue') ? '#0000FF' : 
                    prompt.toLowerCase().includes('green') ? '#00FF00' : '#4CAF50',
        backgroundColor: prompt.toLowerCase().includes('dark') ? '#121212' : '#FFFFFF',
        fontFamily: prompt.toLowerCase().includes('italic') ? 'italic' :
                   prompt.toLowerCase().includes('bold') ? 'bold' : 'modern',
        borderRadius: 'medium',
        shadow: 'subtle',
        backgroundImage: prompt.toLowerCase().includes('racing') ? 'racing-background.jpg' : null,
        iconStyle: prompt.toLowerCase().includes('racing') ? 'sharp' : 'material',
        iconColor: prompt.toLowerCase().includes('red') ? '#FF0000' : '#4CAF50',
        animationStyle: prompt.toLowerCase().includes('racing') ? 'dynamic' : 'subtle'
      };
    }

    console.log('Parsed preferences:', preferences);

    try {
      // Save preferences to MongoDB
      const savedPreferences = await UserPreferences.findOneAndUpdate(
        { userId },
        { ...preferences, userId },
        { upsert: true, new: true }
      );

      console.log('Saved preferences:', savedPreferences);
      res.json(preferences);
    } catch (dbError) {
      console.error('Database Error:', dbError);
      // Even if database save fails, return the preferences
      res.json(preferences);
    }
  } catch (error) {
    console.error('General Error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to process prompt',
      details: error.message 
    });
  }
});

app.get('/api/preferences/:userId', async (req, res) => {
  try {
    const preferences = await UserPreferences.findOne({ userId: req.params.userId });
    console.log('Retrieved preferences:', preferences);
    res.json(preferences || {});
  } catch (error) {
    console.error('Error fetching preferences:', error);
    res.status(500).json({ error: 'Failed to fetch preferences' });
  }
});

// Function to find an available port
const findAvailablePort = (startPort) => {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.unref();
    server.on('error', () => {
      resolve(findAvailablePort(startPort + 1));
    });
    server.listen(startPort, () => {
      server.close(() => {
        resolve(startPort);
      });
    });
  });
};

// Start server with port handling
const startServer = async () => {
  try {
    const availablePort = await findAvailablePort(port);
    const server = app.listen(availablePort, () => {
      console.log(`Server running on port ${availablePort}`);
      // Write the port to a file that the frontend can read
      require('fs').writeFileSync('port.txt', availablePort.toString());
    });
    
    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.log(`Port ${availablePort} is in use, trying next port...`);
        startServer();
      } else {
        console.error('Server error:', error);
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer(); 