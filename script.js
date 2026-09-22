// =========================
// Mobile Menu
// =========================

const menuBtn = document.querySelector(".menu-btn");

if (menuBtn) {
menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});
}
// =========================
// Navbar Background on Scroll
// =========================

window.addEventListener("scroll", () => {

    const navbar = document.querySelector(".navbar");

    if(window.scrollY > 50){
        navbar.style.background = "rgba(0,0,0,0.95)";
        navbar.style.padding = "15px 40px";
        navbar.style.transition = "0.4s";
    }
    else{
        navbar.style.background = "transparent";
        navbar.style.padding = "20px 0";
    }

});
// ===========================
// COUNTER ANIMATION
// ===========================

const counters = document.querySelectorAll(".count");

counters.forEach(counter => {

    counter.innerText = "0";

    const updateCounter = () => {

        const target = +counter.getAttribute("data-target");

        const current = +counter.innerText;

        const increment = target / 100;

        if(current < target){

            counter.innerText = `${Math.ceil(current + increment)}`;

            setTimeout(updateCounter,20);

        }

        else{

            counter.innerText = target + "+";

        }

    };

    updateCounter();
    const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
        startCounter();
        observer.disconnect();
    }
    });


});
// ===========================
// BACK TO TOP BUTTON
// ===========================

const topBtn = document.getElementById("topBtn");

window.addEventListener("scroll", () => {

    if(window.scrollY > 300){

        topBtn.style.display = "block";

    }
    else{

        topBtn.style.display = "none";

    }

});

topBtn.addEventListener("click", () => {

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

});
// ======================
// LIGHTBOX
// ======================

const galleryImages = document.querySelectorAll(".gallery-item img");

const lightbox = document.querySelector(".lightbox");

const lightboxImg = document.querySelector(".lightbox-img");

const closeBtn = document.querySelector(".close");

if (lightbox && lightboxImg && closeBtn) {

galleryImages.forEach(image=>{

    image.addEventListener("click",()=>{

        lightbox.style.display="flex";

        lightboxImg.src=image.src;

    });

});

closeBtn.addEventListener("click",()=>{

    lightbox.style.display="none";

});

lightbox.addEventListener("click",(e)=>{

    if(e.target===lightbox){

        lightbox.style.display="none";

    }

});

}
// ==========================
// TESTIMONIAL SLIDER
// ==========================

const testimonials = document.querySelectorAll(".testimonial");

let currentTestimonial = 0;

function showTestimonial() {

    if (testimonials.length === 0) return;

    testimonials.forEach((item) => {

        item.classList.remove("active");

    });

    testimonials[currentTestimonial].classList.add("active");

    currentTestimonial++;

    if (currentTestimonial >= testimonials.length) {

        currentTestimonial = 0;

    }

}

showTestimonial();

setInterval(showTestimonial, 4000);
// ==========================
// Booking Form
// ==========================


// Navbar Scroll Effect

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {

    if(window.scrollY > 50){

        navbar.classList.add("scrolled");

    }else{

        navbar.classList.remove("scrolled");

    }

});
// ======================
// HERO SLIDER
// ======================

const slides = document.querySelectorAll(".slide");

let currentSlide = 0;

function showSlide(){

    if (slides.length === 0) return;

    slides.forEach(slide=>slide.classList.remove("active"));

    slides[currentSlide].classList.add("active");

    currentSlide++;

if(currentSlide>=slides.length){

    currentSlide=0;

}

}

showSlide();

setInterval(showSlide,5000);
// ==========================
// WEBSITE LOADER
// ==========================

window.addEventListener("load", () => {

    const loader = document.getElementById("loader");
    
    if (!loader) return;

    setTimeout(() => {

        loader.style.opacity = "0";

        setTimeout(() => {

            loader.style.display = "none";

        }, 800);

    }, 2000);

});

// ======================
// BACK TO TOP
// ======================



window.addEventListener("scroll", () => {

    if(window.scrollY > 300){

        topBtn.style.display = "block";

    }else{

        topBtn.style.display = "none";

    }

});

topBtn.addEventListener("click", () => {

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

});

// ======================
// MOBILE MENU
// ======================

const menuToggle = document.querySelector(".menu-toggle");


if(menuToggle){

menuToggle.addEventListener("click",()=>{

navLinks.classList.toggle("active");

});

}


const bookingForm = document.getElementById("bookingForm");

bookingForm.addEventListener("submit", async function(event){
    
    event.preventDefault();

    const formData = new FormData(bookingForm);

    const bookingData = {
        customer_name: formData.get("customer_name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        event_type: formData.get("event_type"),
        event_date: formData.get("event_date"),
        event_time: formData.get("event_time"),
        location: formData.get("location"),
        requirements: formData.get("requirements")
    };

    try {

        const response = await fetch(
            "https://bhanu-photography.onrender.com/api/bookings",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(bookingData)
            }
        );

        const result = await response.json();

        if (response.ok) {

            alert("✅ Booking submitted successfully!");

            bookingForm.reset();

            console.log("Booking:", result);

        } else {

            alert("❌ Booking failed!");

            console.error(result);

        }

    } catch (error) {

        console.error("Error:", error);

        alert(
            "❌ Cannot connect to the server. Make sure your backend is running."
        );

    }

});
