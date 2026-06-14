// ============================================
// THEME TOGGLE (LIGHT/DARK MODE)
// ============================================

function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    
    if (themeToggle) {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            body.classList.add('dark-mode');
        }

        themeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            
            // Save theme preference
            if (body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });
    }
}

initThemeToggle();

// ============================================
// MOBILE MENU TOGGLE
// ============================================

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when a link is clicked
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ============================================
// SET ACTIVE NAV LINK (SCROLL POSITION)
// ============================================

function setActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Set active nav link on scroll
window.addEventListener('scroll', setActiveNavLink);

// Set active nav link on load
setActiveNavLink();

// ============================================
// PROJECT FILTER
// ============================================

const filterButtons = document.querySelectorAll('.filter-btn');
const projectItems = document.querySelectorAll('.project-item');

if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            // Filter projects
            projectItems.forEach(item => {
                if (filterValue === 'all') {
                    item.classList.remove('hidden');
                } else {
                    const category = item.getAttribute('data-category');
                    if (category === filterValue) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                }
            });
        });
    });
}

// ============================================
// CONTACT FORM HANDLING (TELEGRAM INTEGRATION)
// ============================================

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();
        const formMessage = document.getElementById('formMessage');

        // Validation
        if (!name || !email || !message) {
            showMessage('Please fill in all fields', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage('Please enter a valid email address', 'error');
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

        // Telegram Bot Details
        const TELEGRAM_TOKEN = '8678279044:AAHNivCyJ8geCaobrpVxL4Lf5g6G8I8Km7M';
        const CHAT_ID = '6923811326'; // <-- PASTE YOUR ID FROM @userinfobot HERE

        // Prepare message for Telegram (Plain text is safer)
        const telegramMessage = `
📬 New Message from Portfolio
👤 Name: ${name}
📧 Email: ${email}
📝 Message: 
${message}
        `;

        try {
            const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: telegramMessage
                })
            });

            const data = await response.json();

            if (response.ok) {
                showMessage('Message sent successfully! I\'ll receive it on Telegram.', 'success');
                contactForm.reset();
            } else {
                console.error('Telegram API Error:', data);
                throw new Error(data.description || 'Failed to send message');
            }
        } catch (error) {
            console.error('Submission Error:', error);
            showMessage(`Error: ${error.message}. Please check if you started the bot!`, 'error');
        } finally {
            // Restore button state
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
            
            // Clear message after 5 seconds if successful
            if (formMessage.classList.contains('success')) {
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 5000);
            }
        }
    });

    function showMessage(text, type) {
        const formMessage = document.getElementById('formMessage');
        formMessage.textContent = text;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';
    }
}

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ============================================
// SCROLL ANIMATIONS
// ============================================

const observerOptions = {
    threshold: 0.1,
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

// Observe project cards and skill categories
document.querySelectorAll('.project-card, .skill-card, .timeline-item').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
});

// ============================================
// SKILL PROGRESS ANIMATION
// ============================================

const skillProgressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBars = entry.target.querySelectorAll('.skill-progress-bar');
            progressBars.forEach((bar, index) => {
                const percentage = bar.getAttribute('data-percentage');
                setTimeout(() => {
                    bar.style.width = percentage + '%';
                }, index * 150); // Stagger animation
            });
            skillProgressObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const skillsSection = document.getElementById('skills');
if (skillsSection) {
    skillProgressObserver.observe(skillsSection);
}

// ============================================
// NAVBAR BACKGROUND ON SCROLL
// ============================================

const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
    }
});

// ============================================
// COUNTER ANIMATION (Optional - for stats)
// ============================================

function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio website loaded successfully!');
});
