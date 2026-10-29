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
