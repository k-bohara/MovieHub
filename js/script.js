const state = {
  currentPage: window.location.pathname,
  search: {
    term: "",
    type: "",
    page: 1,
    totalPages: 1,
    totalResults: 0,
  },
  api: {
    // insert your api from tmdb
    apiKey: "",
    apiUrl: "https://api.themoviedb.org/3/",
  },
};

// Display popular TV Shows:
const displayPopularShows = async () => {
  const { results } = await fetchAPIData("/tv/popular");
  results.forEach((show) => {
    const divElement = document.createElement("div");
    divElement.classList.add("card");
    divElement.innerHTML = `
    <a href="tv-details.html?id=${show.id}">
    ${
      show.poster_path
        ? ` <img
    src="https://image.tmdb.org/t/p/w500${show.poster_path}"
    class="card-img-top"
    alt="${show.name}"
  />`
        : `<img
  src="images/no-image.jpg"
  class="card-img-top"
  alt="${show.name}"
/>`
    }
      
    </a>
    <div class="card-body">
      <h5 class="card-title">${show.name}</h5>
      <p class="card-text">
        <small class="text-muted">Air Date: ${show.first_air_date}</small>
      </p>
    </div>
  `;
    document.querySelector("#popular-shows").appendChild(divElement);
  });
};

// Display Popular Movies
const displayPopularMovies = async () => {
  const { results } = await fetchAPIData("movie/popular");
  results.forEach((movie) => {
    const divElement = document.createElement("div");
    divElement.classList.add("card");
    divElement.innerHTML = `
    <a href="movie-details.html?id=${movie.id}">
    ${
      movie.poster_path
        ? ` <img
    src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
    class="card-img-top"
    alt="${movie.title}"
  />`
        : `<img
  src="images/no-image.jpg"
  class="card-img-top"
  alt="${movie.title}"
/>`
    }
      
    </a>
    <div class="card-body">
      <h5 class="card-title">${movie.title}</h5>
      <p class="card-text">
        <small class="text-muted">Release: ${movie.release_date}</small>
      </p>
    </div>
  `;
    document.querySelector("#popular-movies").appendChild(divElement);
  });
};

// Display Movie Details
const displayMovieDetails = async () => {
  // to retrieve id from the url
  const movieId = window.location.search.split("=")[1];
  const movie = await fetchAPIData(`movie/${movieId}`);

  // Overlay for background image
  displayBackgroundImage("movie", movie.backdrop_path);

  const divElement = document.createElement("div");

  divElement.innerHTML = `
  <div class="details-top">
  <div>
  ${
    movie.poster_path
      ? ` <img
  src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
  class="card-img-top"
  alt="${movie.title}"
/>`
      : `<img
src="images/no-image.jpg"
class="card-img-top"
alt="${movie.title}"
/>`
  }
  </div>
  <div>
    <h2>${movie.title}</h2>
    <p>
      <i class="fas fa-star text-primary"></i>
      ${movie.vote_average.toFixed(1)} / 10
    </p>
    <p class="text-muted">Release Date: ${movie.release_date}</p>
    <p>${movie.overview}
    </p>
    <h5>Genres</h5>
    <ul class="list-group">
      ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
    </ul>
    <a href="${
      movie.homepage
    }" target="_blank" class="btn">Visit Movie Homepage</a>
  </div>
</div>
<div class="details-bottom">
  <h2>Movie Info</h2>
  <ul>
    <li><span class="text-secondary">Budget:</span> $${addCommasToNumber(
      movie.budget
    )}</li>
    <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(
      movie.revenue
    )}</li>
    <li><span class="text-secondary">Runtime:</span> ${
      movie.runtime
    } minutes</li>
    <li><span class="text-secondary">Status:</span> ${movie.status}</li>
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group">
  ${movie.production_companies
    .map((company) => `<span>${company.name}&nbsp; </span>`)
    .join("")}
  </div>
</div>`;
  document.querySelector("#movie-details").appendChild(divElement);
};
// Display Show Details
const displayShowDetails = async () => {
  const showId = window.location.search.split("=")[1];

  const show = await fetchAPIData(`tv/${showId}`);

  // Overlay for background image
  displayBackgroundImage("tv", show.backdrop_path);

  const div = document.createElement("div");

  div.innerHTML = `
  <div class="details-top">
  <div>
  ${
    show.poster_path
      ? `<img
    src="https://image.tmdb.org/t/p/w500${show.poster_path}"
    class="card-img-top"
    alt="${show.name}"
  />`
      : `<img
  src="../images/no-image.jpg"
  class="card-img-top"
  alt="${show.name}"
/>`
  }
  </div>
  <div>
    <h2>${show.name}</h2>
    <p>
      <i class="fas fa-star text-primary"></i>
      ${show.vote_average.toFixed(1)} / 10
    </p>
    <p class="text-muted">Last Air Date: ${show.last_air_date}</p>
    <p>
      ${show.overview}
    </p>
    <h5>Genres</h5>
    <ul class="list-group">
      ${show.genres.map((genre) => `<li>${genre.name}</li>`).join("")}
    </ul>
    <a href="${
      show.homepage
    }" target="_blank" class="btn">Visit show Homepage</a>
  </div>
</div>
<div class="details-bottom">
  <h2>Show Info</h2>
  <ul>
    <li><span class="text-secondary">Number of Episodes:</span> ${
      show.number_of_episodes
    }</li>
    <li><span class="text-secondary">Last Episode To Air:</span> ${
      show.last_episode_to_air.name
    }</li>
    <li><span class="text-secondary">Status:</span> ${show.status}</li>
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group">
    ${show.production_companies
      .map((company) => `<span>${company.name}</span>`)
      .join(", ")}
  </div>
</div>
  `;

  document.querySelector("#show-details").appendChild(div);
};

// Display Backdrop image on details page
const displayBackgroundImage = (type, backgroundPath) => {
  const overlayDiv = document.createElement("div");
  overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
  overlayDiv.style.backgroundSize = "cover";
  overlayDiv.style.backgroundPosition = "center";
  overlayDiv.style.backgroundRepeat = "no-repeat";
  overlayDiv.style.height = "100vh";
  overlayDiv.style.width = "100vw";
  overlayDiv.style.position = "absolute";
  overlayDiv.style.top = "0";
  overlayDiv.style.left = "0";
  overlayDiv.style.zIndex = "-1";
  overlayDiv.style.opacity = "0.1";

  if (type === "movie") {
    document.querySelector("#movie-details").appendChild(overlayDiv);
  } else {
    document.querySelector("#show-details").appendChild(overlayDiv);
  }
};

// Display similar Movies
const displaySimilarMovies = async () => {
  const movieId = window.location.search.split("=")[1];
  console.log(movieId);

  // fetch similar movies data from api
  const { results } = await fetchAPIData(`movie/${movieId}/similar`);
  console.log(results);
  const res = results.slice(0, 5);
  res.forEach((movie) => {
    const divElement = document.createElement("div");
    divElement.classList.add("card");
    divElement.innerHTML = `
      <a href="tv-details.html?id=${movie.id}">
      ${
        movie.poster_path
          ? ` <img
      src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
      class="card-img-top"
      alt="${movie.title}"
    />`
          : `<img
    src="images/no-image.jpg"
    class="card-img-movie
    alt="${movie.title}"
  />`
      }

      </a>
      <div class="card-body">
        <h5 class="card-title">${movie.title}</h5>
        <p class="card-text">
          <small class="text-muted">Air Date: ${movie.release_date}</small>
        </p>
      </div>
    `;
    document.querySelector("#similar-results").appendChild(divElement);
  });
};

// Display similar TV Shows
const displaySimilarTvShows = async () => {
  const showId = window.location.search.split("=")[1];

  // fetching similart tv shows data from api
  const { results } = await fetchAPIData(`tv/${showId}/similar`);

  const res = results.slice(0, 5);
  res.forEach((show) => {
    const divElement = document.createElement("div");
    divElement.classList.add("card");
    divElement.innerHTML = `
      <a href="tv-details.html?id=${show.id}">
      ${
        show.poster_path
          ? ` <img
      src="https://image.tmdb.org/t/p/w500${show.poster_path}"
      class="card-img-top"
      alt="${show.name}"
    />`
          : `<img
    src="images/no-image.jpg"
    class="card-img-top"
    alt="${show.name}"
  />`
      }

      </a>
      <div class="card-body">
        <h5 class="card-title">${show.name}</h5>
        <p class="card-text">
          <small class="text-muted">Air Date: ${show.first_air_date}</small>
        </p>
      </div>
    `;
    document.querySelector("#similar-results").appendChild(divElement);
  });
};

// Display slider movies that are currently running on threaters
const displaySlider = async () => {
  const { results } = await fetchAPIData("movie/now_playing");

  results.forEach((movie) => {
    const div = document.createElement("div");
    div.classList.add("swiper-slide");

    div.innerHTML = `
      <a href="movie-details.html?id=${movie.id}">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
      </a>
      <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i> ${movie.vote_average} / 10
      </h4>
    `;

    document.querySelector(".swiper-wrapper").appendChild(div);

    initSwiper();
  });
};

// Display Slider TV Shows that are currently airing
const displayTvSlider = async () => {
  const { results } = await fetchAPIData("tv/on_the_air");

  results.forEach((show) => {
    console.log(show);
    const div = document.createElement("div");
    div.classList.add("swiper-slide");

    div.innerHTML = `
      <a href="tv-details.html?id=${show.id}">
        <img src="https://image.tmdb.org/t/p/w500${show.poster_path}" alt="${show.name}" />
      </a>
      <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i> ${show.vote_average} / 10
      </h4>
    `;

    document.querySelector(".swiper-wrapper").appendChild(div);
    initSwiper();
  });
};

const initSwiper = () => {
  const swiper = new Swiper(".swiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
};

// Search Movies/Shows
async function search() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  state.search.type = urlParams.get("type");
  state.search.term = urlParams.get("search-term");

  if (state.search.term !== "" && state.search.term !== null) {
    const { results, total_pages, page, total_results } = await searchAPIData();
    state.search.page = page;
    state.search.totalPages = total_pages;
    state.search.totalResults = total_results;
    if (results.length === 0) {
      showAlert("No results found");
      return;
    }
    displaySearchResults(results);
    document.querySelector("#search-term").value = "";
  } else {
    showAlert("Please enter a search term");
  }
}

// Displaying Search Results
const displaySearchResults = (results) => {
  // clear previous results
  document.querySelector("#search-results").innerHTML = "";
  document.querySelector("#search-results-heading").innerHTML = "";
  document.querySelector("#pagination").innerHTML = "";
  results.forEach((result) => {
    const divElement = document.createElement("div");
    divElement.classList.add("card");
    divElement.innerHTML = `
    <a href="${state.search.type}-details.html?id=${result.id}">
    ${
      result.poster_path
        ? ` <img
    src="https://image.tmdb.org/t/p/w500/${result.poster_path}"
    class="card-img-top"
    alt="${state.search.type === "movie" ? result.title : result.name}"
  />`
        : `<img
  src="images/no-image.jpg"
  class="card-img-top"
  alt="${state.search.type === "movie" ? result.title : result.name}"
/>`
    }
      
    </a>
    <div class="card-body">
      <h5 class="card-title">${
        state.search.type === "movie" ? result.title : result.name
      }</h5>
      <p class="card-text">
        <small class="text-muted">Release: ${
          state.search.type === "movie"
            ? result.release_date
            : result.first_air_date
        }</small>
      </p>
    </div>
  `;
    document.querySelector("#search-results-heading").innerHTML = `
  <h2>${results.length} of ${state.search.totalResults} Results for ${state.search.term}</h2>
`;
    document.querySelector("#search-results").appendChild(divElement);
  });
  displayPagination();
};

// display pagination
const displayPagination = () => {
  const div = document.createElement("div");
  div.classList.add("pagination");
  div.innerHTML = `
  <button class="btn btn-primary" id="prev">Prev</button>
  <button class="btn btn-primary" id="next">Next</button>
  <div class="page-counter">Page ${state.search.page} of ${state.search.totalPages}</div>
  `;

  document.querySelector("#pagination").appendChild(div);

  // disable previous button if it is the first page
  if (state.search.page === 1) {
    document.querySelector("#prev").disabled = true;
  }
  // disable previous button if it is the last page
  if (state.search.page === state.search.totalPages) {
    document.querySelector("#next").disabled = true;
  }

  // displaying next page
  document.querySelector("#next").addEventListener("click", async () => {
    state.search.page++;
    const { results, total_pages } = await searchAPIData();
    displaySearchResults(results);
  });
  // displaying previous page
  document.querySelector("#prev").addEventListener("click", async () => {
    state.search.page--;
    const { results, total_pages } = await searchAPIData();
    displaySearchResults(results);
  });
};

// Show Alert Message
const showAlert = (message, className = "error") => {
  const alertElement = document.createElement("div");
  alertElement.classList.add("alert", className);
  alertElement.appendChild(document.createTextNode(message));
  document.querySelector("#alert").appendChild(alertElement);

  setTimeout(() => alertElement.remove(), 3000);
};

// Fetch data from the TMDB API
const fetchAPIData = async (endpoint) => {
  const API_KEY = state.api.apiKey;
  const API_URL = state.api.apiUrl;

  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
  );
  const data = await response.json();

  return data;
};

// Making Search Request
const searchAPIData = async () => {
  const API_KEY = state.api.apiKey;
  const API_URL = state.api.apiUrl;

  const response = await fetch(
    `${API_URL}search/${state.search.type}?api_key=${API_KEY}&language=en-US&query=${state.search.term}&page=${state.search.page}`
  );

  const data = await response.json();

  return data;
};

// Highlight active link
const highlightActiveLink = () => {
  const links = document.querySelectorAll(".nav-link");
  links.forEach((link) => {
    if (link.getAttribute("href") == state.currentPage) {
      link.classList.add("active");
    }
  });
};

// Function to add commas to budget and revenue
const addCommasToNumber = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Initialize App
const init = () => {
  switch (state.currentPage) {
    case "/":
    case "/index.html":
      displaySlider();
      displayPopularMovies();
      break;
    case "/shows.html":
      displayTvSlider();
      displayPopularShows();
      break;
    case "/movie-details.html":
      displayMovieDetails();
      displaySimilarMovies();
      break;
    case "/tv-details.html":
      displayShowDetails();
      displaySimilarTvShows();
      break;
    case "/search.html":
      search();
      break;
  }
  highlightActiveLink();
};
document.addEventListener("DOMContentLoaded", init);
