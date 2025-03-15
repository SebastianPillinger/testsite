// Dark Mode Toggle
const darkModeToggle = document.getElementById('dark-mode-toggle');
const body = document.body;

// Dark Mode aus dem localStorage laden
if (localStorage.getItem('dark-mode') === 'true') {
    body.classList.add('dark-mode');
    darkModeToggle.checked = true;
}

// Dark Mode umschalten
darkModeToggle.addEventListener('change', () => {
    body.classList.toggle('dark-mode');
    localStorage.setItem('dark-mode', body.classList.contains('dark-mode'));
});

// Lightbox-Funktionen
let currentIndex = 0;
let images = [];

function openLightbox(imageSrc, imageList) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    lightboxImg.src = imageSrc;
    lightbox.classList.add('active');

    // Bilderliste speichern
    images = imageList;
    currentIndex = images.indexOf(imageSrc);

    // Event-Listener für das Mausrad hinzufügen
    lightbox.addEventListener('wheel', handleScroll, { passive: false });
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');

    // Event-Listener für das Mausrad entfernen
    lightbox.removeEventListener('wheel', handleScroll);
}

function changeImage(n) {
    currentIndex += n;

    // Zyklisches Durchlaufen der Bilder
    if (currentIndex >= images.length) currentIndex = 0;
    if (currentIndex < 0) currentIndex = images.length - 1;

    const lightboxImg = document.getElementById('lightbox-img');
    lightboxImg.src = images[currentIndex];
}

// Mausrad-Scrollen
function handleScroll(event) {
    event.preventDefault(); // Verhindert das Standard-Scrollverhalten
    if (event.deltaY > 0) {
        changeImage(1); // Nach unten scrollen -> Nächstes Bild
    } else if (event.deltaY < 0) {
        changeImage(-1); // Nach oben scrollen -> Vorheriges Bild
    }
}

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