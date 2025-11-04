let orderBy = "createdAt";
let orderDirection = "desc";
let page = 2;
const limit = 10;
let loading = false;
const container = document.querySelector(".columns-1");
const loader = document.getElementById("loader");
const sortSelect = document.getElementById("sort");
sortSelect.addEventListener("change", onSortChange);

function resetPage() {
  page = 1;
  container.innerHTML = "";
  loading = false;
  loader.classList.add("hidden");
}

function onSortChange(event) {
  const [field, direction] = event.target.value.split("|");
  orderBy = field;
  orderDirection = direction;
  resetPage();
  window.removeEventListener("scroll", handleScroll);
  window.addEventListener("scroll", handleScroll);
  loadMorePosts();
}

function createPostDiv(post) {
  const container = document.createElement("div");
  container.className =
    "break-inside-avoid bg-white rounded-lg shadow mb-4 overflow-hidden";

  let contentWrapper;

  if (post.imageUri) {
    const link = document.createElement("a");
    link.href = `/web/posts/${post.id}`;

    const img = document.createElement("img");
    img.src = post.imageUri;
    img.alt = "Pin Image";
    img.className = "w-full rounded-t-lg";

    link.appendChild(img);
    container.appendChild(link);

    contentWrapper = document.createElement("div");
    contentWrapper.className = "p-4";
    link.appendChild(contentWrapper);
  } else {
    contentWrapper = document.createElement("div");
    contentWrapper.className = "p-4";
    container.appendChild(contentWrapper);
  }

  const title = document.createElement("h2");
  title.className = "font-semibold text-lg text-gray-900 mb-2";
  title.textContent = post.title || "";
  contentWrapper.appendChild(title);

  const desc = document.createElement("p");
  desc.className = "text-gray-700 mb-3";
  desc.textContent = post.description || "";
  contentWrapper.appendChild(desc);

  if (post.comments && post.comments.length > 0) {
    const commentsDiv = document.createElement("div");
    commentsDiv.className = "border-t border-gray-200 pt-2 mt-2";

    const commentsTitle = document.createElement("h3");
    commentsTitle.className = "text-sm font-semibold text-gray-600 mb-1";
    commentsTitle.textContent = "Comments";
    commentsDiv.appendChild(commentsTitle);

    const ul = document.createElement("ul");
    ul.className = "space-y-2";

    post.comments.slice(0, 3).forEach((comment) => {
      const li = document.createElement("li");
      li.className = "text-sm text-gray-700 bg-gray-50 p-2 rounded-md";
      li.innerHTML = `<span class="font-semibold">${
        comment.usuario?.name || "Anonymous"
      }:</span> ${comment.description || "(no text)"}`;
      ul.appendChild(li);
    });

    commentsDiv.appendChild(ul);

    const note = document.createElement("p");
    note.className = "text-xs text-gray-500 mt-1 italic";
    note.textContent = "Only showing first 3 comments...";
    commentsDiv.appendChild(note);

    contentWrapper.appendChild(commentsDiv);
  } else {
    const noComments = document.createElement("p");
    noComments.className = "text-sm text-gray-400 italic";
    noComments.textContent = "No comments yet.";
    contentWrapper.appendChild(noComments);
  }

  const form = document.createElement("form");
  form.action = "/api/posts";
  form.method = "POST";
  form.className = "mt-3 border-t border-gray-200 pt-3";

  const formWrapper = document.createElement("div");
  formWrapper.className = "flex items-center gap-2";

  const hiddenInput = document.createElement("input");
  hiddenInput.type = "number";
  hiddenInput.name = "parentId";
  hiddenInput.style.display = "none";
  hiddenInput.value = post.id;

  const textInput = document.createElement("input");
  textInput.type = "text";
  textInput.name = "description";
  textInput.placeholder = "Add a comment...";
  textInput.required = true;
  textInput.className =
    "flex-1 border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-red-400";

  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.className =
    "px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition";
  submitBtn.textContent = "Post";

  formWrapper.appendChild(hiddenInput);
  formWrapper.appendChild(textInput);
  formWrapper.appendChild(submitBtn);
  form.appendChild(formWrapper);

  container.appendChild(form);

  return container;
}

async function loadMorePosts() {
  if (loading) return;
  loading = true;
  loader.classList.remove("hidden");

  try {
    const posts = await fetch(
      `/web/users/feed?page=${page}&limit=${limit}&orderBy=${orderBy}&direction=${orderDirection}&json=true`
    ).then((res) => res.json());

    if (!posts.length) {
      window.removeEventListener("scroll", handleScroll);
      return;
    }

    posts.forEach((post) => {
      const postDiv = createPostDiv(post);
      container.appendChild(postDiv);
    });

    page++;
  } catch (err) {
    console.error(err);
  } finally {
    loader.classList.add("hidden");
    loading = false;
  }
}

function handleScroll() {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
    loadMorePosts();
  }
}

window.addEventListener("scroll", handleScroll);
