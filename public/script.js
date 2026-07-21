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

// ============================================
// Threshold quiz — three questions, answered on the page.
// ============================================
(function () {
    var mount = document.getElementById('spc-quiz');
    if (!mount) return;

    var questions = [
        {
            text: 'What best describes where you are right now?',
            options: [
                { key: 'a', label: 'I have an idea I keep not acting on' },
                { key: 'b', label: "I've outgrown my current role" },
                { key: 'c', label: "I'm mid-change and it feels wobbly" }
            ]
        },
        {
            text: 'What is actually stopping you?',
            options: [
                { key: 'a', label: "I don't know the first concrete step" },
                { key: 'b', label: 'The people above me are not making room' },
                { key: 'c', label: "The fear that this isn't my time" }
            ]
        },
        {
            text: 'How ready are you to move?',
            options: [
                { key: 'a', label: 'Ready now, I just need a plan' },
                { key: 'b', label: 'Ready soon, once the path is clear' },
                { key: 'c', label: "Not sure, and that's why I'm here" }
            ]
        }
    ];

    var results = {
        a: {
            title: 'You are standing at the builder’s threshold.',
            body: 'The gap in front of you is between the idea and the operating reality, and it closes with structure: a first step, a deadline, and someone holding you to both. That is exactly what a Crossing engagement is built for.'
        },
        b: {
            title: 'You have outgrown the seat you are in.',
            body: 'The org chart says there is no path, and the org chart has been wrong before. Engineering a path where none exists is the signature move of this practice, and it starts with one conversation.'
        },
        c: {
            title: 'The work is not the problem. The belief is.',
            body: 'You are waiting for permission to be the main character of your own story. Consider this your invitation: bring that exact feeling to a free discovery call and we will name what is under it.'
        }
    };

    var tally = { a: 0, b: 0, c: 0 };
    var step = 0;

    function el(tag, styles, text) {
        var node = document.createElement(tag);
        if (styles) node.setAttribute('style', styles);
        if (text) node.textContent = text;
        return node;
    }

    function render() {
        mount.innerHTML = '';
        if (step < questions.length) {
            var q = questions[step];
            var card = el('div', 'background: var(--cream); border-radius: 12px; padding: 2.5rem 2rem; text-align: center;');
            card.appendChild(el('p', 'font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--terracotta); margin-bottom: 0.75rem;', 'Question ' + (step + 1) + ' of ' + questions.length));
            card.appendChild(el('h3', 'font-family: var(--font-heading); font-size: 1.5rem; margin-bottom: 1.5rem;', q.text));
            q.options.forEach(function (opt) {
                var btn = el('button', 'display: block; width: 100%; margin: 0 auto 0.75rem; padding: 1rem 1.25rem; border: 1px solid rgba(168,96,60,0.4); border-radius: 8px; background: var(--white); font-family: var(--font-body); font-size: 1rem; color: var(--charcoal); cursor: pointer; transition: var(--transition);', opt.label);
                btn.onmouseenter = function () { btn.style.background = '#F3EBDD'; };
                btn.onmouseleave = function () { btn.style.background = 'var(--white)'; };
                btn.onclick = function () {
                    tally[opt.key] += 1;
                    step += 1;
                    render();
                };
                card.appendChild(btn);
            });
            mount.appendChild(card);
        } else {
            var winner = 'a';
            if (tally.b > tally[winner]) winner = 'b';
            if (tally.c > tally[winner]) winner = 'c';
            var r = results[winner];
            var out = el('div', 'background: var(--cream); border-radius: 12px; padding: 2.5rem 2rem; text-align: center;');
            out.appendChild(el('h3', 'font-family: var(--font-heading); font-size: 1.6rem; margin-bottom: 1rem;', r.title));
            out.appendChild(el('p', 'font-size: 1.05rem; line-height: 1.8; margin-bottom: 1.75rem;', r.body));
            var cta = el('a', '', 'Book a Free Discovery Call');
            cta.href = 'contact.html';
            cta.className = 'btn btn-primary';
            out.appendChild(cta);
            var again = el('button', 'display: block; margin: 1.25rem auto 0; background: none; border: none; color: rgba(59,58,48,0.6); font-size: 0.9rem; cursor: pointer; text-decoration: underline;', 'Start over');
            again.onclick = function () { tally = { a: 0, b: 0, c: 0 }; step = 0; render(); };
            out.appendChild(again);
            mount.appendChild(out);
        }
    }

    render();
})();
