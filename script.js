let apiUrl ="https://api.dictionaryapi.dev/api/v2/entries/en/${word}";

// Get the parts of the page we need
    const form = document.getElementById("search-form");
    const input = document.getElementById("word-input");
    const results = document.getElementById("results");
    const statusText = document.getElementById("status");

    // When the user clicks Search (or presses Enter)
    form.addEventListener("submit", function (event) {
      event.preventDefault(); // stop the page from reloading

      const word = input.value.trim();

      if (word === "") {
        statusText.textContent = "Please type a word.";
        return;
      }

      searchWord(word);
    });

    // Step 1: get the data from the API
    async function searchWord(word) {
      statusText.textContent = "Searching...";
      results.innerHTML = "";

      try {
        const response = await fetch(apiUrl + word.toLowerCase());

        if (!response.ok) {
          statusText.textContent = "Sorry, we could not find \"" + word + "\".";
          return;
        }

        const data = await response.json();
        statusText.textContent = "";
        showWord(data[0]); // use the first result
      } catch (error) {
        console.log(error);
        statusText.textContent = "Something went wrong. Check your internet and try again.";
      }
    }

    // Step 2: show the data on the page
    function showWord(entry) {
      // Word + pronunciation text
      let html = '<div class="fade-in bg-white p-6 rounded-xl shadow">';
      html += '<h2 class="text-3xl font-bold text-indigo-700">' + entry.word + "</h2>";
      html += '<p class="text-gray-500">' + (entry.phonetic || "") + "</p>";

      // Find the first audio link
      let audioLink = "";
      for (let i = 0; i < entry.phonetics.length; i++) {
        if (entry.phonetics[i].audio) {
          audioLink = entry.phonetics[i].audio;
          break;
        }
      }

      // Audio button
      if (audioLink !== "") {
        html += '<button id="play-button" aria-label="Play pronunciation" ' +
                'class="mt-3 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full hover:bg-indigo-600 hover:text-white transition">' +
                "Play sound</button>";
      } else {
        html += '<p class="text-sm text-gray-400 mt-2">No audio available.</p>';
      }

      // Meanings (noun, verb, ...)
      for (let i = 0; i < entry.meanings.length; i++) {
        const meaning = entry.meanings[i];

        html += '<h3 class="mt-5 text-xl font-semibold italic text-indigo-600">' + meaning.partOfSpeech + "</h3>";
        html += '<ol class="list-decimal pl-6 mt-2 space-y-2 text-gray-700">';

        for (let j = 0; j < meaning.definitions.length; j++) {
          html += "<li>" + meaning.definitions[j].definition + "</li>";
        }
        html += "</ol>";

        // Synonyms
        if (meaning.synonyms.length > 0) {
          html += '<p class="mt-3 text-sm"><strong>Synonyms:</strong> ' + meaning.synonyms.join(", ") + "</p>";
        }
      }

      html += "</div>";

      // Put everything on the page
      results.innerHTML = html;

      // Make the audio button work
      if (audioLink !== "") {
        document.getElementById("play-button").addEventListener("click", function () {
          const sound = new Audio(audioLink);
          sound.play();
        });
      }
    }