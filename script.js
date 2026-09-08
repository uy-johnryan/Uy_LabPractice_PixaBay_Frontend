const API_URL = "https://pixabay.com/api/";
const VIDEO_API_URL = "https://pixabay.com/api/videos/";

const searchInput = document.getElementById("searchInput");
const searchType = document.getElementById("searchType");
const searchButton = document.getElementById("searchButton");

const rocketButton = document.getElementById("rocketButton");
const basketballButton = document.getElementById("basketballButton");
const forestButton = document.getElementById("forestButton");
const roadForestButton = document.getElementById("roadForestButton");

const status = document.getElementById("status");
const results = document.getElementById("results");


// ==========================================
// Normal Search
// ==========================================

searchButton.addEventListener("click", function () {

    const searchTerm = searchInput.value.trim();
    const type = searchType.value;

    if (searchTerm === "") {
        status.textContent = "Please enter a search term.";
        return;
    }

    searchPixabay(searchTerm, type);

});


// ==========================================
// Challenge 1: Rocket Launch
// Video + Science + Editor's Choice
// ==========================================

rocketButton.addEventListener("click", function () {

    searchChallenge({
        type: "video",
        query: "rocket launch",
        category: "science",
        editors_choice: true,
        per_page: 3
    });

});


// ==========================================
// Challenge 2: Basketball
// Video + Sports + Latest
// ==========================================

basketballButton.addEventListener("click", function () {

    searchChallenge({
        type: "video",
        query: "basketball",
        category: "sports",
        order: "latest",
        per_page: 3
    });

});


// ==========================================
// Challenge 3: Forest
// Video + Background + Editor's Choice
// + Latest
// ==========================================

forestButton.addEventListener("click", function () {

    searchChallenge({
        type: "video",
        query: "forest",
        category: "backgrounds",
        editors_choice: true,
        order: "latest",
        per_page: 3
    });

});


// ==========================================
// Challenge 4: Road Forest
// Photo + Nature + Editor's Choice
// ==========================================

roadForestButton.addEventListener("click", function () {

    searchChallenge({
        type: "photo",
        query: "road forest",
        image_type: "photo",
        category: "nature",
        editors_choice: true,
        per_page: 3
    });

});


// ==========================================
// Normal Pixabay Search
// ==========================================

async function searchPixabay(searchTerm, type) {

    status.textContent = "Loading...";
    results.innerHTML = "";

    try {

        let url;

        if (type === "photo") {

            url =
                `${API_URL}?key=${PIXABAY_API_KEY}` +
                `&q=${encodeURIComponent(searchTerm)}` +
                `&image_type=photo` +
                `&per_page=12`;

        } else {

            url =
                `${VIDEO_API_URL}?key=${PIXABAY_API_KEY}` +
                `&q=${encodeURIComponent(searchTerm)}` +
                `&per_page=12`;

        }


        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Request failed");
        }


        const data = await response.json();


        if (data.hits.length === 0) {

            status.textContent = "No results found.";
            return;

        }


        status.textContent = `Showing results for "${searchTerm}"`;


        if (type === "photo") {

            displayPhotos(data.hits);

        } else {

            displayVideos(data.hits);

        }


    } catch (error) {

        status.textContent =
            "An error occurred while loading the results.";

        console.error(error);

    }

}


// ==========================================
// Challenge Search
// ==========================================

async function searchChallenge(parameters) {

    status.textContent = "Loading...";
    results.innerHTML = "";

    try {

        let baseURL;

        if (parameters.type === "photo") {
            baseURL = API_URL;
        } else {
            baseURL = VIDEO_API_URL;
        }


        const url = new URL(baseURL);

        url.searchParams.set("key", PIXABAY_API_KEY);
        url.searchParams.set("q", parameters.query);


        if (parameters.type === "photo") {

            url.searchParams.set(
                "image_type",
                parameters.image_type
            );

        }


        if (parameters.category) {

            url.searchParams.set(
                "category",
                parameters.category
            );

        }


        if (parameters.editors_choice) {

            url.searchParams.set(
                "editors_choice",
                "true"
            );

        }


        if (parameters.order) {

            url.searchParams.set(
                "order",
                parameters.order
            );

        }


        url.searchParams.set(
            "per_page",
            parameters.per_page
        );


        const response = await fetch(url);


        if (!response.ok) {
            throw new Error("Request failed");
        }


        const data = await response.json();


        if (data.hits.length === 0) {

            status.textContent = "No results found.";
            return;

        }


        status.textContent =
            `Showing ${data.hits.length} results for "${parameters.query}"`;


        if (parameters.type === "photo") {

            displayPhotos(data.hits);

        } else {

            displayVideos(data.hits);

        }


    } catch (error) {

        status.textContent =
            "An error occurred while loading the results.";

        console.error(error);

    }

}


// ==========================================
// Display Photos
// ==========================================

function displayPhotos(photos) {

    photos.forEach(function (photo) {

        const card = document.createElement("div");

        card.classList.add("result-card");


        card.innerHTML = `
            <img
                src="${photo.webformatURL}"
                alt="${photo.tags}"
            >

            <div class="result-info">
                ${photo.tags}
            </div>
        `;


        results.appendChild(card);

    });

}


// ==========================================
// Display Videos
// ==========================================

function displayVideos(videos) {

    videos.forEach(function (video) {

        const card = document.createElement("div");

        card.classList.add("result-card");


        card.innerHTML = `
            <video controls>
                <source
                    src="${video.videos.medium.url}"
                    type="video/mp4"
                >
            </video>

            <div class="result-info">
                ${video.tags}
            </div>
        `;


        results.appendChild(card);

    });

}