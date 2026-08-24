(() => {
const POSTS = window.TAMP_EDUCATION_BLOG_POSTS || [];
let audience = "All", category = "All", query = "";
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const text = v => String(v ?? "").toLowerCase().trim();
const esc = v => String(v ?? "").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
const cats = ["All", ...new Set(POSTS.map(p=>p.category))];

function renderCategories() {
    const select = $("#categorySelect");

    if (!select) return;

    select.innerHTML = cats.map(categoryName => `
        <option value="${esc(categoryName)}"
            ${categoryName === category ? "selected" : ""}>
            ${esc(categoryName === "All" ? "All Categories" : categoryName)}
        </option>
    `).join("");

    select.onchange = () => {
        category = select.value;
        renderPosts();
    };
}


const input = $("#blogSearch");
const button = $("#searchButton");

input?.addEventListener("input", () => {
    query = input.value;
    category = "All";
    renderCategories();
    renderPosts();
});

button?.addEventListener("click", (event) => {
    event.preventDefault();

    query = input.value;
    category = "All";

    renderCategories();
    renderPosts();
});

input?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();

        query = input.value;
        category = "All";

        renderCategories();
        renderPosts();
    }
});

function filtered(){
  const q=text(query);
  return POSTS.filter(p=>{
    const a=audience==="All"||p.audience===audience;
    const c=category==="All"||p.category===category;
    const hay=text([p.title,p.excerpt,p.content,p.category,p.audience,p.keywords].join(" "));
    return a&&c&&(!q||hay.includes(q));
  });
}
function renderPosts(){
  const grid=$("#postGrid"), count=$("#resultsLine"); if(!grid)return;
  const posts=filtered();
  if(count)count.textContent=`${posts.length} ${posts.length===1?"article":"articles"} found`;
  grid.innerHTML=posts.length?posts.map((p,i)=>`
    <article class="post-card">
      <div class="post-topline"><span class="audience-pill ${text(p.audience)}">${esc(p.audience)}</span><span class="post-number">${String(i+1).padStart(2,"0")}</span></div>
      <span class="category">${esc(p.category)}</span>
      <h3>${esc(p.title)}</h3><p>${esc(p.excerpt)}</p>
      <div class="post-footer"><button type="button" class="read-btn" data-id="${p.id}">Read more →</button><span>TAMP EDUCATION</span></div>
    </article>`).join(""):`<div class="no-results"><div>⌕</div><h3>No article matched your search.</h3><p>Try “ballet”, “school”, “Lagos”, “chess”, “parenting” or “adult classes”.</p><button type="button" class="primary-btn" id="resetSearch">Show all articles</button></div>`;
  $$("#postGrid .read-btn").forEach(b=>b.onclick=()=>openArticle(+b.dataset.id));
  $("#resetSearch")?.addEventListener("click",reset);
}
function openArticle(id){
  const p=POSTS.find(x=>x.id===id); if(!p)return;
  $("#modalAudience").textContent=p.audience;$("#modalCategory").textContent=p.category;
  $("#modalTitle").textContent=p.title;$("#modalExcerpt").textContent=p.excerpt;
  $("#modalContent").innerHTML="";
  String(p.content||"").split(/\n+/).filter(Boolean).forEach(s=>{const el=document.createElement("p");el.textContent=s;$("#modalContent").appendChild(el);});
  $("#articleModal").classList.add("open");document.body.classList.add("modal-open");
}
function closeArticle(){$("#articleModal")?.classList.remove("open");document.body.classList.remove("modal-open");}
function reset(){audience="All";category="All";query="";if($("#blogSearch"))$("#blogSearch").value="";updateAudience();renderCategories();renderPosts();}
function updateAudience(){$$("[data-audience]").forEach(b=>b.classList.toggle("active",b.dataset.audience===audience));}
function selectAudience(a){audience=a;category="All";updateAudience();renderCategories();renderPosts();$("#articles")?.scrollIntoView({behavior:"smooth"});}
function init(){
  $("#year").textContent=new Date().getFullYear();
  const input=$("#blogSearch");
  input?.addEventListener("input",()=>{query=input.value;category="All";renderCategories();renderPosts();});
  $("#searchButton")?.addEventListener("click",e=>{e.preventDefault();query=input?.value||"";category="All";renderCategories();renderPosts();});
  input?.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();query=input.value;category="All";renderCategories();renderPosts();}});
  $("#clearSearch")?.addEventListener("click",e=>{e.preventDefault();query="";input.value="";category="All";renderCategories();renderPosts();input.focus();});
  $$("[data-audience]").forEach(b=>b.addEventListener("click",()=>selectAudience(b.dataset.audience)));
  $("#modalClose")?.addEventListener("click",closeArticle);
  $("#articleModal")?.addEventListener("click",e=>{if(e.target.id==="articleModal")closeArticle();});
  document.addEventListener("keydown",e=>{if(e.key==="Escape")closeArticle();});
  $("#blogMenu")?.addEventListener("click",()=>$("#blogNavLinks")?.classList.toggle("open"));
  const p=POSTS[0];
  if(p&&$("#featuredCard")){
    $("#featuredCard").innerHTML=`<div class="featured-copy"><div class="post-meta"><span>${esc(p.audience)}</span><span>${esc(p.category)}</span></div><h2>${esc(p.title)}</h2><p>${esc(p.excerpt)}</p><button type="button" class="primary-btn" id="featuredRead">Read the article →</button></div><div class="featured-visual">

    <img
        class="featured-image"
        src="images/blog.jpg"
        alt="TAMP Education featured article"
    >

    <div class="visual-bubble">
        Learn.<br>
        Grow.<br>
        Thrive.
    </div>

</div>;
`;


    $("#featuredRead").onclick=()=>openArticle(p.id);
  }
  updateAudience();renderCategories();renderPosts();
}
document.readyState==="loading"?document.addEventListener("DOMContentLoaded",init):init();
})();