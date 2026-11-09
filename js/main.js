// Okiru Electronics - Main JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Header Scroll Effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileBtn.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-xmark');
        });
    }

    // Scroll Reveal Animation (using Intersection Observer)
    const revealElements = document.querySelectorAll('section, .product-card, .contact-info-card');
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.05,
        rootMargin: "0px 0px 50px 0px"
    });

    revealElements.forEach(el => {
        el.classList.add('reveal-hidden');
        revealObserver.observe(el);
    });

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                });
            }
        });
    });
    
    // Contact Form Logic
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    const submitBtn = document.getElementById('submitBtn');

    if (contactForm && formStatus && submitBtn) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // 1. Reset status
            formStatus.style.display = 'none';
            formStatus.className = 'form-status';
            
            // 2. Collect Data
            const formData = {
                full_name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                message: document.getElementById('message').value.trim()
            };

            // 3. Simple Validation
            if (!formData.full_name || !formData.email || !formData.phone || !formData.message) {
                showStatus('Please fill in all required fields.', 'error');
                return;
            }

            // 4. Loading State
            submitBtn.disabled = true;
            submitBtn.classList.add('btn-loading');

            try {
                // The deployed Google Apps Script Web App URL
                const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxxuEzfAmtCOmS1ajTdlcA7b4Dru8BhGJV79bBMc8--J6Tp4F2keg1w9SGJO9we7AaF/exec';

                const response = await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors', // Essential for GAS
                    headers: {
                        'Content-Type': 'text/plain' 
                    },
                    body: JSON.stringify(formData)
                });

                // Since we use no-cors, we can't read the response body, 
                // but if it didn't throw, we assume success or handle timeout
                showStatus('Your message has been sent successfully.', 'success');
                contactForm.reset();

            } catch (error) {
                console.error('Submission Error:', error);
                if (error.message.includes('configure')) {
                    showStatus(error.message, 'error');
                } else {
                    showStatus('Failed to send message. Please try again or contact us via WhatsApp.', 'error');
                }
            } finally {
                submitBtn.disabled = false;
                submitBtn.classList.remove('btn-loading');
            }
        });

        function showStatus(message, type) {
            formStatus.textContent = message;
            formStatus.className = `form-status ${type}`;
            formStatus.style.display = 'block';
            
            // Scroll to status if it's an error
            if (type === 'error') {
                formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    }

    // Product Modal Logic
    const modal = document.getElementById('productModal');
    if (modal) {
        const modalImg = document.getElementById('modalImg');
        const modalTitle = document.getElementById('modalTitle');
        const modalDesc = document.getElementById('modalDesc');
        const modalBtn = document.getElementById('modalContactBtn');
        const closeModal = document.querySelector('.close-modal');

        document.querySelectorAll('.product-card').forEach(card => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', (e) => {
                if(e.target.closest('a')) return;

                const img = card.querySelector('img');
                const title = card.querySelector('h3').textContent;
                const desc = card.querySelector('p').textContent;
                const contactLink = card.querySelector('a').getAttribute('href');

                modalImg.src = img.src;
                modalTitle.textContent = title;
                modalDesc.textContent = desc;
                modalBtn.setAttribute('href', contactLink);

                modal.style.display = 'flex';
                // Trigger reflow
                void modal.offsetWidth;
                modal.classList.add('show');
            });
        });

        closeModal.addEventListener('click', () => {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        });

        window.addEventListener('click', (e) => {
            if (e.target == modal) {
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 300);
            }
        });
    }

});
