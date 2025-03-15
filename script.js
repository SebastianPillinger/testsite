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
let touchStartX = 0; // Startposition des Wischens (horizontal)
let touchStartY = 0; // Startposition des Wischens (vertikal)
let touchEndX = 0; // Endposition des Wischens (horizontal)
let touchEndY = 0; // Endposition des Wischens (vertikal)
let isSwiping = false; // Status, ob gerade gewischt wird
let startX = 0; // Startposition für Momentum
let currentX = 0; // Aktuelle Position für Momentum
let distanceX = 0; // Distanz des Wischens
const swipeThreshold = 50; // Mindestabstand für einen Swipe
const momentumThreshold = 100; // Schwung, um das Bild zu wechseln

// Lightbox öffnen
function openLightbox(imageSrc, imageList) {
    console.log('Lightbox öffnen:', imageSrc); // Debugging
    const lightbox = document.getElementById('lightbox');
    const lightboxImgCurrent = document.getElementById('lightbox-img-current');
    const lightboxImgNext = document.getElementById('lightbox-img-next');
    lightboxImgCurrent.src = imageSrc;
    lightbox.classList.add('active');

    // Bilderliste speichern
    images = imageList;
    currentIndex = images.indexOf(imageSrc);

    // Nächstes Bild vorbereiten
    lightboxImgNext.src = images[currentIndex + 1 >= images.length ? 0 : currentIndex + 1];

    // Scrollen verhindern
    document.body.style.overflow = 'hidden';

    // Touch-Events für Wischen hinzufügen
    lightbox.addEventListener('touchstart', handleTouchStart, { passive: false });
    lightbox.addEventListener('touchmove', handleTouchMove, { passive: false });
    lightbox.addEventListener('touchend', handleTouchEnd, { passive: false });
}

// Lightbox schließen
function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');

    // Scrollen wieder erlauben
    document.body.style.overflow = 'auto';

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

    const lightboxImgCurrent = document.getElementById('lightbox-img-current');
    const lightboxImgNext = document.getElementById('lightbox-img-next');
    lightboxImgCurrent.src = images[currentIndex];
    lightboxImgNext.src = images[currentIndex + n >= images.length ? images[0] : images[currentIndex + n]; // Nächstes Bild vorbereiten

    // Bilder zurücksetzen
    lightboxImgCurrent.style.transform = 'translateX(0)';
    lightboxImgNext.style.transform = n > 0 ? 'translateX(100%)' : 'translateX(-100%)';
}

// Touch-Event-Handler
function handleTouchStart(event) {
    isSwiping = true;
    startX = event.touches[0].clientX; // Startposition des Wischens (horizontal)
    currentX = startX;
    touchStartY = event.touches[0].clientY; // Startposition des Wischens (vertikal)
}

function handleTouchMove(event) {
    if (!isSwiping) return;

    const touch = event.touches[0];
    distanceX = touch.clientX - currentX; // Distanz des Wischens (horizontal)
    currentX = touch.clientX;

    // Beide Bilder verschieben
    const lightboxImgCurrent = document.getElementById('lightbox-img-current');
    const lightboxImgNext = document.getElementById('lightbox-img-next');
    lightboxImgCurrent.style.transform = `translateX(${distanceX}px)`;
    lightboxImgNext.style.transform = `translateX(${distanceX + (distanceX > 0 ? -100 : 100)}px)`;
}

function handleTouchEnd(event) {
    if (!isSwiping) return;

    isSwiping = false;
    touchEndX = event.changedTouches[0].clientX; // Endposition des Wischens (horizontal)
    touchEndY = event.changedTouches[0].clientY; // Endposition des Wischens (vertikal)

    // Momentum und Fehlerbehandlung
    handleSwipe();
}

// Wischlogik mit Momentum und Fehlerbehandlung
function handleSwipe() {
    const deltaX = touchEndX - startX; // Differenz zwischen Start- und Endposition (horizontal)
    const deltaY = touchEndY - touchStartY; // Differenz zwischen Start- und Endposition (vertikal)
    const velocity = Math.abs(deltaX); // Geschwindigkeit des Wischens

    // Wenn der Wisch weit genug ist (mehr als swipeThreshold) oder Schwung vorhanden ist (mehr als momentumThreshold)
    if (Math.abs(deltaX) > swipeThreshold || velocity > momentumThreshold) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontaler Wisch
            if (deltaX > 0) {
                changeImage(-1); // Nach rechts wischen -> Vorheriges Bild
            } else {
                changeImage(1); // Nach links wischen -> Nächstes Bild
            }
        }
    } else {
        // Bilder zurücksetzen, wenn der Wisch nicht ausreicht
        const lightboxImgCurrent = document.getElementById('lightbox-img-current');
        const lightboxImgNext = document.getElementById('lightbox-img-next');
        lightboxImgCurrent.style.transform = 'translateX(0)';
        lightboxImgNext.style.transform = deltaX > 0 ? 'translateX(-100%)' : 'translateX(100%)';
    }
}

// Lightbox-Öffnungsfunktion für Portfolio-Bilder
document.querySelectorAll('.portfolio-gallery img').forEach((img, index) => {
    img.addEventListener('click', () => {
        console.log('Bild geklickt:', img.src); // Debugging
        const imageList = Array.from(document.querySelectorAll('.portfolio-gallery img')).map(img => img.src);
        console.log('Bildliste:', imageList); // Debugging
        openLightbox(img.src, imageList);
    });
});

// Tastatursteuerung
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
