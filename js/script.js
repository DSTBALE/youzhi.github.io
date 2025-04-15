document.addEventListener('DOMContentLoaded', function() {
    // Image Carousel Functionality
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const carouselContainer = document.querySelector('.carousel-container');
    let currentSlideIndex = 0;
    let touchStartX = 0;
    let touchEndX = 0;
    let intervalId;

    // Function to show a specific slide
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
            slide.style.opacity = 0;
        });
        
        // Show the current slide
        slides[index].classList.add('active');
        setTimeout(() => {
            slides[index].style.opacity = 1;
        }, 50);
    }

    // Function to show the next slide
    function nextSlide() {
        currentSlideIndex++;
        if (currentSlideIndex >= slides.length) {
            currentSlideIndex = 0;
        }
        showSlide(currentSlideIndex);
    }

    // Function to show the previous slide
    function prevSlide() {
        currentSlideIndex--;
        if (currentSlideIndex < 0) {
            currentSlideIndex = slides.length - 1;
        }
        showSlide(currentSlideIndex);
    }

    // Event listeners for buttons
    if(prevBtn && nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetInterval();
        });
        
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetInterval();
        });
    }

    // Touch swipe functionality for mobile
    if(carouselContainer) {
        carouselContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        carouselContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        // Pause autoplay when hovering over carousel
        carouselContainer.addEventListener('mouseenter', () => {
            clearInterval(intervalId);
        });

        carouselContainer.addEventListener('mouseleave', () => {
            intervalId = setInterval(nextSlide, 5000);
        });
    }

    function handleSwipe() {
        // Detect swipe direction (50px threshold)
        if (touchEndX < touchStartX - 50) {
            nextSlide(); // Swipe left
            resetInterval();
        } else if (touchEndX > touchStartX + 50) {
            prevSlide(); // Swipe right
            resetInterval();
        }
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if(slides.length === 0) return;
        
        if (e.key === 'ArrowLeft') {
            prevSlide();
            resetInterval();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            resetInterval();
        }
    });

    // Reset interval timer after manual navigation
    function resetInterval() {
        if(!slides.length) return;
        
        clearInterval(intervalId);
        intervalId = setInterval(nextSlide, 5000);
    }

    // Initialize the carousel if it exists
    if(slides.length > 0) {
        // Auto slide change every 5 seconds
        intervalId = setInterval(nextSlide, 5000);
        // Initialize the carousel
        showSlide(currentSlideIndex);
    }

    // Add fade-in animation to profile cards and university cards when they come into view
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px'
    };

    const profileObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('fade-in');
                }, entry.target.dataset.delay || 0);
                profileObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Animate headings
    const headings = document.querySelectorAll('.alumni-profiles h2');
    headings.forEach(heading => {
        heading.style.opacity = '0';
        profileObserver.observe(heading);
    });

    // Animate profile cards with staggered delay
    const profileCards = document.querySelectorAll('.profile-card');
    profileCards.forEach((card, index) => {
        // Add a data attribute for staggered animation
        card.dataset.delay = index * 100;
        profileObserver.observe(card);
    });

    // Animate university cards
    const universityCards = document.querySelectorAll('.university-card');
    universityCards.forEach((card, index) => {
        card.dataset.delay = index * 100;
        profileObserver.observe(card);
    });
}); 