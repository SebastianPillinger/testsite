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

// Funktionen für Touch-Events
function handleTouchStart(event) {
    const imageContainer = event.currentTarget;
    const image = imageContainer.querySelector('img');
    const overlayText = imageContainer.querySelector('.overlay-text');

    image.style.transform = 'scale(1.1)';
    image.style.filter = 'brightness(0.7)';
    overlayText.style.opacity = '1';
}

function handleTouchEnd(event) {
    const imageContainer = event.currentTarget;
    const image = imageContainer.querySelector('img');
    const overlayText = imageContainer.querySelector('.overlay-text');

    image.style.transform = 'scale(1)';
    image.style.filter = 'brightness(1)';
    overlayText.style.opacity = '0';
}

// Touch-Events zu allen Bildcontainern hinzufügen
const imageContainers = document.querySelectorAll('.image-container');
imageContainers.forEach(container => {
    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchend', handleTouchEnd);
});

// Lightbox-Funktionen
let currentIndex = 0;
let images = [];
let touchStartX = 0; // Startposition des Wischens

// Lightbox öffnen
function openLightbox(imageSrc, imageList) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    lightboxImg.src = imageSrc;
    lightbox.classList.add('active');

    // Bilderliste speichern
    images = imageList;
    currentIndex = images.indexOf(imageSrc);

    // Touch-Events für Wischen hinzufügen
    lightbox.addEventListener('touchstart', handleTouchStart, { passive: false });
    lightbox.addEventListener('touchmove', handleTouchMove, { passive: false });
    lightbox.addEventListener('touchend', handleTouchEnd, { passive: false });
}

// Lightbox schließen
function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');

    // Touch-Events entfernen
    lightbox.removeEventListener('touchstart', handleTouchStart);
    lightbox.removeEventListener('touchmove', handleTouchMove);
    lightbox.removeEventListener('touchend', handleTouchEnd);
}

// Bildwechsel
function changeImage(n) {
    currentIndex += n;

    // Zyklisches Durchlaufen der Bilder
    if (currentIndex >= images.length) currentIndex = 0;
    if (currentIndex < 0) currentIndex = images.length - 1;

    const lightboxImg = document.getElementById('lightbox-img');
    lightboxImg.src = images[currentIndex];
}

// Touch-Event-Handler
function handleTouchStart(event) {
    touchStartX = event.touches[0].clientX; // Startposition des Wischens speichern
}

function handleTouchMove(event) {
    event.preventDefault(); // Verhindert das Standard-Scrollverhalten
}

function handleTouchEnd(event) {
    const touchEndX = event.changedTouches[0].clientX; // Endposition des Wischens
    const deltaX = touchEndX - touchStartX; // Differenz zwischen Start- und Endposition

    // Wenn der Wisch weit genug ist (z. B. mehr als 50 Pixel), Bild wechseln
    if (Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
            changeImage(-1); // Nach rechts wischen -> Vorheriges Bild
        } else {
            changeImage(1); // Nach links wischen -> Nächstes Bild
        }
    }
}

// Tastatursteuerung (optional, bleibt unverändert)
document.addEventListener('keydown', (event) => {
    const lightbox = document.getElementById('lightbox');
    if (lightbox.classList.contains('active')) {
        if (event.key === 'ArrowRight') changeImage(1); // Nächstes Bild
        if (event.key === 'ArrowLeft') changeImage(-1); // Vorheriges Bild
        if (event.key === 'Escape') closeLightbox(); // Lightbox schließen
    }
});

// Kopieren in die Zwischenablage
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Kopiert: ' + text);
    }).catch(() => {
        alert('Kopieren fehlgeschlagen. Bitte manuell kopieren: ' + text);
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
