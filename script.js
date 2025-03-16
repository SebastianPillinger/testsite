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

function openLightbox(imageSrc, imageList) {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    lightboxImg.src = imageSrc;
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
    currentIndex = (currentIndex + n + images.length) % images.length;
    const lightboxImg = document.getElementById("lightbox-img");
    lightboxImg.src = images[currentIndex];
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
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;
let isSwiping = false;

function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
    isSwiping = true;
}

function handleTouchMove(event) {
    if (!isSwiping) return;
    
    const touchCurrentX = event.touches[0].clientX;
    const deltaX = touchCurrentX - touchStartX;
    const lightboxImg = document.getElementById('lightbox-img');
    
    // Begrenze die Bewegungsreichweite
    const maxDelta = 100;
    const offset = Math.min(Math.max(deltaX, -maxDelta), maxDelta);
    
    // Bewege das Bild mit dem Finger
    lightboxImg.style.transform = `translateX(${offset}px)`;
    
    // Verhindere Scrollen der Seite
    event.preventDefault();
}

function handleTouchEnd(event) {
    if (!isSwiping) return;

    const deltaX = touchEndX - touchStartX;
    const swipeThreshold = 50;
    const lightboxImg = document.getElementById('lightbox-img');

    // Zurücksetzen der Transformation
    lightboxImg.style.transform = 'translateX(0)';
    
    // Nur bei ausreichendem Swipe wechseln
    if (Math.abs(deltaX) > swipeThreshold) {
        if (deltaX < 0) changeImage(1);
        else changeImage(-1);
    }

    isSwiping = false;
}

const lightbox = document.getElementById('lightbox');
lightbox.addEventListener('touchstart', handleTouchStart, { passive: false });
lightbox.addEventListener('touchmove', handleTouchMove, { passive: false });
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
