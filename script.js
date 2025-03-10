// Progressive Image Loading
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('.game-preview img, .profile-container img');
    
    const loadImage = (img) => {
        // Add loading class
        img.classList.add('loading');
        
        // Create a new image object
        const newImg = new Image();
        
        newImg.onload = () => {
            // When image is loaded, update the src and add loaded class
            img.src = newImg.src;
            img.classList.remove('loading');
            img.classList.add('loaded');
        };
        
        // Start loading the image
        newImg.src = img.src;
    };
    
    // Handle each image
    images.forEach(img => {
        if (img.complete) {
            // If image is already loaded from cache
            img.classList.add('loaded');
        } else {
            // If image needs to be loaded
            loadImage(img);
        }
    });
});

// Intersection Observer for lazy loading
const lazyLoadImages = () => {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    loadImage(img);
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
};

// Initialize lazy loading
lazyLoadImages();

// Performance-optimized image loading
const imageLoader = {
    observer: null,
    init() {
        // Create single IntersectionObserver instance
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        this.observer.unobserve(entry.target);
                    }
                });
            },
            {
                rootMargin: '50px 0px',
                threshold: 0.1
            }
        );

        // Initialize on DOM load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeImages());
        } else {
            this.initializeImages();
        }
    },

    initializeImages() {
        const images = document.querySelectorAll('.game-preview img, .profile-container img');
        images.forEach(img => {
            if (img.complete) {
                img.classList.add('loaded');
            } else {
                img.classList.add('loading');
                this.observer.observe(img);
            }
        });
    },

    loadImage(img) {
        const tempImage = new Image();
        
        tempImage.onload = () => {
            requestAnimationFrame(() => {
                img.src = tempImage.src;
                img.classList.remove('loading');
                img.classList.add('loaded');
            });
        };

        tempImage.src = img.dataset.src || img.src;
    }
};

// Initialize image loader
imageLoader.init();

// Optimize scroll performance
let scrollTimeout;
const body = document.body;

window.addEventListener('scroll', () => {
    if (!body.classList.contains('is-scrolling')) {
        body.classList.add('is-scrolling');
    }
    
    clearTimeout(scrollTimeout);
    
    scrollTimeout = setTimeout(() => {
        body.classList.remove('is-scrolling');
    }, 150);
}, { passive: true });

// Optimize animation frames
const optimizeAnimations = () => {
    const animatedElements = document.querySelectorAll('.profile-container, .game-card, .project-card');
    
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    entry.target.style.willChange = 'auto';
                } else {
                    entry.target.style.willChange = 'transform';
                }
            });
        },
        {
            threshold: 0.1
        }
    );

    animatedElements.forEach(element => observer.observe(element));
}; 