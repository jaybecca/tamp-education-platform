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


let currentCategory="dance";
let currentImage=0;

function loadGallery(category){


galleryGrid.innerHTML="";


galleryData[category].forEach((photo,index)=>{

galleryGrid.innerHTML+=`

<div class="gallery-item" onclick="openLightbox('${category}',${index})">

<img src="${photo.image}" alt="${photo.title}">

<div class="gallery-overlay">

<h4>${photo.title}</h4>

<p>${photo.desc}</p>

</div>

</div>

`;

});

}

loadGallery(currentCategory);

tabs.forEach(tab=>{

tab.addEventListener("click",()=>{

tabs.forEach(btn=>btn.classList.remove("active"));



tab.classList.add("active");

currentCategory=tab.dataset.category;

loadGallery(currentCategory);

});

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
// BACK TO TOP
//==============================

const backTop=document.getElementById("backTop");

window.addEventListener("scroll",()=>{

    if(window.scrollY>500){

        backTop.style.display="block";

    }

    else{

        backTop.style.display="none";

    }

});

backTop.onclick=()=>{

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

};

//==============================
// SCROLL PROGRESS BAR
//==============================

window.addEventListener("scroll",()=>{

const scrollTop=document.documentElement.scrollTop;

const scrollHeight=document.documentElement.scrollHeight-document.documentElement.clientHeight;

const progress=(scrollTop/scrollHeight)*100;

document.getElementById("progressBar").style.width=progress+"%";

});


const form=document.querySelector("form");

if(form){

form.addEventListener("submit",(e)=>{

e.preventDefault();

document.getElementById("successMessage").style.display="block";

form.reset();

});

}
