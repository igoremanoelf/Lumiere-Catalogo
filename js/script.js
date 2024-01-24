let pagsListMovies = [];
let pagOfDisplay = 0;

const btnTheme = document.querySelector('.btn-theme');
const logo = document.querySelector('.logo');
const root = document.querySelector(":root");

const btnArrowLeft = document.querySelector('.btn-prev');
const btnArrowRight = document.querySelector('.btn-next');
const moviesContainer = document.querySelector('.movies');

const modal = document.querySelector('.modal');
const modalBody = document.querySelector('.modal__body');
const btnCloseModal = document.querySelector('.modal__close');
const modalTitle = document.querySelector('.modal__title');
const modalImg = document.querySelector('.modal__img');
const modalDescription = document.querySelector('.modal__description');
const modalGenreAverage = document.querySelector('.modal__genre-average');
const modalGenres = document.querySelector('.modal__genres');
const modalAverage = document.querySelector('.modal__average');

const highlightVideo = document.querySelector('.highlight__video');
const highlightTitle = document.querySelector('.highlight__title');
const highlightRating = document.querySelector('.highlight__rating');
const highlightGenresLaunch = document.querySelector('.highlight__genres-launch');
const highlightGenres = document.querySelector('.highlight__genres');
const highlightLaunch = document.querySelector('.highlight__launch');
const highlightDescription = document.querySelector('.highlight__description');
const highlightVideoLink = document.querySelector('.highlight__video-link');

const inputMovies = document.querySelector('.input');

async function loadMovies() {
    try {
        const response = await api.get('/discover/movie?language=pt-BR&include_adult=false');

        let movies = "";

        if (response.data.results.length < 7) {
            movies = 1;
        } else if (response.data.results < 13) {
            movies = 2;
        } else {
            movies = 3;
        }

        for (let i = 0; i < movies; i++) {
            pagsListMovies.push(response.data.results.splice(0, 6))
        }


    } catch (error) {
        console.log(error.response)
    }
    createMoviePoster(pagsListMovies[0]);
}

function createMoviePoster(pagsListMovies) {
    moviesContainer.innerHTML = "";
    for (const movie of pagsListMovies) {
        const posterMovie = document.createElement('div');
        const movieInfo = document.createElement('div');
        const movieTitle = document.createElement('span');
        const movieRating = document.createElement('span');
        const starRating = document.createElement('img');

        posterMovie.classList.add('movie');
        movieInfo.classList.add('movie__info');
        movieTitle.classList.add('movie__title');
        movieRating.classList.add('movie__rating');

        moviesContainer.appendChild(posterMovie);
        posterMovie.appendChild(movieInfo);
        movieInfo.appendChild(movieTitle);

        movieInfo.appendChild(movieRating);
        movieInfo.appendChild(starRating);

        if (!movie.poster_path) {
            posterMovie.style.backgroundImage = "url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR81NhuqnB9GoQYLnc4Gn3BO_GFpgNpsnKznEcaAdFK-Fr6FMEZYIh3Kdj_4HrBo0K0znk&usqp=CAU)";
        } else {
            posterMovie.style.backgroundImage = `url(${movie.poster_path})`;
        }


        movieTitle.textContent = movie.title;
        movieRating.textContent = movie.vote_average;
        movieRating.style.color = 'white';
        starRating.src = './assets/rating.svg';
        starRating.style.color = 'var(--rating-color)';

        posterMovie.addEventListener('click', (event) => {
            event.preventDefault();

            openModal(movie.id);
        })
    }
}

btnTheme.addEventListener('click', () => {
    const currentBackground = root.style.getPropertyValue('--background');

    if (!currentBackground || currentBackground === '#FFFFFF') {
        root.style.setProperty('--background', '#1B2028');
        root.style.setProperty('--text-color', '#FFFFFF');
        root.style.setProperty('--bg-secondary', '#2D3440');
        btnTheme.src = './assets/dark-mode.svg';
        logo.src = './assets/logo.svg';
        btnArrowLeft.src = './assets/arrow-left-light.svg';
        btnArrowRight.src = './assets/arrow-right-light.svg';
        return;
    }

    root.style.setProperty('--background', '#FFFFFF');
    root.style.setProperty('--text-color', '#1b2028');
    root.style.setProperty('--bg-secondary', '#EDEDED');
    btnTheme.src = './assets/light-mode.svg';
    logo.src = './assets/logo-dark.png';
    btnArrowLeft.src = './assets/arrow-left-dark.svg';
    btnArrowRight.src = './assets/arrow-right-dark.svg';
})

btnArrowRight.addEventListener('click', (event) => {
    event.stopPropagation;
    if (pagOfDisplay === 2) {
        pagOfDisplay = 0;
    } else {
        pagOfDisplay++;
    }
    createMoviePoster(pagsListMovies[pagOfDisplay])
})

btnArrowLeft.addEventListener('click', (event) => {
    event.stopPropagation;
    if (pagOfDisplay > 0) {
        pagOfDisplay--;
    }
    createMoviePoster(pagsListMovies[pagOfDisplay])
})

modal.addEventListener('click', (event) => {
    event.stopPropagation();
    modal.classList.toggle('hidden');
    modalGenres.innerHTML = "";
})

btnCloseModal.addEventListener('click', (event) => {
    event.stopPropagation();
    modal.classList.toggle('hidden');
    modalGenres.innerHTML = "";
})

async function openModal(id_movie) {
    const movieClick = await api.get(`movie/${id_movie}?language=pt-BR`);

    modal.classList.remove('hidden');

    modalTitle.textContent = movieClick.data.title;
    modalImg.src = movieClick.data.backdrop_path;
    modalDescription.textContent = movieClick.data.overview;
    modalAverage.textContent = parseFloat(movieClick.data.vote_average.toFixed(1));

    movieClick.data.genres.forEach(element => {
        const genresMovie = document.createElement('span');
        genresMovie.classList.add('modal__genre');
        modalGenres.appendChild(genresMovie);

        genresMovie.textContent = element.name;
    });
}

async function movieOfTheDay() {
    const response = await api.get('/movie/436969?language=pt-BR');

    highlightVideo.style.backgroundImage = `url(${response.data.backdrop_path})`;
    highlightVideo.style.backgroundSize = 'cover';
    highlightTitle.textContent = response.data.title;
    highlightRating.textContent = response.data.vote_average.toFixed(1);
    highlightGenres.innerText = response.data.genres.map((genresMovie) =>
        genresMovie.name
    ).join(", ");
    highlightDescription.textContent = response.data.overview;

    function formatDate(responseDate) {
        const dateLaunchMovie = responseDate.split("-").map(Number);
        const year = dateLaunchMovie[0];
        const month = dateLaunchMovie[1];
        const day = dateLaunchMovie[2];

        const date = new Date(year, month, day);

        return date.toLocaleDateString("pt-BR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            timeZone: "UTC",
        });
    }

    highlightLaunch.innerText = "/ " + formatDate(response.data.release_date);
}

async function videoMovie() {
    const response = await api.get('movie/436969/videos?language=pt-BR');

    const referenceMovieOfTheDay = response.data.results[0].key;
    const youtube = "https://www.youtube.com/watch?v=";

    highlightVideoLink.href = youtube.concat(referenceMovieOfTheDay);
}

async function searchMovies(movieSelected) {
    if (inputMovies.value === "") {
        pagsListMovies = [];
        loadMovies();
    }
    try {
        const response = await api.get(`/search/movie?language=pt-BR&include_adult=false&query=${movieSelected}`);
        pagsListMovies = [];

        let movies = "";

        if (response.data.results.length < 7) {
            movies = 1;
        } else if (response.data.results < 13) {
            movies = 2;
        } else {
            movies = 3;
        }

        for (let i = 0; i < movies; i++) {
            pagsListMovies.push(response.data.results.splice(0, 6))
        }
    } catch (error) {
        console.log(error);
        pagsListMovies = [];
        loadMovies();
    }
    createMoviePoster(pagsListMovies[0]);
}

inputMovies.addEventListener('keypress', (event) => {
    event.stopPropagation;
    if (event.key !== 'Enter') {
        return;
    }
    searchMovies(inputMovies.value)
    createMoviePoster(pagsListMovies[0]);
    inputMovies.value = "";

});

loadMovies();
videoMovie();
movieOfTheDay();















