// ======================
// HEALIO JAVASCRIPT
// ======================

document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            
            // Animate hamburger icon
            const spans = menuToggle.querySelectorAll('span');
            spans.forEach((span, index) => {
                if (navLinks.classList.contains('active')) {
                    if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
                    if (index === 1) span.style.opacity = '0';
                    if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
                } else {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                }
            });
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinksItems = document.querySelectorAll('.nav-links a');
    navLinksItems.forEach(link => {
        link.addEventListener('click', function() {
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                
                // Reset hamburger icon
                const spans = menuToggle.querySelectorAll('span');
                spans.forEach(span => {
                    span.style.transform = 'none';
                    span.style.opacity = '1';
                });
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
    
    // Form handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Simple validation
            if (!data.name || !data.email || !data.message) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual form handler)
            setTimeout(() => {
                alert('Thank you for your message! We will get back to you soon.');
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }
    
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
    const animateElements = document.querySelectorAll('.card, .step, .testimonial');
    animateElements.forEach(el => observer.observe(el));
    
    // Highlight active navigation item
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navItems = document.querySelectorAll('.nav-links a');
    
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            item.style.color = 'var(--primary-color)';
            item.style.fontWeight = '600';
        }
    });
    
    // Add WhatsApp floating button functionality
    const whatsappBtn = document.querySelector('.whatsapp-float');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const message = encodeURIComponent('Hello! I would like to know more about Healio services.');
            const whatsappUrl = `https://wa.me/918762204773?text=${message}`;
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
                // Remove active class and styles from all buttons
                filterBtns.forEach(b => {
                    b.classList.remove('active');
                    b.style.background = 'white';
                    b.style.color = '#0f172a';
                    b.style.boxShadow = 'none';
                    b.style.border = '1px solid #e2e8f0';
                });
                
                // Set active style on clicked button
                this.classList.add('active');
                this.style.background = '#009688';
                this.style.color = 'white';
                this.style.boxShadow = '0 4px 12px rgba(0,150,136,0.2)';
                this.style.border = 'none';
                
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