# GenDrive+ - AI-Powered UI/UX Personalization Engine

GenDrive+ is an innovative dashboard system that uses AI to personalize the user interface based on natural language prompts. The system can interpret voice or text commands to dynamically adjust the dashboard's appearance and behavior.

## Features

- Natural language processing for UI customization
- Voice and text input support
- Dynamic theme switching
- Accessibility features (high contrast, reduced motion)
- Responsive layout adjustments
- Real-time UI updates

## Tech Stack

- Frontend: React, Material-UI
- Backend: Node.js, Express
- Database: MongoDB
- AI: OpenAI GPT-3.5
- Voice Recognition: Web Speech API

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- OpenAI API key
- Modern web browser with Web Speech API support

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/yourusername/gendrive-plus.git
cd gendrive-plus
```

2. Install dependencies:
```bash
npm run install-all
```

3. Create a `.env` file in the backend directory:
```
OPENAI_API_KEY=your_openai_api_key
MONGODB_URI=mongodb://localhost:27017/gendrive
PORT=5000
```

4. Start the development servers:
```bash
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Usage

1. Open the dashboard in your browser
2. Use the input field at the bottom to type commands or click the microphone icon for voice input
3. Try commands like:
   - "Switch to dark mode"
   - "Make it elder-friendly"
   - "I need a calm dashboard"
   - "Activate night mode with big fonts"

## Project Structure

```
gendrive-plus/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.js
│   │   │   └── PromptInput.js
│   │   └── App.js
│   └── package.json
├── backend/
│   ├── server.js
│   └── package.json
└── package.json
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. #   G e n D r i v e -  
 