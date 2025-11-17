console.log('✓ Script.js загружен!');

// === НАСТРОЙКИ ===
const WORKER_URL = 'https://polished-cake-e6c7.lakazov77.workers.dev/'; // ЗАМЕНИТЕ на ваш реальный URL!

console.log('Worker URL:', WORKER_URL);

// === SMOOTH SCROLL ===
document.addEventListener('DOMContentLoaded', function() {
    console.log('✓ DOM загружен!');
    
    // Smooth scroll для навигации
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // === COUNTER ANIMATION ===
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target + (target === 100 ? '' : '+');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start) + (target === 100 ? '' : '+');
            }
        }, 16);
    }

    // === INTERSECTION OBSERVER ===
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                if (entry.target.classList.contains('hero-content')) {
                    const statNumbers = document.querySelectorAll('.stat-number');
                    statNumbers.forEach(stat => {
                        const target = parseInt(stat.getAttribute('data-target'));
                        animateCounter(stat, target);
                    });
                }
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));
    
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        observer.observe(heroContent);
    }

    // === MOBILE MENU ===
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });

        document.querySelectorAll('.nav a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            });
        });
    }

    // === КАЛЬКУЛЯТОР ===
    const calculatorForm = document.getElementById('calculator-form');
    const calculatorResult = document.getElementById('calculator-result');

    if (calculatorForm) {
        console.log('✓ Калькулятор найден!');
        calculatorForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const area = parseFloat(document.getElementById('area').value);
            const serviceType = parseFloat(document.getElementById('service-type').value);
            const waterproofing = document.querySelector('input[name="waterproofing"]').checked ? 150 : 0;
            const insulation = document.querySelector('input[name="insulation"]').checked ? 200 : 0;
            
            if (area && serviceType) {
                const totalPricePerSqm = serviceType + waterproofing + insulation;
                const totalPrice = area * totalPricePerSqm;
                
                calculatorResult.innerHTML = `
                    <div>Примерная стоимость:</div>
                    <div style="font-size: 2rem; margin-top: 0.5rem;">${totalPrice.toLocaleString('ru-RU')} ₽</div>
                    <div style="font-size: 1rem; margin-top: 0.5rem; opacity: 0.8;">${totalPricePerSqm} ₽/м² × ${area} м²</div>
                `;
                calculatorResult.classList.add('show');
                
                setTimeout(() => {
                    calculatorResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 100);
            }
        });
    }

    // === КОНТАКТНАЯ ФОРМА ===
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    
    if (!contactForm) {
        console.error('✗ Форма не найдена! Проверьте id="contact-form"');
    } else {
        console.log('✓ Контактная форма найдена!');
        
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('✓ Форма отправляется!');
            
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                message: formData.get('message') || 'Не указано'
            };
            
            console.log('Данные формы:', data);
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Отправка...';
            submitBtn.disabled = true;
            
            try {
                console.log('Отправляю на:', WORKER_URL);
                
                const response = await fetch(WORKER_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                console.log('Ответ получен:', response.status);
                
                const result = await response.json();
                console.log('Результат:', result);
                
                if (result.success) {
                    formSuccess.innerHTML = '✓ Спасибо! Ваша заявка принята. Мы свяжемся с вами в ближайшее время.';
                    formSuccess.classList.add('show', 'success');
                    contactForm.reset();
                } else {
                    throw new Error(result.message);
                }
            } catch (error) {
                console.error('Ошибка:', error);
                formSuccess.innerHTML = '✗ Ошибка отправки. Пожалуйста, позвоните нам по телефону.';
                formSuccess.classList.add('show');
                formSuccess.style.background = '#fee2e2';
                formSuccess.style.color = '#dc2626';
                formSuccess.style.borderLeft = '4px solid #dc2626';
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                setTimeout(() => {
                    formSuccess.classList.remove('show');
                }, 5000);
            }
        });
    }

    // === TESTIMONIALS SLIDER ===
    let currentTestimonial = 0;
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');

    function showTestimonial(index) {
        testimonialItems.forEach((item, i) => {
            item.classList.remove('active');
            if (i === index) {
                item.classList.add('active');
            }
        });
    }

    if (prevBtn && nextBtn && testimonialItems.length > 0) {
        prevBtn.addEventListener('click', () => {
            currentTestimonial = (currentTestimonial - 1 + testimonialItems.length) % testimonialItems.length;
            showTestimonial(currentTestimonial);
        });

        nextBtn.addEventListener('click', () => {
            currentTestimonial = (currentTestimonial + 1) % testimonialItems.length;
            showTestimonial(currentTestimonial);
        });

        setInterval(() => {
            currentTestimonial = (currentTestimonial + 1) % testimonialItems.length;
            showTestimonial(currentTestimonial);
        }, 5000);
    }

    // === PHONE FORMATTING ===
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 0) {
                if (value[0] === '8') {
                    value = '7' + value.substring(1);
                }
                
                let formatted = '+7';
                if (value.length > 1) {
                    formatted += ' (' + value.substring(1, 4);
                }
                if (value.length >= 5) {
                    formatted += ') ' + value.substring(4, 7);
                }
                if (value.length >= 8) {
                    formatted += '-' + value.substring(7, 9);
                }
                if (value.length >= 10) {
                    formatted += '-' + value.substring(9, 11);
                }
                
                e.target.value = formatted;
            }
        });
    });

    // === HEADER SCROLL EFFECT ===
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }
    });

    // === PARALLAX (desktop only) ===
    if (window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero');
            if (hero && scrolled < hero.offsetHeight) {
                hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
            }
        });
    }
});

console.log('✓ Script.js полностью выполнен!');
