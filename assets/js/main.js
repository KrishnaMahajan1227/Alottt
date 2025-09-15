// Main JavaScript File
(function() {
    'use strict';
    
    // Global variables
    let particlesCanvas;
    let particlesCtx;
    let particles = [];
    let mouse = { x: 0, y: 0 };
    let isAnimating = true;
    
    // Initialize everything when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        initParticles();
        initHeader();
        initAnimations();
        initSwipers();
        initTilt();
        initMagneticButtons();
        initBackToTop();
        initCounters();
        initMobileMenu();
        initSmoothScroll();
        
        // Page-specific initializations
        if (window.location.pathname.includes('contact')) {
            initContactForm();
        }
    });
    
    // Particle System
    function initParticles() {
        particlesCanvas = document.getElementById('particles-canvas');
        if (!particlesCanvas) return;
        
        particlesCtx = particlesCanvas.getContext('2d');
        
        // Set canvas size
        function resizeCanvas() {
            particlesCanvas.width = window.innerWidth;
            particlesCanvas.height = window.innerHeight;
        }
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        // Create particles
        function createParticles() {
            const particleCount = Math.min(50, window.innerWidth / 20);
            particles = [];
            
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * particlesCanvas.width,
                    y: Math.random() * particlesCanvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    size: Math.random() * 2 + 1,
                    opacity: Math.random() * 0.5 + 0.2
                });
            }
        }
        
        // Animate particles
        function animateParticles() {
            if (!isAnimating) return;
            
            particlesCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
            
            particles.forEach((particle, index) => {
                // Update position
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Bounce off edges
                if (particle.x < 0 || particle.x > particlesCanvas.width) {
                    particle.vx *= -1;
                }
                if (particle.y < 0 || particle.y > particlesCanvas.height) {
                    particle.vy *= -1;
                }
                
                // Draw particle
                particlesCtx.beginPath();
                particlesCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                particlesCtx.fillStyle = `rgba(11, 95, 255, ${particle.opacity})`;
                particlesCtx.fill();
                
                // Draw connections
                particles.forEach((otherParticle, otherIndex) => {
                    if (index === otherIndex) return;
                    
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100) {
                        particlesCtx.beginPath();
                        particlesCtx.moveTo(particle.x, particle.y);
                        particlesCtx.lineTo(otherParticle.x, otherParticle.y);
                        particlesCtx.strokeStyle = `rgba(11, 95, 255, ${0.1 * (1 - distance / 100)})`;
                        particlesCtx.lineWidth = 1;
                        particlesCtx.stroke();
                    }
                });
            });
            
            requestAnimationFrame(animateParticles);
        }
        
        // Mouse interaction
        particlesCanvas.addEventListener('mousemove', function(e) {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            
            particles.forEach(particle => {
                const dx = mouse.x - particle.x;
                const dy = mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    const force = (100 - distance) / 100;
                    particle.vx -= (dx / distance) * force * 0.01;
                    particle.vy -= (dy / distance) * force * 0.01;
                }
            });
        });
        
        createParticles();
        animateParticles();
        
        // Pause animation when tab is not visible
        document.addEventListener('visibilitychange', function() {
            isAnimating = !document.hidden;
            if (isAnimating) {
                animateParticles();
            }
        });
    }
    
    // Header functionality
    function initHeader() {
        const header = document.getElementById('header');
        if (!header) return;
        
        let lastScrollY = window.scrollY;
        
        function updateHeader() {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            lastScrollY = currentScrollY;
        }
        
        window.addEventListener('scroll', updateHeader, { passive: true });
        updateHeader();
    }
    
    // GSAP Animations
    function initAnimations() {
        if (typeof gsap === 'undefined') return;
        
        gsap.registerPlugin(ScrollTrigger);
        
        // Hero animations
        const heroTitle = document.querySelectorAll('.hero-line');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const heroActions = document.querySelector('.hero-actions');
        
        if (heroTitle.length > 0) {
            gsap.timeline()
                .to(heroTitle, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: 'power2.out'
                })
                .to(heroSubtitle, {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: 'power2.out'
                }, '-=0.4')
                .to(heroActions, {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: 'power2.out'
                }, '-=0.3');
        }
        
        // Page hero animations
        const pageTitle = document.querySelector('.page-title');
        const pageSubtitle = document.querySelector('.page-subtitle');
        const legalDate = document.querySelector('.legal-date');
        
        if (pageTitle) {
            gsap.timeline()
                .to(pageTitle, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power2.out'
                })
                .to(pageSubtitle, {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: 'power2.out'
                }, '-=0.4')
                .to(legalDate, {
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    ease: 'power2.out'
                }, '-=0.2');
        }
        
        // Section headers
        gsap.utils.toArray('.section-title').forEach(title => {
            gsap.to(title, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: title,
                    start: 'top 80%',
                    once: true
                }
            });
        });
        
        gsap.utils.toArray('.section-subtitle').forEach(subtitle => {
            gsap.to(subtitle, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: subtitle,
                    start: 'top 80%',
                    once: true
                }
            });
        });
        
        // Service cards
        gsap.utils.toArray('.service-card').forEach((card, index) => {
            gsap.to(card, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                delay: index * 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                    once: true
                }
            });
        });
        
        // Service detailed cards
        gsap.utils.toArray('.service-detailed').forEach((card, index) => {
            gsap.to(card, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                delay: index * 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                    once: true
                }
            });
        });
        
        // Project cards
        gsap.utils.toArray('.project-card').forEach((card, index) => {
            gsap.to(card, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                delay: index * 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                    once: true
                }
            });
        });
        
        // Timeline items
        const timelineLine = document.querySelector('.timeline-line');
        if (timelineLine) {
            gsap.to(timelineLine, {
                height: '100%',
                duration: 2,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: timelineLine,
                    start: 'top 80%',
                    once: true
                }
            });
        }
        
        gsap.utils.toArray('.timeline-item').forEach((item, index) => {
            gsap.to(item, {
                opacity: 1,
                x: 0,
                duration: 0.6,
                delay: index * 0.2,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: item,
                    start: 'top 80%',
                    once: true
                }
            });
        });
        
        // Roadmap items
        gsap.utils.toArray('.roadmap-item').forEach((item, index) => {
            gsap.to(item, {
                opacity: 1,
                x: 0,
                duration: 0.6,
                delay: index * 0.2,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: item,
                    start: 'top 80%',
                    once: true
                }
            });
        });
        
        // KPI counters
        gsap.utils.toArray('.kpi-item').forEach((item, index) => {
            gsap.to(item, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                delay: index * 0.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: item,
                    start: 'top 80%',
                    once: true
                }
            });
        });
        
        // CTA sections
        gsap.utils.toArray('.cta-content h2').forEach(title => {
            gsap.to(title, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: title,
                    start: 'top 80%',
                    once: true
                }
            });
        });
        
        gsap.utils.toArray('.cta-content p').forEach(text => {
            gsap.to(text, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: text,
                    start: 'top 80%',
                    once: true
                }
            });
        });
        
        gsap.utils.toArray('.cta .btn-primary').forEach(btn => {
            gsap.to(btn, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: btn,
                    start: 'top 80%',
                    once: true
                }
            });
        });
        
        // Generic fade-up animations
        const fadeUpElements = [
            '.partner-benefit',
            '.goal-item',
            '.module-card',
            '.workflow-item',
            '.feature-card',
            '.tech-item',
            '.value-item',
            '.resource-card',
            '.highlight-item',
            '.faq-item',
            '.result-item',
            '.skill-category',
            '.summary-item',
            '.contact-form-wrapper',
            '.contact-info',
            '.legal-document',
            '.content-main',
            '.content-sidebar',
            '.framing-content'
        ];
        
        fadeUpElements.forEach(selector => {
            gsap.utils.toArray(selector).forEach((element, index) => {
                gsap.to(element, {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: element,
                        start: 'top 80%',
                        once: true
                    }
                });
            });
        });
        
        // Project hero animations
        const projectTitle = document.querySelector('.project-title');
        const projectSubtitle = document.querySelector('.project-subtitle');
        const projectMeta = document.querySelector('.project-meta');
        
        if (projectTitle) {
            gsap.timeline()
                .to(projectTitle, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power2.out'
                })
                .to(projectSubtitle, {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: 'power2.out'
                }, '-=0.4')
                .to(projectMeta, {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: 'power2.out'
                }, '-=0.3');
        }
    }
    
    // Swiper initialization
    function initSwipers() {
        if (typeof Swiper === 'undefined') return;
        
        // Work/Projects Swiper
        const workSwiper = document.querySelector('.work-swiper, .projects-swiper');
        if (workSwiper) {
            new Swiper(workSwiper, {
                slidesPerView: 1,
                spaceBetween: 30,
                loop: true,
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false,
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                breakpoints: {
                    768: {
                        slidesPerView: 2,
                    },
                    1024: {
                        slidesPerView: 3,
                    }
                }
            });
        }
        
        // Gallery Swiper
        const gallerySwiper = document.querySelector('.gallery-swiper');
        if (gallerySwiper) {
            new Swiper(gallerySwiper, {
                slidesPerView: 1,
                spaceBetween: 30,
                loop: true,
                autoplay: {
                    delay: 4000,
                    disableOnInteraction: false,
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                breakpoints: {
                    768: {
                        slidesPerView: 2,
                    }
                }
            });
        }
    }
    
    // VanillaTilt initialization
    function initTilt() {
        if (typeof VanillaTilt === 'undefined') return;
        
        const tiltElements = document.querySelectorAll('[data-tilt]');
        tiltElements.forEach(element => {
            VanillaTilt.init(element, {
                max: 15,
                speed: 400,
                glare: true,
                'max-glare': 0.2,
            });
        });
    }
    
    // Magnetic buttons
    function initMagneticButtons() {
        const magneticButtons = document.querySelectorAll('.magnetic');
        
        magneticButtons.forEach(button => {
            button.addEventListener('mousemove', function(e) {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const moveX = x * 0.1;
                const moveY = y * 0.1;
                
                button.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
            
            button.addEventListener('mouseleave', function() {
                button.style.transform = 'translate(0, 0)';
            });
        });
    }
    
    // Back to top button
    function initBackToTop() {
        const backToTop = document.getElementById('back-to-top');
        if (!backToTop) return;
        
        function toggleBackToTop() {
            if (window.scrollY > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
        
        window.addEventListener('scroll', toggleBackToTop, { passive: true });
        
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Counter animations
    function initCounters() {
        const counters = document.querySelectorAll('.kpi-number, .stat-number, .result-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.target || counter.textContent);
            let current = 0;
            const increment = target / 100;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = Math.floor(current);
            }, 20);
            
            // Trigger animation on scroll
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Animation is handled by the timer above
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(counter);
        });
    }
    
    // Mobile menu
    function initMobileMenu() {
        const mobileToggle = document.getElementById('mobile-toggle');
        const nav = document.getElementById('nav');
        
        if (!mobileToggle || !nav) return;
        
        mobileToggle.addEventListener('click', function() {
            mobileToggle.classList.toggle('active');
            nav.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = nav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileToggle.classList.remove('active');
                nav.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && !mobileToggle.contains(e.target)) {
                mobileToggle.classList.remove('active');
                nav.classList.remove('active');
            }
        });
    }
    
    // Smooth scroll for anchor links
    function initSmoothScroll() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const headerHeight = document.getElementById('header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // Contact form handling
    function initContactForm() {
        const contactForm = document.getElementById('contact-form');
        if (!contactForm) return;
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = {};
            
            for (let [key, value] of formData.entries()) {
                data[key] = value;
            }
            
            // Validate required fields
            const requiredFields = ['name', 'email', 'message', 'privacy'];
            let isValid = true;
            
            requiredFields.forEach(field => {
                const input = this.querySelector(`[name="${field}"]`);
                if (!data[field] || data[field].trim() === '') {
                    isValid = false;
                    input.style.borderColor = '#ef4444';
                } else {
                    input.style.borderColor = '#d1d5db';
                }
            });
            
            if (!isValid) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Create mailto link
            const subject = encodeURIComponent(`New Project Inquiry from ${data.name}`);
            const body = encodeURIComponent(`
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}
Company: ${data.company || 'Not provided'}
Service Interest: ${data.service || 'Not specified'}
Budget Range: ${data.budget || 'Not specified'}

Project Details:
${data.message}

---
This inquiry was submitted through the Alottt website contact form.
            `);
            
            const mailtoLink = `mailto:connect@alottt.com?subject=${subject}&body=${body}`;
            
            // Open email client
            window.location.href = mailtoLink;
            
            // Show success message
            alert('Thank you for your inquiry! Your default email client should open with the message. If it doesn\'t, please email us directly at connect@alottt.com');
            
            // Reset form
            this.reset();
        });
        
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.hasAttribute('required') && !this.value.trim()) {
                    this.style.borderColor = '#ef4444';
                } else {
                    this.style.borderColor = '#d1d5db';
                }
            });
            
            input.addEventListener('input', function() {
                if (this.style.borderColor === 'rgb(239, 68, 68)') {
                    this.style.borderColor = '#d1d5db';
                }
            });
        });
    }
    
    // Utility functions
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // Performance optimizations
    const debouncedResize = debounce(() => {
        // Handle resize events
        if (particlesCanvas) {
            particlesCanvas.width = window.innerWidth;
            particlesCanvas.height = window.innerHeight;
        }
    }, 250);
    
    window.addEventListener('resize', debouncedResize);
    
    // Lazy loading for images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Error handling
    window.addEventListener('error', function(e) {
        console.error('JavaScript error:', e.error);
    });
    
    // Service worker registration (if available)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                    console.log('SW registered: ', registration);
                })
                .catch(function(registrationError) {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
    
})();