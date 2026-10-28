const form = document.getElementById("search-form");
const input = document.getElementById("word-input");
const results = document.getElementById("results");
const statusText = document.getElementById("status");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const word = input.value.trim();

  if (word === "") {
    statusText.textContent = "Please type a word.";
    return;
  }

  searchWord(word);
});

async function searchWord(word) {
  statusText.textContent = "Searching...";
  results.innerHTML = "";

  const cleanWord = encodeURIComponent(word.toLowerCase());
  
  try {
    let response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${cleanWord}`);
    let data;

    if (!response.ok && response.status !== 404) {
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://api.dictionaryapi.dev/api/v2/entries/en/${cleanWord}`)}`;
      const proxyResponse = await fetch(proxyUrl);
      const proxyData = await proxyResponse.json();
      data = JSON.parse(proxyData.contents);
    } else {
      if (response.status === 404) {
        statusText.textContent = `Sorry, we could not find "${word}".`;
        return;
      }
      data = await response.json();
    }

    if (!Array.isArray(data) || data.length === 0) {
      statusText.textContent = `Sorry, we could not find "${word}".`;
      return;
    }

    statusText.textContent = "";
    showWord(data[0]);

  } catch (error) {
    console.error("Fetch Error Details:", error);
    statusText.textContent = "Unable to reach dictionary server. Check ad-blocker or network extensions.";
  }
}

function showWord(entry) {
  let html = '<div class="fade-in bg-white p-6 rounded-xl shadow">';
  html += '<h2 class="text-3xl font-bold text-indigo-700">' + entry.word + "</h2>";
  html += '<p class="text-gray-500">' + (entry.phonetic || "") + "</p>";

  // Extract valid audio URL from phonetics array
  let audioLink = "";
  if (entry.phonetics && entry.phonetics.length > 0) {
    for (let i = 0; i < entry.phonetics.length; i++) {
      if (entry.phonetics[i].audio && entry.phonetics[i].audio.trim() !== "") {
        audioLink = entry.phonetics[i].audio;
        break;
      }
    }
  }

  if (audioLink.startsWith("//")) {
    audioLink = "https:" + audioLink;
  }

  // Audio button render
  if (audioLink !== "") {
   
  html += `<button onclick="playAudio('${audioLink}', '${entry.word}')" aria-label="Play pronunciation" 
            class="mt-3 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full hover:bg-indigo-600 hover:text-white transition cursor-pointer flex items-center gap-2">
            <span>Play sound</span> 🔊
          </button>`;
  } else {
    html += '<p class="text-sm text-gray-400 mt-2">No audio available for this word.</p>';
  }

  // Render definitions
  if (entry.meanings) {
    for (let i = 0; i < entry.meanings.length; i++) {
      const meaning = entry.meanings[i];
      html += '<h3 class="mt-5 text-xl font-semibold italic text-indigo-600">' + meaning.partOfSpeech + "</h3>";
      html += '<ol class="list-decimal pl-6 mt-2 space-y-2 text-gray-700">';

      for (let j = 0; j < meaning.definitions.length; j++) {
        html += "<li>" + meaning.definitions[j].definition + "</li>";
      }
      html += "</ol>";

      if (meaning.synonyms && meaning.synonyms.length > 0) {
        html += '<p class="mt-3 text-sm"><strong>Synonyms:</strong> ' + meaning.synonyms.join(", ") + "</p>";
      }
    }
  }

  html += "</div>";
  results.innerHTML = html;
}

// Standalone audio player with Web Speech API fallback
function playAudio(url, wordToSpeak) {
  
  if (!url || url.trim() === "") {
    speakWord(wordToSpeak);
    return;
  }

  // 2. Try playing the API audio file
  const sound = new Audio(url);

  sound.play().catch(function (error) {
    console.warn("API audio file failed or blocked. Falling back to Web Speech API:", error);
    // Fallback if the MP3 file is broken or blocked by the browser
    speakWord(wordToSpeak);
  });
}

// Built-in Browser Text-to-Speech Engine
function speakWord(word) {
  if ('speechSynthesis' in window) {
    // Cancel any previous active speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US'; // Set language to English
    utterance.rate = 0.9;     // Slightly slower for clear pronunciation

    window.speechSynthesis.speak(utterance);
  } else {
    alert("Sorry, your browser does not support text-to-speech pronunciation.");
  }
}