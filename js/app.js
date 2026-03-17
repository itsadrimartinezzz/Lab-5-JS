const postsContainer = document.getElementById("postsContainer");
const stateText = document.getElementById("state");
const retryBtn = document.getElementById("retryBtn");

const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const btnAll = document.getElementById("btnAll");

const postForm = document.getElementById("postForm");
const titleInput = document.getElementById("title");
const bodyInput = document.getElementById("body");
const userIdInput = document.getElementById("userId");
const createMessage = document.getElementById("createMessage");

let lastQuery = "";

function setState(text) {
  stateText.textContent = text;
}

function showRetry(show) {
  retryBtn.style.display = show ? "block" : "none";
}

function renderPosts(posts) {
  postsContainer.innerHTML = "";

  if (posts.length === 0) {
    setState("Empty");
    return;
  }

  posts.forEach(function(post) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${post.title}</h3>
      <p>${post.body}</p>
      <small>User ID: ${post.userId}</small>
    `;
    postsContainer.appendChild(card);
  });

  setState("Success");
}

function loadPosts() {
  setState("Loading");
  showRetry(false);
  postsContainer.innerHTML = "";

  fetch("https://dummyjson.com/posts")
    .then(function(response) {
      if (!response.ok) {
        throw new Error("Error");
      }
      return response.json();
    })
    .then(function(data) {
      renderPosts(data.posts);
    })
    .catch(function() {
      setState("Error");
      showRetry(true);
    });
}

function searchPosts(query) {
  setState("Loading");
  showRetry(false);
  postsContainer.innerHTML = "";

  fetch("https://dummyjson.com/posts/search?q=" + encodeURIComponent(query))
    .then(function(response) {
      if (!response.ok) {
        throw new Error("Error");
      }
      return response.json();
    })
    .then(function(data) {
      renderPosts(data.posts);
    })
    .catch(function() {
      setState("Error");
      showRetry(true);
    });
}

function createPost(title, body, userId) {
  createMessage.textContent = "Loading";

  fetch("https://dummyjson.com/posts/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: title,
      body: body,
      userId: Number(userId)
    })
  })
    .then(function(response) {
      if (!response.ok) {
        throw new Error("Error");
      }
      return response.json();
    })
    .then(function(data) {
      createMessage.textContent = "Success";

      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3>${data.title}</h3>
        <p>${data.body}</p>
        <small>User ID: ${data.userId}</small>
      `;
      postsContainer.prepend(card);
      setState("Success");

      postForm.reset();
    })
    .catch(function() {
      createMessage.textContent = "Error";
    });
}

searchForm.addEventListener("submit", function(e) {
  e.preventDefault();
  const query = searchInput.value.trim();
  lastQuery = query;

  if (query === "") {
    loadPosts();
  } else {
    searchPosts(query);
  }
});

btnAll.addEventListener("click", function() {
  searchInput.value = "";
  lastQuery = "";
  loadPosts();
});

postForm.addEventListener("submit", function(e) {
  e.preventDefault();

  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();
  const userId = userIdInput.value.trim();

  if (title === "" || body === "" || userId === "") {
    createMessage.textContent = "Error";
    return;
  }

  createPost(title, body, userId);
});

retryBtn.addEventListener("click", function() {
  if (lastQuery === "") {
    loadPosts();
  } else {
    searchPosts(lastQuery);
  }
});

loadPosts();