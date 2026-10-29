📖 Simple Dictionary Web Application

A clean, responsive, and light-weight English Dictionary web application built with HTML5, Tailwind CSS, and JavaScript. It utilizes the Free Dictionary API with proxy fallback mechanisms and browser-native Speech Synthesis as a fallback for audio pronunciations.

✨ Features

Instant Word Search: Fast definition lookup for any English word.

Audio Pronunciation:

-Direct playback of audio files provided by the Free Dictionary API.

-Automatic fallback to the browser's native Web Speech Synthesis API if audio files fail or are blocked.

Detailed Meanings: Displays parts of speech, numbered definitions, and relevant synonyms.

Resilient API Calls: Includes an alternative proxy path (allorigins) to bypass common CORS or network blockages.

Responsive & Accessible Design: Styled with Tailwind CSS, featuring accessible ARIA labels and subtle animations.

📁 File Structure

├── index.html     # Main HTML structure and UI markup

├── style.css      # Custom animations and custom styles

├── script.js     # Search logic, API fetching, DOM updates, and audio fallback

└── README.md      # Project documentation and commit guide

🚀 Getting Started

Prerequisites

No special package managers or runtime environments are required. You only need a modern web browser (e.g., Chrome, Firefox, Edge, Safari).

Running the Application

Clone the repository to your local machine:

git clone https://github.com/your-username/wordly-dictonary.git
cd wordly-dictonary

Open index.html:
Double-click index.html or open it with your browser of choice. Alternatively, serve it using a local development server such as VS Code's Live Server.

💡 How It Works

User Query: The user inputs a word into the search box and submits the form.

Data Fetching:

script.js normalizes the input (trim() and toLowerCase()).

Sends a request to https://api.dictionaryapi.dev/api/v2/entries/en/<word>.

If the main request encounters issues, it falls back to an allorigins proxy.

DOM Generation:

Extracts phonetics, part of speech, definitions, and synonyms.

Dynamically builds HTML elements and appends them to #results.

Audio Playback:

Tries playing the hosted .mp3 file from the API response.

If playback fails, it can fall back to window.speechSynthesis (Web Speech API).