/*!
* Start Bootstrap - Personal v1.0.1 (https://startbootstrap.com/template-overviews/personal)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-personal/blob/master/LICENSE)
*/

// Auto-sliding Hero Carousel
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const totalSlides = slides.length;

// Auto-slide interval (changes every 4 seconds)
let autoSlideInterval;

// Initialize carousel
function initCarousel() {
    if (slides.length === 0) return;
    
    // Start auto-slide
    startAutoSlide();
}

// Go to next slide
function nextSlide() {
    // Remove active class from current slide
    slides[currentSlide].classList.remove('active');
    
    // Move to next slide (loop back to first if at end)
    currentSlide = (currentSlide + 1) % totalSlides;
    
    // Add active class to new slide
    slides[currentSlide].classList.add('active');
}

// Start auto-slide
function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        nextSlide();
    }, 4000); // Change slide every 4 seconds
}

// Pause auto-slide when user hovers over the carousel
function pauseAutoSlide() {
    clearInterval(autoSlideInterval);
}

// Resume auto-slide when user stops hovering
function resumeAutoSlide() {
    startAutoSlide();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    cleanInlineStyles(); // Clean inline styles first
    initCarousel();
    initProcessStepsAnimation(); // Initialize process steps animation
    initClientPageEffects(); // Initialize client page effects and statistics
    
    // Optional: Pause on hover for better user experience
    const carousel = document.querySelector('.hero-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', pauseAutoSlide);
        carousel.addEventListener('mouseleave', resumeAutoSlide);
    }
    
    // Mobile menu scroll control
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        // Create backdrop element
        const backdrop = document.createElement('div');
        backdrop.className = 'menu-backdrop';
        document.body.appendChild(backdrop);
        
        // Listen for menu toggle events
        navbarToggler.addEventListener('click', function() {
            // Use setTimeout to wait for Bootstrap to update aria-expanded
            setTimeout(() => {
                const isExpanded = navbarToggler.getAttribute('aria-expanded') === 'true';
                if (isExpanded) {
                    document.body.classList.add('menu-open');
                    backdrop.classList.add('show');
                } else {
                    document.body.classList.remove('menu-open');
                    backdrop.classList.remove('show');
                }
            }, 10);
        });
        
        // Close menu when clicking on backdrop
        backdrop.addEventListener('click', function() {
            navbarToggler.click();
            document.body.classList.remove('menu-open');
            backdrop.classList.remove('show');
        });
        
        // Also handle when menu items are clicked (to close menu)
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                document.body.classList.remove('menu-open');
                backdrop.classList.remove('show');
                // Close the Bootstrap collapse
                if (navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }
            });
        });
    }
});

// Pause carousel when page is not visible (performance optimization)
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        pauseAutoSlide();
    } else {
        startAutoSlide();
    }
});

// Process Steps Animation (for Services page)
function initProcessStepsAnimation() {
    // Animate process steps on scroll
    const processSteps = document.querySelectorAll('.process-step');
    
    if (processSteps.length === 0) return; // Exit if no process steps found
    
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const processObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate');
                }, index * 200);
            }
        });
    }, observerOptions);
    
    processSteps.forEach(step => {
        processObserver.observe(step);
    });
    
    // Sequential activation effect
    let currentActiveStep = 0;
    const totalSteps = processSteps.length;
    
    function activateNextStep() {
        // Remove active class from all steps
        processSteps.forEach(step => step.classList.remove('active'));
        
        // Add active class to current step
        if (processSteps[currentActiveStep]) {
            processSteps[currentActiveStep].classList.add('active');
        }
        
        // Move to next step
        currentActiveStep = (currentActiveStep + 1) % totalSteps;
    }
    
    // Start sequential animation when process section is visible
    const processSection = document.querySelector('.process-step').closest('section');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Start sequential animation
                activateNextStep();
                setInterval(activateNextStep, 3000);
                sectionObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    if (processSection) {
        sectionObserver.observe(processSection);
    }
}

// Client Page Effects and Statistics Animation
function initClientPageEffects() {
    // Función para animar contadores
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000; // 2 segundos
        const start = 0;
        const increment = target / (duration / 16); // 60fps
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Formato especial para porcentajes
            if (element.closest('.stat-item').querySelector('.stat-label').textContent.includes('Satisfacción')) {
                element.textContent = Math.floor(current) + '%';
            } else if (target >= 50) {
                element.textContent = Math.floor(current) + '+';
            } else {
                element.textContent = Math.floor(current);
            }
            
            element.classList.add('animate');
        }, 16);
    }
    
    // Intersection Observer para activar contadores cuando entren en vista
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach((statNumber, index) => {
                    setTimeout(() => {
                        animateCounter(statNumber);
                    }, index * 200); // Retraso escalonado
                });
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observar la sección de estadísticas
    const statsContainer = document.querySelector('.stats-container');
    if (statsContainer) {
        observer.observe(statsContainer);
    }
    
    // Efectos adicionales para tarjetas de clientes
    const clientCards = document.querySelectorAll('.client-card');
    clientCards.forEach((card, index) => {
        // Retraso escalonado para la animación inicial
        card.style.animationDelay = `${index * 0.1}s`;
        
        // Efecto de sonido visual en hover (opcional)
        card.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 25px 50px rgba(0,0,0,0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
        });
    });
    
    // Efecto parallax sutil para partículas
    window.addEventListener('scroll', function() {
        const particles = document.querySelectorAll('.stats-particle');
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        particles.forEach((particle, index) => {
            particle.style.transform = `translateY(${rate + (index * 10)}px)`;
        });
    });
}

// Clean inline styles and apply CSS classes
function cleanInlineStyles() {
    // Clean service card images
    const serviceImages = document.querySelectorAll('.card-img-top');
    serviceImages.forEach(img => {
        if (img.style.height === '140px' && img.style.objectFit === 'cover') {
            img.classList.add('service-card-img');
            img.style.height = '';
            img.style.objectFit = '';
        }
        if (img.style.height === '200px' && img.style.objectFit === 'cover') {
            img.classList.add('client-card-img');
            img.style.height = '';
            img.style.objectFit = '';
        }
    });
    
    // Clean badges
    const badges = document.querySelectorAll('.badge');
    badges.forEach(badge => {
        if (badge.style.fontSize === '0.7rem') {
            badge.classList.add('service-badge');
            badge.style.fontSize = '';
        }
    });
    
    // Clean titles
    const titles = document.querySelectorAll('.card-title');
    titles.forEach(title => {
        if (title.style.fontSize === '1rem') {
            title.classList.add('service-title');
            title.style.fontSize = '';
        }
    });
    
    // Clean text
    const texts = document.querySelectorAll('.card-text');
    texts.forEach(text => {
        if (text.style.fontSize === '0.85rem') {
            text.classList.add('service-text');
            text.style.fontSize = '';
        }
    });
    
    // Clean lists
    const lists = document.querySelectorAll('.list-unstyled');
    lists.forEach(list => {
        if (list.style.fontSize === '0.8rem') {
            list.classList.add('service-list');
            list.style.fontSize = '';
        }
    });
    
    // Clean feature icons
    const features = document.querySelectorAll('.feature');
    features.forEach(feature => {
        if (feature.style.width === '3rem' && feature.style.height === '3rem') {
            feature.classList.add('feature-icon-md');
            feature.style.width = '';
            feature.style.height = '';
            feature.style.display = '';
            feature.style.alignItems = '';
            feature.style.justifyContent = '';
        }
        if (feature.style.width === '4rem' && feature.style.height === '4rem') {
            feature.classList.add('feature-icon-lg');
            feature.style.width = '';
            feature.style.height = '';
        }
    });
}