const apiKey = "c1f5fa42"; // OMDb API Key

const movieInput = document.getElementById("movieInput");
const movieInfo = document.getElementById("movieInfo");
const watchlist = document.getElementById("watchlist");
const themeToggle = document.getElementById("themeToggle");

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
        <button onclick="addToWatchlist('${data.Title}')">➕ Add to Watchlist</button>
      `;
    })
    .catch(() => {
      movieInfo.innerHTML = `<p style="color:red;">Error fetching movie data.</p>`;
    });
}

function addToWatchlist(title) {
  if (!movies.includes(title)) {
    movies.push(title);
    localStorage.setItem("watchlist", JSON.stringify(movies));
    renderWatchlist();
  } else {
    alert("Movie already in watchlist!");
  }
}

function renderWatchlist() {
  watchlist.innerHTML = "";
  movies.forEach(movie => {
    const li = document.createElement("li");
    li.textContent = movie;
    watchlist.appendChild(li);
  });
}
