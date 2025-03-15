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

// Lightbox-Funktionen
let currentIndex = 0;
let images = [];
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;
const isMobile = window.innerWidth <= 768; // Prüft, ob die Bildschirmbreite ≤ 768px ist

// Lightbox öffnen (für alle Geräte)
function openLightbox(imageSrc, imageList) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    lightboxImg.src = imageSrc;
    lightbox.classList.add('active');

    // Bilderliste speichern
    images = imageList;
    currentIndex = images.indexOf(imageSrc);

    // Scrollen verhindern
    document.body.style.overflow = 'hidden';

    // Touch-Events nur für mobile Geräte hinzufügen
    if (isMobile) {
        lightbox.addEventListener('touchstart', handleLightboxTouchStart, { passive: false });
        lightbox.addEventListener('touchend', handleLightboxTouchEnd, { passive: false });
    }
}

// Lightbox schließen (für alle Geräte)
function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');

    // Scrollen wieder erlauben
    document.body.style.overflow = 'auto';

    // Touch-Events entfernen (nur für mobile Geräte)
    if (isMobile) {
        lightbox.removeEventListener('touchstart', handleLightboxTouchStart);
        lightbox.removeEventListener('touchend', handleLightboxTouchEnd);
    }
}

// Bildwechsel (für Laptops)
function changeImage(n) {
    const lightboxImg = document.getElementById('lightbox-img');
    const newIndex = currentIndex + n;

    // Zyklisches Durchlaufen der Bilder
    if (newIndex >= images.length) currentIndex = 0;
    else if (newIndex < 0) currentIndex = images.length - 1;
    else currentIndex = newIndex;

    // Neues Bild anzeigen
    lightboxImg.src = images[currentIndex];
}

// Touch-Event-Handler für Lightbox (nur für mobile Geräte)
function handleLightboxTouchStart(event) {
    if (isMobile) {
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
    }
}

function handleLightboxTouchEnd(event) {
    if (isMobile) {
        touchEndX = event.changedTouches[0].clientX;
        touchEndY = event.changedTouches[0].clientY;
        handleSwipe();
    }
}

// Wischlogik (nur für mobile Geräte)
function handleSwipe() {
    if (isMobile) {
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        // Wenn der Wisch weit genug ist (z. B. mehr als 50 Pixel), Aktion ausführen
        if (Math.abs(deltaX) > 50 || Math.abs(deltaY) > 50) {
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // Horizontaler Wisch
                if (deltaX > 0) {
                    changeImage(-1); // Nach rechts wischen -> Vorheriges Bild
                } else {
                    changeImage(1); // Nach links wischen -> Nächstes Bild
                }
            } else {
                // Vertikaler Wisch
                closeLightbox(); // Lightbox schließen
            }
        }
    }
}

// Tastatursteuerung (für Laptops)
document.addEventListener('keydown', (event) => {
    const lightbox = document.getElementById('lightbox');
    if (lightbox.classList.contains('active')) {
        if (event.key === 'ArrowRight') changeImage(1); // Nächstes Bild
        if (event.key === 'ArrowLeft') changeImage(-1); // Vorheriges Bild
        if (event.key === 'Escape') closeLightbox(); // Lightbox schließen
    }
});

// Event-Listener für Klicks auf Bilder
document.querySelectorAll('.image-container img').forEach(img => {
    img.addEventListener('click', () => {
        const imageSrc = img.src;
        const imageList = Array.from(document.querySelectorAll('.image-container img')).map(img => img.src);
        openLightbox(imageSrc, imageList);
    });
});
