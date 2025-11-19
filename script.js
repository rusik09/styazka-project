// ===== CONFIGURATION =====
const WORKER_URL = 'https://polished-cake-e6c7.lakazov77.workers.dev/';

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
        // Блокируем ввод букв и обрабатываем Enter
        input.addEventListener('keypress', function(e) {
            const char = e.key;
            
            // Обработка Enter - ОТПРАВКА ФОРМЫ
            if (char === 'Enter') {
                e.preventDefault();
                console.log('✓ Enter нажат в поле телефона');
                const form = this.closest('form');
                if (form) {
                    console.log('✓ Отправляем форму...');
                    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
                }
                return;
            }
            
            // Разрешаем служебные клавиши
            const allowedKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'];
            if (allowedKeys.includes(char)) {
                return;
            }
            
            // Блокируем всё кроме цифр
            if (!/^\d$/.test(char)) {
                e.preventDefault();
            }
        });
        
        // Форматирование при вводе
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 0) {
                if (value[0] === '8') {
                    value = '7' + value.substring(1);
                }
                
                // Ограничиваем длину до 11 цифр
                if (value.length > 11) {
                    value = value.substring(0, 11);
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

        // Запрет вставки текста с буквами
        input.addEventListener('paste', function(e) {
            e.preventDefault();
            const pastedText = (e.clipboardData || window.clipboardData).getData('text');
            const digits = pastedText.replace(/\D/g, '');
            
            if (digits) {
                const event = new Event('input', { bubbles: true });
                this.value = digits;
                this.dispatchEvent(event);
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
    
    // ===== ОТПРАВКА ПО ENTER В ИМЕНИ =====
    const nameInput = contactForm.querySelector('input[name="name"]');
    if (nameInput) {
        nameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                console.log('✓ Enter нажат в поле имени');
                contactForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
            }
        });
        console.log('✓ Enter для поля имени настроен');
    }
    
    // ===== ОТПРАВКА ПО ENTER В TEXTAREA (опционально) =====
    const messageInput = contactForm.querySelector('textarea[name="message"]');
    if (messageInput) {
        messageInput.addEventListener('keypress', function(e) {
            // Ctrl+Enter или Cmd+Enter для отправки из textarea
            if (e.key === 'Enter') {
                e.preventDefault();
                console.log('✓ Ctrl+Enter нажат в комментарии');
                contactForm.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
            }
        });
        console.log('✓ Ctrl+Enter для textarea настроен');
    }
    
    // ===== ОТПРАВКА ФОРМЫ =====
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
        
        // Проверка Worker URL
        if (WORKER_URL.includes('your-worker-name')) {
            console.error('✗ ОШИБКА: Worker URL не настроен!');
            formSuccess.innerHTML = '⚠️ Форма не настроена. Обратитесь к администратору.';
            formSuccess.style.background = '#ff9800';
            formSuccess.classList.add('show');
            setTimeout(() => formSuccess.classList.remove('show'), 5000);
            return;
        }
        
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
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            console.log('Результат:', result);
            
            if (result.success) {
                formSuccess.innerHTML = '✓ Спасибо! Ваша заявка принята. Мы свяжемся с вами в ближайшее время.';
                formSuccess.style.background = '#4CAF50';
                formSuccess.classList.add('show');
                contactForm.reset();
            } else {
                throw new Error(result.message || 'Неизвестная ошибка');
            }
        } catch (error) {
            console.error('Ошибка отправки:', error);
            formSuccess.innerHTML = '✗ Ошибка отправки: ' + error.message + '<br>Позвоните нам: +7 (863) 000-00-00';
            formSuccess.style.background = '#f44336';
            formSuccess.classList.add('show');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            setTimeout(() => {
                formSuccess.classList.remove('show');
            }, 7000);
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
