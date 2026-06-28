// ======================
// HELIO JAVASCRIPT
// ======================

document.addEventListener('DOMContentLoaded', function() {
    
    // Sticky Header Scroll Effect
    const header = document.querySelector('header');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check
    }
    
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinksItems = document.querySelectorAll('.nav-links a');
    navLinksItems.forEach(link => {
        link.addEventListener('click', function() {
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                if (menuToggle) {
                    menuToggle.classList.remove('active');
                }
            }
        });
    });
    
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Form handling - removed (contact form replaced with mailto link)
    
    // Add animation to cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe cards and other elements for animation
    const animateElements = document.querySelectorAll('.card, .step, .testimonial, .gallery-item');
    animateElements.forEach(el => observer.observe(el));
    
    // Highlight active navigation item
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navItems = document.querySelectorAll('.nav-links a');
    
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            item.classList.add('nav-active');
        } else {
            item.classList.remove('nav-active');
        }
    });
    
    // Add WhatsApp floating button functionality
    const whatsappBtn = document.querySelector('.whatsapp-float');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const message = encodeURIComponent('Hello! I would like to know more about Helio services.');
            const whatsappUrl = `https://wa.me/919743428688?text=${message}`;
            window.open(whatsappUrl, '_blank');
        });
    }

    // ==========================================
    // INTERACTIVE GALLERY & LIGHTBOX
    // ==========================================
    
    // Filter buttons
    const filterBtns = document.querySelectorAll('.gallery-filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (filterBtns.length > 0 && galleryItems.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                
                // Set active class on clicked button
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                
                galleryItems.forEach(item => {
                    const category = item.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 10);
                    } else {
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.95)';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
    
    // Lightbox Functionality
    const lightbox = document.getElementById('gallery-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDesc = document.getElementById('lightbox-desc');
    
    if (lightbox && galleryItems.length > 0) {
        let currentIndex = 0;
        const activeGalleryImages = [];
        
        // Fill active images (only those currently visible)
        const updateActiveImages = function() {
            activeGalleryImages.length = 0; // Clear array
            galleryItems.forEach(item => {
                if (item.style.display !== 'none') {
                    const img = item.querySelector('.gallery-img');
                    const overlay = item.querySelector('.gallery-overlay');
                    const title = overlay.querySelector('h4').textContent;
                    const desc = overlay.querySelector('p').textContent;
                    
                    activeGalleryImages.push({
                        src: img.getAttribute('src'),
                        title: title,
                        desc: desc
                    });
                }
            });
        };
        
        const showLightboxImage = function() {
            if (currentIndex < 0 || currentIndex >= activeGalleryImages.length) return;
            const currentData = activeGalleryImages[currentIndex];
            
            lightboxImg.style.transform = 'scale(0.95)';
            lightboxImg.style.opacity = '0';
            
            setTimeout(() => {
                lightboxImg.setAttribute('src', currentData.src);
                lightboxTitle.textContent = currentData.title;
                lightboxDesc.textContent = currentData.desc;
                lightboxImg.style.transform = 'scale(1)';
                lightboxImg.style.opacity = '1';
            }, 150);
        };
        
        // Open Lightbox
        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                updateActiveImages();
                
                const img = this.querySelector('.gallery-img');
                const src = img.getAttribute('src');
                
                // Find index of this image in active images
                currentIndex = activeGalleryImages.findIndex(item => item.src === src);
                
                showLightboxImage();
                
                lightbox.style.opacity = '1';
                lightbox.style.pointerEvents = 'auto';
                document.body.classList.add('lightbox-active');
            });
        });
        
        // Close Lightbox
        if (lightboxClose) {
            const closeFn = function() {
                lightbox.style.opacity = '0';
                lightbox.style.pointerEvents = 'none';
                document.body.classList.remove('lightbox-active');
            };
            
            lightboxClose.addEventListener('click', closeFn);
            lightbox.addEventListener('click', function(e) {
                if (e.target === lightbox) {
                    closeFn();
                }
            });
        }
        
        // Navigation
        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', function(e) {
                e.stopPropagation();
                if (activeGalleryImages.length > 0) {
                    currentIndex = (currentIndex - 1 + activeGalleryImages.length) % activeGalleryImages.length;
                    showLightboxImage();
                }
            });
        }
        
        if (lightboxNext) {
            lightboxNext.addEventListener('click', function(e) {
                e.stopPropagation();
                if (activeGalleryImages.length > 0) {
                    currentIndex = (currentIndex + 1) % activeGalleryImages.length;
                    showLightboxImage();
                }
            });
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (document.body.classList.contains('lightbox-active')) {
                if (e.key === 'Escape' && lightboxClose) {
                    lightboxClose.click();
                } else if (e.key === 'ArrowLeft' && lightboxPrev) {
                    lightboxPrev.click();
                } else if (e.key === 'ArrowRight' && lightboxNext) {
                    lightboxNext.click();
                }
            }
        });
    }
});

// Utility function to add loading state to buttons
function addLoadingState(button, loadingText = 'Loading...') {
    const originalText = button.textContent;
    button.textContent = loadingText;
    button.disabled = true;
    
    return function() {
        button.textContent = originalText;
        button.disabled = false;
    };
}

// ==================================================
// UNIVERSAL SLIDESHOW ENGINE
// Usage: initSlideshow('prefix') where HTML uses
//   class="prefix-slide"   and   class="prefix-dot"
// ==================================================
const _slideshowState = {};

function initSlideshow(prefix) {
    const slides = document.querySelectorAll('.' + prefix + '-slide');
    const dots   = document.querySelectorAll('.' + prefix + '-dot');
    if (!slides.length) return;

    _slideshowState[prefix] = { current: 0, slides, dots };
    _updateSlideshow(prefix);

    // Auto-advance every 4s
    const timer = setInterval(() => {
        const s = _slideshowState[prefix];
        s.current = (s.current + 1) % s.slides.length;
        _updateSlideshow(prefix);
    }, 4000);
    _slideshowState[prefix].timer = timer;
}

function slideshowStep(prefix, dir) {
    const s = _slideshowState[prefix];
    if (!s) return;
    clearInterval(s.timer);
    s.current = (s.current + dir + s.slides.length) % s.slides.length;
    _updateSlideshow(prefix);
    // Restart auto-advance
    s.timer = setInterval(() => {
        s.current = (s.current + 1) % s.slides.length;
        _updateSlideshow(prefix);
    }, 4000);
}

function slideshowGoto(prefix, index) {
    const s = _slideshowState[prefix];
    if (!s) return;
    clearInterval(s.timer);
    s.current = index;
    _updateSlideshow(prefix);
    s.timer = setInterval(() => {
        s.current = (s.current + 1) % s.slides.length;
        _updateSlideshow(prefix);
    }, 4000);
}

function _updateSlideshow(prefix) {
    const s = _slideshowState[prefix];
    s.slides.forEach((slide, i) => {
        slide.style.opacity = i === s.current ? '1' : '0';
    });
    s.dots.forEach((dot, i) => {
        dot.style.width  = i === s.current ? '20px' : '8px';
        dot.style.background = i === s.current ? 'white' : 'rgba(255,255,255,0.35)';
    });
}

// Expose to window scope for HTML inline calls
window.initSlideshow = initSlideshow;
window.slideshowStep = slideshowStep;
window.slideshowGoto = slideshowGoto;