const apiKey = "c1f5fa42"; // OMDb API Key

const movieInput = document.getElementById("movieInput");
const movieInfo = document.getElementById("movieInfo");
const watchlist = document.getElementById("watchlist");
const themeToggle = document.getElementById("themeToggle");
const trendingSection = document.getElementById("trendingMovies");

// Toggle dark mode
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

// Apply saved theme on load
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

// Load watchlist
let movies = JSON.parse(localStorage.getItem("watchlist")) || [];
renderWatchlist();

function searchMovie() {
  const title = movieInput.value.trim();
  if (!title) {
    alert("Please enter a movie name.");
    return;
  }

  fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`)
    .then(res => res.json())
    .then(data => {
      if (data.Response === "False") {
        movieInfo.innerHTML = `<p style="color:red;">Movie not found.</p>`;
        return;
      }

      movieInfo.innerHTML = `
        <img src="${data.Poster !== "N/A" ? data.Poster : "https://via.placeholder.com/150"}" alt="Poster" />
        <h3>${data.Title} (${data.Year})</h3>
        <p>🎬 Genre: ${data.Genre}</p>
        <p>⭐ IMDb Rating: ${data.imdbRating}</p>
        <p>📜 Plot: ${data.Plot}</p>
        <p>📆 Release: ${data.Released}</p>
        <a href="https://www.imdb.com/title/${data.imdbID}" target="_blank">🔗 View on IMDb</a><br/>
        <textarea placeholder="📝 Add your notes..." id="note-${data.imdbID}" rows="2"></textarea><br/>
        <button onclick="addToWatchlist('${data.imdbID}', '${data.Title}')">➕ Add to Watchlist</button>
      `;
    })
    .catch(() => {
      movieInfo.innerHTML = `<p style="color:red;">Error fetching movie data.</p>`;
    });
}

function addToWatchlist(id, title) {
  if (!movies.find(m => m.id === id)) {
    const note = document.getElementById(`note-${id}`).value;
    movies.push({ id, title, note });
    localStorage.setItem("watchlist", JSON.stringify(movies));
    renderWatchlist();
  } else {
    alert("Movie already in watchlist!");
  }
}

function removeFromWatchlist(id) {
  movies = movies.filter(m => m.id !== id);
  localStorage.setItem("watchlist", JSON.stringify(movies));
  renderWatchlist();
}

function renderWatchlist() {
  watchlist.innerHTML = "";
  movies.forEach(({ id, title, note }) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${title}</strong>
      <br /><em>${note || "(No notes)"}</em>
      <br /><a href="https://www.imdb.com/title/${id}" target="_blank">🔗 IMDb</a>
      <button onclick="removeFromWatchlist('${id}')">❌ Remove</button>
    `;
    watchlist.appendChild(li);
  });
}

// Display trending movies
const trendingTitles = ["Pathaan", "RRR", "Jawan", "K.G.F", "Gadar 2"];
trendingTitles.forEach(title => {
  fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`)
    .then(res => res.json())
    .then(data => {
      if (data.Response !== "False") {
        const div = document.createElement("div");
        div.className = "trending-card";
        div.innerHTML = `
          <a href="https://www.imdb.com/title/${data.imdbID}" target="_blank">
            <img src="${data.Poster}" alt="${data.Title}"/>
            <p><strong>${data.Title}</strong></p>
            <p>${data.Year}</p>
          </a>
        `;
        trendingSection.appendChild(div);
      }
    });
});
