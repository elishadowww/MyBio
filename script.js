// Back to Top Button
const backToTopButton = document.getElementById('backToTop');
let isAtTop = true;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 300) {
        backToTopButton.classList.add('visible');
        backToTopButton.classList.remove('pop');
        isAtTop = false;
    } else if (currentScroll < 100 && !isAtTop) {
        // Trigger bubble pop animation when reaching top
        backToTopButton.classList.add('pop');
        isAtTop = true;

        // Remove visible class after animation completes
        setTimeout(() => {
            backToTopButton.classList.remove('visible');
            backToTopButton.classList.remove('pop');
        }, 400);
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Character Animation on Scroll
const character = document.getElementById('character');
const runningCharacter = document.getElementById('runningCharacter');
const landscape1 = document.querySelector('.landscape-1');
const landscape2 = document.querySelector('.landscape-2');

window.addEventListener('scroll', () => {
    const scrollPosition = window.pageYOffset;
    const landscape1Height = landscape1.offsetHeight;

    // Animate character moving down from first to second landscape
    if (scrollPosition > landscape1Height * 0.5 && scrollPosition < landscape1Height * 1.5) {
        const progress = (scrollPosition - landscape1Height * 0.5) / (landscape1Height);
        character.style.transform = `translateY(${progress * 200}px)`;
        character.style.opacity = 1 - progress;
    } else if (scrollPosition < landscape1Height * 0.5) {
        character.style.transform = 'translateY(0)';
        character.style.opacity = '1';
    }
});

// Roadmap Horizontal Scroll with Character Runner
const roadmapScroll = document.querySelector('.roadmap-scroll');
const roadmapMarkers = document.querySelectorAll('.roadmap-marker');

if (roadmapScroll && roadmapMarkers.length > 0) {
    let currentMarkerIndex = 0;

    // Function to update character to exact marker position
    function updateCharacterPosition() {
        const scrollLeft = roadmapScroll.scrollLeft;
        const maxScroll = roadmapScroll.scrollWidth - roadmapScroll.clientWidth;

        // Calculate which marker index based on scroll progress
        const scrollProgress = maxScroll > 0 ? scrollLeft / maxScroll : 0;
        const targetIndex = Math.round(scrollProgress * (roadmapMarkers.length - 1));

        // Only update if marker changed
        if (targetIndex !== currentMarkerIndex) {
            currentMarkerIndex = targetIndex;
        }

        // Get character width for centering
        const characterWidth = runningCharacter.querySelector('.character-box.small').offsetWidth;

        // Position character at the exact center of current marker
        const currentMarker = roadmapMarkers[currentMarkerIndex];
        const markerCenter = currentMarker.offsetLeft + (currentMarker.offsetWidth / 2);
        const characterLeft = markerCenter - (characterWidth / 2);

        // Position character on the roadmap line
        runningCharacter.style.left = `${characterLeft}px`;
    }

    // Update on scroll
    roadmapScroll.addEventListener('scroll', updateCharacterPosition);

    // Initial position
    setTimeout(updateCharacterPosition, 100);

    // Update on window resize
    window.addEventListener('resize', updateCharacterPosition);
}

// Projects Circular Carousel
const projectsScroll = document.querySelector('.projects-scroll');
const scrollLeftBtn = document.querySelector('.scroll-left');
const scrollRightBtn = document.querySelector('.scroll-right');
const projectCards = document.querySelectorAll('.project-card');

if (projectCards.length > 0) {
    let currentIndex = 0;

    function updateCarousel() {
        projectCards.forEach((card, index) => {
            // Calculate position relative to current center card
            let offset = index - currentIndex;

            // Create circular effect - wrap around
            const totalCards = projectCards.length;
            if (offset > totalCards / 2) {
                offset -= totalCards;
            } else if (offset < -totalCards / 2) {
                offset += totalCards;
            }

            // Remove all classes first
            card.classList.remove('center');

            if (offset === 0) {
                // Center card
                card.classList.add('center');
                card.style.left = '50%';
                card.style.top = '50%';
                card.style.transform = 'translate(-50%, -50%) translateZ(0) scale(1)';
                card.style.opacity = '1';
                card.style.zIndex = '10';
            } else {
                // Side cards in circular arrangement
                const angle = offset * 45; // Degrees
                const zDistance = Math.abs(offset) * -100; // Depth
                const scale = 1 - (Math.abs(offset) * 0.15); // Scale down side cards
                const xOffset = offset * 280;

                card.style.left = '50%';
                card.style.top = '50%';
                card.style.transform = `translate(calc(-50% + ${xOffset}px), -50%) translateZ(${zDistance}px) scale(${scale}) rotateY(${-angle * 0.3}deg)`;
                card.style.opacity = offset === 1 || offset === -1 ? '0.7' : '0.3';
                card.style.zIndex = 10 - Math.abs(offset);
            }
        });
    }

    function nextCard() {
        currentIndex = (currentIndex + 1) % projectCards.length;
        updateCarousel();
    }

    function prevCard() {
        currentIndex = (currentIndex - 1 + projectCards.length) % projectCards.length;
        updateCarousel();
    }

    if (scrollLeftBtn && scrollRightBtn) {
        scrollLeftBtn.addEventListener('click', prevCard);
        scrollRightBtn.addEventListener('click', nextCard);
    }

    // Click on card to center it
    projectCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            if (index !== currentIndex) {
                currentIndex = index;
                updateCarousel();
            }
        });
    });

    // Initialize carousel - wait for DOM to be fully ready
    setTimeout(() => {
        updateCarousel();
    }, 100);

    // Also update on window load to ensure proper positioning
    window.addEventListener('load', updateCarousel);
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add scroll reveal animation for roadmap items
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe roadmap items
document.querySelectorAll('.roadmap-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(item);
});

// Parallax effect for first landscape
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const bioContent = document.querySelector('.bio-content');

    if (bioContent && scrolled < window.innerHeight) {
        bioContent.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});
