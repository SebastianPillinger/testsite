// Hamburger-Menü und Navigation
const hamburgerMenu = document.getElementById('hamburger-menu');
const mainNav = document.getElementById('main-nav');

// Menü ein- oder ausblenden
hamburgerMenu.addEventListener('click', (event) => {
    event.stopPropagation(); // Verhindert, dass der Klick an das Dokument weitergegeben wird
    mainNav.classList.toggle('active');
});

// Menü schließen, wenn außerhalb geklickt wird
document.addEventListener('click', (event) => {
    if (mainNav.classList.contains('active')) {
        const isClickInsideNav = mainNav.contains(event.target);
        const isClickOnHamburger = hamburgerMenu.contains(event.target);

        if (!isClickInsideNav && !isClickOnHamburger) {
            mainNav.classList.remove('active'); // Menü schließen
        }
    }
});

// Menü schließen, wenn ein Link geklickt wird
const navLinks = document.querySelectorAll('#main-nav a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mainNav.classList.remove('active'); // Menü schließen
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

// Überprüfen, ob das Gerät Touch-Events unterstützt (mobil)
const isMobile = 'ontouchstart' in window;

function openLightbox(imageSrc, imageList) {
    images = imageList;
    currentIndex = images.indexOf(imageSrc);

    // Leere die Slideshow und füge die Bilder dynamisch hinzu
    slides.innerHTML = '';

    // Füge das letzte Bild am Anfang hinzu (für den Übergang)
    const firstClone = document.createElement('img');
    firstClone.src = images[images.length - 1];
    firstClone.alt = `Bild ${images.length}`;
    slides.appendChild(firstClone);

    // Füge die originalen Bilder hinzu
    images.forEach((src, index) => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = `Bild ${index + 1}`;
        slides.appendChild(img);
    });

    // Füge das erste Bild am Ende hinzu (für den Übergang)
    const lastClone = document.createElement('img');
    lastClone.src = images[0];
    lastClone.alt = `Bild 1`;
    slides.appendChild(lastClone);

    // Zeige die Lightbox und das aktuelle Bild
    lightbox.classList.add('active');
    showSlide(currentIndex + 1); // +1, weil das erste Bild ein Klon ist
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function showSlide(index) {
    if (index >= images.length) {
        currentIndex = 0;
    } else if (index < 0) {
        currentIndex = images.length - 1;
    } else {
        currentIndex = index;
    }

    const offset = -(currentIndex + 1) * 100; // +1, weil das erste Bild ein Klon ist
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

// Tastatursteuerung (für PC)
document.addEventListener('keydown', (event) => {
    if (lightbox.classList.contains('active')) {
        if (event.key === 'ArrowRight') nextSlide();
        if (event.key === 'ArrowLeft') prevSlide();
        if (event.key === 'Escape') closeLightbox();
    }
});

// Touch-Events für Wischfunktion (nur für mobile Geräte)
let touchStartX = 0;
let touchCurrentX = 0;
let isSwiping = false;

// Touch-Start: Speichere die Startposition
function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchCurrentX = touchStartX;
    isSwiping = true;
    slides.style.transition = 'none'; // Deaktiviere die Animation während des Wischens
}

// Touch-Move: Bewege die Slideshow basierend auf der Fingerbewegung
function handleTouchMove(event) {
    if (!isSwiping) return;

    touchCurrentX = event.touches[0].clientX;
    const deltaX = touchCurrentX - touchStartX; // Berechne die Differenz
    const offset = -(currentIndex + 1) * 100 + (deltaX / window.innerWidth) * 100; // Verschiebe die Slideshow
    slides.style.transform = `translateX(${offset}%)`;
}

// Touch-End: Beende den Swipe und zeige das nächste/vorherige Bild
function handleTouchEnd() {
    if (!isSwiping) return;

    isSwiping = false;
    slides.style.transition = 'transform 0.5s ease-in-out'; // Aktiviere die Animation wieder

    const deltaX = touchCurrentX - touchStartX;
    const swipeThreshold = window.innerWidth * 0.2; // Mindestlänge des Wischens (20% der Bildschirmbreite)

    if (deltaX < -swipeThreshold) {
        nextSlide(); // Wischen nach links (nächstes Bild)
    } else if (deltaX > swipeThreshold) {
        prevSlide(); // Wischen nach rechts (vorheriges Bild)
    } else {
        showSlide(currentIndex); // Kein Swipe: Zeige das aktuelle Bild
    }
}

// Event-Listener hinzufügen
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
        e.preventDefault(); // Verhindert das Standardverhalten
        const targetId = this.getAttribute('href').substring(1); // Holt die Ziel-ID
        const targetElement = document.getElementById(targetId); // Findet das Ziel-Element

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth', // Sanftes Scrollen
                block: 'start' // Scrollt zum Anfang des Abschnitts
            });
        }
    });
});
