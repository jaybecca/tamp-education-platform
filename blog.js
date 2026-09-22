(() => {
  const POSTS = window.TAMP_EDUCATION_BLOG_POSTS || [];
  let audience = "All";
  let category = "All";
  let query = "";

  const $ = selector => document.querySelector(selector);
  const $$ = selector => Array.from(document.querySelectorAll(selector));
  const text = value => String(value ?? "").toLowerCase().trim();
  const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));

  const cats = ["All", ...new Set(POSTS.map(post => post.category))];

  function renderCategories() {
    const select = $("#categorySelect");
    if (!select) return;

    select.innerHTML = cats.map(categoryName => `
      <option value="${esc(categoryName)}" ${categoryName === category ? "selected" : ""}>
        ${esc(categoryName === "All" ? "All Categories" : categoryName)}
      </option>
    `).join("");

    select.onchange = () => {
      category = select.value;
      renderPosts();
    };
  }

  function filtered() {
    const q = text(query);

    return POSTS.filter(post => {
      const matchesAudience = audience === "All" || post.audience === audience;
      const matchesCategory = category === "All" || post.category === category;
      const searchableText = text([
        post.title,
        post.excerpt,
        post.content,
        post.category,
        post.audience,
        post.keywords
      ].join(" "));

      return matchesAudience && matchesCategory && (!q || searchableText.includes(q));
    });
  }

  function renderPosts() {
    const grid = $("#postGrid");
    const count = $("#resultsLine");
    if (!grid) return;

    const posts = filtered();
    if (count) {
      count.textContent = `${posts.length} ${posts.length === 1 ? "article" : "articles"} found`;
    }

    grid.innerHTML = posts.length
      ? posts.map((post, index) => `
        <article class="post-card">
          <div class="post-topline">
            <span class="audience-pill ${text(post.audience)}">${esc(post.audience)}</span>
            <span class="post-number">${String(index + 1).padStart(2, "0")}</span>
          </div>
          <span class="category">${esc(post.category)}</span>
          <h3>${esc(post.title)}</h3>
          <p>${esc(post.excerpt)}</p>
          <div class="post-footer">
            <button type="button" class="read-btn" data-id="${post.id}">Read more →</button>
            <span>TAMP EDUCATION</span>
          </div>
        </article>
      `).join("")
      : `
        <div class="no-results">
          <div>⌕</div>
          <h3>No article matched your search.</h3>
          <p>Try “ballet”, “school”, “Lagos”, “chess”, “parenting” or “adult classes”.</p>
          <button type="button" class="primary-btn" id="resetSearch">Show all articles</button>
        </div>
      `;

    $$("#postGrid .read-btn").forEach(button => {
      button.onclick = () => openArticle(Number(button.dataset.id));
    });

    $("#resetSearch")?.addEventListener("click", reset);
  }

  function openArticle(id) {
    const post = POSTS.find(item => item.id === id);
    if (!post) return;

    $("#modalAudience").textContent = post.audience;
    $("#modalCategory").textContent = post.category;
    $("#modalTitle").textContent = post.title;
    $("#modalExcerpt").textContent = post.excerpt;
    $("#modalContent").innerHTML = "";

    String(post.content || "")
      .split(/\n+/)
      .filter(Boolean)
      .forEach(paragraph => {
        const element = document.createElement("p");
        element.textContent = paragraph;
        $("#modalContent").appendChild(element);
      });

    $("#articleModal").classList.add("open");
    document.body.classList.add("modal-open");
  }

  function closeArticle() {
    $("#articleModal")?.classList.remove("open");
    document.body.classList.remove("modal-open");
  }

  function reset() {
    audience = "All";
    category = "All";
    query = "";

    const input = $("#blogSearch");
    if (input) input.value = "";

    updateAudience();
    renderCategories();
    renderPosts();
  }

  function updateAudience() {
    $$('[data-audience]').forEach(button => {
      button.classList.toggle("active", button.dataset.audience === audience);
    });
  }

  function selectAudience(value) {
    audience = value;
    category = "All";
    updateAudience();
    renderCategories();
    renderPosts();
    $("#articles")?.scrollIntoView({ behavior: "smooth" });
  }

  function init() {
    const year = $("#year");
    if (year) year.textContent = new Date().getFullYear();

    const input = $("#blogSearch");
    const searchIcon = $("#searchIcon");

    input?.addEventListener("input", () => {
      query = input.value;
      category = "All";
      renderCategories();
      renderPosts();
    });

    input?.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        event.preventDefault();
        reset();
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        query = input.value;
        category = "All";
        renderCategories();
        renderPosts();
      }
    });

    searchIcon?.addEventListener("click", () => input?.focus());

    $$('[data-audience]').forEach(button => {
      button.addEventListener("click", () => selectAudience(button.dataset.audience));
    });

    $("#modalClose")?.addEventListener("click", closeArticle);
    $("#articleModal")?.addEventListener("click", event => {
      if (event.target.id === "articleModal") closeArticle();
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeArticle();
    });

    $("#blogMenu")?.addEventListener("click", () => {
      $("#blogNavLinks")?.classList.toggle("open");
    });

    const featured = POSTS[0];
    if (featured && $("#featuredCard")) {
      $("#featuredCard").innerHTML = `
        <div class="featured-copy">
          <div class="post-meta">
            <span>${esc(featured.audience)}</span>
            <span>${esc(featured.category)}</span>
          </div>
          <h2>${esc(featured.title)}</h2>
          <p>${esc(featured.excerpt)}</p>
          <button type="button" class="primary-btn" id="featuredRead">Read the article →</button>
        </div>
        <div class="featured-visual">
          <img class="featured-image" src="images/blog.jpg" alt="TAMP Education featured article">
          <div class="visual-bubble">
            Learn.<br>
            Grow.<br>
            Thrive.
          </div>
        </div>
      `;

      $("#featuredRead").onclick = () => openArticle(featured.id);
    }

    updateAudience();
    renderCategories();
    renderPosts();
  }

  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", init)
    : init();
})();
