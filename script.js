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
let isAnimating = false; // Verhindert, dass während einer Animation ein weiterer Wechsel ausgelöst wird

function openLightbox(imageSrc, imageList) {
    const lightbox = document.getElementById("lightbox");
    const lightboxImgCurrent = document.getElementById("lightbox-img-current");
    const lightboxImgNext = document.getElementById("lightbox-img-next");

    lightboxImgCurrent.src = imageSrc;
    lightboxImgNext.src = ""; // Setzt das nächste Bild zurück
    lightbox.classList.add("active");
    images = imageList;
    currentIndex = images.indexOf(imageSrc);
    document.body.style.overflow = "hidden";
}

function closeLightbox() {
    const lightbox = document.getElementById("lightbox");
    lightbox.classList.remove("active");
    document.body.style.overflow = "auto";
}

function changeImage(n) {
    if (isAnimating) return; // Verhindert, dass während einer Animation ein weiterer Wechsel ausgelöst wird

    const lightboxImages = document.querySelector(".lightbox-images");
    const lightboxImgCurrent = document.getElementById("lightbox-img-current");
    const lightboxImgNext = document.getElementById("lightbox-img-next");

    // Berechnet den Index des nächsten Bildes
    const nextIndex = (currentIndex + n + images.length) % images.length;
    lightboxImgNext.src = images[nextIndex]; // Lädt das nächste Bild

    // Startet die Animation
    isAnimating = true;
    if (n === 1) {
        lightboxImages.classList.add("slide-left"); // Animation nach links
    } else if (n === -1) {
        lightboxImages.classList.add("slide-right"); // Animation nach rechts
    }

    // Wartet, bis die Animation abgeschlossen ist
    lightboxImages.addEventListener("transitionend", () => {
        lightboxImages.classList.remove("slide-left", "slide-right");
        lightboxImgCurrent.src = lightboxImgNext.src; // Setzt das aktuelle Bild auf das neue Bild
        lightboxImgNext.src = ""; // Setzt das nächste Bild zurück
        currentIndex = nextIndex; // Aktualisiert den aktuellen Index
        isAnimating = false; // Beendet die Animation
    }, { once: true }); // Event-Listener wird nur einmal ausgeführt
}

// Tastatursteuerung
document.addEventListener("keydown", (event) => {
    const lightbox = document.getElementById("lightbox");
    if (lightbox.classList.contains("active")) {
        if (event.key === "ArrowRight") changeImage(1);
        if (event.key === "ArrowLeft") changeImage(-1);
        if (event.key === "Escape") closeLightbox();
    }
});

// Touch-Events für Wischfunktion
let touchStartX = 0;
let touchEndX = 0;

function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX; // Speichert die Startposition des Wischens
}

function handleTouchEnd(event) {
    touchEndX = event.changedTouches[0].clientX; // Speichert die Endposition des Wischens
    handleSwipe(); // Verarbeitet die Wischbewegung
}

function handleSwipe() {
    const swipeThreshold = 50; // Mindestlänge des Wischens in Pixeln

    if (touchEndX < touchStartX - swipeThreshold) {
        changeImage(1); // Wischen nach links (nächstes Bild)
    } else if (touchEndX > touchStartX + swipeThreshold) {
        changeImage(-1); // Wischen nach rechts (vorheriges Bild)
    }
}

const lightbox = document.getElementById('lightbox');
lightbox.addEventListener('touchstart', handleTouchStart, { passive: true });
lightbox.addEventListener('touchend', handleTouchEnd, { passive: true });

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
