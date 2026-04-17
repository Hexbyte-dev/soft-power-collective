// ============================================
// Navigation Menu Toggle
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle hamburger menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu.contains(event.target);
        const isClickOnHamburger = hamburger.contains(event.target);

        if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
});

// ============================================
// Scroll Animation for Cards and Sections
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all cards and scrollable elements
    document.querySelectorAll('.card, .intro-text, .about-casey-text').forEach(el => {
        el.classList.add('scroll-fade-in');
        observer.observe(el);
    });
});

// ============================================
// Smooth Scroll for Anchor Links
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            const headerOffset = 80; // Account for fixed navbar
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// Navbar Scroll State (translucent cream backdrop + blur once scrolled)
// ============================================

window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ============================================
// Email signup — AJAX POST to our /api/subscribe proxy.
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.signup-form').forEach(function(form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            var emailInput = form.querySelector('input[type="email"]');
            var email = (emailInput && emailInput.value || '').trim();
            if (!email) return;

            var sourceInput = form.querySelector('input[name="fields[source]"]');
            var source = sourceInput ? sourceInput.value : '';

            form.classList.remove('error');
            form.classList.add('submitted');

            try {
                var resp = await fetch('/api/subscribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email_address: email, source: source }),
                });

                if (!resp.ok) {
                    form.classList.remove('submitted');
                    form.classList.add('error');
                }
            } catch (err) {
                form.classList.remove('submitted');
                form.classList.add('error');
            }
        });
    });
});

// ============================================
// Contact form — AJAX POST to /api/contact.
// Submissions logged to Railway + sender added to Kit as "contact-form".
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    var contactForm = document.querySelector('.contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        var name = contactForm.querySelector('#name').value.trim();
        var email = contactForm.querySelector('#email').value.trim();
        var inquiry = contactForm.querySelector('#inquiry').value;
        var message = contactForm.querySelector('#message').value.trim();

        if (!name || !email || !message) return;

        contactForm.classList.remove('error');
        contactForm.classList.add('submitted');

        try {
            var resp = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name, email: email, inquiry: inquiry, message: message }),
            });

            if (!resp.ok) {
                contactForm.classList.remove('submitted');
                contactForm.classList.add('error');
            }
        } catch (err) {
            contactForm.classList.remove('submitted');
            contactForm.classList.add('error');
        }
    });
});
