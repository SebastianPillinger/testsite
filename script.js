// Hamburger-Menü und Navigation
const hamburgerMenu = document.getElementById('hamburger-menu');
const mainNav = document.getElementById('main-nav');

// Menü ein- oder ausblenden
hamburgerMenu.addEventListener('click', (event) => {
    event.stopPropagation();
    mainNav.classList.toggle('active');
});

// Menü schließen, wenn außerhalb geklickt wird
document.addEventListener('click', (event) => {
    if (mainNav.classList.contains('active')) {
        const isClickInsideNav = mainNav.contains(event.target);
        const isClickOnHamburger = hamburgerMenu.contains(event.target);

        if (!isClickInsideNav && !isClickOnHamburger) {
            mainNav.classList.remove('active');
        }
    }
});

// Menü schließen, wenn ein Link geklickt wird
const navLinks = document.querySelectorAll('#main-nav a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mainNav.classList.remove('active');
    });
});

// Dynamisches Laden der Portfolio-Bilder
const portfolioData = [
    { src: "bilder/linzm1.jpg", alt: "Linz-Marathon", images: ["bilder/linzm1.jpg", "bilder/linzm2.jpg", "bilder/linzm3.jpg"] },
    { src: "bilder/rr1.jpg", alt: "Kasberg-Inferno", images: ["bilder/rr1.jpg", "bilder/rr2.jpg", "bilder/rr3.jpg", "bilder/rr4.jpg", "bilder/rr5.jpg"] },
    { src: "bilder/hochzeit1.jpg", alt: "Hochzeitsfotografie", images: ["bilder/hochzeit1.jpg", "bilder/hochzeit2.jpg", "bilder/hochzeit3.jpg"] },
    { src: "bilder/tiere1.jpg", alt: "Haustiere", images: ["bilder/tiere1.jpg", "bilder/tiere2.jpg", "bilder/tiere3.jpg", "bilder/tiere4.jpg", "bilder/tiere5.jpg", "bilder/tiere6.jpg", "bilder/tiere7.jpg", "bilder/tiere8.jpg"] },
    { src: "bilder/wildlife1.jpg", alt: "Wildlife", images: ["bilder/wildlife1.jpg", "bilder/wildlife2.jpg", "bilder/wildlife3.jpg", "bilder/wildlife4.jpg", "bilder/wildlife5.jpg", "bilder/wildlife6.jpg"] },
    { src: "bilder/party1.jpg", alt: "Partyfotografie", images: ["bilder/party1.jpg", "bilder/party2.jpg", "bilder/party3.jpg"] }
];

const portfolioGallery = document.getElementById("portfolio-gallery");

portfolioData.forEach(item => {
    const container = document.createElement("div");
    container.className = "image-container";
    container.innerHTML = `
        <img src="${item.src}" alt="${item.alt}" loading="lazy">
        <div class="overlay-text">${item.alt}</div>
    `;
    container.addEventListener("click", () => openLightbox(item.src, item.images));
    portfolioGallery.appendChild(container);
});

// Lightbox-Funktionen
let currentIndex = 0;
let images = [];
const slides = document.querySelector('.slides');
const lightbox = document.getElementById('lightbox');
const isMobile = 'ontouchstart' in window;

function openLightbox(imageSrc, imageList) {
    images = imageList;
    currentIndex = images.indexOf(imageSrc);

    // Leere die Slideshow und füge die Bilder dynamisch hinzu
    slides.innerHTML = '';
    images.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = `Bild ${index + 1}`;
        slides.appendChild(img);
    });

    // Zeige die Lightbox und das aktuelle Bild
    lightbox.classList.add('active');
    showSlide(currentIndex);
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function showSlide(index) {
    if (index >= images.length) {
        currentIndex = 0; // Zurück zum ersten Bild, wenn Ende erreicht
    } else if (index < 0) {
        currentIndex = images.length - 1; // Zum letzten Bild, wenn Anfang erreicht
    } else {
        currentIndex = index;
    }

    // Berechne den Versatz basierend auf dem aktuellen Index
    const offset = -currentIndex * 100;
    slides.style.transform = `translateX(${offset}%)`;

    // Deaktiviere die Animation auf dem PC
    if (!isMobile) {
        slides.style.transition = 'none'; // Keine Animation auf dem PC
    } else {
        slides.style.transition = 'transform 0.5s ease-in-out'; // Animation auf mobilen Geräten
    }
}

function nextSlide() {
    showSlide(currentIndex + 1);
}

function prevSlide() {
    showSlide(currentIndex - 1);
}

document.querySelector('.prev').addEventListener('click', prevSlide);
document.querySelector('.next').addEventListener('click', nextSlide);

// Tastatursteuerung
document.addEventListener('keydown', (event) => {
    if (lightbox.classList.contains('active')) {
        if (event.key === 'ArrowRight') nextSlide();
        if (event.key === 'ArrowLeft') prevSlide();
        if (event.key === 'Escape') closeLightbox();
    }
});

// Touch-Events für Wischfunktion
let touchStartX = 0;
let touchStartY = 0;
let touchCurrentX = 0;
let isSwiping = false;

function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
    touchCurrentX = touchStartX;
    isSwiping = true;
    slides.style.transition = 'none';
}

function handleTouchMove(event) {
    if (!isSwiping) return;

    const touchCurrentY = event.touches[0].clientY;
    const deltaY = touchCurrentY - touchStartY;

    if (Math.abs(deltaY) > 50) {
        closeLightbox();
        return;
    }

    touchCurrentX = event.touches[0].clientX;
    const deltaX = touchCurrentX - touchStartX;
    const offset = -(currentIndex + 1) * 100 + (deltaX / window.innerWidth) * 100;
    slides.style.transform = `translateX(${offset}%)`;
}

function handleTouchEnd() {
    if (!isSwiping) return;

    isSwiping = false;
    slides.style.transition = 'transform 0.3s ease-in-out';

    const deltaX = touchCurrentX - touchStartX;
    const swipeThreshold = window.innerWidth * 0.1;

    if (deltaX < -swipeThreshold) {
        nextSlide();
    } else if (deltaX > swipeThreshold) {
        prevSlide();
    } else {
        showSlide(currentIndex);
    }
}

slides.addEventListener('touchstart', handleTouchStart, { passive: true });
slides.addEventListener('touchmove', handleTouchMove, { passive: true });
slides.addEventListener('touchend', handleTouchEnd, { passive: true });

// Kopieren in die Zwischenablage
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert("Kopiert: " + text);
    }).catch(() => {
        alert("Kopieren fehlgeschlagen. Bitte manuell kopieren: " + text);
    });
}

// Smooth Scroll für interne Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
