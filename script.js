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

// Optimize scroll performance
let scrollTimeout;
const body = document.body;
let lastScrollTop = 0;
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add scrolling class only when actually scrolling
            if (Math.abs(currentScrollTop - lastScrollTop) > 50) {
                body.classList.add('is-scrolling');
                
                // Clear previous timeout
                clearTimeout(scrollTimeout);
                
                // Set new timeout
                scrollTimeout = setTimeout(() => {
                    body.classList.remove('is-scrolling');
                }, 150);
            }
            
            lastScrollTop = currentScrollTop;
            ticking = false;
        });
        
        ticking = true;
    }
}, { passive: true });

// Optimize image loading
const imageLoader = {
    init() {
        this.images = document.querySelectorAll('img[data-src]');
        this.loadVisibleImages();
        this.setupIntersectionObserver();
    },

    loadVisibleImages() {
        this.images.forEach(img => {
            if (this.isInViewport(img)) {
                this.loadImage(img);
            }
        });
    },

    isInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '50px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        this.images.forEach(img => {
            if (!img.complete) {
                observer.observe(img);
            }
        });
    },

    loadImage(img) {
        if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        }
    }
};

// Initialize optimizations
document.addEventListener('DOMContentLoaded', () => {
    imageLoader.init();
});

// Prevent unnecessary reflows
window.addEventListener('resize', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            // Update any necessary layout calculations here
            ticking = false;
        });
        ticking = true;
    }
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
                    requestAnimationFrame(() => {
                        entry.target.style.willChange = 'transform';
                    });
                }
            });
        },
        {
            threshold: 0.1
        }
    );

    animatedElements.forEach(element => observer.observe(element));
};

// Initialize animation optimization
optimizeAnimations();

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    const navItems = document.querySelectorAll('.sidebar .nav-item');

    // Toggle sidebar
    function toggleSidebar() {
        sidebar.classList.toggle('active');
        sidebarOverlay.classList.toggle('active');
        document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
    }

    // Event listeners
    menuToggle.addEventListener('click', toggleSidebar);
    sidebarOverlay.addEventListener('click', toggleSidebar);

    // Close sidebar when clicking a nav item
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            toggleSidebar();
        });
    });

    // Close sidebar when pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            toggleSidebar();
        }
    });

    // Handle active state of nav items
    function updateActiveNavItem() {
        const sections = document.querySelectorAll('section');
        const navItems = document.querySelectorAll('.nav-item');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - sectionHeight/3)) {
                currentSection = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentSection}`) {
                item.classList.add('active');
            }
        });
    }

    // Update active nav item on scroll
    window.addEventListener('scroll', updateActiveNavItem);
    updateActiveNavItem();
}); 