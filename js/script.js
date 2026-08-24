// TAMP Education JavaScript


window.addEventListener("load", () => {

    const loader = document.getElementById("loader");

    if(loader){

        loader.style.display = "none";

    }

});


/* FAQ Accordion */

const faqQuestions = document.querySelectorAll(".faq-question");

faqQuestions.forEach(question => {

    question.addEventListener("click", () => {

        const answer = question.nextElementSibling;

        const icon = question.querySelector("span");

        if (answer.style.maxHeight) {

            answer.style.maxHeight = null;
            icon.textContent = "+";

        } else {

            document.querySelectorAll(".faq-answer").forEach(item => {
                item.style.maxHeight = null;
            });

            document.querySelectorAll(".faq-question span").forEach(item => {
                item.textContent = "+";
            });

            answer.style.maxHeight = answer.scrollHeight + "px";
            icon.textContent = "−";
        }

    });

});

//==============================
// GALLERY DATA
//==============================

const galleryData = {

    dance: [

        {image:"images/gallery/dance1.jpg", title:"Dance Performance", desc:"Building confidence through dance."},
        {image:"images/gallery/dance2.jpg", title:"Ballet Stretch", desc:"Flexibility learning."},
        {image:"images/gallery/dance3.jpg", title:"Performance Day", desc:"Students showcasing their talents."},
        {image:"images/gallery/dance4.jpg", title:"Hip-hop Dance Training", desc:"Expressing creativity through movement."},
        {image:"images/gallery/dance5.jpg", title:"Ballet Dance Poise", desc:"A moment for the camera."},
        {image:"images/gallery/dance6.jpg", title:"Ballet Dance", desc:"Learning rhythm and movement."},
        {image:"images/gallery/dance7.jpg", title:"Group Performance", desc:"Working together as one team."},
        {image:"images/gallery/dance8.jpg", title:"Dance Showcase", desc:"Celebrating every achievement."}

    ],

    sports: [

        {image:"images/gallery/sports1.jpg", title:"Gymnastics", desc:"Learning teamwork and discipline."},
        {image:"images/gallery/sports2.jpg", title:"Sports Day", desc:"Healthy competition and fun."},
        {image:"images/gallery/sports3.jpg", title:"Swimming", desc:"Building confidence in water."},
        {image:"images/gallery/sports4.jpg", title:"Taekwondo", desc:"Developing focus and respect."},
        {image:"images/gallery/sports5.jpg", title:"Chess Competition", desc:"Strategic thinking in action."},
        {image:"images/gallery/sports6.jpg", title:"Swimming Tests", desc:"Fitness through play."},
        {image:"images/gallery/sports7.jpg", title:"Taekwondo Club", desc:"Team spirit at its best."},
        {image:"images/gallery/sports8.jpg", title:"Swim Play Day", desc:"Strength, speed and endurance."}

    ],

    arts: [

        {image:"images/gallery/arts1.jpg", title:"Drama Class", desc:"Storytelling and expressions."},
        {image:"images/gallery/arts2.jpg", title:"Paper Craft", desc:"Hands-on creativity."},
        {image:"images/gallery/arts3.jpg", title:"Creative Arts", desc:"Exploring creativity."},
        {image:"images/gallery/arts4.jpg", title:"Craft Project", desc:"Learning by creating."},
        {image:"images/gallery/arts5.jpg", title:"Art Workshop", desc:"Creative imaginations."},
        {image:"images/gallery/arts6.jpg", title:"Student Artwork", desc:"Celebrating creativity."},
        {image:"images/gallery/arts7.jpg", title:"Craft Display", desc:"Proud moments."},
        {image:"images/gallery/arts8.jpg", title:"Financial Class", desc:"Moments of learning."}

    ]

};

const galleryGrid=document.getElementById("gallery-grid");
const tabs=document.querySelectorAll(".tab-btn");

const lightbox=document.getElementById("lightbox");
const lightboxImg=document.getElementById("lightbox-img");

const captionTitle=document.getElementById("caption-title");
const captionText=document.getElementById("caption-text");

const counter=document.getElementById("image-counter");

const closeBtn=document.querySelector(".close-lightbox");

const prevBtn=document.querySelector(".prev");
const nextBtn=document.querySelector(".next");


let currentCategory = "dance";
let currentImage = 0;
let galleryVisibleCount = 4;

function loadGallery(category) {

    galleryGrid.innerHTML = "";

    const photos = galleryData[category];
    const visiblePhotos = photos.slice(0, galleryVisibleCount);

    visiblePhotos.forEach((photo, index) => {

        galleryGrid.innerHTML += `
            <div class="gallery-item" onclick="openLightbox('${category}',${index})">

                <img
                    src="${photo.image}"
                    alt="${photo.title}"
                    loading="lazy"
                >

                <div class="gallery-overlay">

                    <h4>${photo.title}</h4>

                    <p>${photo.desc}</p>

                </div>

            </div>
        `;

    });

    updateViewMoreButton();
}

function updateViewMoreButton() {

    const viewMoreBtn = document.getElementById("viewMoreBtn");

    if (!viewMoreBtn) return;

    const totalPhotos = galleryData[currentCategory].length;

    if (galleryVisibleCount >= totalPhotos) {

        viewMoreBtn.textContent = "View Less ↑";

    } else {

        viewMoreBtn.textContent = "View More Photos →";

    }
}

loadGallery(currentCategory);

const viewMoreBtn = document.getElementById("viewMoreBtn");

if (viewMoreBtn) {

    viewMoreBtn.addEventListener("click", () => {

        const totalPhotos = galleryData[currentCategory].length;

        if (galleryVisibleCount >= totalPhotos) {

            galleryVisibleCount = 4;

        } else {

            galleryVisibleCount = totalPhotos;

        }

        loadGallery(currentCategory);

    });

}

tabs.forEach(tab=>{

tab.addEventListener("click",()=>{

    tabs.forEach(btn => btn.classList.remove("active"));

    tab.classList.add("active");

    currentCategory = tab.dataset.category;

    galleryVisibleCount = 4;

    loadGallery(currentCategory);

});

tabs.forEach(btn=>btn.classList.remove("active"));



tab.classList.add("active");

currentCategory=tab.dataset.category;

loadGallery(currentCategory);

});

function openLightbox(category,index){

currentCategory=category;

currentImage=index;

updateLightbox();

lightbox.style.display="flex";

}

function updateLightbox(){

const photo=galleryData[currentCategory][currentImage];

lightboxImg.src=photo.image;

captionTitle.textContent=photo.title;

captionText.textContent=photo.desc;

counter.textContent=`${currentImage+1} of ${galleryData[currentCategory].length}`;

}

closeBtn.onclick=()=>{

lightbox.style.display="none";

}

lightbox.onclick=(e)=>{

if(e.target===lightbox){

lightbox.style.display="none";

}

}

nextBtn.onclick=()=>{

currentImage++;

if(currentImage>=galleryData[currentCategory].length){

currentImage=0;

}

updateLightbox();

}

prevBtn.onclick=()=>{

currentImage--;

if(currentImage<0){

currentImage=galleryData[currentCategory].length-1;

}

updateLightbox();

}

document.addEventListener("keydown",(e)=>{

if(e.key==="Escape"){

lightbox.style.display="none";

}

if(e.key==="ArrowRight"){

nextBtn.click();

}

if(e.key==="ArrowLeft"){

prevBtn.click();

}

});

document.getElementById("viewMoreBtn").addEventListener("click",()=>{

alert("More photos coming soon!");

});

//====================================
// SCROLL REVEAL
//====================================

const reveals = document.querySelectorAll(

'.reveal, .reveal-left, .reveal-right, .reveal-zoom'

);

function revealSections(){

    const trigger = window.innerHeight * 0.85;

    reveals.forEach(section=>{

        const top = section.getBoundingClientRect().top;

        if(top < trigger){

            section.classList.add("active");

        }

    });

}

window.addEventListener("scroll", revealSections);

window.addEventListener("load", revealSections);


//==============================
// SCROLL PROGRESS BAR
//==============================

window.addEventListener("scroll",()=>{

const scrollTop=document.documentElement.scrollTop;

const scrollHeight=document.documentElement.scrollHeight-document.documentElement.clientHeight;

const progress=(scrollTop/scrollHeight)*100;

document.getElementById("progressBar").style.width=progress+"%";

});







const form = document.getElementById("form");

if(form){

    form.addEventListener("submit", async function(e){

        e.preventDefault();

        const button = form.querySelector(".contact-btn");
        const original = button.innerHTML;

        button.disabled = true;
        button.innerHTML = "Sending...";

        const formData = new FormData(form);

        try{

            const response = await fetch(
                "https://api.web3forms.com/submit",
                {
                    method:"POST",
                    body:formData
                }
            );

            const result = await response.json();

            if(result.success){

                alert("Message sent successfully!");

                form.reset();

            }else{

                alert(result.message);

            }

        }catch(error){

            alert("Unable to send message.");

        }

        button.disabled = false;
        button.innerHTML = original;

    });

}











// Automatically update copyright year

document.addEventListener("DOMContentLoaded", () => {
    const year = document.getElementById("currentYear");

    if (year) {
        year.textContent = new Date().getFullYear();
    }
});





    /*==============================================
            INPUT FOCUS EFFECT
    ==============================================*/

    const inputs = document.querySelectorAll(

        ".contact-form input, .contact-form textarea, .contact-form select"

    );

    inputs.forEach((input) => {

        input.addEventListener("focus", () => {

            input.parentElement.classList.add("active");

        });

        input.addEventListener("blur", () => {

            if (input.value.trim() === "") {

                input.parentElement.classList.remove("active");

            }

        });

    });


    
/*=========================================
        CUSTOM SELECT DROPDOWN
=========================================*/

document.querySelectorAll(".custom-select").forEach(selectWrapper => {

    const select = selectWrapper.querySelector("select");

    // Selected item
    const selected = document.createElement("div");
    selected.className = "select-selected";
    selected.textContent =
        select.options[select.selectedIndex].text;

    selectWrapper.appendChild(selected);

    // Dropdown list
    const optionList = document.createElement("div");
    optionList.className = "select-items select-hide";

    for (let i = 1; i < select.options.length; i++) {

        const option = document.createElement("div");

        option.textContent = select.options[i].text;

        option.addEventListener("click", function () {

            select.selectedIndex = i;

            selected.textContent = this.textContent;

            optionList.querySelectorAll(".same-as-selected")
                .forEach(el => el.classList.remove("same-as-selected"));

            this.classList.add("same-as-selected");

            optionList.classList.add("select-hide");

            selected.classList.remove("select-arrow-active");

        });

        optionList.appendChild(option);

    }

    selectWrapper.appendChild(optionList);

    selected.addEventListener("click", function (e) {

        e.stopPropagation();

        closeAllSelect(this);

        optionList.classList.toggle("select-hide");

        this.classList.toggle("select-arrow-active");

    });

});


function closeAllSelect(elmnt) {

    document.querySelectorAll(".select-items").forEach(list => {

        if (list.previousSibling !== elmnt) {

            list.classList.add("select-hide");

        }

    });

    document.querySelectorAll(".select-selected").forEach(item => {

        if (item !== elmnt) {

            item.classList.remove("select-arrow-active");

        }

    });

}

document.addEventListener("click", closeAllSelect);






const counters = document.querySelectorAll(".counter");

const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if(entry.isIntersecting){

            const counter = entry.target;

            const target = Number(counter.dataset.target);

            let current = 0;

            const timer = setInterval(()=>{

                current += Math.ceil(target / 100);

                if(current >= target){

                    counter.textContent = target;

                    clearInterval(timer);

                }else{

                    counter.textContent = current;

                }

            },20);

            observer.unobserve(counter);

        }

    });

});

counters.forEach(counter=>observer.observe(counter));


