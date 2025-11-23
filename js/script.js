// ===== التحكم في القائمة للشاشات الصغيرة =====
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navbar = document.querySelector('.navbar');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
});

// إغلاق القائمة عند النقر على رابط
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// إغلاق القائمة عند النقر خارجها
document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !menuToggle.contains(e.target) && navLinks.classList.contains('active')) {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// ===== تغيير شكل شريط التنقل عند التمرير =====
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ===== زر العودة للأعلى =====
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===== تحريك العدادات =====
function animateCounter(el, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const suffix = el.textContent.includes('%') ? '%' : '';
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            el.textContent = target + (suffix ? '' : '+');
            clearInterval(timer);
        } else {
            el.textContent = Math.floor(start);
        }
    }, 16);
}

// Observer للعدادات
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.stats-number, .stat-number');
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                if (target && !counter.classList.contains('counted')) {
                    counter.classList.add('counted');
                    animateCounter(counter, target);
                }
            });
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stats-section, .hero-stats').forEach(section => {
    statsObserver.observe(section);
});

// ===== تأثير الظهور التدريجي للعناصر =====
const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('animate');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.feature-card, .gallery-item, .about-content > div, .info-card, .stats-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    animateOnScroll.observe(el);
});

// ===== التعامل مع نموذج التواصل =====
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            subject: document.getElementById('subject')?.value || '',
            message: document.getElementById('message').value.trim()
        };
        
        // التحقق من البيانات
        if (!formData.name || !formData.email || !formData.message) {
            showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
            return;
        }
        
        if (!isValidEmail(formData.email)) {
            showNotification('يرجى إدخال بريد إلكتروني صحيح', 'error');
            return;
        }
        
        // محاكاة إرسال النموذج
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalContent = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            showNotification('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً', 'success');
            contactForm.reset();
            submitBtn.innerHTML = originalContent;
            submitBtn.disabled = false;
        }, 2000);
    });
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ===== عرض الإشعارات =====
function showNotification(message, type) {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        left: '50%',
        transform: 'translateX(-50%) translateY(-20px)',
        background: type === 'success' ? 'linear-gradient(135deg, #05bfdb 0%, #00ffca 100%)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        color: type === 'success' ? '#001d3d' : '#fff',
        padding: '16px 24px',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        fontSize: '1rem',
        fontWeight: '600',
        zIndex: '10000',
        opacity: '0',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        minWidth: '300px',
        maxWidth: '90%'
    });
    
    const content = notification.querySelector('.notification-content');
    Object.assign(content.style, {
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    });
    
    const closeBtn = notification.querySelector('.notification-close');
    Object.assign(closeBtn.style, {
        background: 'none',
        border: 'none',
        color: 'inherit',
        cursor: 'pointer',
        padding: '5px',
        opacity: '0.7',
        transition: 'opacity 0.3s'
    });
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(-50%) translateY(0)';
    }, 10);
    
    const hideNotification = () => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(-50%) translateY(-20px)';
        setTimeout(() => notification.remove(), 400);
    };
    
    closeBtn.addEventListener('click', hideNotification);
    setTimeout(hideNotification, 5000);
}

// ===== معرض الصور - Lightbox =====
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const title = item.querySelector('.gallery-content span')?.textContent || '';
        
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-overlay"></div>
            <div class="lightbox-container">
                <button class="lightbox-close"><i class="fas fa-times"></i></button>
                <img src="${img.src}" alt="${title}">
                <p class="lightbox-title">${title}</p>
            </div>
        `;
        
        Object.assign(lightbox.style, {
            position: 'fixed',
            inset: '0',
            zIndex: '10001',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        });
        
        const overlay = lightbox.querySelector('.lightbox-overlay');
        Object.assign(overlay.style, {
            position: 'absolute',
            inset: '0',
            background: 'rgba(0, 29, 61, 0.95)',
            backdropFilter: 'blur(10px)',
            opacity: '0',
            transition: 'opacity 0.4s'
        });
        
        const container = lightbox.querySelector('.lightbox-container');
        Object.assign(container.style, {
            position: 'relative',
            maxWidth: '90%',
            maxHeight: '90%',
            textAlign: 'center',
            transform: 'scale(0.9)',
            opacity: '0',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
        });
        
        const lightboxImg = lightbox.querySelector('img');
        Object.assign(lightboxImg.style, {
            maxWidth: '100%',
            maxHeight: '80vh',
            borderRadius: '16px',
            boxShadow: '0 25px 80px rgba(0,0,0,0.5)'
        });
        
        const lightboxTitle = lightbox.querySelector('.lightbox-title');
        Object.assign(lightboxTitle.style, {
            color: '#fff',
            marginTop: '20px',
            fontSize: '1.3rem',
            fontWeight: '600'
        });
        
        const closeBtn = lightbox.querySelector('.lightbox-close');
        Object.assign(closeBtn.style, {
            position: 'absolute',
            top: '-50px',
            left: '0',
            background: 'linear-gradient(135deg, #05bfdb 0%, #00ffca 100%)',
            border: 'none',
            color: '#001d3d',
            width: '45px',
            height: '45px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '1.2rem',
            transition: 'transform 0.3s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        });
        
        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            overlay.style.opacity = '1';
            container.style.opacity = '1';
            container.style.transform = 'scale(1)';
        }, 10);
        
        const closeLightbox = () => {
            overlay.style.opacity = '0';
            container.style.opacity = '0';
            container.style.transform = 'scale(0.9)';
            document.body.style.overflow = '';
            setTimeout(() => lightbox.remove(), 400);
        };
        
        closeBtn.addEventListener('click', closeLightbox);
        overlay.addEventListener('click', closeLightbox);
        
        document.addEventListener('keydown', function handler(e) {
            if (e.key === 'Escape') {
                closeLightbox();
                document.removeEventListener('keydown', handler);
            }
        });
    });
});

// ===== التمرير السلس للروابط الداخلية =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(targetId);
        
        if (target) {
            const navbarHeight = navbar.offsetHeight;
            const targetPosition = target.offsetTop - navbarHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== تحديد الصفحة النشطة في القائمة =====
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('#')) {
            link.classList.remove('active');
            if (href === currentPage) {
                link.classList.add('active');
            }
        }
    });
}

setActiveNavLink();

// ===== تأثير الجسيمات في الخلفية =====
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 5 + 2;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = Math.random() * 10 + 10;
        
        Object.assign(particle.style, {
            position: 'absolute',
            width: `${size}px`,
            height: `${size}px`,
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            left: `${posX}%`,
            top: `${posY}%`,
            animation: `float ${duration}s ease-in-out ${delay}s infinite`
        });
        
        particlesContainer.appendChild(particle);
    }
}

createParticles();

// ===== تأثير التلاشي عند تحميل الصفحة =====
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// ===== تأثير Parallax للخلفية =====
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrolled = window.scrollY;
        hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
    }
});