const state = {
    currentPage: window.location.pathname,
}

function imageUrl(filep) {
    const base = 'https://image.tmdb.org/t/p/';
    
    return base + 'w500/' + filep;
}

function imageUrlBack(filep) {
    const base = 'https://image.tmdb.org/t/p/';
    
    return base + 'original/' + filep;
}

async function displayPopularMovies() {
    const {results} = await fetchData('movie/popular')
    const grid = document.getElementById('popular-movies');
    results.forEach(movie => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
          <a href="movie-details.html?id=${movie.id}">
            <img
              src="${imageUrl(movie.poster_path) ? imageUrl(movie.poster_path) : '../images/no-image.jpg'}"
              class="card-img-top"
              alt="${movie.title}"
            />
          </a>
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${movie.release_date}</small>
            </p>
          </div>
        `;
        grid.appendChild(card);
    });   
}

async function displayPopularTVShows() {
    const {results} = await fetchData('tv/popular')
    const grid = document.getElementById('popular-shows');
    results.forEach(show => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
          <a href="tv-details.html?id=${show.id}">
            <img
                src="${imageUrl(show.poster_path) ? imageUrl(show.poster_path) : '../images/no-image.jpg'}"
              class="card-img-top"
              alt="${show.title}"
            />
          </a>
          <div class="card-body">
          <h5 class="card-title">${show.title}</h5>
            <p class="card-text">
            <small class="text-muted">Release: ${show.first_air_date}</small>
            </p>
          </div>
        `;
        grid.appendChild(card);
    });
    
}

async function displayTVshowDetails() {
    const movieID = new URLSearchParams(window.location.search).get('id');
    let moneyFormatter = new Intl.NumberFormat();
    const movie = await fetchData(`tv/${movieID}`);
    const top = document.querySelector('.details-top');
    const top_1 = document.createElement('div');
    const top_2 = document.createElement('div');
    document.querySelector('.underlay').style.backgroundImage = `url(${imageUrlBack(movie.backdrop_path)})`;
    const bottom = document.createElement('div');
    const getProdCompanies = (companyList) => {
        let companies = '';
        companyList.forEach((company) => companies += (company.name+', '))

        return companies;
    };
    bottom.classList.add('details-bottom');

    let genreList = '';
    movie.genres.forEach((genre) => {
        genreList += `<li>${genre.name}</li>`;
    });
    top_1.innerHTML = `
    <div>
        <img
        src="${imageUrl(movie.poster_path) ? imageUrl(movie.poster_path) : '../images/no-image.jpg'}"
        class="card-img-top"
        alt="${movie.title}"
        />
    </div>
    `
    top_2.innerHTML = `
    <div>
        <h2>${movie.name}</h2>
        <p>
        <i class="fas fa-star text-primary"></i>
        ${Math.round(movie.vote_average * 10) / 10} / 10
        </p>
        <p class="text-muted">Release Date: ${movie.first_air_date}</p>
        <p>
        ${movie.overview}
        </p>
        <h5>Genres</h5>
        <ul class="list-group"
        ${genreList}
        </ul>
        <a href="${movie.homepage}" target="_blank" class="btn">Visit Show Homepage</a>
    </div>
    `
    bottom.innerHTML = `
    <h2>Show Info</h2>
    <ul>
      <li><span class="text-secondary">Number Of Episodes:</span> ${movie.number_of_episodes}</li>
      <li>
        <span class="text-secondary">Last Episode To Air:</span> ${movie.last_episode_to_air.name}
      </li>
      <li><span class="text-secondary">Status:</span> ${movie.status}</li>
    </ul>
    <h4>Production Companies</h4>
    <div class="list-group">${getProdCompanies(movie.production_companies)}</div>
    `

    top.appendChild(top_1);
    top.appendChild(top_2);
    document.getElementById('show-details').appendChild(bottom);
    console.log(movie);
}
async function displayMovieDetails() {
    const movieID = new URLSearchParams(window.location.search).get('id');
    let moneyFormatter = new Intl.NumberFormat();
    const movie = await fetchData(`movie/${movieID}`);
    const top = document.querySelector('.details-top');
    const top_1 = document.createElement('div');
    const top_2 = document.createElement('div');
    const bottom = document.createElement('div');
    document.querySelector('.underlay').style.backgroundImage = `url(${imageUrlBack(movie.backdrop_path)})`;
    const getProdCompanies = (companyList) => {
        let companies = []
        companyList.forEach((company) => companies.push(company.name))

        return companies;
    };
    bottom.classList.add('details-bottom');

    let genreList = '';
    movie.genres.forEach((genre) => {
        genreList += `<li>${genre.name}</li>`;
    });
    top_1.innerHTML = `
    <div>
        <img
        src="${imageUrl(movie.poster_path) ? imageUrl(movie.poster_path) : '../images/no-image.jpg'}"
        class="card-img-top"
        alt="${movie.title}"
        />
    </div>
    `
    top_2.innerHTML = `
    <div>
        <h2>${movie.title}</h2>
        <p>
        <i class="fas fa-star text-primary"></i>
        ${Math.round(movie.vote_average * 10) / 10} / 10
        </p>
        <p class="text-muted">Release Date: ${movie.release_date}</p>
        <p>
        ${movie.overview}
        </p>
        <h5>Genres</h5>
        <ul class="list-group"
        ${genreList}
        </ul>
        <a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
    </div>
    `
    bottom.innerHTML = `
    <h2>Movie Info</h2>
    <ul>
      <li><span class="text-secondary">Budget:</span> $${moneyFormatter.format(movie.budget)}</li>
      <li><span class="text-secondary">Revenue:</span> $${moneyFormatter.format(movie.revenue)}</li>
      <li><span class="text-secondary">Runtime:</span> ${movie.runtime} minutes</li>
      <li><span class="text-secondary">Status:</span> ${movie.status}</li>
    </ul>
    <h4>Production Companies</h4>
    <div class="list-group">${getProdCompanies(movie.production_companies)}</div>
    `

    top.appendChild(top_1);
    top.appendChild(top_2);
    document.getElementById('movie-details').appendChild(bottom);
}

//Fetch data from TMDB API
async function fetchData(endpoint) {
    document.querySelector('.spinner').classList.add('show');
    const API_KEY = '78fb183b10a53073c151977cb08cc1c6';
    const API_URL = "https://api.themoviedb.org/3/";

    const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);

    const data = await response.json();

    document.querySelector('.spinner').classList.remove('show');
    return data;
}

//Highlight active link
function highlightActiveLink() {
    const allLinks = document.querySelectorAll('.nav-link');
    allLinks.forEach((link) => {
        if(link.getAttribute('href') === state.currentPage) {
            link.classList.add('active');
        }
    });
}

async function showSlider() {
    const {results} = await fetchData(`movie/now_playing`);
    const wrapper = document.querySelector('.swiper-wrapper');
    console.log(results);
    results.forEach((movie) => {
        const card = document.createElement('div');
        card.classList.add('swiper-slide');
        card.innerHTML = `
        <a href="movie-details.html?id=${movie.id}">
          <img src="${imageUrl(movie.poster_path) ? imageUrl(movie.poster_path) : '../images/no-image.jpg'}" alt="${movie.title}" />
        </a>
        <h4 class="swiper-rating">
          <i class="fas fa-star text-secondary"></i> ${Math.round(movie.vote_average * 10) / 10} / 10
        </h4>
        `;
        wrapper.appendChild(card);
    });

    const swiper = new Swiper('.swiper', {
        speed: 400,
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
        }
      });
}

//Init app
function init() {
    switch (state.currentPage) {
        case '/':
        case '/index.html':
            displayPopularMovies();
            showSlider();
        break;
        case '/shows.html':
            displayPopularTVShows();
        break;
        case '/movie-details.html':
            displayMovieDetails();
        break;
        case '/tv-details.html':
            displayTVshowDetails();
        break;
        case '/search.html':
        break;
    }
    highlightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);