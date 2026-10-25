// FIX 1: base URL only (no "hello" at the end); the searched word is added later
const API_URL = "https://api.dictionaryapi.dev/api/v2/entries/en/";

// DOM elements
const searchForm = document.getElementById("search-form");
const wordInput = document.getElementById("word-input");
const searchButton = document.getElementById("search-button");
const resultsContainer = document.getElementById("results");
const statusMessage = document.getElementById("status");

let currentRequest = 0;

// Form event listener (async/await)
searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const word = wordInput.value.trim();

  if (!word) {
    showStatus("Please enter a word to search.", true);
    wordInput.focus();
    return;
  }
  if (!/^[a-zA-Z]+(?:[-'][a-zA-Z]+)*$/.test(word)) {
    showStatus("Please enter a valid English word.", true);
    return;
  }
  await searchWord(word);
});

// Fetching a word from the API
async function searchWord(word) {
  const requestId = ++currentRequest;
  searchButton.disabled = true;
  searchButton.textContent = "Searching...";
  resultsContainer.replaceChildren();
  showStatus(`Searching for "${word}"...`);

  try {
    // FIX 2: toLowerCase (capital C), not toLowercase
    const response = await fetch(API_URL + encodeURIComponent(word.toLowerCase()));
    const data = await response.json();

    if (requestId !== currentRequest) return; // a newer search replaced this one

    if (!response.ok) {
      throw new Error(data.title || "No dictionary entry was found.");
    }
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("No definitions were found for this word.");
    }

    displayResults(data);
    showStatus(`Dictionary results for "${word}".`);
  } catch (error) {
    if (requestId !== currentRequest) return;
    const message =
      error instanceof TypeError
        ? "Unable to connect to the dictionary. Check your internet connection and try again."
        : error.message;
    showStatus(message, true);
  } finally {
    if (requestId === currentRequest) {
      searchButton.disabled = false;
      searchButton.textContent = "Search";
    }
  }
}

// Displaying dictionary entries
function displayResults(entries) {
  resultsContainer.replaceChildren();

  entries.forEach((entry) => {
    const card = document.createElement("article");
    // FIX 3: typo "reult-card" -> "result-card"
    card.className = "result-card rounded-2xl bg-white p-6 shadow-md sm:p-8";

    // Word heading
    const heading = document.createElement("h2");
    heading.className = "break-words text-3xl font-bold text-indigo-700";
    heading.textContent = entry.word || "Unknown word";
    // FIX 4: the heading was created but never added to the card
    card.appendChild(heading);

    // Pronunciation and audio controls
    const pronunciations = entry.phonetics || [];
    const phonetic = pronunciations.find((item) => item.text);
    const audioItem = pronunciations.find((item) => item.audio);

    const pronunciationRow = document.createElement("div");
    pronunciationRow.className = "mt-3 flex flex-wrap items-center gap-3";

    if (phonetic) {
      const phoneticText = document.createElement("span");
      phoneticText.className = "text-slate-500";
      phoneticText.textContent = phonetic.text;
      pronunciationRow.appendChild(phoneticText);
    }

    if (audioItem) {
      const audioButton = document.createElement("button");
      audioButton.type = "button";
      audioButton.className =
        "audio-button rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-200";
      audioButton.textContent = "▶ Play pronunciation";
      audioButton.setAttribute("aria-label", `Play pronunciation of ${entry.word}`);

      const audio = new Audio(audioItem.audio);

      audioButton.addEventListener("click", async () => {
        try {
          if (!audio.paused) {
            audio.pause();
            audio.currentTime = 0;
          }
          await audio.play();
        } catch {
          showStatus("Audio could not be played. Please try again.", true);
        }
      });

      pronunciationRow.appendChild(audioButton);
    } else {
      const noAudio = document.createElement("span");
      noAudio.className = "text-sm text-slate-400";
      noAudio.textContent = "Audio unavailable";
      pronunciationRow.appendChild(noAudio);
    }

    card.appendChild(pronunciationRow);

    // Meanings and definitions
    const meaningsHeading = document.createElement("h3");
    meaningsHeading.className =
      "mt-7 border-b border-slate-200 pb-2 text-xl font-semibold";
    meaningsHeading.textContent = "Definitions";
    card.appendChild(meaningsHeading);

    (entry.meanings || []).forEach((meaning) => {
      const meaningBlock = document.createElement("div");
      meaningBlock.className = "mt-5";

      const partOfSpeech = document.createElement("h4");
      partOfSpeech.className = "font-semibold capitalize text-indigo-700";
      partOfSpeech.textContent = meaning.partOfSpeech || "Meaning";
      meaningBlock.appendChild(partOfSpeech);

      const definitionsList = document.createElement("ol");
      definitionsList.className = "mt-3 list-decimal space-y-3 pl-6 text-slate-700";

      (meaning.definitions || []).forEach((definition) => {
        const listItem = document.createElement("li");

        const definitionText = document.createElement("p");
        definitionText.textContent = definition.definition;
        listItem.appendChild(definitionText);

        if (definition.example) {
          const example = document.createElement("p");
          example.className = "mt-1 text-sm italic text-slate-500";
          example.textContent = `Example: "${definition.example}"`;
          listItem.appendChild(example);
        }

        definitionsList.appendChild(listItem);
      });

      meaningBlock.appendChild(definitionsList);

      // Synonyms: meaning level + definition level, duplicates removed
      const synonyms = [
        ...new Set([
          ...(meaning.synonyms || []),
          ...(meaning.definitions || []).flatMap((d) => d.synonyms || [])
        ])
      ];

      if (synonyms.length > 0) {
        const synonymHeading = document.createElement("h5");
        synonymHeading.className = "mt-4 text-sm font-semibold text-slate-700";
        synonymHeading.textContent = "Synonyms";
        meaningBlock.appendChild(synonymHeading);

        const synonymContainer = document.createElement("div");
        synonymContainer.className = "mt-2 flex flex-wrap gap-2";

        synonyms.forEach((synonym) => {
          const synonymButton = document.createElement("button");
          synonymButton.type = "button";
          synonymButton.className =
            "rounded-full border border-indigo-200 px-3 py-1 text-sm text-indigo-700 transition hover:bg-indigo-50";
          synonymButton.textContent = synonym;
          synonymButton.setAttribute("aria-label", `Search for synonym ${synonym}`);

          synonymButton.addEventListener("click", () => {
            wordInput.value = synonym;
            searchWord(synonym);
          });

          synonymContainer.appendChild(synonymButton);
        });

        meaningBlock.appendChild(synonymContainer);
      }

      card.appendChild(meaningBlock);
    });

    resultsContainer.appendChild(card);
  });
}

// Display status and error messages
function showStatus(message, isError = false) {
  statusMessage.textContent = message;
  statusMessage.className = isError
    ? "mt-6 text-center font-medium text-red-600"
    : "mt-6 text-center text-slate-600";
}