// ===== КОНФИГУРАЦИЯ =====
const WORKER_URL = 'https://muddy-resonance-4c32.lakazov77.workers.dev'; // ЗАМЕНИТЕ на ваш реальный URL Worker!

console.log('✓ Script.js загружен!');
console.log('Worker URL:', WORKER_URL);

// ===== SMOOTH SCROLL =====
function scrollToContact() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('✓ DOM загружен!');
    
    // ===== PHONE FORMATTING =====
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

    // ===== CONTACT FORM =====
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    
    if (!contactForm) {
        console.error('✗ Форма не найдена! Проверьте id="contact-form"');
        return;
    }
    
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
                formSuccess.style.background = '#4CAF50';
                formSuccess.classList.add('show');
                contactForm.reset();
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            console.error('Ошибка:', error);
            formSuccess.innerHTML = '✗ Ошибка отправки. Пожалуйста, позвоните нам по телефону.';
            formSuccess.style.background = '#f44336';
            formSuccess.classList.add('show');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            setTimeout(() => {
                formSuccess.classList.remove('show');
            }, 5000);
        }
    });

    // ===== HEADER SCROLL EFFECT =====
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
        }
        
        lastScroll = currentScroll;
    });
});

console.log('✓ Script.js полностью выполнен!');
